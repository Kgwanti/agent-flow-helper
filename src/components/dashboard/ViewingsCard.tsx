import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ViewingAppointment } from "@/types/viewing";

interface ViewingsCardProps {
  viewings: ViewingAppointment[];
  loading: boolean;
}

const ViewingsCard = ({ viewings, loading }: ViewingsCardProps) => {
  const [showWarning, setShowWarning] = useState(true);

  return (
    <Card className="bg-white/100 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Upcoming Viewings</CardTitle>
        {showWarning && (
          <Alert variant="warning" className="mt-2 relative">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Showing demo data. Schedule real viewings to replace these examples.
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
  );
};

export default ViewingsCard;