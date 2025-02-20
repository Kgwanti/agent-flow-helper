
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface CreateDealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateDealDialog = ({ open, onOpenChange }: CreateDealDialogProps) => {
  const [title, setTitle] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [amount, setAmount] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('deals')
        .insert({
          title,
          property_address: propertyAddress,
          amount: Number(amount),
          status: 'INITIAL_CONTACT'
        });

      if (error) throw error;

      toast({
        title: "Deal created",
        description: "New deal has been successfully created."
      });

      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['dealStats'] });
      onOpenChange(false);
      setTitle("");
      setPropertyAddress("");
      setAmount("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create deal. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Deal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Deal Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter deal title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="propertyAddress">Property Address</Label>
            <Input
              id="propertyAddress"
              value={propertyAddress}
              onChange={(e) => setPropertyAddress(e.target.value)}
              placeholder="Enter property address"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter deal amount"
              required
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Deal</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDealDialog;
