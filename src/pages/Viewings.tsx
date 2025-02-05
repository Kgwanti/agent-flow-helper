import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ViewingAppointment } from "@/types/viewing";
import { ViewingHeader } from "@/components/viewing/ViewingHeader";
import { ViewingContent } from "@/components/viewing/ViewingContent";
import Navbar from "@/components/Navbar";

const Viewings = () => {
  const [appointments, setAppointments] = useState<ViewingAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from("viewing_appointments")
        .select(`
          id,
          viewing_date,
          viewing_time,
          address,
          profile:profiles!viewing_appointments_profile_id_fkey (
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .order("viewing_date", { ascending: true });

      if (error) throw error;

      setAppointments(data || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load viewing appointments",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAppointments();
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("viewing_appointments")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setAppointments(appointments.filter(appointment => appointment.id !== id));

      toast({
        title: "Success",
        description: "Appointment deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete appointment",
      });
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-8 pb-20">
        <ViewingHeader 
          onRefresh={handleRefresh}
          onBack={() => navigate("/")}
          refreshing={refreshing}
        />
        <ViewingContent 
          loading={loading}
          appointments={appointments}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Viewings;