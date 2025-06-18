"use client";
import React, { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

export default function ChatLayout() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex h-screen">
      <ChatSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex-1">
        <ChatWindow onSidebarToggle={() => setCollapsed(false)} />
      </div>
    </div>
  );
} 