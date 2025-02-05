import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  const navigate = useNavigate();

  const handleTimeSelection = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirmViewing = async () => {
    // Check authentication first
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: (
          <div className="flex flex-col gap-4">
            <p>Please sign in to schedule a viewing.</p>
            <Button 
              variant="outline" 
              onClick={() => navigate("/auth")}
              className="mt-2"
            >
              Sign In
            </Button>
          </div>
        ),
      });
      return;
    }

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
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: (
            <div className="flex flex-col gap-4">
              <p>Please sign in to schedule a viewing.</p>
              <Button 
                variant="outline" 
                onClick={() => navigate("/auth")}
                className="mt-2"
              >
                Sign In
              </Button>
            </div>
          ),
        });
        return;
      }

      const userId = session.session.user.id;

      // First update or create the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
        });

      if (profileError) throw profileError;

      // Then create the viewing appointment
      const { error: appointmentError } = await supabase
        .from('viewing_appointments')
        .insert({
          profile_id: userId,
          viewing_date: date?.toISOString().split('T')[0],
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
                <DialogDescription>
                  Choose your preferred date and time for the property viewing.
                </DialogDescription>
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
                <DialogDescription>
                  Please provide your contact information for the viewing appointment.
                </DialogDescription>
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