import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SchedulingSection from "@/components/SchedulingSection";
import AIChatAssistant from "@/components/AIChatAssistant";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <SchedulingSection />
      <AIChatAssistant />
    </div>
  );
};

export default Index;