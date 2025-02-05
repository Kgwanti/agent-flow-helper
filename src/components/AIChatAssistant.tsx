import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
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
                {getPersonalizedMessage()}
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
          onClick={handleOpen}
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default AIChatAssistant;