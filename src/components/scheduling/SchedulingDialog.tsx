import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TimeSlotSelector from "./TimeSlotSelector";

interface SchedulingDialogProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  onConfirm: () => void;
  open: boolean;
}

const SchedulingDialog = ({
  date,
  setDate,
  selectedTime,
  onTimeSelect,
  onConfirm,
  open,
}: SchedulingDialogProps) => {
  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Schedule a Viewing</DialogTitle>
        <DialogDescription>
          Choose your preferred date and time for the property viewing.
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid md:grid-cols-2 gap-8 items-start mt-4">
        <div className="bg-muted p-4 rounded-lg shadow-sm">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </div>
        
        <div className="space-y-6">
          <TimeSlotSelector
            selectedTime={selectedTime}
            onTimeSelect={onTimeSelect}
          />
          
          <Button 
            className="w-full" 
            size="lg"
            onClick={onConfirm}
          >
            Confirm Viewing
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default SchedulingDialog;