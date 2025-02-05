import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ViewingAppointment } from "@/types/viewing";
import { ViewingAppointmentsTable } from "@/components/viewing/ViewingAppointmentsTable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
      <div className="container mx-auto py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Viewing Appointments</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => navigate("/")}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Viewing Appointments</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing}
            className={refreshing ? "animate-spin" : ""}
          >
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh appointments</span>
          </Button>
        </div>

        {loading ? (
          <div className="text-center">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No viewing appointments found
          </div>
        ) : (
          <ViewingAppointmentsTable
            appointments={appointments}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default Viewings;