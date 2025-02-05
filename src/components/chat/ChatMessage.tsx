import { Message } from "@/types/chat";

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
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  );
};