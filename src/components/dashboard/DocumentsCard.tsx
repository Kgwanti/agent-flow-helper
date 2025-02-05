import { useNavigate } from "react-router-dom";
import { FileText, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DocumentsCard = () => {
  const navigate = useNavigate();

  const { data: documents } = useQuery({
    queryKey: ["recent-documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer bg-white/100 backdrop-blur-sm"
      onClick={() => navigate("/documents")}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Recent Documents
        </CardTitle>
        <Alert variant="warning" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Showing demo documents. Upload real documents to replace these examples.
          </AlertDescription>
        </Alert>
      </CardHeader>
      <CardContent>
        {documents?.length ? (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="border-b pb-2">
                <p className="font-medium">{doc.filename}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(doc.created_at), "PPp")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No documents uploaded yet</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentsCard;