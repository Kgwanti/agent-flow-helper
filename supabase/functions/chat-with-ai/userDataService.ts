import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

export interface UserData {
  profile: any;
  viewings: any[];
  preferences: any;
  recentCommunications: any[];
  documents: any[];
}

export const fetchUserData = async (userId: string): Promise<UserData> => {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase credentials not configured');
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const [
    profileResult,
    viewingsResult,
    preferencesResult,
    communicationLogsResult,
    documentsResult
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle(),
    supabase
      .from('viewing_appointments')
      .select('*, profile:profiles(*)')
      .eq('profile_id', userId)
      .order('viewing_date', { ascending: true }),
    supabase
      .from('client_preferences')
      .select('*')
      .eq('profile_id', userId)
      .maybeSingle(),
    supabase
      .from('communication_logs')
      .select('*')
      .eq('profile_id', userId)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('documents')
      .select('*')
      .eq('profile_id', userId)
      .order('created_at', { ascending: false })
  ]);

  return {
    profile: profileResult.data,
    viewings: viewingsResult.data || [],
    preferences: preferencesResult.data,
    recentCommunications: communicationLogsResult.data || [],
    documents: documentsResult.data || []
  };
};