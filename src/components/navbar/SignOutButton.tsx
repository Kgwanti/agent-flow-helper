import { Button } from "@/components/ui/button";

interface SignOutButtonProps {
  onSignOut: () => void;
}

const SignOutButton = ({ onSignOut }: SignOutButtonProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
      <div className="max-w-[1600px] mx-auto">
        <Button 
          onClick={onSignOut} 
          variant="outline" 
          size="default" 
          className="w-full text-sm bg-white hover:bg-accent"
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default SignOutButton;