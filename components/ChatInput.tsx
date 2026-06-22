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
    <div className="p-4 bg-gradient-to-t from-background via-background/95 to-transparent border-t border-foreground/[0.03]">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative">
        <div className="relative flex items-end gap-2 p-2 pr-3 pl-4 rounded-2xl bg-foreground/[0.02] border border-foreground/10 focus-within:border-accent-primary/40 focus-within:ring-2 focus-within:ring-accent-primary/10 transition-all duration-300 backdrop-blur-md shadow-lg">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            rows={1}
            className="flex-1 max-h-[180px] min-h-[24px] py-1 bg-transparent text-foreground placeholder-zinc-500 border-none outline-none resize-none text-sm focus:ring-0 leading-relaxed font-sans scrollbar-none"
            style={{ height: "auto" }}
          />

          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-primary text-white shadow-md shadow-accent-primary/10 hover:shadow-lg hover:shadow-accent-primary/20 hover:brightness-110 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
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
        <div className="text-[10px] text-zinc-500 text-center mt-2 font-medium">
          T3.chat can make mistakes. Please check important info.
        </div>
      </form>
    </div>
  );
}