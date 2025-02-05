import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ViewingAppointment } from "@/types/viewing";
import CommunicationsCard from "./CommunicationsCard";
import ViewingsCard from "./ViewingsCard";

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
      <CommunicationsCard communications={communications} loading={loading} />
      <ViewingsCard viewings={viewings} loading={loading} />
    </div>
  );
};

export default DashboardSummary;