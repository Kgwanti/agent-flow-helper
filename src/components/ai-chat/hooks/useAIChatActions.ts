
import { Message } from '@/types/chat';
import { EmailConfirmation } from '../types';

interface UseAIChatActionsProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setInputMessage: (message: string) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useAIChatActions = ({
  messages,
  setMessages,
  setInputMessage,
  setIsLoading,
}: UseAIChatActionsProps) => {
  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    try {
      setIsLoading(true);
      const userMessage: Message = { role: 'user', content: message };
      setMessages([...messages, userMessage]);
      setInputMessage("");

      // Simple mock response for now
      const mockResponse = "This is a placeholder response. The chat functionality will be rebuilt from scratch.";
      
      const assistantMessage: Message = { role: 'assistant', content: mockResponse };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return { sendMessage };
};
