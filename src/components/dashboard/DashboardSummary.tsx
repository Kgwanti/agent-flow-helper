import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { ViewingAppointment } from "@/types/viewing";

const DashboardSummary = () => {
  const [viewings, setViewings] = useState<ViewingAppointment[]>([]);
  const [communications, setCommunications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: viewingsData } = await supabase
          .from("viewing_appointments")
          .select(`
            *,
            profile:profiles (
              first_name,
              last_name,
              email,
              phone
            )
          `)
          .order('viewing_date', { ascending: true })
          .limit(5);

        const { data: communicationsData } = await supabase
          .from("communication_logs")
          .select(`
            *,
            profile:profiles (
              first_name,
              last_name,
              email
            )
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        setViewings(viewingsData || []);
        setCommunications(communicationsData || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-white/100 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Recent Communications</CardTitle>
          <Alert variant="warning" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Showing demo data. Add real communications to replace these examples.
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading communications...</p>
          ) : communications.length === 0 ? (
            <p className="text-muted-foreground">No recent communications</p>
          ) : (
            <div className="space-y-4">
              {communications.map((comm) => (
                <div key={comm.id} className="border-b pb-2">
                  <p className="font-medium">
                    {comm.profile?.first_name} {comm.profile?.last_name || '[DEMO] Client'}
                  </p>
                  <p className="text-sm text-muted-foreground">{comm.content}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(comm.created_at), "PPp")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white/100 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Upcoming Viewings</CardTitle>
          <Alert variant="warning" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Showing demo data. Schedule real viewings to replace these examples.
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading viewings...</p>
          ) : viewings.length === 0 ? (
            <p className="text-muted-foreground">No upcoming viewings</p>
          ) : (
            <div className="space-y-4">
              {viewings.map((viewing) => (
                <div key={viewing.id} className="border-b pb-2">
                  <p className="font-medium">{viewing.address}</p>
                  <p className="text-sm">
                    {viewing.profile?.first_name} {viewing.profile?.last_name || '[DEMO] Client'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(viewing.viewing_date), "PPP")} at{" "}
                    {viewing.viewing_time}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSummary;