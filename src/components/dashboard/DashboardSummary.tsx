import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardSummary = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Communications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No recent communications</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Viewings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No upcoming viewings</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSummary;