"use client";

import { User } from "@prisma/client";
import Image from "next/image";

type Message = {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  threadId: string | null;
  chatId: string | null;
  user: User;
};

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className="flex items-start gap-4 rounded-lg border p-4"
        >
          <Image
            src={message.user.image || ""}
            alt={message.user.name || ""}
            width={32}
            height={32}
            className="rounded-full"
          />
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{message.user.name}</span>
              <span className="text-sm text-muted-foreground">
                {new Date(message.createdAt).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-sm">{message.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
} 