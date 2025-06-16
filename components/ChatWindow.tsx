"use client";
import React, { useState } from 'react';
import ChatInput from './ChatInput';
import { ModelType } from '@/lib/models';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! How can I help you today?', sender: 'bot' },
    { id: '2', text: 'I want to build a chat app UI like this.', sender: 'user' },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const onSendMessage = async (message: string, model: ModelType) => {
    const userMsg: Message = { id: Date.now() + '-user', text: message, sender: 'user' };
    setMessages((msgs) => [...msgs, userMsg]);
    setIsLoading(true);
    let botMsg: Message = { id: Date.now() + '-bot', text: '', sender: 'bot' };
    setMessages((msgs) => [...msgs, botMsg]);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, model }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      let text = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        text += new TextDecoder().decode(value);
        setMessages((msgs) =>
          msgs.map((m) =>
            m.id === botMsg.id ? { ...m,  text } : m
          )
        );
      }
    } catch (err) {
      console.error("Error getting response:", err);
      setMessages((msgs) =>
        msgs.map((m) =>
          m.id === botMsg.id ? { ...m, text: 'Error getting response.'  } : m
        )
      );
    } finally {

      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col flex-1 h-full">
      {/* Header */}
      <header className="px-6 py-4 border-b border-zinc-200 bg-white/80 backdrop-blur flex items-center justify-between">
        <h1 className="text-lg font-bold">T3.chat</h1>
        <button className="px-3 py-1 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm">New Chat</button>
      </header>
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-zinc-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 items-start ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${msg.sender === 'user' ? 'bg-blue-600' : 'bg-zinc-700'}`}>
              {msg.sender === 'user' ? 'Y' : 'H'}
            </div>
            <div className={`rounded-lg px-4 py-2 shadow text-sm max-w-xl ${msg.sender === 'user' ? 'bg-blue-100' : 'bg-white'}`}>
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
      {/* Message input */}
      <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
    </section>
  );
} 