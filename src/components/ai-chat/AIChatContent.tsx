
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInput } from "../chat/ChatInput";
import { ChatMessage } from "../chat/ChatMessage";
import { AIChatContentProps } from "./types";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export const AIChatContent = ({
  greeting,
  messages,
  isLoading,
  inputMessage,
  setInputMessage,
  sendMessage,
  resetChat,
}: AIChatContentProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  return (
    <>
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          <div className="bg-muted rounded-lg p-3 relative">
            <p className="text-sm pr-8">{greeting}</p>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={resetChat}
              title="Reset chat"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
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
