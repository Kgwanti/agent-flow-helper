
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DealCard from "./DealCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Clock, Settings } from "lucide-react";
import { useState } from "react";
import EditDealStageDialog from "./EditDealStageDialog";

const DEAL_STATUSES = [
  'INITIAL_CONTACT',
  'VIEWING_SCHEDULED',
  'OFFER_MADE',
  'NEGOTIATION',
  'AGREEMENT_PENDING',
  'CONTRACT_SIGNED',
  'CLOSED_WON',
  'CLOSED_LOST'
] as const;

interface DealStage {
  status: typeof DEAL_STATUSES[number];
  title: string;
  notes: string;
  expense: number;
  bgColor: string;
  lightBgColor: string;
}

const defaultStages: Record<typeof DEAL_STATUSES[number], DealStage> = {
  INITIAL_CONTACT: {
    status: 'INITIAL_CONTACT',
    title: 'Initial Contact',
    notes: 'First contact with potential client',
    expense: 0,
    bgColor: 'bg-[#F2FCE2]',
    lightBgColor: 'hover:bg-[#E2ECE2]'
  },
  VIEWING_SCHEDULED: {
    status: 'VIEWING_SCHEDULED',
    title: 'Viewing Scheduled',
    notes: 'Property viewing arranged',
    expense: 0,
    bgColor: 'bg-[#FEF7CD]',
    lightBgColor: 'hover:bg-[#EEE7BD]'
  },
  OFFER_MADE: {
    status: 'OFFER_MADE',
    title: 'Offer Made',
    notes: 'Client has made an offer',
    expense: 0,
    bgColor: 'bg-[#FEC6A1]',
    lightBgColor: 'hover:bg-[#EEB691]'
  },
  NEGOTIATION: {
    status: 'NEGOTIATION',
    title: 'Negotiation',
    notes: 'Negotiating terms with client',
    expense: 0,
    bgColor: 'bg-[#E5DEFF]',
    lightBgColor: 'hover:bg-[#D5CEEF]'
  },
  AGREEMENT_PENDING: {
    status: 'AGREEMENT_PENDING',
    title: 'Agreement Pending',
    notes: 'Waiting for agreement finalization',
    expense: 0,
    bgColor: 'bg-[#FFDEE2]',
    lightBgColor: 'hover:bg-[#EFCED2]'
  },
  CONTRACT_SIGNED: {
    status: 'CONTRACT_SIGNED',
    title: 'Contract Signed',
    notes: 'Deal contract has been signed',
    expense: 0,
    bgColor: 'bg-[#D3E4FD]',
    lightBgColor: 'hover:bg-[#C3D4ED]'
  },
  CLOSED_WON: {
    status: 'CLOSED_WON',
    title: 'Closed Won',
    notes: 'Deal successfully closed',
    expense: 0,
    bgColor: 'bg-[#0EA5E9]',
    lightBgColor: 'hover:bg-[#0E95D9]'
  },
  CLOSED_LOST: {
    status: 'CLOSED_LOST',
    title: 'Closed Lost',
    notes: 'Deal was not successful',
    expense: 0,
    bgColor: 'bg-[#ea384c]',
    lightBgColor: 'hover:bg-[#da283c]'
  }
};

interface Deal {
  id: string;
  title: string;
  property_address: string | null;
  amount: number;
  status: typeof DEAL_STATUSES[number];
  last_activity_date: string | null;
  client: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
  } | null;
}

const DealBoard = () => {
  const [stages, setStages] = useState<Record<typeof DEAL_STATUSES[number], DealStage>>(defaultStages);
  const [editingStage, setEditingStage] = useState<typeof DEAL_STATUSES[number] | null>(null);

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
      setStages(prev => ({
        ...prev,
        [editingStage]: {
          ...prev[editingStage],
          title: data.title,
          notes: data.notes,
          expense: data.amount
        }
      }));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {DEAL_STATUSES.slice(0, -2).map((status) => (
        <Card key={status} className={`h-fit ${stages[status].bgColor} border-none shadow-md transition-colors duration-200`}>
          <CardHeader className="flex flex-row items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {stages[status].title}
                {status === 'VIEWING_SCHEDULED' && (
                  <Clock className="h-4 w-4 text-orange-500" />
                )}
                {status === 'AGREEMENT_PENDING' && (
                  <Bell className="h-4 w-4 text-red-500 animate-bounce" />
                )}
              </CardTitle>
              <div className="text-xs text-muted-foreground">
                {stages[status].notes}
              </div>
              <div className="text-xs font-medium">
                Stage Expense: R {(stages[status]?.expense || 0).toLocaleString()}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditingStage(status)}
              className="h-8 w-8"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {deals
              .filter(deal => deal.status === status)
              .map(deal => (
                <DealCard 
                  key={deal.id} 
                  deal={deal} 
                  lightBgColor={stages[status].lightBgColor}
                />
              ))}
          </CardContent>
        </Card>
      ))}

      <EditDealStageDialog
        open={editingStage !== null}
        onOpenChange={(open) => !open && setEditingStage(null)}
        status={editingStage || ''}
        initialTitle={editingStage ? stages[editingStage]?.title : ''}
        initialNotes={editingStage ? stages[editingStage]?.notes : ''}
        initialAmount={editingStage ? stages[editingStage]?.expense : 0}
        onSave={handleSaveStage}
      />
    </div>
  );
};

export default DealBoard;
