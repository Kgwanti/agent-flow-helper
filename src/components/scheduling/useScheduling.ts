import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserDetailsFormData } from "./UserDetailsForm";

export const useScheduling = () => {
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
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) throw authError;
      if (!user) {
        throw new Error('No authenticated user found');
      }

      // Update the user's profile first
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Create the viewing appointment
      const { error: appointmentError } = await supabase
        .from('viewing_appointments')
        .insert({
          profile_id: user.id,
          viewing_date: date?.toISOString().split('T')[0],
          viewing_time: selectedTime,
          address: data.address,
        });

      if (appointmentError) throw appointmentError;

      toast({
        title: "Viewing Scheduled!",
        description: "We'll send you a confirmation email shortly.",
      });
      
      setShowDetailsDialog(false);
      setDate(undefined);
      setSelectedTime(null);
    } catch (error: any) {
      console.error('Error scheduling viewing:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem scheduling your viewing. Please try again.",
      });
    }
  };

  return {
    date,
    setDate,
    selectedTime,
    handleTimeSelection,
    showDetailsDialog,
    setShowDetailsDialog,
    handleConfirmViewing,
    onSubmit,
  };
};