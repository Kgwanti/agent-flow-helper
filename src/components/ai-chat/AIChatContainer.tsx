import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { ChatHeader } from "../chat/ChatHeader";
import { AIChatContent } from "./AIChatContent";
import { AIChatContainerProps } from "./types";

export const AIChatContainer = ({
  embedded,
  isOpen,
  handleOpen,
  handleClose,
  greeting,
  messages,
  isLoading,
  inputMessage,
  setInputMessage,
  sendMessage,
}: AIChatContainerProps & AIChatContentProps) => {
  const chatContent = (
    <AIChatContent
      greeting={greeting}
      messages={messages}
      isLoading={isLoading}
      inputMessage={inputMessage}
      setInputMessage={setInputMessage}
      sendMessage={sendMessage}
    />
  );

  if (embedded) {
    return (
      <div className="bg-white rounded-lg h-[500px] flex flex-col">
        {chatContent}
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl w-[350px] h-[500px] flex flex-col">
          <ChatHeader onClose={handleClose} />
          {chatContent}
        </div>
      ) : (
        <Button
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg"
          onClick={handleOpen}
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};