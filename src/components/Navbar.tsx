import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Users, Calendar, MessageSquare, Bot, FileText } from "lucide-react";

const Navbar = () => {
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <>
      <nav className="bg-background border-b">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold">Nexdata</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  <Button variant="ghost" size="default" className="gap-2 min-w-[110px] text-sm" asChild>
                    <Link to="/viewings">
                      <Calendar className="h-4 w-4" />
                      <span>Viewings</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" size="default" className="gap-2 min-w-[140px] text-sm" asChild>
                    <Link to="/communications">
                      <MessageSquare className="h-4 w-4" />
                      <span>Communications</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" size="default" className="gap-2 min-w-[100px] text-sm" asChild>
                    <Link to="/clients">
                      <Users className="h-4 w-4" />
                      <span>Clients</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" size="default" className="gap-2 min-w-[120px] text-sm" asChild>
                    <Link to="/documents">
                      <FileText className="h-4 w-4" />
                      <span>Documents</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" size="default" className="gap-2 min-w-[120px] text-sm" asChild>
                    <Link to="/assistant">
                      <Bot className="h-4 w-4" />
                      <span>Assistant</span>
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="default" className="gap-2 min-w-[120px] text-sm" asChild>
                    <Link to="/assistant">
                      <Bot className="h-4 w-4" />
                      <span>Assistant</span>
                    </Link>
                  </Button>
                  <Link to="/auth">
                    <Button size="default" className="min-w-[100px] text-sm">Sign In</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      {session && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
          <div className="max-w-[1600px] mx-auto">
            <Button 
              onClick={handleSignOut} 
              variant="outline" 
              size="default" 
              className="w-full text-sm bg-white hover:bg-accent"
            >
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;