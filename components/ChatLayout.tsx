"use client";
import React, { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

export default function ChatLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [incognito, setIncognito] = useState(false);

  const handleIncognito = () => {
    setIncognito(true);
    // Emit a special event to start a new incognito chat
    window.dispatchEvent(new CustomEvent("newIncognitoChatStarted"));
  };

  return (
    <div className="flex h-screen">
      <ChatSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex-1">
        <div className="flex items-center justify-end p-2 border-b border-background-dark bg-background-dark/90">
          <button
            className={`px-3 py-1 rounded bg-zinc-800 text-white font-semibold shadow hover:bg-zinc-700 mr-4 ${incognito ? 'bg-accent-primary' : ''}`}
            onClick={handleIncognito}
            disabled={incognito}
            title="Start Incognito Chat"
          >
            {incognito ? 'Incognito Active' : 'Incognito Mode'}
          </button>
        </div>
        <ChatWindow onSidebarToggle={() => setCollapsed(false)} incognito={incognito} />
      </div>
    </div>
  );
} 