"use client";

import { useState } from "react";

interface NewThreadButtonProps {
  className?: string;
}

export function NewThreadButton({ className = "" }: NewThreadButtonProps) {
  const [isCreating, setIsCreating] = useState(false);

  const startNewChat = () => {
    // Emit an event that the main chat window can listen to
    window.dispatchEvent(new CustomEvent("newChatStarted"));
  };

  return (
    <button
      onClick={startNewChat}
      disabled={isCreating}
      className={`flex items-center gap-2 rounded-lg border p-3 text-sm transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
      New Chat
    </button>
  );
} 