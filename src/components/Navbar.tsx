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
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold">Nexdata</span>
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            {session ? (
              <>
                <Button variant="ghost" size="lg" className="gap-3 min-w-[140px]" asChild>
                  <Link to="/viewings">
                    <Calendar className="h-5 w-5" />
                    <span>Viewings</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="lg" className="gap-3 min-w-[160px]" asChild>
                  <Link to="/communications">
                    <MessageSquare className="h-5 w-5" />
                    <span>Communications</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="lg" className="gap-3 min-w-[120px]" asChild>
                  <Link to="/clients">
                    <Users className="h-5 w-5" />
                    <span>Clients</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="lg" className="gap-3 min-w-[140px]" asChild>
                  <Link to="/documents">
                    <FileText className="h-5 w-5" />
                    <span>Documents</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="lg" className="gap-3 min-w-[140px]" asChild>
                  <Link to="/assistant">
                    <Bot className="h-5 w-5" />
                    <span>Assistant</span>
                  </Link>
                </Button>
                <Button onClick={handleSignOut} variant="outline" size="lg" className="min-w-[120px]">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="lg" className="gap-3 min-w-[140px]" asChild>
                  <Link to="/assistant">
                    <Bot className="h-5 w-5" />
                    <span>Assistant</span>
                  </Link>
                </Button>
                <Link to="/auth">
                  <Button size="lg" className="min-w-[120px]">Sign In</Button>
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