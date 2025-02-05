import { Skeleton } from "@/components/ui/skeleton";
import { ChatInput } from "../chat/ChatInput";
import { ChatMessage } from "../chat/ChatMessage";
import { AIChatContentProps } from "./types";

export const AIChatContent = ({
  greeting,
  messages,
  isLoading,
  inputMessage,
  setInputMessage,
  sendMessage,
}: AIChatContentProps) => {
  return (
    <>
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="bg-muted rounded-lg p-3 mb-4">
          <p className="text-sm">{greeting}</p>
        </div>
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        {isLoading && (
          <div className="flex items-start gap-2 mb-4">
            <Skeleton className="h-10 w-32" />
          </div>
        )}
      </div>
      
      <ChatInput
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        sendMessage={sendMessage}
        isLoading={isLoading}
      />
    </>
  );
};