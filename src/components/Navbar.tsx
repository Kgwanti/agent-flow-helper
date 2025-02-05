import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import NavLinks from "./navbar/NavLinks";
import SignOutButton from "./navbar/SignOutButton";
import { Building2 } from "lucide-react";

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
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center gap-2">
                <Building2 size={32} className="text-primary" />
                <span className="text-xl font-semibold text-primary">NexData</span>
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