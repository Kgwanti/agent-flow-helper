
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";
import { useState } from "react";
import EditDealStageDialog from "./EditDealStageDialog";
import ManageStagesDialog from "./ManageStagesDialog";
import StageCard from "./StageCard";
import { initialStages } from "./constants";
import { Stage, Deal } from "./types";

const DealBoard = () => {
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [editingStage, setEditingStage] = useState<string | null>(null);
  const [isManageStagesOpen, setIsManageStagesOpen] = useState(false);

  const { data: deals = [] } = useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
        .select(`
          id,
          title,
          property_address,
          amount,
          status,
          last_activity_date,
          client:profiles!deals_client_id_fkey(
            first_name,
            last_name,
            email
          )
        `)
        .order('last_activity_date', { ascending: false });
      
      if (error) throw error;
      return data as Deal[];
    }
  });

  const handleSaveStage = (data: { title: string; notes: string; amount: number }) => {
    if (editingStage) {
      setStages(prev => prev.map(stage => 
        stage.id === editingStage
          ? { ...stage, title: data.title, notes: data.notes, expense: data.amount }
          : stage
      ));
    }
  };

  const handleSaveStages = (newStages: Stage[]) => {
    setStages(newStages);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsManageStagesOpen(true)} className="gap-2">
          <ListFilter className="h-4 w-4" />
          Manage Stages
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stages
          .sort((a, b) => a.order - b.order)
          .map((stage) => (
            <StageCard
              key={stage.id}
              stage={stage}
              deals={deals}
              onEditStage={setEditingStage}
            />
          ))}
      </div>

      <EditDealStageDialog
        open={editingStage !== null}
        onOpenChange={(open) => !open && setEditingStage(null)}
        status={editingStage ? stages.find(s => s.id === editingStage)?.status || '' : ''}
        initialTitle={editingStage ? stages.find(s => s.id === editingStage)?.title : ''}
        initialNotes={editingStage ? stages.find(s => s.id === editingStage)?.notes : ''}
        initialAmount={editingStage ? stages.find(s => s.id === editingStage)?.expense : 0}
        onSave={handleSaveStage}
      />

      <ManageStagesDialog
        open={isManageStagesOpen}
        onOpenChange={setIsManageStagesOpen}
        stages={stages}
        onSaveStages={handleSaveStages}
      />
    </div>
  );
};

export default DealBoard;
