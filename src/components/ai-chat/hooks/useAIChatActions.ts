import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/chat';
import { EmailConfirmation } from '../types';

interface UseAIChatActionsProps {
  userId: string | null;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setInputMessage: (message: string) => void;
  setIsLoading: (loading: boolean) => void;
  setEmailConfirmation: React.Dispatch<React.SetStateAction<EmailConfirmation>>;
  userProfile: { email?: string } | null;
}

export const useAIChatActions = ({
  userId,
  setMessages,
  setInputMessage,
  setIsLoading,
  setEmailConfirmation,
  userProfile
}: UseAIChatActionsProps) => {
  const { toast } = useToast();

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    try {
      setIsLoading(true);
      const userMessage: Message = { role: 'user', content: message };
      setMessages((prev: Message[]) => [...prev, userMessage]);
      setInputMessage("");

      // Check if the message contains keywords about sending an email
      const wantsEmail = /email|send|copy|transcript/i.test(message.toLowerCase());

      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: { 
          message,
          userId,
          sendEmail: false // We'll handle email sending after confirmation
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
      setMessages((prev: Message[]) => [...prev, assistantMessage]);

      // If email is requested and we have the user's email, show confirmation
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
      setMessages((prev: Message[]) => [...prev, errorMessage]);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmAndSendEmail = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: { 
          message: "Please send the last response as an email",
          userId,
          sendEmail: true
        }
      });

      if (error) throw error;

      // Log the email communication
      await supabase
        .from('communication_logs')
        .insert([{
          profile_id: userId,
          message_type: 'email',
          content: `Email sent: ${emailConfirmation.content}`
        }]);

      toast({
        title: "Email Sent",
        description: "A copy of this conversation has been sent to your email.",
      });
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send email. Please try again.",
      });
    } finally {
      setIsLoading(false);
      setEmailConfirmation({
        show: false,
        content: '',
        recipientEmail: ''
      });
    }
  };

  return { sendMessage, confirmAndSendEmail };
};