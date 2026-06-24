"use client";

import React, { useState, useEffect, useCallback } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

export default function ChatLayout() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return true;
  });

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return true;
  });

  // Listen for resize events to detect mobile/desktop transitions
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeSidebar = useCallback(() => setCollapsed(true), []);
  const openSidebar = useCallback(() => setCollapsed(false), []);
  const toggleSidebar = useCallback(() => setCollapsed((c) => !c), []);

  return (
    <div className="flex h-[100dvh] w-screen overflow-hidden bg-background text-foreground relative">
      {/* Mobile backdrop overlay */}
      {isMobile && !collapsed && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <ChatSidebar
        collapsed={collapsed}
        onToggle={toggleSidebar}
        isMobile={isMobile}
        onClose={closeSidebar}
      />
      <main className="flex-1 h-full min-w-0 relative flex flex-col">
        <ChatWindow 
          onSidebarToggle={openSidebar} 
          sidebarCollapsed={collapsed}
          isMobile={isMobile}
        />
      </main>
    </div>
  );
}