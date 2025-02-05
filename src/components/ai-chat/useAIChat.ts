import { useAIChatState } from './hooks/useAIChatState';
import { useAIChatActions } from './hooks/useAIChatActions';

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

  const { sendMessage: sendMessageAction, confirmAndSendEmail } = useAIChatActions({
    userId,
    setMessages,
    setInputMessage,
    setIsLoading,
    setEmailConfirmation,
    emailConfirmation,
    userProfile
  });

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const cancelEmailSend = () => {
    setEmailConfirmation({
      show: false,
      content: '',
      recipientEmail: ''
    });
  };

  const getPersonalizedMessage = () => {
    if (userProfile?.first_name) {
      return `Hi ${userProfile.first_name}! ${greeting}`;
    }
    return greeting || "Hello! How can I help you with your real estate needs today?";
  };

  const sendMessage = () => {
    sendMessageAction(inputMessage);
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