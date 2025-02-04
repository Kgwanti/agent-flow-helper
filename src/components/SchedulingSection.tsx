import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface UserDetailsForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const SchedulingSection = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const { toast } = useToast();

  const form = useForm<UserDetailsForm>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (data: UserDetailsForm) => {
    if (!date || !selectedTime) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select both date and time for your viewing.",
      });
      return;
    }

    try {
      // First, create or update the user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
        });

      if (profileError) throw profileError;

      // Get the current user's ID
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user?.id) {
        throw new Error('User not authenticated');
      }

      // Create the viewing appointment
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
      form.reset();
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
                          variant={selectedTime === time ? "default" : "outline"}
                          className="justify-start"
                          onClick={() => handleTimeSelection(time)}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
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
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john.doe@example.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 000-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full">
                    Schedule Viewing
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default SchedulingSection;