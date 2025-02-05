import { useAIChatState } from './hooks/useAIChatState';
import { useAIChatActions } from './hooks/useAIChatActions';
import { useEmailActions } from './hooks/useEmailActions';

export const useAIChat = (embedded = false) => {
  const {
    isOpen,
    setIsOpen,
    greeting,
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    isLoading,
    setIsLoading,
    userId,
    userProfile,
    emailConfirmation,
    setEmailConfirmation
  } = useAIChatState(embedded);

  const { sendMessage } = useAIChatActions({
    userId,
    messages,
    setMessages,
    setInputMessage,
    setIsLoading,
    setEmailConfirmation,
    userProfile,
    emailConfirmation
  });

  const { confirmAndSendEmail, cancelEmailSend } = useEmailActions({
    userId,
    setIsLoading,
    setEmailConfirmation,
    emailConfirmation
  });

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const getPersonalizedMessage = () => {
    if (userProfile?.first_name) {
      return `Hi ${userProfile.first_name}! ${greeting}`;
    }
    return greeting || "Hello! How can I help you with your real estate needs today?";
  };

  return {
    isOpen,
    greeting: getPersonalizedMessage(),
    messages,
    isLoading,
    inputMessage,
    setInputMessage,
    sendMessage,
    handleOpen,
    handleClose,
    emailConfirmation,
    confirmAndSendEmail,
    cancelEmailSend,
  };
};