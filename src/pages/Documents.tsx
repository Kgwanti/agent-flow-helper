
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DocumentUploadButton } from "@/components/documents/DocumentUploadButton";
import { DocumentsTable } from "@/components/documents/DocumentsTable";

const Documents = () => {
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: documents, refetch } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleAnalyze = async (documentId: string, action: 'analyze' | 'summarize') => {
    try {
      setAnalyzing(documentId);
      const { data: user } = await supabase.auth.getUser();
      
      const response = await supabase.functions.invoke('chat-with-ai', {
        body: {
          documentId,
          action,
          userId: user.user?.id
        },
      });

      if (response.error) throw response.error;

      toast({
        title: "Success",
        description: `Document ${action === 'analyze' ? 'analysis' : 'summary'} completed`,
      });
    } catch (error) {
      console.error(`Error ${action}ing document:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${action} document. Please try again.`,
      });
    } finally {
      setAnalyzing(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
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
              <BreadcrumbPage>Documents</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Documents</h1>
          <DocumentUploadButton onUploadSuccess={refetch} />
        </div>

        <DocumentsTable
          documents={documents}
          analyzing={analyzing}
          onAnalyze={handleAnalyze}
          onDelete={refetch}
        />
      </div>
    </div>
  );
};

export default Documents;
