"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { NewThreadButton } from "./NewThreadButton";
import { useEffect, useState } from "react";

type Thread = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export default function ChatSidebar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
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

  const handleThreadSelect = (threadId: string) => {
    setSelectedThreadId(threadId);
    // Emit an event that the main chat window can listen to
    window.dispatchEvent(new CustomEvent("threadSelected", { detail: { threadId } }));
  };

  return (
    <aside className="flex flex-col h-full w-72 bg-zinc-900 text-white border-r border-zinc-800">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <NewThreadButton className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700" />
      </div>
      {/* Search */}
      <div className="p-4 border-b border-zinc-800">
        <input
          type="text"
          placeholder="Search your threads..."
          className="w-full px-3 py-2 rounded bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none"
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
              className={`hover:bg-zinc-800 rounded px-3 py-2 cursor-pointer ${
                selectedThreadId === thread.id ? "bg-zinc-800" : ""
              }`}
            >
              <div className="text-sm font-medium truncate">{thread.title}</div>
              <div className="text-xs text-zinc-400">
                {new Date(thread.updatedAt).toLocaleDateString()}
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* User Profile */}
      <div 
        className="p-4 border-t border-zinc-800 flex items-center gap-3 cursor-pointer hover:bg-zinc-800"
        onClick={() => router.push('/settings')}
      >
        {session?.user?.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-bold">
            {session?.user?.name?.[0] || "U"}
          </div>
        )}
        <div>
          <div className="text-sm font-semibold">{session?.user?.name || "User"}</div>
          <div className="text-xs text-zinc-400">{session?.user?.email || ""}</div>
        </div>
      </div>
    </aside>
  );
} 