"use client";

import { useSession } from "next-auth/react";

export default function ChatSidebar() {
  const { data: session } = useSession();

  return (
    <aside className="flex flex-col h-full w-72 bg-zinc-900 text-white border-r border-zinc-800">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <button className="w-full py-2 rounded bg-zinc-800 hover:bg-zinc-700 font-semibold">New Chat</button>
      </div>
      {/* Search */}
      <div className="p-4 border-b border-zinc-800">
        <input
          type="text"
          placeholder="Search your threads..."
          className="w-full px-3 py-2 rounded bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none"
        />
      </div>
      {/* Pinned */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 pt-4 pb-2 text-xs text-zinc-400 font-semibold">Pinned</div>
        <ul className="px-2 space-y-1">
          <li className="bg-zinc-800 rounded px-3 py-2 cursor-pointer">Structure design patterns e ...</li>
        </ul>
        <div className="px-4 pt-6 pb-2 text-xs text-zinc-400 font-semibold">Last 7 Days</div>
        <ul className="px-2 space-y-1">
          <li className="hover:bg-zinc-800 rounded px-3 py-2 cursor-pointer">Tailwind CSS PostCSS ...</li>
        </ul>
      </div>
      {/* User Profile */}
      <div className="p-4 border-t border-zinc-800 flex items-center gap-3">
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