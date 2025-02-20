
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDistance } from "date-fns";

interface DealCardProps {
  deal: {
    id: string;
    title: string;
    property_address: string | null;
    amount: number;
    last_activity_date: string | null;
    client: {
      first_name: string | null;
      last_name: string | null;
      email: string | null;
    } | null;
  };
  lightBgColor: string;
}

const DealCard = ({ deal, lightBgColor }: DealCardProps) => {
  const isRecentActivity = deal.last_activity_date && 
    new Date(deal.last_activity_date) > new Date(Date.now() - 24 * 60 * 60 * 1000);

  return (
    <Card className={`${lightBgColor} transition-colors duration-200 border-none shadow-sm`}>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div className="font-semibold truncate">{deal.title}</div>
          {isRecentActivity && (
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          )}
        </div>
        <div className="text-sm text-muted-foreground truncate">
          {deal.property_address || 'No address provided'}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-sm font-medium">
          R {deal.amount.toLocaleString()}
        </div>
        {deal.client && (
          <div className="text-sm text-muted-foreground truncate">
            {deal.client.first_name} {deal.client.last_name}
          </div>
        )}
        <div className="text-xs text-muted-foreground mt-2">
          Last activity: {deal.last_activity_date 
            ? formatDistance(new Date(deal.last_activity_date), new Date(), { addSuffix: true })
            : 'Never'}
        </div>
      </CardContent>
    </Card>
  );
};

export default DealCard;
