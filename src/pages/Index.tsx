import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SchedulingSection from "@/components/SchedulingSection";
import AIChatAssistant from "@/components/AIChatAssistant";
import DashboardCards from "@/components/dashboard/DashboardCards";
import DashboardSummary from "@/components/dashboard/DashboardSummary";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <Hero />
        <SchedulingSection />
        <AIChatAssistant />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <DashboardCards />
        <DashboardSummary />
      </div>
      <AIChatAssistant />
    </div>
  );
};

export default Index;