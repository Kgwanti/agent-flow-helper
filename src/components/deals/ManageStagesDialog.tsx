
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, MoveUp, MoveDown } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export interface Stage {
  id: string;
  status: string;
  title: string;
  notes: string;
  expense: number;
  bgColor: string;
  lightBgColor: string;
  order: number;
}

interface ManageStagesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stages: Stage[];
  onSaveStages: (stages: Stage[]) => void;
}

const defaultColors = [
  { bg: 'bg-[#F2FCE2]', hover: 'hover:bg-[#E2ECE2]' },
  { bg: 'bg-[#FEF7CD]', hover: 'hover:bg-[#EEE7BD]' },
  { bg: 'bg-[#FEC6A1]', hover: 'hover:bg-[#EEB691]' },
  { bg: 'bg-[#E5DEFF]', hover: 'hover:bg-[#D5CEEF]' },
  { bg: 'bg-[#FFDEE2]', hover: 'hover:bg-[#EFCED2]' },
  { bg: 'bg-[#D3E4FD]', hover: 'hover:bg-[#C3D4ED]' },
];

const ManageStagesDialog = ({ 
  open, 
  onOpenChange, 
  stages,
  onSaveStages 
}: ManageStagesDialogProps) => {
  const [localStages, setLocalStages] = useState<Stage[]>(stages);
  const { toast } = useToast();

  const handleAddStage = () => {
    const newStage: Stage = {
      id: crypto.randomUUID(),
      status: `CUSTOM_STAGE_${localStages.length + 1}`,
      title: `New Stage ${localStages.length + 1}`,
      notes: '',
      expense: 0,
      bgColor: defaultColors[localStages.length % defaultColors.length].bg,
      lightBgColor: defaultColors[localStages.length % defaultColors.length].hover,
      order: localStages.length
    };
    setLocalStages([...localStages, newStage]);
  };

  const handleRemoveStage = (id: string) => {
    if (localStages.length <= 3) {
      toast({
        title: "Cannot remove stage",
        description: "You must have at least 3 stages in your pipeline.",
        variant: "destructive"
      });
      return;
    }
    setLocalStages(localStages.filter(stage => stage.id !== id));
  };

  const handleMoveStage = (id: string, direction: 'up' | 'down') => {
    const index = localStages.findIndex(stage => stage.id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === localStages.length - 1)
    ) return;

    const newStages = [...localStages];
    const temp = newStages[index];
    if (direction === 'up') {
      newStages[index] = newStages[index - 1];
      newStages[index - 1] = temp;
    } else {
      newStages[index] = newStages[index + 1];
      newStages[index + 1] = temp;
    }
    
    // Update order numbers
    newStages.forEach((stage, idx) => {
      stage.order = idx;
    });
    
    setLocalStages(newStages);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveStages(localStages);
    toast({
      title: "Stages updated",
      description: "Your deal pipeline has been successfully updated."
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Deal Stages</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {localStages.map((stage, index) => (
              <div key={stage.id} className={`p-4 rounded-lg ${stage.bgColor} space-y-2`}>
                <div className="flex items-center justify-between gap-2">
                  <Input
                    value={stage.title}
                    onChange={(e) => {
                      const newStages = [...localStages];
                      newStages[index].title = e.target.value;
                      setLocalStages(newStages);
                    }}
                    placeholder="Stage title"
                    required
                    className="flex-1"
                  />
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleMoveStage(stage.id, 'up')}
                      disabled={index === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleMoveStage(stage.id, 'down')}
                      disabled={index === localStages.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveStage(stage.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={stage.notes}
                  onChange={(e) => {
                    const newStages = [...localStages];
                    newStages[index].notes = e.target.value;
                    setLocalStages(newStages);
                  }}
                  placeholder="Stage description"
                  rows={2}
                />
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleAddStage}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Stage
            </Button>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
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

export default ManageStagesDialog;
