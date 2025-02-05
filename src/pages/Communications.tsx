import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

const Communications = () => {
  const [communications, setCommunications] = useState<Tables<"communication_logs">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunications = async () => {
      const { data, error } = await supabase
        .from("communication_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching communications:", error);
        return;
      }

      setCommunications(data || []);
      setLoading(false);
    };

    fetchCommunications();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 animate-gradient-slow"></div>
      <div className="relative">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 mb-8">
            <MessageSquare className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Communications</h1>
          </div>
          <div className="grid gap-6">
            {communications.map((comm) => (
              <Card key={comm.id} className="backdrop-blur-sm bg-white/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    {comm.message_type}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{comm.content}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {new Date(comm.created_at).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
            {communications.length === 0 && (
              <p className="text-muted-foreground text-center py-8">
                No communications found
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Communications;