"use client";

import React, { useEffect, useRef } from "react";
import { BeatLoader } from "react-spinners";

// Message type definition
type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
};

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

// MessageList component
const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[70%] p-3 rounded-lg ${
              message.role === "user"
                ? "bg-purple-600 text-white"
                : "bg-purple-50 text-gray-800"
            } shadow-sm`}
          >
            {message.content}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-[70%] p-3 rounded-lg bg-purple-50 text-gray-800 shadow-sm ">
          <div className="flex items-center gap-2">
              <span>Thinking</span>
              <BeatLoader size={5} color="#9333ea" />
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
