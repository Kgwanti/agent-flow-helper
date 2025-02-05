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
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold">Nexdata</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/viewings">
                    <Calendar className="h-4 w-4 mr-2" />
                    Viewings
                  </Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/communications">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Communications
                  </Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/clients">
                    <Users className="h-4 w-4 mr-2" />
                    Clients
                  </Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/documents">
                    <FileText className="h-4 w-4 mr-2" />
                    Documents
                  </Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/assistant">
                    <Bot className="h-4 w-4 mr-2" />
                    Assistant
                  </Link>
                </Button>
                <Button onClick={handleSignOut} variant="outline">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/assistant">
                    <Bot className="h-4 w-4 mr-2" />
                    Assistant
                  </Link>
                </Button>
                <Link to="/auth">
                  <Button>Sign In</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;