import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
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
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <div className="bg-muted rounded-lg p-3">
            <p className="text-sm">{greeting}</p>
          </div>
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          {isLoading && (
            <div className="flex items-start gap-2">
              <Skeleton className="h-10 w-32" />
            </div>
          )}
        </div>
      </ScrollArea>
      
      <ChatInput
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        sendMessage={sendMessage}
        isLoading={isLoading}
      />
    </>
  );
};