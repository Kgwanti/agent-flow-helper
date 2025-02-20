
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Calendar, MessageSquare, Bot, FileText, DollarSign } from "lucide-react";

interface NavLinksProps {
  isAuthenticated: boolean;
}

const NavLinks = ({ isAuthenticated }: NavLinksProps) => {
  if (isAuthenticated) {
    return (
      <>
        <Button variant="ghost" size="default" className="gap-2 min-w-[110px] text-sm" asChild>
          <Link to="/viewings">
            <Calendar className="h-4 w-4" />
            <span>Viewings</span>
          </Link>
        </Button>
        <Button variant="ghost" size="default" className="gap-2 min-w-[140px] text-sm" asChild>
          <Link to="/communications">
            <MessageSquare className="h-4 w-4" />
            <span>Communications</span>
          </Link>
        </Button>
        <Button variant="ghost" size="default" className="gap-2 min-w-[100px] text-sm" asChild>
          <Link to="/clients">
            <Users className="h-4 w-4" />
            <span>Clients</span>
          </Link>
        </Button>
        <Button variant="ghost" size="default" className="gap-2 min-w-[100px] text-sm" asChild>
          <Link to="/deals">
            <DollarSign className="h-4 w-4" />
            <span>Deals</span>
          </Link>
        </Button>
        <Button variant="ghost" size="default" className="gap-2 min-w-[120px] text-sm" asChild>
          <Link to="/documents">
            <FileText className="h-4 w-4" />
            <span>Documents</span>
          </Link>
        </Button>
        <Button variant="ghost" size="default" className="gap-2 min-w-[120px] text-sm" asChild>
          <Link to="/assistant">
            <Bot className="h-4 w-4" />
            <span>Assistant</span>
          </Link>
        </Button>
      </>
    );
  }

  return (
    <>
      <Button variant="ghost" size="default" className="gap-2 min-w-[120px] text-sm" asChild>
        <Link to="/assistant">
          <Bot className="h-4 w-4" />
          <span>Assistant</span>
        </Link>
      </Button>
      <Link to="/auth">
        <Button size="default" className="min-w-[100px] text-sm">Sign In</Button>
      </Link>
    </>
  );
};

export default NavLinks;
