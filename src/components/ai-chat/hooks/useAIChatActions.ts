
import { Message } from '@/types/chat';
import { supabase } from '@/integrations/supabase/client';

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

      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: { message }
      });

      if (error) throw error;

      const assistantMessage: Message = { 
        role: 'assistant', 
        content: data.response || "I apologize, but I'm having trouble processing your request at the moment."
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: "I apologize, but I encountered an error while processing your request. Please try again later."
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return { sendMessage };
};
