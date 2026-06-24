"use client";

import React, { useState, useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import { ModelType } from '@/lib/models';
import ReactMarkdown from 'react-markdown';
import ModelSelect from './ModelSelect';
import { useSession } from 'next-auth/react';

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

export default function ChatWindow({
  onSidebarToggle,
  sidebarCollapsed = true,
  isMobile = false,
}: {
  onSidebarToggle: () => void;
  sidebarCollapsed?: boolean;
  isMobile?: boolean;
}) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelType>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('selectedModel') as ModelType) || "qwen/qwen3-8b";
    }
    return "qwen/qwen3-8b";
  });

  useEffect(() => {
    localStorage.setItem('selectedModel', selectedModel);
  }, [selectedModel]);
  const [currentThreadTitle, setCurrentThreadTitle] = useState<string | null>(null);

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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const handleThreadSelect = (event: CustomEvent<{ threadId: string }>) => {
      setCurrentThreadId(event.detail.threadId);
      setPendingNewThread(false);
      fetchThreadMessages(event.detail.threadId);
    };
    const handleNewChatStarted = () => {
      setCurrentThreadId(null);
      setCurrentThreadTitle(null);
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
        setCurrentThreadTitle(data.title || null);
      }
    } catch (error) {
      console.error("Error fetching thread messages:", error);
    }
  };

  const generateThreadTitle = async (message: string, model: ModelType, threadId: string) => {
    try {
      const titlePrompt = `Suggest a short, relevant chat title for this message: "${message}". Respond with only the title, no punctuation or quotes.`;
      const titleRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: titlePrompt, model, isTitle: true }),
      });
      let aiTitle = 'New Chat';
      if (titleRes.ok && titleRes.body) {
        const reader = titleRes.body.getReader();
        let titleText = '';
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          titleText += new TextDecoder().decode(value);
        }
        aiTitle = titleText.trim().replace(/^"|"$/g, '');
        if (!aiTitle) aiTitle = 'New Chat';
      }
      const res = await fetch(`/api/threads/${threadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: aiTitle }),
      });
      if (res.ok) {
        setCurrentThreadTitle(aiTitle);
        window.dispatchEvent(new CustomEvent('threadTitleUpdated', {
          detail: { threadId, title: aiTitle },
        }));
      }
    } catch (err) {
      console.error('Error generating thread title:', err);
    }
  };

  const createThreadAndSendMessage = async (message: string, model: ModelType) => {
    const optimisticId = 'temp-msg-' + Date.now();
    const optimisticMessage: Message = {
      id: optimisticId,
      content: message,
      createdAt: new Date(),
      userId: session?.user?.email || 'user',
      isAi: false,
      user: {
        name: session?.user?.name || null,
        image: session?.user?.image || null,
      },
    };
    setMessages((prev) => [...prev, optimisticMessage]);
    try {
      setIsLoading(true);
      const placeholderTitle = message.length > 50 ? message.slice(0, 50) + '...' : message;
      setCurrentThreadTitle(placeholderTitle);
      const threadRes = await fetch('/api/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: placeholderTitle,
          message,
        }),
      });
      if (!threadRes.ok) throw new Error('Failed to create thread');
      const thread = await threadRes.json();
      setCurrentThreadId(thread.id);
      setPendingNewThread(false);
      setMessages((prev) =>
        prev.map((m) => (m.id === optimisticId ? thread.messages[0] : m))
      );
      window.dispatchEvent(new CustomEvent('newThreadCreated', {
        detail: {
          thread: {
            id: thread.id,
            title: placeholderTitle,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      }));
      generateThreadTitle(message, model, thread.id);
      await getAIResponse(message, model, thread.id);
    } catch (err) {
      console.error('Error creating thread and sending message:', err);
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
    } finally {
      setIsLoading(false);
    }
  };

  const getAIResponse = async (message: string, model: ModelType, threadId: string) => {
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

    const aiResponse = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: contextMessages, model, isTitle: false }),
    });
    if (!aiResponse.ok) {
      throw new Error('Failed to get AI response');
    }
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

  const onSendMessage = async (message: string) => {
    if (pendingNewThread) {
      await createThreadAndSendMessage(message, selectedModel);
      return;
    }
    if (!currentThreadId) return;
    try {
      setIsLoading(true);
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
      await getAIResponse(message, selectedModel, currentThreadId);
    } catch (err) {
      console.error('Error in message flow:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const firstName = session?.user?.name ? session.user.name.split(' ')[0] : 'there';

  const suggestionCards = [
    {
      title: "Draft an email",
      subtitle: "to my team announcing a project launch",
      prompt: "Write a professional email to my team announcing the successful launch of our new project. Keep it engaging and concise."
    },
    {
      title: "Explain a concept",
      subtitle: "like JavaScript Promises under the hood",
      prompt: "Explain how JavaScript Promises work under the hood using a simple real-world analogy."
    },
    {
      title: "Help me plan",
      subtitle: "a 3-day budget travel trip to Tokyo",
      prompt: "Provide a 3-day travel itinerary for visiting Tokyo on a moderate budget, focusing on food and culture."
    },
    {
      title: "Design a routine",
      subtitle: "beginner strength bodyweight workout",
      prompt: "Design a 4-week beginner-friendly bodyweight workout routine aimed at building general strength."
    }
  ];

  return (
    <section className="flex flex-col flex-1 h-full bg-transparent relative overflow-hidden">
      {/* Header */}
      <header className="px-3 sm:px-4 py-2 sm:py-3 border-b border-white/[0.04] bg-surface-1/60 backdrop-blur-xl flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          {/* Hamburger Menu to Toggle Sidebar */}
          {(isMobile || sidebarCollapsed) && (
            <button
              onClick={onSidebarToggle}
              className="text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.05] rounded-lg p-2 transition-all cursor-pointer active:scale-95 shrink-0"
              title="Toggle Sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
              </svg>
            </button>
          )}
          
          {/* Active Thread Title */}
          {currentThreadTitle && (
            <span className="text-xs sm:text-sm font-medium text-zinc-300 truncate max-w-[140px] sm:max-w-[300px]">
              {currentThreadTitle}
            </span>
          )}
        </div>

        {/* Model Selector in Header */}
        <ModelSelect selectedModel={selectedModel} onModelChange={setSelectedModel} align="right" />
      </header>

      {/* Chat Messages and Landing Dashboard */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {messages.length === 0 && pendingNewThread ? (
          /* Modern Landing Dashboard */
          <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center px-2 sm:px-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-primary/10 mb-6 animate-float">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-accent-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight gradient-text mb-2">
              Hi {firstName}, how can I help you today?
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm max-w-md mb-6 sm:mb-10 leading-relaxed">
              Choose a model above and prompt below to start a conversation, or select one of the ideas below.
            </p>

            {/* Suggestions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
              {suggestionCards.map((card, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(card.prompt)}
                  className="p-4 text-left rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-accent-primary/30 hover:bg-white/[0.04] transition-all duration-200 hover:-translate-y-0.5 group cursor-pointer"
                >
                  <div className="text-sm font-medium text-zinc-200 group-hover:text-accent-primary transition-colors">
                    {card.title}
                  </div>
                  <div className="text-xs text-zinc-500 mt-1 line-clamp-1">
                    {card.subtitle}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Chat List */
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 pb-4">
            {messages.map((msg) => {
              const isAi = msg.isAi;
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2 sm:gap-3 items-start animate-fade-in ${isAi ? 'justify-start' : 'justify-end'}`}
                >
                  {/* AI Avatar */}
                  {isAi && (
                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-xl bg-accent-primary/10 text-accent-primary shadow-inner mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl max-w-[90%] sm:max-w-[75%] px-3 sm:px-4 py-2 sm:py-2.5 text-[13px] sm:text-sm leading-relaxed
                      ${isAi
                        ? 'bg-white/[0.03] border border-white/[0.05] rounded-tl-sm text-foreground'
                        : 'bg-gradient-to-br from-accent-primary to-accent-primary-dark text-white rounded-tr-sm ml-auto'}
                    `}
                  >
                    <ReactMarkdown
                      components={{
                        // Custom code renderer with headers and Copy buttons
                        code({ className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '');
                          const codeContent = String(children).replace(/\n$/, '');
                          return match ? (
                            <div className="my-3 overflow-hidden rounded-xl bg-black/50 border border-white/[0.06]">
                              <div className="flex items-center justify-between px-3 py-1.5 bg-white/[0.03] border-b border-white/[0.05] text-[10px] text-zinc-400 font-mono">
                                <span>{match[1]}</span>
                                <button
                                  onClick={() => navigator.clipboard.writeText(codeContent)}
                                  className="hover:text-accent-primary transition-colors flex items-center gap-1 active:scale-95 cursor-pointer"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H5.25m14.25 14.25v-10.5A2.25 2.25 0 0017.25 7.5h-9a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 008.25 22.5h9a2.25 2.25 0 002.25-2.25z" />
                                  </svg>
                                  Copy
                                </button>
                              </div>
                              <pre className="p-3 overflow-x-auto text-[11px] leading-relaxed font-mono">
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              </pre>
                            </div>
                          ) : (
                            <code className="bg-accent-primary/10 text-accent-primary px-1 py-0.5 rounded font-mono text-[12px]" {...props}>
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              );
            })}

            {/* Typing indicator spinner dot card */}
            {isLoading && messages.length > 0 && !messages[messages.length - 1].isAi && (
              <div className="flex gap-2 sm:gap-3 items-start justify-start animate-fade-in">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-xl bg-accent-primary/10 text-accent-primary shadow-inner mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-white/[0.03] border border-white/[0.05] px-4 py-3 max-w-[150px] flex items-center gap-1.5 text-zinc-400">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Floating capsule text input */}
      <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
    </section>
  );
} 