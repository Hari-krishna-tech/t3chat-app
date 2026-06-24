"use client";

import React, { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    // Auto-adjust height on load/reset
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, []);

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  };

  return (
    <div className="px-3 sm:px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:pb-5 pt-2 sm:pt-3 bg-gradient-to-t from-surface-0 via-surface-0/80 to-transparent">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative">
        <div className="bg-surface-2/50 border border-white/[0.08] rounded-2xl p-1.5 sm:p-2 pr-2 sm:pr-2.5 pl-3 sm:pl-4 flex items-end gap-1.5 sm:gap-2 focus-within:border-accent-primary/30 focus-within:ring-1 focus-within:ring-accent-primary/15 transition-all duration-300 shadow-lg shadow-black/20">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            rows={1}
            className="flex-1 max-h-[180px] min-h-[24px] py-1 bg-transparent text-zinc-100 placeholder-zinc-600 border-none outline-none resize-none text-sm focus:ring-0 leading-relaxed font-sans scrollbar-none"
            style={{ height: "auto" }}
          />

          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-primary text-white hover:brightness-110 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed shrink-0 shadow-sm shadow-accent-primary/20"
            aria-label="Send message"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            )}
          </button>
        </div>
        <div className="text-[9px] sm:text-[10px] text-zinc-700 text-center mt-1.5 sm:mt-2">
          T3.chat can make mistakes. Please check important info.
        </div>
      </form>
    </div>
  );
}