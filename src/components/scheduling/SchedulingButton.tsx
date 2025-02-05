import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog";

const SchedulingButton = () => {
  return (
    <DialogTrigger asChild>
      <Button size="lg" className="animate-fadeIn">
        <CalendarIcon className="mr-2 h-5 w-5" />
        Schedule a Viewing
      </Button>
    </DialogTrigger>
  );
};

export default SchedulingButton;