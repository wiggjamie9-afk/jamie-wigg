'use client';

import { useRef, useEffect, useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

interface ChatInterfaceProps {
  messages?: Message[];
  onSendMessage?: (message: string) => Promise<void>;
  isLoading?: boolean;
  sessionId?: string;
}

export function ChatInterface({
  messages = [],
  onSendMessage,
  isLoading = false,
  sessionId,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isSending || !onSendMessage) return;

    setIsSending(true);
    try {
      await onSendMessage(input);
      setInput('');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-full flex-col rounded-lg border-2 border-gray-200 bg-white">
      <div className="border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 p-4">
        <h3 className="font-semibold text-gray-800">JARVIS - Your AI Companion</h3>
        <p className="text-xs text-gray-600">Personalized support for your journey</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center text-gray-500">
            <div>
              <p className="text-2xl">💭</p>
              <p className="mt-2 text-sm">Start a conversation with your AI companion</p>
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs rounded-lg px-4 py-2 ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="mt-1 text-xs opacity-70">
                  {msg.timestamp
                    ? new Date(msg.timestamp).toLocaleTimeString()
                    : ''}
                </p>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-lg bg-gray-200 px-4 py-2 text-gray-800">
              <p className="text-sm">JARVIS is thinking...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t-2 border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask JARVIS anything..."
            disabled={isSending || !onSendMessage}
            className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500 disabled:bg-gray-100"
          />
          <button
            onClick={handleSend}
            disabled={isSending || !input.trim() || !onSendMessage}
            className="rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
          >
            Send
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          {sessionId ? `Session: ${sessionId.slice(0, 8)}...` : 'New session'}
        </p>
      </div>
    </div>
  );
}
