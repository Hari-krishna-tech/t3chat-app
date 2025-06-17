"use client";

import { useState } from "react";

interface NewThreadButtonProps {
  className?: string;
}

export function NewThreadButton({ className = "" }: NewThreadButtonProps) {
  const [isCreating, setIsCreating] = useState(false);

  const createNewThread = async () => {
    try {
      setIsCreating(true);
      const response = await fetch("/api/threads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "New Chat",
          message: "Hello! How can I help you today?",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create thread");
      }

      const thread = await response.json();
      // Emit an event that the main chat window can listen to
      window.dispatchEvent(new CustomEvent("threadSelected", { detail: { threadId: thread.id } }));
    } catch (error) {
      console.error("Error creating thread:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <button
      onClick={createNewThread}
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
      {isCreating ? "Creating..." : "New Chat"}
    </button>
  );
} 