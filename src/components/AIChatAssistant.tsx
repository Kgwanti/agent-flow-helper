import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send } from "lucide-react";
import { useState } from "react";

const AIChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl w-[350px] h-[500px] flex flex-col">
          <div className="p-4 bg-primary text-white rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <span className="font-semibold">AI Assistant</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-white/80"
              onClick={() => setIsOpen(false)}
            >
              ×
            </Button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="bg-muted rounded-lg p-3 mb-4">
              <p className="text-sm">
                Hello! I'm your AI assistant. How can I help you today with your real estate needs?
              </p>
            </div>
          </div>
          
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default AIChatAssistant;