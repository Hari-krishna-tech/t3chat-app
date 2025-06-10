import React from 'react';

export default function ChatWindow() {
  return (
    <section className="flex flex-col flex-1 h-full">
      {/* Header */}
      <header className="px-6 py-4 border-b border-zinc-200 bg-white/80 backdrop-blur flex items-center justify-between">
        <h1 className="text-lg font-bold">T3.chat</h1>
        <button className="px-3 py-1 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm">New Chat</button>
      </header>
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-zinc-50">
        {/* Example messages */}
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-white font-bold">H</div>
          <div className="bg-white rounded-lg px-4 py-2 shadow text-sm max-w-xl">Hello! How can I help you today?</div>
        </div>
        <div className="flex gap-3 items-start flex-row-reverse">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">Y</div>
          <div className="bg-blue-100 rounded-lg px-4 py-2 shadow text-sm max-w-xl">I want to build a chat app UI like this.</div>
        </div>
      </div>
      {/* Message input */}
      <form className="px-6 py-4 border-t border-zinc-200 bg-white flex items-center gap-3">
        <input
          type="text"
          placeholder="Type your message here..."
          className="flex-1 px-4 py-2 rounded bg-zinc-100 focus:outline-none"
        />
        <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700">Send</button>
      </form>
    </section>
  );
} 