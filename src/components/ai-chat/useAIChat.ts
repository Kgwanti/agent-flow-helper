
import { useAIChatState } from './hooks/useAIChatState';
import { useAIChatActions } from './hooks/useAIChatActions';
import { useEmailActions } from './hooks/useEmailActions';
import { useState } from 'react';

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
    setEmailConfirmation,
    getRandomGreeting
  } = useAIChatState(embedded);

  const [showHelpMessage, setShowHelpMessage] = useState(true);

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

  const resetChat = () => {
    setMessages([]);
    setInputMessage("");
    setShowHelpMessage(true);
  };

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
    resetChat,
    showHelpMessage,
    setShowHelpMessage,
  };
};
