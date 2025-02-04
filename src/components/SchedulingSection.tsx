import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";

const SchedulingSection = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Schedule a Viewing</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose your preferred date and time to view properties. Our agents will confirm your appointment within 24 hours.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="bg-muted p-6 rounded-lg shadow-sm">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </div>
          
          <div className="space-y-6">
            <div className="bg-muted p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Available Time Slots</h3>
              <div className="grid grid-cols-2 gap-3">
                {["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"].map((time) => (
                  <Button
                    key={time}
                    variant="outline"
                    className="justify-start"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {time}
                  </Button>
                ))}
              </div>
            </div>
            
            <Button className="w-full" size="lg">
              Schedule Viewing
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SchedulingSection;