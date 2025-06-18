"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { NewThreadButton } from "./NewThreadButton";
import { useEffect, useState } from "react";
import React from 'react';

type Thread = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export default function ChatSidebar({ isOpen = true, onClose = () => {} }: { isOpen?: boolean, onClose?: () => void }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedThreadId');
    }
    return null;
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await fetch("/api/threads");
        if (response.ok) {
          const data = await response.json();
          setThreads(data);
        }
      } catch (error) {
        console.error("Error fetching threads:", error);
      }
    };

    fetchThreads();
  }, []);

  useEffect(() => {
    const handleNewThreadCreated = (event: CustomEvent<{ thread: Thread }>) => {
      setThreads(prev => [event.detail.thread, ...prev]);
      setSelectedThreadId(event.detail.thread.id);
      localStorage.setItem('selectedThreadId', event.detail.thread.id);
    };

    window.addEventListener('newThreadCreated', handleNewThreadCreated as EventListener);
    return () => {
      window.removeEventListener('newThreadCreated', handleNewThreadCreated as EventListener);
    };
  }, []);

  const handleThreadSelect = (threadId: string) => {
    setSelectedThreadId(threadId);
    localStorage.setItem('selectedThreadId', threadId);
    // Emit an event that the main chat window can listen to
    window.dispatchEvent(new CustomEvent("threadSelected", { detail: { threadId } }));
  };

  return (
    <aside className={`flex flex-col h-full w-72 bg-background text-foreground border-r border-background-dark shadow-lg transition-transform duration-200 z-30 fixed md:static top-0 left-0 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      {/* Close button for mobile */}
      <button
        className="md:hidden absolute top-4 right-4 z-40 bg-background-dark text-foreground rounded-full p-2 shadow hover:bg-background"
        onClick={onClose}
        aria-label="Close sidebar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {/* Header */}
      <div className="p-4 border-b border-background-dark">
        <NewThreadButton className="w-full bg-accent-primary hover:bg-accent-primary-dark text-white border-none shadow-md" />
      </div>
      {/* Search */}
      <div className="p-4 border-b border-background-dark">
        <input
          type="text"
          placeholder="Search your threads..."
          className="w-full px-3 py-2 rounded-lg bg-background-dark text-foreground placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {/* Threads List */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 pt-4 pb-2 text-xs text-zinc-400 font-semibold">Your Threads</div>
        <ul className="px-2 space-y-1">
          {threads
            .filter((thread) =>
              thread.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((thread) => (
            <li
              key={thread.id}
              onClick={() => handleThreadSelect(thread.id)}
              className={`rounded-lg px-3 py-2 cursor-pointer transition-colors font-medium flex flex-col gap-0.5 shadow-sm
                ${selectedThreadId === thread.id
                  ? "bg-accent-primary/20 border-l-4 border-accent-primary text-accent-primary"
                  : "hover:bg-background-dark hover:text-accent-primary/80"}
              `}
            >
              <div className="text-sm truncate">{thread.title}</div>
              <div className="text-xs text-zinc-400">
                {new Date(thread.updatedAt).toLocaleDateString()}
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* User Profile */}
      <div 
        className="p-4 border-t border-background-dark flex items-center gap-3 cursor-pointer hover:bg-background-dark transition rounded-b-lg"
        onClick={() => router.push('/settings')}
      >
        {session?.user?.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            className="w-9 h-9 rounded-full border-2 border-accent-primary shadow"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-accent-primary flex items-center justify-center text-lg font-bold text-white shadow">
            {session?.user?.name?.[0] || "U"}
          </div>
        )}
        <div>
          <div className="text-sm font-semibold text-foreground">{session?.user?.name || "User"}</div>
          <div className="text-xs text-zinc-400">{session?.user?.email || ""}</div>
        </div>
      </div>
    </aside>
  );
} 