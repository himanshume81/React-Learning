import { getAccessToken } from "@/lib/auth-tokens";
import type { ChatTransport, UIMessage, UIMessageChunk } from "ai";
import { z } from "zod";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:9000"
).replace(/\/$/, "");

const imageSchema = z
  .string()
  .trim()
  .transform((value) => {
    if (!value || value === "{" || value === "}" || value === "[]" || value === "{}") {
      return undefined;
    }

    return value;
  })
  .optional();

export const productSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  category: z.string().optional(),
  brand: z.string().optional(),
  image: imageSchema,
  stock: z.boolean().optional(),
});

export const aiProductResponseSchema = z.object({
  answer: z.string(),
  products: z.array(productSchema),
});

const productMetadataSchema = z.object({
  products: z.array(productSchema),
});

const streamEventSchema = z
  .object({
    type: z.string().optional(),
    delta: z.string().optional(),
    text: z.string().optional(),
    answer: z.string().optional(),
    products: z.array(productSchema).optional(),
  })
  .passthrough();

export type AiProduct = z.infer<typeof productSchema>;
export type AiProductResponse = z.infer<typeof aiProductResponseSchema>;
export type ProductChatMessage = UIMessage<unknown, { products: AiProduct[] }>;

export class AiProductValidationError extends Error {
  readonly issues: z.ZodIssue[];

  constructor(error: z.ZodError) {
    super("The product search service returned an unexpected response.");
    this.name = "AiProductValidationError";
    this.issues = error.issues;
  }
}

export class AiProductRequestError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AiProductRequestError";
    this.status = status;
  }
}

type StreamAiProductSearchOptions = {
  signal: AbortSignal;
  onText: (chunk: string) => void;
  onProducts: (products: AiProduct[]) => void;
};

function validationError(error: z.ZodError) {
  return new AiProductValidationError(error);
}

function parseProducts(value: unknown): AiProduct[] {
  const parsed = productMetadataSchema.safeParse(value);
  if (!parsed.success) throw validationError(parsed.error);
  return parsed.data.products;
}

function errorMessage(body: string, fallback: string) {
  try {
    const payload = JSON.parse(body) as { message?: unknown };
    if (Array.isArray(payload.message)) return payload.message.join(" ");
    if (typeof payload.message === "string" && payload.message.trim()) {
      return payload.message;
    }
  } catch {
    if (body.trim()) return body.trim();
  }

  return fallback;
}

/**
 * Streams plain text, SSE, or NDJSON from the NestJS endpoint.
 * Structured streams can send `{ "type": "delta", "delta": "hello" }`
 * followed by `{ "type": "products", "products": [...] }`.
 */
export async function streamAiProductSearch(
  query: string,
  { signal, onText, onProducts }: StreamAiProductSearchOptions
): Promise<void> {
  let response: Response;

  try {
    const accessToken = getAccessToken();
    response = await fetch(`${API_BASE_URL}/ai/products/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream, application/x-ndjson, application/json, text/plain",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({ query: query.trim() }),
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new AiProductRequestError(
      "Unable to reach the server. Check your connection and try again.",
      0
    );
  }

  if (!response.ok) {
    const body = await response.text();
    throw new AiProductRequestError(
      errorMessage(body, "The product search request failed. Please try again."),
      response.status
    );
  }

  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";

  // Support a buffered JSON fallback while keeping it fully validated.
  if (contentType.includes("application/json") && !contentType.includes("ndjson")) {
    const payload: unknown = await response.json();
    const parsed = aiProductResponseSchema.safeParse(payload);
    if (!parsed.success) throw validationError(parsed.error);
    onText(parsed.data.answer);
    onProducts(parsed.data.products);
    return;
  }

  // Product metadata may also be supplied before the text stream in a header.
  const headerProducts = response.headers.get("x-ai-products");
  if (headerProducts) {
    try {
      onProducts(parseProducts({ products: JSON.parse(headerProducts) }));
    } catch (error) {
      if (error instanceof AiProductValidationError) throw error;
      throw new AiProductRequestError("The product metadata header is invalid.", 502);
    }
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new AiProductRequestError("The server did not return a readable stream.", 502);
  }

  const decoder = new TextDecoder();
  const isSse = contentType.includes("text/event-stream");
  const isNdjson = contentType.includes("ndjson") || contentType.includes("jsonl");
  let buffer = "";
  let receivedText = false;

  function emitText(chunk: string) {
    if (!chunk) return;
    receivedText = true;
    onText(chunk);
  }

  function handleStructuredData(data: string) {
    const trimmed = data.trim();
    if (!trimmed || trimmed === "[DONE]") return;

    let payload: unknown;
    try {
      payload = JSON.parse(trimmed);
    } catch {
      emitText(data);
      return;
    }

    if (typeof payload === "string") {
      emitText(payload);
      return;
    }

    const parsed = streamEventSchema.safeParse(payload);
    if (!parsed.success) throw validationError(parsed.error);

    const event = parsed.data;
    const text = event.delta ?? event.text;
    if (text) emitText(text);

    // A final event may repeat the completed answer alongside the products.
    if (!receivedText && event.answer) emitText(event.answer);
    if (event.products) onProducts(parseProducts({ products: event.products }));
  }

  function flushSse(final = false) {
    const blocks = buffer.split(/\r?\n\r?\n/);
    const remainder = final ? "" : (blocks.pop() ?? "");

    for (const block of blocks) {
      const data = block
        .split(/\r?\n/)
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trimStart())
        .join("\n");
      if (data) handleStructuredData(data);
    }

    if (final && remainder.trim()) handleStructuredData(remainder);
    buffer = remainder;
  }

  function flushNdjson(final = false) {
    const lines = buffer.split(/\r?\n/);
    const remainder = final ? "" : (lines.pop() ?? "");
    for (const line of lines) handleStructuredData(line);
    if (final && remainder.trim()) handleStructuredData(remainder);
    buffer = remainder;
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    if (isSse || isNdjson) {
      buffer += chunk;
      if (isSse) flushSse();
      else flushNdjson();
    } else {
      emitText(chunk);
    }
  }

  const finalChunk = decoder.decode();
  if (isSse || isNdjson) {
    buffer += finalChunk;
    if (isSse) flushSse(true);
    else flushNdjson(true);
  } else {
    emitText(finalChunk);
  }
}

function getLatestUserText(messages: ProductChatMessage[]) {
  const userMessage = [...messages].reverse().find((message) => message.role === "user");
  return userMessage?.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("")
    .trim() ?? "";
}

function createMessageId(prefix: string) {
  const suffix = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${suffix}`;
}

/**
 * Adapts the existing NestJS endpoint to the UIMessageChunk protocol expected
 * by @ai-sdk/react's useChat hook. Groq remains behind the NestJS API.
 */
export const aiProductTransport: ChatTransport<ProductChatMessage> = {
  async sendMessages({ messages, abortSignal }) {
    const query = getLatestUserText(messages);
    if (!query) throw new AiProductRequestError("Enter a product search query.", 400);

    const signal = abortSignal ?? new AbortController().signal;
    const textId = createMessageId("product-answer");

    return new ReadableStream<UIMessageChunk>({
      async start(controller) {
        controller.enqueue({ type: "start" });
        controller.enqueue({ type: "start-step" });
        controller.enqueue({ type: "text-start", id: textId });

        try {
          await streamAiProductSearch(query, {
            signal,
            onText: (delta) => {
              controller.enqueue({ type: "text-delta", id: textId, delta });
            },
            onProducts: (products) => {
              controller.enqueue({ type: "data-products", data: products });
            },
          });

          controller.enqueue({ type: "text-end", id: textId });
          controller.enqueue({ type: "finish-step" });
          controller.enqueue({ type: "finish", finishReason: "stop" });
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });
  },

  async reconnectToStream() {
    return null;
  },
};
