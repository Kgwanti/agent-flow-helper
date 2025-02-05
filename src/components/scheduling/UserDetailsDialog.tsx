import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UserDetailsForm, { UserDetailsFormData } from "./UserDetailsForm";

interface UserDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UserDetailsFormData) => void;
}

const UserDetailsDialog = ({
  open,
  onOpenChange,
  onSubmit,
}: UserDetailsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Your Details</DialogTitle>
          <DialogDescription>
            Please provide your contact information for the viewing appointment.
          </DialogDescription>
        </DialogHeader>
        <UserDetailsForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsDialog;