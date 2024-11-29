"use client";

import React, { useState } from "react";
import MessageList from "./MessageList";
import { bot } from "@prisma/client";
import ChatInput from "./ChatInput";

interface ChatComponentProps {
  botId: string;  
  bot: bot;
}

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
}

export default function ChatComponent({ botId, bot }: ChatComponentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      role: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/chat/${botId}/ans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [...messages, userMessage], botId }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: data.content,
        role: data.role,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          content: "Sorry, something went wrong.",
          role: "assistant",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
      <div className="p-4 border-b bg-white/90">
        <h3 className="text-xl font-semibold text-purple-600 capitalize">{bot.name}</h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>

      <div className="p-4 border-t bg-white/90">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
