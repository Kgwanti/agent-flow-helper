
import { Calendar, MessageSquare, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardCards = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card 
        className="hover:shadow-lg transition-shadow cursor-pointer bg-white/100 backdrop-blur-sm animate-border bg-gradient-to-r from-primary via-accent to-primary bg-[length:400%_400%] p-[2px]" 
        onClick={() => navigate("/clients")}
      >
        <div className="bg-white rounded-lg h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Manage your client database and preferences
            </p>
          </CardContent>
        </div>
      </Card>

      <Card 
        className="hover:shadow-lg transition-shadow cursor-pointer bg-white/100 backdrop-blur-sm animate-border bg-gradient-to-r from-primary via-accent to-primary bg-[length:400%_400%] p-[2px]" 
        onClick={() => navigate("/viewings")}
      >
        <div className="bg-white rounded-lg h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Viewings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Schedule and manage property viewings
            </p>
          </CardContent>
        </div>
      </Card>

      <Card 
        className="hover:shadow-lg transition-shadow cursor-pointer bg-white/100 backdrop-blur-sm animate-border bg-gradient-to-r from-primary via-accent to-primary bg-[length:400%_400%] p-[2px]"
        onClick={() => navigate("/communications")}
      >
        <div className="bg-white rounded-lg h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Communications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              View chat history and client interactions
            </p>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default DashboardCards;
