
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DealCard from "./DealCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
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
  amount: number;
}

const defaultStages: Record<typeof DEAL_STATUSES[number], DealStage> = {
  INITIAL_CONTACT: {
    status: 'INITIAL_CONTACT',
    title: 'Initial Contact',
    notes: 'First contact with potential client',
    amount: 0
  },
  VIEWING_SCHEDULED: {
    status: 'VIEWING_SCHEDULED',
    title: 'Viewing Scheduled',
    notes: 'Property viewing arranged',
    amount: 0
  },
  OFFER_MADE: {
    status: 'OFFER_MADE',
    title: 'Offer Made',
    notes: 'Client has made an offer',
    amount: 0
  },
  NEGOTIATION: {
    status: 'NEGOTIATION',
    title: 'Negotiation',
    notes: 'Negotiating terms with client',
    amount: 0
  },
  AGREEMENT_PENDING: {
    status: 'AGREEMENT_PENDING',
    title: 'Agreement Pending',
    notes: 'Waiting for agreement finalization',
    amount: 0
  },
  CONTRACT_SIGNED: {
    status: 'CONTRACT_SIGNED',
    title: 'Contract Signed',
    notes: 'Deal contract has been signed',
    amount: 0
  },
  CLOSED_WON: {
    status: 'CLOSED_WON',
    title: 'Closed Won',
    notes: 'Deal successfully closed',
    amount: 0
  },
  CLOSED_LOST: {
    status: 'CLOSED_LOST',
    title: 'Closed Lost',
    notes: 'Deal was not successful',
    amount: 0
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
          ...data
        }
      }));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {DEAL_STATUSES.slice(0, -2).map((status) => (
        <Card key={status} className="h-fit">
          <CardHeader className="flex flex-row items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">
                {stages[status].title}
              </CardTitle>
              <div className="text-xs text-muted-foreground">
                {stages[status].notes}
              </div>
              <div className="text-xs font-medium">
                Stage Value: R {stages[status].amount.toLocaleString()}
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
                <DealCard key={deal.id} deal={deal} />
              ))}
          </CardContent>
        </Card>
      ))}

      <EditDealStageDialog
        open={editingStage !== null}
        onOpenChange={(open) => !open && setEditingStage(null)}
        status={editingStage || ''}
        initialTitle={editingStage ? stages[editingStage].title : ''}
        initialNotes={editingStage ? stages[editingStage].notes : ''}
        initialAmount={editingStage ? stages[editingStage].amount : 0}
        onSave={handleSaveStage}
      />
    </div>
  );
};

export default DealBoard;
