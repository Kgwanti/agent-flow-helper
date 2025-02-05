import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/chat';

interface UseAIChatActionsProps {
  userId: string | null;
  setMessages: (messages: Message[]) => void;
  setInputMessage: (message: string) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useAIChatActions = ({
  userId,
  setMessages,
  setInputMessage,
  setIsLoading
}: UseAIChatActionsProps) => {
  const { toast } = useToast();

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    try {
      setIsLoading(true);
      const userMessage = { role: 'user' as const, content: message };
      setMessages(prev => [...prev, userMessage]);
      setInputMessage("");

      // Check if the message contains keywords about sending an email
      const wantsEmail = /email|send|copy|transcript/i.test(message.toLowerCase());

      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: { 
          message,
          userId,
          sendEmail: wantsEmail
        }
      });

      if (error) {
        console.error('Error calling chat-with-ai function:', error);
        throw error;
      }

      if (!data?.response) {
        throw new Error('No response received from AI');
      }

      const assistantMessage = { role: 'assistant' as const, content: data.response };
      setMessages(prev => [...prev, assistantMessage]);

      if (wantsEmail) {
        toast({
          title: "Email Sent",
          description: "A copy of this conversation has been sent to your email.",
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { 
        role: 'assistant' as const, 
        content: 'Sorry, I encountered an error. Please try again later.' 
      };
      setMessages(prev => [...prev, errorMessage]);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { sendMessage };
};