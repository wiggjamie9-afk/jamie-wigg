import { useState, useCallback, useRef } from 'react';
import { apiClient } from '../services/api';

interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

interface UseChatReturn {
  sessionId: string | null;
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  sendMessage: (message: string, appId?: string) => Promise<void>;
  loadHistory: (userId: string, sessionId: string) => Promise<void>;
  clearSession: (userId: string, sessionId: string) => Promise<void>;
  startNewSession: () => void;
}

export const useChat = (): UseChatReturn => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionRef = useRef<string | null>(null);

  const startNewSession = useCallback(() => {
    setSessionId(null);
    setMessages([]);
    sessionRef.current = null;
  }, []);

  const sendMessage = useCallback(async (message: string, appId?: string) => {
    try {
      setLoading(true);
      setError(null);

      // Get userId from localStorage
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        throw new Error('User not authenticated');
      }

      const user = JSON.parse(userStr);
      const userId = user.userId;

      // Add user message to local state
      const userMessage: ChatMessage = {
        role: 'user',
        content: message,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);

      // Send to API
      const response = await apiClient.sendMessage(
        userId,
        message,
        appId,
        sessionRef.current || undefined
      );

      // Update session ID
      if (!sessionRef.current) {
        sessionRef.current = response.sessionId;
        setSessionId(response.sessionId);
      }

      // Add AI response to messages
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send message';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadHistory = useCallback(async (userId: string, sessionIdToLoad: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.getChatHistory(userId, sessionIdToLoad);

      setSessionId(sessionIdToLoad);
      sessionRef.current = sessionIdToLoad;
      setMessages(
        response.messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
        }))
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load history';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSession = useCallback(async (userId: string, sessionIdToClear: string) => {
    try {
      setLoading(true);

      await apiClient.clearChatSession(userId, sessionIdToClear);

      if (sessionIdToClear === sessionId) {
        startNewSession();
      }
    } catch (err) {
      console.error('Clear session error:', err);
    } finally {
      setLoading(false);
    }
  }, [sessionId, startNewSession]);

  return {
    sessionId,
    messages,
    loading,
    error,
    sendMessage,
    loadHistory,
    clearSession,
    startNewSession,
  };
};
