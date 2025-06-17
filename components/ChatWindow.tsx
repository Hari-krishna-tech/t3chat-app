"use client";
import React, { useState, useEffect } from 'react';
import ChatInput from './ChatInput';
import { ModelType } from '@/lib/models';
import ReactMarkdown from 'react-markdown';
import { NewThreadButton } from './NewThreadButton';

type Message = {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  user: {
    name: string | null;
    image: string | null;
  };
};

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);

  useEffect(() => {
    const handleThreadSelect = (event: CustomEvent<{ threadId: string }>) => {
      setCurrentThreadId(event.detail.threadId);
      fetchThreadMessages(event.detail.threadId);
    };

    window.addEventListener('threadSelected', handleThreadSelect as EventListener);
    return () => {
      window.removeEventListener('threadSelected', handleThreadSelect as EventListener);
    };
  }, []);

  const fetchThreadMessages = async (threadId: string) => {
    try {
      const response = await fetch(`/api/threads/${threadId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Error fetching thread messages:", error);
    }
  };

  const onSendMessage = async (message: string, model: ModelType) => {
    if (!currentThreadId) return;

    try {
      setIsLoading(true);
      // First, send the user's message
      const userResponse = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: message,
          threadId: currentThreadId,
        }),
      });

      if (!userResponse.ok) {
        throw new Error("Failed to send message");
      }

      const userMessage = await userResponse.json();
      setMessages((prev) => [...prev, userMessage]);

      // Then, get AI response
      const aiResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, model }),
      });

      if (!aiResponse.ok) {
        throw new Error("Failed to get AI response");
      }

      // Create a temporary message for the AI response
      const tempAiMessage: Message = {
        id: 'temp-' + Date.now(),
        content: '',
        createdAt: new Date(),
        userId: 'ai',
        user: {
          name: 'AI Assistant',
          image: null,
        },
      };
      setMessages((prev) => [...prev, tempAiMessage]);

      // Stream the AI response
      const reader = aiResponse.body?.getReader();
      if (!reader) throw new Error("No response body");

      let aiContent = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        aiContent += new TextDecoder().decode(value);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempAiMessage.id ? { ...m, content: aiContent } : m
          )
        );
      }

      // Save the AI response to the database
      const finalAiResponse = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: aiContent,
          threadId: currentThreadId,
          isAi: true,
        }),
      });

      if (!finalAiResponse.ok) {
        throw new Error("Failed to save AI response");
      }

      const savedAiMessage = await finalAiResponse.json();
      setMessages((prev) =>
        prev.map((m) => (m.id === tempAiMessage.id ? savedAiMessage : m))
      );
    } catch (err) {
      console.error("Error in message flow:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col flex-1 h-full">
      {/* Header */}
      <header className="px-6 py-4 border-b border-zinc-200 bg-white/80 backdrop-blur flex items-center justify-between">
        <h1 className="text-lg font-bold">T3.chat</h1>
        <NewThreadButton className="px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200" />
      </header>
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-zinc-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="flex gap-3 items-start"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold bg-zinc-700">
              {msg.user.name?.[0] || 'U'}
            </div>
            <div className="rounded-lg px-4 py-2 shadow text-sm max-w-xl bg-white">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
      {/* Message input */}
      <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
    </section>
  );
} 