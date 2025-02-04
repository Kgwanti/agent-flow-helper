import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const SchedulingSection = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="animate-fadeIn">
                <CalendarIcon className="mr-2 h-5 w-5" />
                Schedule a Viewing
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Schedule a Viewing</DialogTitle>
              </DialogHeader>
              
              <div className="grid md:grid-cols-2 gap-8 items-start mt-4">
                <div className="bg-muted p-4 rounded-lg shadow-sm">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </div>
                
                <div className="space-y-6">
                  <div className="bg-muted p-4 rounded-lg shadow-sm">
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
                    Confirm Viewing
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default SchedulingSection;