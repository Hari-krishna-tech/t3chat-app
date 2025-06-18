"use client";
import React, { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

export default function ChatLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen relative">
      <ChatSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex-1">
        <ChatWindow onSidebarToggle={() => setSidebarOpen(true)} />
      </div>
    </div>
  );
} 