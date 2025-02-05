import { ViewingAppointment } from "@/types/viewing";
import { ViewingAppointmentsTable } from "./ViewingAppointmentsTable";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ViewingContentProps {
  loading: boolean;
  appointments: ViewingAppointment[];
  onDelete: (id: string) => void;
}

export const ViewingContent = ({ 
  loading, 
  appointments, 
  onDelete 
}: ViewingContentProps) => {
  if (loading) {
    return <div className="text-center">Loading appointments...</div>;
  }

  return (
    <div className="space-y-6">
      <Alert variant="warning">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          This page currently displays demo data. Please replace with actual client information in production.
        </AlertDescription>
      </Alert>

      {appointments.length === 0 ? (
        <div className="text-center text-muted-foreground">
          No viewing appointments found
        </div>
      ) : (
        <ViewingAppointmentsTable
          appointments={appointments}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};