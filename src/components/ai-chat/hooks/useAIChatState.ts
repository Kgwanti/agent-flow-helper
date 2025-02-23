
import { useState } from 'react';
import { Message } from '@/types/chat';

const greetings = [
  "Hello! I'm your AI assistant. I'm currently under maintenance.",
  "Hi there! The chat system is being rebuilt from scratch.",
  "Welcome! Please note that full chat functionality is coming soon.",
];

export const getRandomGreeting = () => {
  const randomIndex = Math.floor(Math.random() * greetings.length);
  return greetings[randomIndex];
};

export const useAIChatState = (embedded = false) => {
  const [isOpen, setIsOpen] = useState(embedded);
  const [greeting] = useState(getRandomGreeting());
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return {
    isOpen,
    setIsOpen,
    greeting,
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    isLoading,
    setIsLoading,
    getRandomGreeting
  };
};
