
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DealCard from "./DealCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

const statusLabels: Record<typeof DEAL_STATUSES[number], string> = {
  INITIAL_CONTACT: 'Initial Contact',
  VIEWING_SCHEDULED: 'Viewing Scheduled',
  OFFER_MADE: 'Offer Made',
  NEGOTIATION: 'Negotiation',
  AGREEMENT_PENDING: 'Agreement Pending',
  CONTRACT_SIGNED: 'Contract Signed',
  CLOSED_WON: 'Closed Won',
  CLOSED_LOST: 'Closed Lost'
};

const DealBoard = () => {
  const { data: deals = [] } = useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
        .select(`
          *,
          client:client_id(
            first_name,
            last_name,
            email
          )
        `)
        .order('last_activity_date', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {DEAL_STATUSES.slice(0, -2).map((status) => (
        <Card key={status} className="h-fit">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              {statusLabels[status]}
            </CardTitle>
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
    </div>
  );
};

export default DealBoard;
