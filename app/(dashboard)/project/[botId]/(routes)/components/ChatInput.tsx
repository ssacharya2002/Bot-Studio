import React, { useState } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({
  isLoading,
  onSendMessage,
}: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    onSendMessage(input);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask any question..."
        className="flex-1 px-4 py-2 rounded-lg border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        disabled={isLoading || !input.trim()}
      >
        {isLoading ? (
          "Sending..."
        ) : (
          <Send className="h-4 w-4" />
        )}
      </button>
    </form>
  );
}
