
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Clock, Plus } from "lucide-react";
import { Stage, Deal, StageClient } from "./types";
import DealCard from "./DealCard";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface StageCardProps {
  stage: Stage;
  deals: Deal[];
  onEditStage: (stageId: string) => void;
}

interface AddClientFormData {
  clientname: string;  // Changed to match database column
  expense: number;
  notes: string;
  duedate: string;    // Changed to match database column
  completionstatus: string;  // Changed to match database column
}

const StageCard = ({ stage, deals, onEditStage }: StageCardProps) => {
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: clients = [] } = useQuery({
    queryKey: ['stage-clients', stage.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stage_clients')
        .select('*')
        .eq('stage_id', stage.id);
      
      if (error) throw error;
      return data as StageClient[];
    }
  });
  
  const form = useForm<AddClientFormData>({
    defaultValues: {
      clientname: "",
      expense: 0,
      notes: "",
      duedate: new Date().toISOString().split('T')[0],
      completionstatus: "pending"
    }
  });

  const onSubmit = async (data: AddClientFormData) => {
    try {
      const newClient = {
        stage_id: stage.id,
        ...data
      };

      const { error } = await supabase
        .from('stage_clients')
        .insert([newClient]);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['stage-clients', stage.id] });
      
      toast({
        title: "Client added",
        description: "New client has been successfully added to this stage."
      });
      setIsAddClientOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add client. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
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
            onClick={() => setIsAddClientOpen(true)}
            className="h-8 w-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {clients.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Client Name</TableHead>
                    <TableHead>Expense</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.clientname}</TableCell>
                      <TableCell>R {client.expense.toLocaleString()}</TableCell>
                      <TableCell>{client.completionstatus}</TableCell>
                      <TableCell>{new Date(client.duedate).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
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

      <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Client to {stage.title}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="clientname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter client name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expense"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stage Expense (R)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field} 
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add any relevant notes"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duedate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="completionstatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Completion Status</FormLabel>
                    <FormControl>
                      <Input 
                        type="text" 
                        placeholder="e.g., pending, completed" 
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddClientOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Client</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StageCard;
