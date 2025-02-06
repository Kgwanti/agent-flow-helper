import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInput } from "../chat/ChatInput";
import { ChatMessage } from "../chat/ChatMessage";
import { AIChatContentProps } from "./types";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader, RefreshCw, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const AIChatContent = ({
  greeting,
  messages,
  isLoading,
  inputMessage,
  setInputMessage,
  sendMessage,
  resetChat,
  showHelpMessage,
  setShowHelpMessage,
}: AIChatContentProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  return (
    <>
      <ScrollArea className="flex-1 p-4 h-full" ref={scrollRef}>
        <div className="space-y-4 min-h-full">
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

          {showHelpMessage && (
            <Alert>
              <AlertDescription className="flex items-center justify-between">
                <span>Type "Help" to see how I can be of assistance</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setShowHelpMessage(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader className="h-4 w-4 animate-spin" />
              <span className="text-sm">Generating response...</span>
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