
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
        className={`inline-block rounded-lg p-3 ${
          message.role === 'user'
            ? 'bg-primary text-white'
            : 'bg-muted text-foreground'
        }`}
        style={{ maxWidth: "80%" }}
      >
        <ScrollArea className="w-full max-w-[300px] md:max-w-[400px]" style={{ maxHeight: message.content.length > 200 ? "300px" : "auto" }}>
          <div className="text-sm whitespace-pre-wrap break-words pr-4">
            {message.content}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
