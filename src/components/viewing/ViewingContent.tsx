import { ViewingAppointment } from "@/types/viewing";
import { ViewingAppointmentsTable } from "./ViewingAppointmentsTable";

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

  if (appointments.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        No viewing appointments found
      </div>
    );
  }

  return (
    <ViewingAppointmentsTable
      appointments={appointments}
      onDelete={onDelete}
    />
  );
};