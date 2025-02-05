import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
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
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data, error } = await supabase
          .from("viewing_appointments")
          .select(`
            id,
            viewing_date,
            viewing_time,
            address,
            profile:profiles (
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
      }
    };

    fetchAppointments();
  }, [toast]);

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
                    {appointment.profile
                      ? `${appointment.profile.first_name || ""} ${
                          appointment.profile.last_name || ""
                        }`.trim() || "N/A"
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {appointment.profile
                      ? appointment.profile.email || appointment.profile.phone || "N/A"
                      : "N/A"}
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