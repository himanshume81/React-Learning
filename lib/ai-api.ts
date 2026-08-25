import { apiFetch } from "@/lib/api-client";

export type AiChatRole = "user" | "assistant";

export type AiChatMessage = {
  role: AiChatRole;
  content: string;
};

export type AiChatRequest = {
  messages: AiChatMessage[];
};

export type AiChatResponse = {
  reply: string;
  responseId?: string;
};

export async function sendAiChatMessage({ messages }: AiChatRequest): Promise<AiChatResponse> {
  return apiFetch<AiChatResponse>("/ai/chat", {
    method: "POST",
    body: {
      messages,
    },
    auth: true,
  });
}
