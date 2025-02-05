import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AuthRequiredToast = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col gap-4">
      <p>Please sign in to schedule a viewing.</p>
      <Button 
        variant="outline" 
        onClick={() => navigate("/auth")}
        className="mt-2"
      >
        Sign In
      </Button>
    </div>
  );
};

export default AuthRequiredToast;