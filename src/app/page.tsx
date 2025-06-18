'use client';

import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";

export default function ChatPage() {
  const [messages, setMessages] = useState<Array<{ isBot: boolean; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    console.log('Handling message:', message);
    // Add user message
    setMessages(prev => [...prev, { isBot: false, content: message }]);
    setIsLoading(true);

    try {
      console.log('Making API call to chat endpoint...');
      const response = await axios.post('http://localhost:5000/api/chat', { message });

      console.log('API Response status:', response.status);
      const data = response.data;
      console.log('API Response data:', data);

      if (response.status === 200) {
        setMessages(prev => [...prev, { isBot: true, content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { isBot: true, content: 'Sorry, I encountered an error.' }]);
      }
    } catch (error: any) {
      console.error('API Error:', error);
      if (error.response?.status === 429) {
        const errorMessage = error.response.data.error as string;
        setMessages(prev => [...prev, {
          isBot: true,
          content: errorMessage || 'Rate limit exceeded. Please wait before sending another message.'
        }]);
      } else {
        setMessages(prev => [...prev, { isBot: true, content: 'Sorry, I encountered a network error.' }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white shadow-xl">
          <div className="p-6 border-b border-gray-200 bg-gray-700 text-white rounded-t-lg">
            <h1 className="text-2xl font-bold">Arsyi Chatbot</h1>
            <p className="text-gray-300 text-sm">Ask me anything!</p>
          </div>

          <ScrollArea className="h-[500px] p-6">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <p>No messages yet. Start a conversation!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    message={message.content}
                    isBot={message.isBot}
                  />
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 p-4 rounded-lg">
                      Typing...
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </Card>
      </div>
    </div>
  );
}
