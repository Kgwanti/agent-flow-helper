import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatHeader } from "./chat/ChatHeader";
import { ChatInput } from "./chat/ChatInput";
import { ChatMessage } from "./chat/ChatMessage";
import { Message } from "@/types/chat";

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

const AIChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [userProfile, setUserProfile] = useState<{ first_name?: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUserId(session.user.id);
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name')
            .eq('id', session.user.id)
            .maybeSingle();
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const getRandomGreeting = () => {
    const randomIndex = Math.floor(Math.random() * greetings.length);
    return greetings[randomIndex];
  };

  const handleOpen = () => {
    setGreeting(getRandomGreeting());
    setIsOpen(true);
  };

  const getPersonalizedMessage = () => {
    if (userProfile?.first_name) {
      return `Hi ${userProfile.first_name}! ${greeting}`;
    }
    return greeting || "Hello! How can I help you with your real estate needs today?";
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    try {
      setIsLoading(true);
      const userMessage = { role: 'user' as const, content: inputMessage };
      setMessages(prev => [...prev, userMessage]);
      setInputMessage("");

      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: { 
          message: inputMessage,
          userId: userId
        }
      });

      if (error) {
        console.error('Error calling chat-with-ai function:', error);
        throw error;
      }

      if (!data?.response) {
        throw new Error('No response received from AI');
      }

      const assistantMessage = { role: 'assistant' as const, content: data.response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { 
        role: 'assistant' as const, 
        content: 'Sorry, I encountered an error. Please try again later.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl w-[350px] h-[500px] flex flex-col">
          <ChatHeader onClose={() => setIsOpen(false)} />
          
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="bg-muted rounded-lg p-3 mb-4">
              <p className="text-sm">
                {getPersonalizedMessage()}
              </p>
            </div>
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-start gap-2 mb-4">
                <Skeleton className="h-10 w-32" />
              </div>
            )}
          </div>
          
          <ChatInput
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            sendMessage={sendMessage}
            isLoading={isLoading}
          />
        </div>
      ) : (
        <Button
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg"
          onClick={handleOpen}
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default AIChatAssistant;