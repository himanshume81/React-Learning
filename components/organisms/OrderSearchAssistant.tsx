"use client";

import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import { useEffect, useRef, useState } from "react";

export type OrderAssistantMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  steps?: string[];
};

type Props = {
  messages: OrderAssistantMessage[];
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onRetry: () => void;
  onSearch: (query: string) => void;
};

export function OrderSearchAssistant({ messages, isLoading, error, onClose, onRetry, onSearch }: Props) {
  const [followUp, setFollowUp] = useState("");
  const historyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const history = historyRef.current;
    if (history) history.scrollTop = history.scrollHeight;
  }, [messages, isLoading, error]);

  return (
    <aside aria-labelledby="order-assistant-title" className="min-w-0 self-start rounded-xl border border-zinc-200 bg-white p-5 shadow-sm lg:sticky lg:top-6 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 id="order-assistant-title" className="flex items-center gap-2 text-lg font-semibold">
          <span aria-hidden="true" className="text-2xl text-violet-600">✧</span>
          AI Assistant
        </h2>
        <button type="button" onClick={onClose} aria-label="Close AI Assistant" className="rounded-lg px-2 py-1 text-xl text-zinc-500 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-violet-500 dark:hover:bg-zinc-800">×</button>
      </div>

      <div ref={historyRef} className="max-h-[520px] space-y-4 overflow-y-auto pr-1" aria-live="polite" aria-busy={isLoading}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={message.role === "user"
              ? "ml-6 break-words rounded-xl bg-violet-50 px-4 py-3 text-sm font-medium text-violet-700 dark:bg-violet-950/50 dark:text-violet-300"
              : "rounded-xl bg-zinc-50 p-4 text-sm leading-6 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"}
          >
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
            {message.role === "assistant" && message.steps?.length ? (
              <ol className="mt-3 list-decimal space-y-2 pl-5">
                {message.steps.map((step, index) => (
                  <li key={`${message.id}-${index}`} className="whitespace-pre-wrap break-words">{step}</li>
                ))}
              </ol>
            ) : null}
          </div>
        ))}
        {isLoading ? (
          <div className="flex items-center gap-3 rounded-xl bg-zinc-50 p-4 text-sm text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
            <Spinner size="sm" /> Searching orders...
          </div>
        ) : error ? (
          <div role="alert" className="space-y-3">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <Button variant="secondary" onClick={onRetry}>Try again</Button>
          </div>
        ) : null}
      </div>
      <form
        aria-label="Ask a follow-up about orders"
        className="mt-6 border-t border-zinc-200 pt-4 dark:border-zinc-800"
        onSubmit={(event) => {
          event.preventDefault();
          const trimmed = followUp.trim();
          if (!trimmed || isLoading) return;
          onSearch(trimmed);
          setFollowUp("");
        }}
      >
        <label htmlFor="order-assistant-follow-up" className="mb-2 block text-sm font-medium">Ask a follow-up</label>
        <div className="flex overflow-hidden rounded-xl border border-violet-400 focus-within:ring-2 focus-within:ring-violet-500/20">
          <input
            id="order-assistant-follow-up"
            value={followUp}
            onChange={(event) => setFollowUp(event.target.value)}
            placeholder="Ask more about these orders..."
            className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-zinc-400"
          />
          <button
            type="submit"
            disabled={isLoading || !followUp.trim()}
            className="shrink-0 border-l border-violet-200 bg-violet-50 px-3 text-sm font-medium text-violet-600 transition-colors hover:bg-violet-100 focus-visible:outline-2 focus-visible:outline-violet-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-300 dark:hover:bg-violet-900/50"
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </aside>
  );
}
