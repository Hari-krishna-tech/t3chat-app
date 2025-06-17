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
  isAi: boolean;
  user: {
    name: string | null;
    image: string | null;
  };
};

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedThreadId');
    }
    return null;
  });
  const [pendingNewThread, setPendingNewThread] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('selectedThreadId');
    }
    return true;
  });

  useEffect(() => {
    const handleThreadSelect = (event: CustomEvent<{ threadId: string }>) => {
      setCurrentThreadId(event.detail.threadId);
      setPendingNewThread(false);
      fetchThreadMessages(event.detail.threadId);
    };
    const handleNewChatStarted = () => {
      setCurrentThreadId(null);
      setMessages([]);
      setPendingNewThread(true);
    };
    window.addEventListener('threadSelected', handleThreadSelect as EventListener);
    window.addEventListener('newChatStarted', handleNewChatStarted);
    return () => {
      window.removeEventListener('threadSelected', handleThreadSelect as EventListener);
      window.removeEventListener('newChatStarted', handleNewChatStarted);
    };
  }, []);

  useEffect(() => {
    // If there's a selected thread on load, fetch its messages
    if (currentThreadId && !pendingNewThread) {
      fetchThreadMessages(currentThreadId);
    }
  }, [currentThreadId, pendingNewThread]);

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

  const createThreadAndSendMessage = async (message: string, model: ModelType) => {
    try {
      setIsLoading(true);
      // 1. Generate a title using the LLM
      const titlePrompt = `Suggest a short, relevant chat title for this message: "${message}". Respond with only the title, no punctuation or quotes.`;
      const titleRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: titlePrompt, model , isTitle: true}),
      });
      let title = 'New Chat';
      if (titleRes.ok && titleRes.body) {
        const reader = titleRes.body.getReader();
        let titleText = '';
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          titleText += new TextDecoder().decode(value);
        }
        title = titleText.trim().replace(/^"|"$/g, '');
        if (!title) title = 'New Chat';
      }
      // 2. Create the thread with the generated title
      const threadRes = await fetch('/api/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          message,
        }),
      });
      if (!threadRes.ok) throw new Error('Failed to create thread');
      const thread = await threadRes.json();
      setCurrentThreadId(thread.id);
      setPendingNewThread(false);
      setMessages(thread.messages);
      // Emit event for new thread creation
      window.dispatchEvent(new CustomEvent('newThreadCreated', { 
        detail: { 
          thread: {
            id: thread.id,
            title: title,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        } 
      }));
      // Now, get AI response as normal
      await getAIResponse(message, model, thread.id);
    } catch (err) {
      console.error('Error creating thread and sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getAIResponse = async (message: string, model: ModelType, threadId: string) => {
    // Prepare context: all messages in the thread so far, including the new user message
    const contextMessages = [
      ...messages,
      {
        id: 'user-temp',
        content: message,
        createdAt: new Date(),
        userId: 'user',
        isAi: false,
        user: { name: null, image: null },
      },
    ];
    // Send the full thread as context
    const aiResponse = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: contextMessages, model, isTitle: false }),
    });
    if (!aiResponse.ok) {
      throw new Error('Failed to get AI response');
    }
    // Create a temporary message for the AI response
    const tempAiMessage: Message = {
      id: 'temp-' + Date.now(),
      content: '',
      createdAt: new Date(),
      userId: 'ai',
      isAi: true,
      user: {
        name: 'AI Assistant',
        image: null,
      },
    };
    setMessages((prev) => [...prev, tempAiMessage]);
    // Stream the AI response
    const reader = aiResponse.body?.getReader();
    if (!reader) throw new Error('No response body');
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
        threadId,
        isAi: true,
      }),
    });
    if (!finalAiResponse.ok) {
      throw new Error('Failed to save AI response');
    }
    const savedAiMessage = await finalAiResponse.json();
    setMessages((prev) =>
      prev.map((m) => (m.id === tempAiMessage.id ? savedAiMessage : m))
    );
  };

  const onSendMessage = async (message: string, model: ModelType) => {
    if (pendingNewThread) {
      await createThreadAndSendMessage(message, model);
      return;
    }
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
          isAi: false,
        }),
      });
      if (!userResponse.ok) {
        throw new Error('Failed to send message');
      }
      const userMessage = await userResponse.json();
      setMessages((prev) => [...prev, userMessage]);
      await getAIResponse(message, model, currentThreadId);
    } catch (err) {
      console.error('Error in message flow:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col flex-1 h-full bg-background">
      {/* Header */}
      <header className="px-6 py-4 border-b border-background-dark bg-background-dark/90 backdrop-blur flex items-center justify-between">
        <h1 className="text-lg font-bold text-accent-purple">T3.chat</h1>
        <NewThreadButton className="px-3 py-1 bg-accent-purple hover:bg-accent-dark text-white border-none shadow" />
      </header>
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-background">
        {messages.length === 0 && pendingNewThread && (
          <div className="text-zinc-500 text-center mt-10">Start a new conversation...</div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isAi ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`rounded-lg px-4 py-2 shadow-none text-sm max-w-xl
                ${msg.isAi
                  ? 'text-foreground'
                  : 'text-accent-purple'}
              `}
            >
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