
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Clock, Settings } from "lucide-react";
import { Stage, Deal } from "./types";
import DealCard from "./DealCard";

interface StageCardProps {
  stage: Stage;
  deals: Deal[];
  onEditStage: (stageId: string) => void;
}

const StageCard = ({ stage, deals, onEditStage }: StageCardProps) => {
  return (
    <Card className={`h-fit ${stage.bgColor} border-none shadow-md transition-colors duration-200`}>
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
          onClick={() => onEditStage(stage.id)}
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
  );
};

export default StageCard;
