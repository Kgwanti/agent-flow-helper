import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface ViewingAppointment {
  id: string;
  viewing_date: string;
  viewing_time: string;
  address: string | null;
  profile: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone: string | null;
  } | null;
}

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

  const formatClientName = (profile: ViewingAppointment['profile']) => {
    if (!profile || (!profile.first_name && !profile.last_name)) return "N/A";
    const firstName = profile.first_name || "";
    const lastName = profile.last_name || "";
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || "N/A";
  };

  const formatContactInfo = (profile: ViewingAppointment['profile']) => {
    if (!profile) return "N/A";
    return profile.email || profile.phone || "N/A";
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="container mx-auto py-8">
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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    {format(new Date(appointment.viewing_date), "PPP")}
                  </TableCell>
                  <TableCell>{appointment.viewing_time}</TableCell>
                  <TableCell>{appointment.address || "N/A"}</TableCell>
                  <TableCell>
                    {formatClientName(appointment.profile)}
                  </TableCell>
                  <TableCell>
                    {formatContactInfo(appointment.profile)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(appointment.id)}
                      className="hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete appointment</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Viewings;