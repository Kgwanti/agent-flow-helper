
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DealCard from "./DealCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Clock, Settings, ListFilter } from "lucide-react";
import { useState } from "react";
import EditDealStageDialog from "./EditDealStageDialog";
import ManageStagesDialog, { Stage } from "./ManageStagesDialog";

const initialStages: Stage[] = [
  {
    id: '1',
    status: 'LEAD_QUALIFICATION',
    title: 'Lead Qualification',
    notes: 'Initial evaluation of client requirements and preferences',
    expense: 0,
    bgColor: 'bg-[#F2FCE2]',
    lightBgColor: 'hover:bg-[#E2ECE2]',
    order: 0
  },
  {
    id: '2',
    status: 'PROPERTY_SHOWINGS',
    title: 'Property Showings',
    notes: 'Scheduling and conducting property viewings',
    expense: 0,
    bgColor: 'bg-[#FEF7CD]',
    lightBgColor: 'hover:bg-[#EEE7BD]',
    order: 1
  },
  {
    id: '3',
    status: 'OFFER_SUBMISSION',
    title: 'Offer Submission',
    notes: 'Preparing and submitting offers',
    expense: 0,
    bgColor: 'bg-[#FEC6A1]',
    lightBgColor: 'hover:bg-[#EEB691]',
    order: 2
  },
  {
    id: '4',
    status: 'NEGOTIATION',
    title: 'Negotiation',
    notes: 'Active price and terms negotiation',
    expense: 0,
    bgColor: 'bg-[#E5DEFF]',
    lightBgColor: 'hover:bg-[#D5CEEF]',
    order: 3
  },
  {
    id: '5',
    status: 'DUE_DILIGENCE',
    title: 'Due Diligence',
    notes: 'Property inspection and document review',
    expense: 0,
    bgColor: 'bg-[#FFDEE2]',
    lightBgColor: 'hover:bg-[#EFCED2]',
    order: 4
  },
  {
    id: '6',
    status: 'CLOSING',
    title: 'Closing',
    notes: 'Final paperwork and closing process',
    expense: 0,
    bgColor: 'bg-[#D3E4FD]',
    lightBgColor: 'hover:bg-[#C3D4ED]',
    order: 5
  }
];

interface Deal {
  id: string;
  title: string;
  property_address: string | null;
  amount: number;
  status: string;
  last_activity_date: string | null;
  client: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
  } | null;
}

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
          <Card key={stage.id} className={`h-fit ${stage.bgColor} border-none shadow-md transition-colors duration-200`}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  {stage.title}
                  {stage.status === 'PROPERTY_SHOWINGS' && (
                    <Clock className="h-4 w-4 text-orange-500" />
                  )}
                  {stage.status === 'NEGOTIATION' && (
                    <Bell className="h-4 w-4 text-red-500 animate-bounce" />
                  )}
                </CardTitle>
                <div className="text-xs text-muted-foreground">
                  {stage.notes}
                </div>
                <div className="text-xs font-medium">
                  Stage Expense: R {(stage.expense || 0).toLocaleString()}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingStage(stage.id)}
                className="h-8 w-8"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {deals
                .filter(deal => deal.status === stage.status)
                .map(deal => (
                  <DealCard 
                    key={deal.id} 
                    deal={deal} 
                    lightBgColor={stage.lightBgColor}
                  />
                ))}
            </CardContent>
          </Card>
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
