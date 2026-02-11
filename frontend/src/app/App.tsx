import { useState, useEffect, useRef } from 'react';
import { ChatMessage, Message } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Bot, Sparkles } from 'lucide-react';

const INITIAL_BOT_MESSAGE = 'Olá! Qual especialidade ou serviço você procura?';
const FINAL_BOT_MESSAGE =
  'Obrigada pelas informaçôes. Nossa equipe entrar em contato para dar continuidade ao atendimento.';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: INITIAL_BOT_MESSAGE,
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (isClosed) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setIsTyping(true);

    try {
      const payload = {
        messages: nextMessages.map((message) => ({
          role: message.sender === 'bot' ? 'assistant' : 'user',
          content: message.text,
        })),
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('request_failed');
      }

      const data = await response.json();
      const botText = String(data.reply ?? '').trim();
      if (!botText) {
        throw new Error('empty_reply');
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botText,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      if (botText === FINAL_BOT_MESSAGE) {
        setIsClosed(true);
      }
    } catch (error) {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Não foi possível conectar ao atendimento agora. Tente novamente em instantes.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-semibold">Assistente Virtual</h1>
            <p className="text-sm text-blue-100">Online</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1">
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200">
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isTyping || isClosed}
          placeholder={isClosed ? 'Conversa encerrada.' : 'Digite sua mensagem...'}
        />
        <div className="px-4 py-2 text-center space-y-1">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3" />
            Powered by AI
          </p>
          <p className="text-xs text-gray-500">Desenvolvido por Dario Kruger Junior</p>
        </div>
      </div>
    </div>
  );
}
