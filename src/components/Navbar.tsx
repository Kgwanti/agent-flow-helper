import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import NavLinks from "./navbar/NavLinks";
import SignOutButton from "./navbar/SignOutButton";

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
                <img 
                  src="/lovable-uploads/882ee61f-b22e-42ff-8559-6981d4561c63.png" 
                  alt="Nexdata Logo" 
                  className="h-8 w-auto"
                />
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <NavLinks isAuthenticated={!!session} />
            </div>
          </div>
        </div>
      </nav>
      {session && <SignOutButton onSignOut={handleSignOut} />}
    </>
  );
};

export default Navbar;