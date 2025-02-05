import { Dialog } from "@/components/ui/dialog";
import SchedulingDialog from "./scheduling/SchedulingDialog";
import UserDetailsDialog from "./scheduling/UserDetailsDialog";
import SchedulingButton from "./scheduling/SchedulingButton";
import { useScheduling } from "./scheduling/useScheduling";

const SchedulingSection = () => {
  const {
    date,
    setDate,
    selectedTime,
    handleTimeSelection,
    showDetailsDialog,
    setShowDetailsDialog,
    handleConfirmViewing,
    onSubmit,
  } = useScheduling();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Dialog>
            <SchedulingButton />
            <SchedulingDialog
              date={date}
              setDate={setDate}
              selectedTime={selectedTime}
              onTimeSelect={handleTimeSelection}
              onConfirm={handleConfirmViewing}
              open={true}
            />
          </Dialog>

          <UserDetailsDialog
            open={showDetailsDialog}
            onOpenChange={setShowDetailsDialog}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </section>
  );
};

export default SchedulingSection;