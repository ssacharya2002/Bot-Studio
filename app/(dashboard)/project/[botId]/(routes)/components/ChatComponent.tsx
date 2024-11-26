"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import MessageList from "./MessageList";
import { bot } from "@prisma/client";

interface ChatComponentProps {
  botId: string;
  bot:bot
}

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
}

export default function ChatComponent({ botId,bot }: ChatComponentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent empty submissions
    if (!input.trim()) return;

    // Create user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      role: "user",
    };

    // Update messages with user message
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Reset input
    setInput("");

    // Set loading state
    setIsLoading(true);

    try {
      // Fetch response from API
      const response = await fetch(`/api/chat/${botId}/ans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          botId,
        }),
      });
      if (response.status !== 200) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const data = await response.json();

      // Create assistant message
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: data.content,
        role: data.role,
      };

      // Update messages with assistant response
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally, add an error message to messages
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "Sorry, something went wrong.",
        role: "assistant",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="p-2 bg-white border-b">
        <h3 className="text-xl font-semibold">{bot.name}</h3>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages}  isLoading={isLoading} />
      </div>

      {/* Input form */}
      <div className="bg-white p-2 border-t">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask any question..."
            className="w-full autofocus:outline-none"
            disabled={isLoading}
          />
          <Button
            type="submit"
            className="bg-blue-600"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? "Sending..." : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
