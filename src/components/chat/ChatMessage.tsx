
import { Message } from "@/types/chat";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div
      className={`mb-4 ${
        message.role === 'user' ? 'text-right' : 'text-left'
      }`}
    >
      <div
        className={`inline-block rounded-lg p-3 max-w-[80%] ${
          message.role === 'user'
            ? 'bg-primary text-white'
            : 'bg-muted text-foreground'
        }`}
      >
        <ScrollArea className="h-full max-h-[300px] w-[300px] md:w-[400px]">
          <div className="text-sm whitespace-pre-wrap break-words pr-4">
            {message.content}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
