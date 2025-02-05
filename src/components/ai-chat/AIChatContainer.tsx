import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { ChatHeader } from "../chat/ChatHeader";
import { AIChatContent } from "./AIChatContent";
import { AIChatContainerProps, AIChatContentProps } from "./types";

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
        <div className="bg-white rounded-lg shadow-xl w-[350px] h-[500px] flex flex-col animate-border bg-gradient-to-r from-primary via-accent to-primary bg-[length:400%_400%] p-[2px]">
          <div className="bg-white rounded-lg flex flex-col flex-1">
            <ChatHeader onClose={handleClose} />
            {chatContent}
          </div>
        </div>
      ) : (
        <Button
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg animate-border bg-gradient-to-r from-primary via-accent to-primary bg-[length:400%_400%] p-[2px]"
          onClick={handleOpen}
        >
          <div className="bg-primary rounded-full h-full w-full flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
        </Button>
      )}
    </div>
  );
};