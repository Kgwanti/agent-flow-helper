
import { AIChatContainer } from "./ai-chat/AIChatContainer";
import { useAIChat } from "./ai-chat/useAIChat";
import { AIChatProps } from "./ai-chat/types";

const AIChatAssistant = ({ embedded = false, onClose }: AIChatProps) => {
  const {
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
  } = useAIChat(embedded);

  const handleCloseWrapper = () => {
    handleClose();
    onClose?.();
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
    }
  };

  return (
    <AIChatContainer
      embedded={embedded}
      isOpen={isOpen}
      handleOpen={handleOpen}
      handleClose={handleCloseWrapper}
      greeting={greeting}
      messages={messages}
      isLoading={isLoading}
      inputMessage={inputMessage}
      setInputMessage={setInputMessage}
      sendMessage={handleSendMessage}
      resetChat={resetChat}
      showHelpMessage={showHelpMessage}
      setShowHelpMessage={setShowHelpMessage}
    />
  );
};

export default AIChatAssistant;
