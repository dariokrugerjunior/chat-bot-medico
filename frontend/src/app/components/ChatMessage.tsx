import { User, Bot } from 'lucide-react';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.sender === 'bot';

  return (
    <div className={`flex gap-2 ${isBot ? '' : 'flex-row-reverse'}`}>
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
          isBot ? 'bg-[#075E54]' : 'bg-[#128C7E]'
        }`}
      >
        {isBot ? (
          <Bot className="w-4 h-4 text-white" />
        ) : (
          <User className="w-4 h-4 text-white" />
        )}
      </div>

      <div className={`flex flex-col max-w-[78%] ${isBot ? 'items-start' : 'items-end'}`}>
        <div
          className={`px-3 py-2 rounded-2xl shadow-sm ${
            isBot
              ? 'bg-white text-gray-900 rounded-tl-sm'
              : 'bg-[#DCF8C6] text-gray-900 rounded-tr-sm'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        </div>
        <span className="text-[11px] text-gray-500 mt-1 px-1">
          {message.timestamp.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
}
