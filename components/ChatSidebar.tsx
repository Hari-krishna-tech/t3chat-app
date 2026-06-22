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

const getRelativeTime = (date: string) => {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return diffMins + 'm ago';
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return diffHours + 'h ago';
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return diffDays + 'd ago';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

export default function ChatSidebar({ collapsed = false, onToggle = () => {} }: { collapsed?: boolean, onToggle?: () => void }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(() => {
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
    window.dispatchEvent(new CustomEvent("threadSelected", { detail: { threadId } }));
  };

  return (
    <aside className={`flex flex-col h-full ${collapsed ? 'w-16' : 'w-[280px]'} bg-surface-1/80 backdrop-blur-xl border-r border-white/[0.06] transition-all duration-300 ease-in-out z-30 select-none relative`}>
      {/* Brand Header */}
      <div className={`flex items-center p-4 border-b border-white/[0.06] h-16 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <span className="text-base font-bold tracking-tight gradient-text">
              T3.chat
            </span>
          </div>
        )}
        <button
          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04] transition-all duration-200"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
            </svg>
          )}
        </button>
      </div>

      {/* New Chat Actions Area */}
      <div className="p-3">
        <NewThreadButton collapsed={collapsed} />
      </div>

      {/* Collapsed view items */}
      {collapsed ? (
        <div className="flex-1 flex flex-col items-center justify-between py-4 border-t border-white/[0.06]">
          <div className="flex flex-col gap-2 items-center">
            {/* Quick access icon: simple list tooltip indicator */}
            <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06] transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
          </div>
          {/* Collapsed Profile Avatar */}
          <div 
            className="w-10 h-10 rounded-full cursor-pointer overflow-hidden border border-white/[0.08] hover:border-accent-primary/50 transition-all duration-300"
            onClick={() => router.push('/settings')}
            title="Settings"
          >
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-accent-primary flex items-center justify-center text-sm font-bold text-white">
                {session?.user?.name?.[0] || "U"}
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Search bar */}
          <div className="px-3 pb-3">
            <div className="relative flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2} 
                stroke="currentColor" 
                className="absolute left-3 w-4 h-4 text-zinc-600"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Search your threads..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-white/[0.03] border border-white/[0.06] text-foreground placeholder-zinc-500 rounded-xl focus:outline-none focus:border-accent-primary/40 focus:ring-1 focus:ring-accent-primary/20 transition-all duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Threads List */}
          <div className="flex-1 overflow-y-auto px-2 space-y-1.5 py-2 border-t border-white/[0.06]">
            <div className="px-2 text-[11px] text-zinc-600 font-medium tracking-wide uppercase mb-1">Your Threads</div>
            <ul className="space-y-1">
              {threads
                .filter((thread) =>
                  thread.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((thread) => {
                  const isSelected = selectedThreadId === thread.id;
                  return (
                    <li
                      key={thread.id}
                      onClick={() => handleThreadSelect(thread.id)}
                      className={`group rounded-lg px-3 py-2.5 cursor-pointer transition-all duration-200 flex flex-col gap-0.5
                        ${isSelected
                          ? "bg-accent-primary/[0.08] text-accent-primary border-l-2 border-accent-primary"
                          : "hover:bg-white/[0.03] text-zinc-400 hover:text-zinc-200 border-l-2 border-transparent"}
                      `}
                    >
                      <div className="text-[13px] font-medium truncate pr-4">{thread.title}</div>
                      <div className="text-[11px] text-zinc-600 group-hover:text-zinc-500 transition-colors">
                        {getRelativeTime(thread.updatedAt)}
                      </div>
                    </li>
                  );
                })}
              {threads.filter((thread) =>
                thread.title.toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 && (
                <div className="text-center text-xs text-zinc-500 py-6">No threads found</div>
              )}
            </ul>
          </div>

          {/* User Profile Footer */}
          <div className="px-3 py-3 border-t border-white/[0.06]">
            <div 
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-white/[0.04] transition-all duration-200 group cursor-pointer"
              onClick={() => router.push('/settings')}
            >
              <div className="relative shrink-0">
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-7 h-7 rounded-full border border-white/[0.1]"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-accent-primary/20 flex items-center justify-center text-xs font-semibold text-accent-primary">
                    {session?.user?.name?.[0] || "U"}
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border-[1.5px] border-surface-1" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-zinc-300 truncate group-hover:text-zinc-100 transition-colors">
                  {session?.user?.name || "User"}
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </>
      )}
    </aside>
  );
} 