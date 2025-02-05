import { ChevronLeft, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface ViewingHeaderProps {
  onRefresh: () => void;
  onBack: () => void;
  refreshing: boolean;
}

export const ViewingHeader = ({ 
  onRefresh, 
  onBack, 
  refreshing 
}: ViewingHeaderProps) => {
  return (
    <>
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Viewing Appointments</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          className="gap-2"
          onClick={onBack}
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Viewing Appointments</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          disabled={refreshing}
          className={refreshing ? "animate-spin" : ""}
        >
          <RefreshCw className="h-4 w-4" />
          <span className="sr-only">Refresh appointments</span>
        </Button>
      </div>
    </>
  );
};