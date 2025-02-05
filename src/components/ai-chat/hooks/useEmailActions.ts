import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { EmailConfirmation } from '../types';

interface UseEmailActionsProps {
  userId: string | null;
  setIsLoading: (loading: boolean) => void;
  setEmailConfirmation: React.Dispatch<React.SetStateAction<EmailConfirmation>>;
  emailConfirmation: EmailConfirmation;
}

export const useEmailActions = ({
  userId,
  setIsLoading,
  setEmailConfirmation,
  emailConfirmation,
}: UseEmailActionsProps) => {
  const { toast } = useToast();

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

  const cancelEmailSend = () => {
    setEmailConfirmation({
      show: false,
      content: '',
      recipientEmail: ''
    });
  };

  return { confirmAndSendEmail, cancelEmailSend };
};