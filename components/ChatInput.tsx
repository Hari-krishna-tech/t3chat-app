"use client";

import { useState } from "react";
import { ModelType } from "@/lib/models";
import ModelSelect from "./ModelSelect";

interface ChatInputProps {
  onSendMessage: (message: string, model: ModelType) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState<ModelType>("gemini-2.0-flash");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim(), selectedModel);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-background-dark p-4 bg-background shadow-lg">
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full px-4 py-2 bg-background-dark text-foreground rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-accent-primary transition shadow-inner placeholder-zinc-500"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <ModelSelect selectedModel={selectedModel} onModelChange={setSelectedModel} />
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="px-4 py-2 bg-gradient-to-br from-accent-primary to-accent-primary-dark text-white rounded-lg font-semibold shadow-md hover:from-accent-primary-dark hover:to-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Send"
            )}
          </button>
        </div>
      </div>
    </form>
  );
} 