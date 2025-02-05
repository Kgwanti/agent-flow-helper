import { useState, useEffect } from 'react';
import { Message } from '@/types/chat';
import { supabase } from '@/integrations/supabase/client';
import { EmailConfirmation } from '../types';

const greetings = [
  "Good morning! Ready to turn those bricks into bucks today?",
  "Hey there! Let's make some cash flow out of those concrete jungles!",
  "What's up, house flipper? Ready to rake in some commissions and avoid living in the office?",
  "Greetings, property investor! Time to hunt for gold in the housing market!",
  "Hello, real estate tycoon! Let's sell some dreams before the market crashes again!",
  "Hi there! Let's turn those 'For Sale' signs into cash cows... before the cows come home.",
  "Hey, property mogul! Ready to show some overpriced shoeboxes today?",
  "Salutations, real estate strategist! Time to cash in before interest rates hit the roof!",
  "Hello, deal broker! Let's squeeze every penny out of these listings and hope no one's living in a cardboard box!",
  "Good day, real estate czar! Let's make those listings shine like gold—before they turn into fool's gold"
];

export const getRandomGreeting = () => {
  const randomIndex = Math.floor(Math.random() * greetings.length);
  return greetings[randomIndex];
};

export const useAIChatState = (embedded = false) => {
  const [isOpen, setIsOpen] = useState(embedded);
  const [greeting, setGreeting] = useState(getRandomGreeting());
  const [userProfile, setUserProfile] = useState<{ first_name?: string; email?: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [emailConfirmation, setEmailConfirmation] = useState<EmailConfirmation>({
    show: false,
    content: '',
    recipientEmail: ''
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUserId(session.user.id);
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, email')
            .eq('id', session.user.id)
            .maybeSingle();
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [embedded, isOpen]);

  return {
    isOpen,
    setIsOpen,
    greeting,
    userProfile,
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    isLoading,
    setIsLoading,
    userId,
    emailConfirmation,
    setEmailConfirmation,
    getRandomGreeting
  };
};