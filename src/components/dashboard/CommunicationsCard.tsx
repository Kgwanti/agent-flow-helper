
import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, X, MessageSquare } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CommunicationsCardProps {
  communications: any[];
  loading: boolean;
}

const CommunicationsCard = ({ communications, loading }: CommunicationsCardProps) => {
  const [showWarning, setShowWarning] = useState(true);

  return (
    <Card className="bg-white/100 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Recent Communications</CardTitle>
        </div>
        {showWarning && (
          <Alert variant="warning" className="mt-2 relative">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Showing demo data. Add real communications to replace these examples.
            </AlertDescription>
            <button
              onClick={() => setShowWarning(false)}
              className="absolute top-2 right-2 text-yellow-700 hover:text-yellow-900"
            >
              <X className="h-4 w-4" />
            </button>
          </Alert>
        )}
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
  );
};

export default CommunicationsCard;
