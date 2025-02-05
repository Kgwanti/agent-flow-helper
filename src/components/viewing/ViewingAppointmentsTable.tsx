import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ViewingAppointment } from "@/types/viewing";
import { ViewingAppointmentRow } from "./ViewingAppointmentRow";

interface ViewingAppointmentsTableProps {
  appointments: ViewingAppointment[];
  onDelete: (id: string) => void;
}

export const ViewingAppointmentsTable = ({
  appointments,
  onDelete,
}: ViewingAppointmentsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Client Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <ViewingAppointmentRow
              key={appointment.id}
              appointment={appointment}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};