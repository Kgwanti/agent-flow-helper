import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";

interface TimeSlotSelectorProps {
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
}

const TimeSlotSelector = ({ selectedTime, onTimeSelect }: TimeSlotSelectorProps) => {
  return (
    <div className="bg-muted p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Available Time Slots</h3>
      <div className="grid grid-cols-2 gap-3">
        {["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"].map((time) => (
          <Button
            key={time}
            variant={selectedTime === time ? "default" : "outline"}
            className="justify-start"
            onClick={() => onTimeSelect(time)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {time}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TimeSlotSelector;