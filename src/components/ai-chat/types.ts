import { Message } from "@/types/chat";

export interface AIChatProps {
  embedded?: boolean;
  onClose?: () => void;
}

export interface AIChatContainerProps extends AIChatProps {
  isOpen: boolean;
  handleOpen: () => void;
  handleClose: () => void;
}

export interface AIChatContentProps {
  greeting: string;
  messages: Message[];
  isLoading: boolean;
  inputMessage: string;
  setInputMessage: (message: string) => void;
  sendMessage: () => void;
}