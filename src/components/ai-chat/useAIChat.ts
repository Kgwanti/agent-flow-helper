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
    getRandomGreeting,
    userProfile
  } = useAIChatState(embedded);

  const { sendMessage: sendMessageAction } = useAIChatActions({
    userId,
    setMessages,
    setInputMessage,
    setIsLoading
  });

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
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
  };
};