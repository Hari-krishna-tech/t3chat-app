"use client";

import React, { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

export default function ChatLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground relative">
      <ChatSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <main className="flex-1 h-full min-w-0 relative flex flex-col">
        <ChatWindow onSidebarToggle={() => setCollapsed(false)} />
      </main>
    </div>
  );
}