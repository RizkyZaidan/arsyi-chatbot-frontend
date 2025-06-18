'use client';

import { useState, FormEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with message:', message);
    if (!message.trim()) return;
    
    onSendMessage(message);
    setMessage('');
    console.log('Message sent and input cleared');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t border-gray-200">
      <Input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 bg-gray-50 text-gray-800"
        disabled={isLoading}
      />
      <Button 
        type="submit" 
        disabled={isLoading || !message.trim()}
        className="bg-gray-700 hover:bg-gray-600 text-white"
      >
        Send
      </Button>
    </form>
  );
}
