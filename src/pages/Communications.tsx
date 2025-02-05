import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Communications = () => {
  const [communications, setCommunications] = useState<Tables<"communication_logs">[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCommunications = async () => {
      const { data, error } = await supabase
        .from("communication_logs")
        .select("*, profile:profiles(first_name, last_name, email)")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching communications:", error);
        return;
      }

      setCommunications(data || []);
      setLoading(false);
    };

    fetchCommunications();

    // Set up real-time subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'communication_logs'
        },
        async (payload) => {
          console.log('Real-time update received:', payload);
          
          // Fetch the complete record including profile information
          if (payload.eventType === 'INSERT') {
            const { data: newLog } = await supabase
              .from("communication_logs")
              .select("*, profile:profiles(first_name, last_name, email)")
              .eq('id', payload.new.id)
              .single();

            if (newLog) {
              setCommunications(prev => [newLog, ...prev]);
              toast({
                title: "New Communication",
                description: `New ${payload.new.message_type} sent`,
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 animate-gradient-slow"></div>
      <div className="relative">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <BreadcrumbPage>Communications</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

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
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-sm text-muted-foreground">
                      {new Date(comm.created_at).toLocaleString()}
                    </p>
                    {comm.profile && (
                      <p className="text-sm text-muted-foreground">
                        Sent to: {comm.profile.first_name} {comm.profile.last_name} ({comm.profile.email})
                      </p>
                    )}
                  </div>
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