// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bmgnrtdviohxmcfyikvt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtZ25ydGR2aW9oeG1jZnlpa3Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2NDQyODIsImV4cCI6MjA1NDIyMDI4Mn0.xFjv2MUdRas8m3QG3J7IKmtHZlaxqZ4Zd9nuy_VbYqo";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);