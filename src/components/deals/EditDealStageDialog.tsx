
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface EditDealStageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: string;
  initialTitle?: string;
  initialNotes?: string;
  initialAmount?: number;
  onSave: (data: { title: string; notes: string; amount: number }) => void;
}

const EditDealStageDialog = ({ 
  open, 
  onOpenChange, 
  status, 
  initialTitle = "",
  initialNotes = "",
  initialAmount = 0,
  onSave 
}: EditDealStageDialogProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [notes, setNotes] = useState(initialNotes);
  const [amount, setAmount] = useState(initialAmount.toString());
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      onSave({
        title,
        notes,
        amount: Number(amount)
      });

      toast({
        title: "Stage updated",
        description: "Deal stage has been successfully updated."
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update deal stage. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {status} Stage</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Stage Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter stage title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Stage Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter stage notes"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Stage Expense (R)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter stage expense"
              required
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDealStageDialog;
