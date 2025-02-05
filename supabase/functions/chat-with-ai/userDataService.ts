import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

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

  // Send welcome email for new users
  if (profileResult.data) {
    try {
      const supabaseClient = createClient(supabaseUrl, supabaseAnonKey!);
      await supabaseClient.functions.invoke('send-welcome-email', {
        body: {
          email: profileResult.data.email,
          firstName: profileResult.data.first_name,
          lastName: profileResult.data.last_name,
        },
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
      // Don't throw the error as we don't want to break the user creation process
    }
  }

  return {
    profile: profileResult.data,
    viewings: viewingsResult.data || [],
    preferences: preferencesResult.data,
    recentCommunications: communicationLogsResult.data || [],
    documents: documentsResult.data || []
  };
};