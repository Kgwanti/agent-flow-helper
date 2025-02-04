import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TimeSlotSelector from "./scheduling/TimeSlotSelector";
import UserDetailsForm, { UserDetailsFormData } from "./scheduling/UserDetailsForm";

const SchedulingSection = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const { toast } = useToast();

  const handleTimeSelection = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirmViewing = () => {
    if (!date || !selectedTime) {
      toast({
        variant: "destructive",
        title: "Please select both date and time",
        description: "You need to choose a date and time slot before proceeding.",
      });
      return;
    }
    setShowDetailsDialog(true);
  };

  const onSubmit = async (data: UserDetailsFormData) => {
    if (!date || !selectedTime) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select both date and time for your viewing.",
      });
      return;
    }

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user?.id) {
        throw new Error('User not authenticated');
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userData.user.id,
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
        });

      if (profileError) throw profileError;

      const { error: appointmentError } = await supabase
        .from('viewing_appointments')
        .insert({
          profile_id: userData.user.id,
          viewing_date: date.toISOString().split('T')[0],
          viewing_time: selectedTime,
        });

      if (appointmentError) throw appointmentError;

      toast({
        title: "Viewing Scheduled!",
        description: "We'll send you a confirmation email shortly.",
      });
      
      setShowDetailsDialog(false);
      setDate(undefined);
      setSelectedTime(null);
    } catch (error) {
      console.error('Error scheduling viewing:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem scheduling your viewing. Please try again.",
      });
    }
  };

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
                  <TimeSlotSelector
                    selectedTime={selectedTime}
                    onTimeSelect={handleTimeSelection}
                  />
                  
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleConfirmViewing}
                  >
                    Confirm Viewing
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Your Details</DialogTitle>
              </DialogHeader>
              <UserDetailsForm onSubmit={onSubmit} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default SchedulingSection;