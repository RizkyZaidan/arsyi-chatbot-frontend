interface ChatMessageProps {
  message: string;
  isBot: boolean;
}

export function ChatMessage({ message, isBot }: ChatMessageProps) {
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`max-w-[70%] p-4 rounded-lg ${
          isBot
            ? 'bg-gray-100 text-gray-800'
            : 'bg-gray-700 text-white'
        }`}
      >
        <p className="text-sm md:text-base">{message}</p>
      </div>
    </div>
  );
}
