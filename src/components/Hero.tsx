import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare } from "lucide-react";

const Hero = () => {
  return (
    <div className="bg-gradient-to-b from-muted to-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary sm:text-5xl md:text-6xl animate-fadeIn">
            Streamline Your Real Estate Workflow
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-secondary sm:text-lg md:mt-5 md:text-xl md:max-w-3xl animate-fadeIn">
            Automate scheduling, enhance client communication, and boost your productivity with our AI-powered assistant.
          </p>
          <div className="mt-10 flex justify-center gap-4 animate-fadeIn">
            <Button size="lg" className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Schedule Viewing
            </Button>
            <Button size="lg" variant="outline" className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Chat Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;