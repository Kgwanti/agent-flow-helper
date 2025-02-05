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
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 animate-gradient-slow"></div>
        <div className="relative">
          <Navbar />
          <Hero />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SchedulingSection />
              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">AI Real Estate Assistant</h2>
                <AIChatAssistant embedded={true} />
              </div>
            </div>
          </div>
          <AIChatAssistant embedded={false} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 animate-gradient-slow"></div>
      <div className="relative">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <DashboardCards />
              <DashboardSummary />
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">AI Real Estate Assistant</h2>
              <AIChatAssistant embedded={true} />
            </div>
          </div>
        </div>
        <AIChatAssistant embedded={false} />
      </div>
    </div>
  );
};

export default Index;