import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/chat';
import { EmailConfirmation } from '../types';

interface UseAIChatActionsProps {
  userId: string | null;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setInputMessage: (message: string) => void;
  setIsLoading: (loading: boolean) => void;
  setEmailConfirmation: React.Dispatch<React.SetStateAction<EmailConfirmation>>;
  userProfile: { email?: string } | null;
  emailConfirmation: EmailConfirmation;
}

export const useAIChatActions = ({
  userId,
  messages,
  setMessages,
  setInputMessage,
  setIsLoading,
  setEmailConfirmation,
  userProfile,
  emailConfirmation
}: UseAIChatActionsProps) => {
  const { toast } = useToast();

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    try {
      setIsLoading(true);
      const userMessage: Message = { role: 'user', content: message };
      setMessages([...messages, userMessage]);
      setInputMessage("");

      const wantsEmail = /email|send|copy|transcript/i.test(message.toLowerCase());

      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: { 
          message,
          userId,
          sendEmail: false
        }
      });

      if (error) {
        console.error('Error calling chat-with-ai function:', error);
        throw error;
      }

      if (!data?.response) {
        throw new Error('No response received from AI');
      }

      const assistantMessage: Message = { role: 'assistant', content: data.response };
      setMessages((prev) => [...prev, assistantMessage]);

      if (wantsEmail && userProfile?.email) {
        setEmailConfirmation({
          show: true,
          content: data.response,
          recipientEmail: userProfile.email
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again later.' 
      };
      setMessages((prev) => [...prev, errorMessage]);
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