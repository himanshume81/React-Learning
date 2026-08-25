"use client";

import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import { Text } from "@/components/atoms/Text";
import { ApiError } from "@/lib/api-client";
import { sendAiChatMessage, type AiChatMessage as ApiChatMessage } from "@/lib/ai-api";
import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const initialMessage: ChatMessage = {
  id: "welcome-message",
  role: "assistant",
  content: "Hi! Ask me anything about your app or workflow.",
};

const MAX_HISTORY_MESSAGES = 20;

export function AiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isSending]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setError(null);
    setIsSending(true);

    try {
      const nextHistory: ApiChatMessage[] = [...messages, userMessage]
        .slice(-MAX_HISTORY_MESSAGES)
        .map(({ role, content }) => ({ role, content }));

      const response = await sendAiChatMessage({
        messages: nextHistory,
      });

      setMessages((current) => [
        ...current,
        {
          id: response.responseId ?? `assistant-${Date.now()}`,
          role: "assistant",
          content: response.reply,
        },
      ]);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong while contacting the AI service.");
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  };

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Text as="h3" className="text-lg font-semibold">
            AI assistant
          </Text>
          <Text className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Chat with your NestJS AI endpoint without exposing any API keys in the client.
          </Text>
        </div>
        {isSending ? <Spinner size="sm" className="mt-1 shrink-0" /> : null}
      </div>

      <div className="mt-4 flex h-[420px] flex-col rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div ref={messagesContainerRef} className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`w-fit max-w-[90%] rounded-2xl px-4 py-3 text-sm shadow-sm sm:max-w-[85%] ${
                  message.role === "user"
                    ? "bg-foreground text-background"
                    : "border border-zinc-200 bg-white text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                }`}
              >
                <Text
                  as="span"
                  className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.14em] opacity-70"
                >
                  {message.role === "user" ? "You" : "AI"}
                </Text>
                <Text className="whitespace-pre-wrap leading-6">{message.content}</Text>
              </div>
            </div>
          ))}

          {isSending ? (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-950">
                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <Spinner size="sm" />
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
          {error ? (
            <Text
              className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300"
              role="alert"
            >
              {error}
            </Text>
          ) : null}

          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <label className="min-w-0 flex-1">
              <span className="sr-only">Message</span>
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message and press Enter..."
                rows={3}
                disabled={isSending}
                className="min-h-[112px] w-full resize-none rounded-xl border border-zinc-300 bg-white px-3 py-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-foreground focus:ring-2 focus:ring-foreground/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950"
              />
            </label>

            <Button
              type="button"
              onClick={() => void sendMessage()}
              disabled={isSending || !input.trim()}
              className="h-11 w-full shrink-0 px-6 md:w-auto"
            >
              {isSending ? "Sending..." : "Send"}
            </Button>
          </div>

          <Text className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Press Enter to send. Use Shift + Enter for a new line.
          </Text>
        </div>
      </div>
    </section>
  );
}
