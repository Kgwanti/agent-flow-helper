
import { useAIChatState } from './hooks/useAIChatState';
import { useAIChatActions } from './hooks/useAIChatActions';
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
    getRandomGreeting
  } = useAIChatState(embedded);

  const [showHelpMessage, setShowHelpMessage] = useState(true);

  const { sendMessage } = useAIChatActions({
    messages,
    setMessages,
    setInputMessage,
    setIsLoading,
  });

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const resetChat = () => {
    setMessages([]);
    setInputMessage("");
    setShowHelpMessage(true);
  };

  return {
    isOpen,
    greeting,
    messages,
    isLoading,
    inputMessage,
    setInputMessage,
    sendMessage,
    handleOpen,
    handleClose,
    resetChat,
    showHelpMessage,
    setShowHelpMessage,
  };
};
