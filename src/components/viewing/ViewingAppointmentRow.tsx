import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { ViewingAppointment } from "@/types/viewing";
import { formatClientName, formatContactInfo } from "@/utils/viewing";

interface ViewingAppointmentRowProps {
  appointment: ViewingAppointment;
  onDelete: (id: string) => void;
}

export const ViewingAppointmentRow = ({ 
  appointment, 
  onDelete 
}: ViewingAppointmentRowProps) => {
  const clientName = formatClientName(appointment.profile);
  const contactInfo = formatContactInfo(appointment.profile);
  
  return (
    <TableRow>
      <TableCell>
        {format(new Date(appointment.viewing_date), "PPP")}
      </TableCell>
      <TableCell>{appointment.viewing_time}</TableCell>
      <TableCell>{appointment.address || "N/A"}</TableCell>
      <TableCell className="font-medium">
        {clientName}
      </TableCell>
      <TableCell>
        {contactInfo}
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(appointment.id)}
          className="hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete appointment</span>
        </Button>
      </TableCell>
    </TableRow>
  );
};