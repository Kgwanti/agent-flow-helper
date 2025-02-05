import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

interface CacheData {
  data: any;
  lastFetched: number;
}

const cache = new Map<string, CacheData>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function getCachedData(key: string, fetchFn: () => Promise<any>) {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase credentials not configured');
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // Check if we need to invalidate the cache
    const { data: cacheControl } = await supabase
      .from('cache_control')
      .select('invalidation_time')
      .eq('cache_key', key)
      .single();

    const cachedValue = cache.get(key);
    const now = Date.now();

    // If we have a cached value and it's still valid
    if (cachedValue && 
        now - cachedValue.lastFetched < CACHE_TTL && 
        (!cacheControl || new Date(cacheControl.invalidation_time).getTime() < cachedValue.lastFetched)) {
      console.log(`Cache hit for key: ${key}`);
      return cachedValue.data;
    }

    // If we reach here, we need to fetch fresh data
    console.log(`Cache miss for key: ${key}, fetching fresh data`);
    const freshData = await fetchFn();
    
    // Update the cache
    cache.set(key, {
      data: freshData,
      lastFetched: now
    });

    return freshData;
  } catch (error) {
    console.error(`Error in getCachedData for key ${key}:`, error);
    // If there's an error with caching, fall back to fetching fresh data
    return await fetchFn();
  }
}