
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, BarChart } from "lucide-react";

const DealStats = () => {
  const { data: stats } = useQuery({
    queryKey: ['dealStats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deal_status_stats')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const totalDeals = stats?.reduce((acc, stat) => acc + Number(stat.count), 0) || 0;
  const totalAmount = stats?.reduce((acc, stat) => acc + Number(stat.total_amount), 0) || 0;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Active Deals</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDeals}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Deal Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            R {totalAmount.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DealStats;
