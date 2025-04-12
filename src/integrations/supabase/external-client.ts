
import { createClient } from '@supabase/supabase-js';

// External Supabase client for accessing keys
const externalSupabase = createClient(
  'https://eusxbcbwyhjtfjplwtst.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1c3hiY2J3eWhqdGZqcGx3dHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNTEzOTksImV4cCI6MjA1OTkyNzM5OX0.d6DTqwlZ4X69orabNA0tzxrucsnVv531dqzUcsxum6E'
);

// Get available keys (Pending status only)
export const getExternalPendingKeys = async () => {
  const { data, error } = await externalSupabase
    .from('keys')
    .select('*')
    .eq('status', 'Pending')
    .is('hwid', null);
  
  if (error) {
    console.error('Error fetching external keys:', error);
    throw error;
  }
  
  return { data, error };
};

// Function to synchronize keys between projects
export const syncExternalKeysToLocal = async () => {
  try {
    // Get pending keys from external project
    const { data: externalKeys } = await getExternalPendingKeys();
    
    if (!externalKeys || externalKeys.length === 0) {
      return { 
        success: true, 
        message: 'No new keys found to sync', 
        count: 0 
      };
    }
    
    // Format keys for local database
    const keysToSync = externalKeys.map(key => ({
      key: key.key,
      exploit: key.exploit,
      hwid: key.hwid,
      status: key.status,
      days: key.days,
      allowed_place_ids: key.allowed_place_ids,
      maps: key.maps,
      allowexec: key.allowexec,
      created_at: key.created_at || new Date().toISOString()
    }));
    
    // Import keys to local project using the main supabase client
    // We'll need to do this in the edge function to avoid exposing both API keys
    return { 
      success: true, 
      keys: keysToSync,
      count: keysToSync.length 
    };
  } catch (error) {
    console.error('Error syncing keys:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to sync keys',
      count: 0 
    };
  }
};
