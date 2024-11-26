"use client";

import React, {  useEffect, useRef } from "react";

import { BeatLoader } from "react-spinners";


// Message type definition
type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
};

// MessageList component
const MessageList: React.FC<{ messages: Message[]; isLoading: boolean }> = ({
  messages,
  isLoading,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="p-4 space-y-4">
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={`flex ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[70%] p-3 rounded-lg ${
              message.role === "user"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {message.content}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-[70%] p-3 rounded-lg bg-gray-200 text-black flex justify-center items-center">
          Loading<BeatLoader size={5}  />
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
