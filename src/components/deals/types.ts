
export interface Stage {
  id: string;
  status: string;
  title: string;
  notes: string;
  expense: number;
  bgColor: string;
  lightBgColor: string;
  order: number;
}

export interface Deal {
  id: string;
  title: string;
  property_address: string | null;
  amount: number;
  status: string;
  last_activity_date: string | null;
  client: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
  } | null;
}

export interface StageClient {
  id: string;
  clientname: string;  // Changed from clientName
  expense: number;
  notes: string;
  duedate: string;    // Changed from dueDate
  completionstatus: string;  // Changed from completionStatus
  stage_id: string;
  created_at: string;
  updated_at: string;
}
