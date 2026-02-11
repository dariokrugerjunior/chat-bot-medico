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
    <div className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isBot ? 'bg-blue-500' : 'bg-gray-600'
      }`}>
        {isBot ? (
          <Bot className="w-5 h-5 text-white" />
        ) : (
          <User className="w-5 h-5 text-white" />
        )}
      </div>
      
      <div className={`flex flex-col max-w-[70%] ${isBot ? 'items-start' : 'items-end'}`}>
        <div className={`px-4 py-2 rounded-2xl ${
          isBot 
            ? 'bg-gray-100 text-gray-900 rounded-tl-sm' 
            : 'bg-blue-500 text-white rounded-tr-sm'
        }`}>
          <p className="text-sm leading-relaxed">{message.text}</p>
        </div>
        <span className="text-xs text-gray-400 mt-1 px-1">
          {message.timestamp.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </div>
  );
}
