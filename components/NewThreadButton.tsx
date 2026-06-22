"use client";

import React, { useState } from "react";

interface NewThreadButtonProps {
  className?: string;
  collapsed?: boolean;
}

export function NewThreadButton({ className = "", collapsed = false }: NewThreadButtonProps) {
  const [isCreating, setIsCreating] = useState(false);

  const startNewChat = () => {
    // Emit an event that the main chat window can listen to
    window.dispatchEvent(new CustomEvent("newChatStarted"));
  };

  return (
    <button
      onClick={startNewChat}
      disabled={isCreating}
      title={collapsed ? "Start New Chat" : undefined}
      className={`flex items-center gap-2 rounded-xl border-none font-semibold transition-all duration-300 active:scale-95 bg-gradient-to-br from-accent-primary to-accent-primary-dark text-white shadow-md hover:shadow-lg hover:shadow-accent-primary/20 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 disabled:cursor-not-allowed disabled:opacity-50
        ${collapsed ? "p-3.5 justify-center w-11 h-11" : "px-4 py-3 justify-center w-full text-sm"} 
        ${className}
      `}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 shrink-0"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
      {!collapsed && <span>New Chat</span>}
    </button>
  );
}