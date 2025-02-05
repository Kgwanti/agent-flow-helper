
import { Loader2, FileSearch, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DocumentActionsProps {
  documentId: string;
  filePath: string;
  analyzing: string | null;
  onDelete: () => void;
  onAnalyze: (documentId: string, action: 'analyze' | 'summarize') => Promise<void>;
}

export const DocumentActions = ({
  documentId,
  filePath,
  analyzing,
  onDelete,
  onAnalyze,
}: DocumentActionsProps) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const { error: storageError } = await supabase.storage
        .from("documents")
        .remove([filePath]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from("documents")
        .delete()
        .eq("id", documentId);

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "File deleted successfully",
      });
      onDelete();
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete file. Please try again.",
      });
    }
  };

  return (
    <div className="flex justify-end items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="text-blue-600 hover:text-blue-700"
        onClick={() => onAnalyze(documentId, 'analyze')}
        disabled={analyzing === documentId}
      >
        {analyzing === documentId ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileSearch className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-green-600 hover:text-green-700"
        onClick={() => onAnalyze(documentId, 'summarize')}
        disabled={analyzing === documentId}
      >
        {analyzing === documentId ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileText className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-red-600 hover:text-red-700"
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
