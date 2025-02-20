
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DealBoard from "@/components/deals/DealBoard";
import DealStats from "@/components/deals/DealStats";
import CreateDealDialog from "@/components/deals/CreateDealDialog";

const Deals = () => {
  const [isCreateDealOpen, setIsCreateDealOpen] = useState(false);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Deals</h1>
        <Button onClick={() => setIsCreateDealOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Deal
        </Button>
      </div>
      
      <DealStats />
      <DealBoard />
      
      <CreateDealDialog 
        open={isCreateDealOpen}
        onOpenChange={setIsCreateDealOpen}
      />
    </div>
  );
};

export default Deals;
