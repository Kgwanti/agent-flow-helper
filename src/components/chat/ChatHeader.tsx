import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface ChatHeaderProps {
  onClose: () => void;
}

export const ChatHeader = ({ onClose }: ChatHeaderProps) => {
  return (
    <div className="p-4 bg-primary text-white rounded-t-lg flex justify-between items-center">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <span className="font-semibold">AI Assistant</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="text-white hover:text-white/80"
        onClick={onClose}
      >
        ×
      </Button>
    </div>
  );
};