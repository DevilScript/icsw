
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

// Define CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handle CORS preflight requests
const handleCors = (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
}

// Serve the HTTP request
Deno.serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    // Get environment variables
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const EXTERNAL_SUPABASE_URL = 'https://eusxbcbwyhjtfjplwtst.supabase.co'
    const EXTERNAL_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1c3hiY2J3eWhqdGZqcGx3dHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNTEzOTksImV4cCI6MjA1OTkyNzM5OX0.d6DTqwlZ4X69orabNA0tzxrucsnVv531dqzUcsxum6E'

    // Create Supabase clients
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const externalSupabase = createClient(EXTERNAL_SUPABASE_URL, EXTERNAL_SUPABASE_ANON_KEY)

    // Fetch pending keys from external project
    const { data: externalKeys, error: fetchError } = await externalSupabase
      .from('keys')
      .select('*')
      .eq('status', 'Pending')
      .is('hwid', null)

    if (fetchError) {
      throw new Error(`Failed to fetch external keys: ${fetchError.message}`)
    }

    if (!externalKeys || externalKeys.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No new keys found to sync', 
          count: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
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
    }))

    // Check which keys already exist in the local database
    const existingKeys = await Promise.all(
      keysToSync.map(key => 
        supabase.from('keys').select('key').eq('key', key.key).maybeSingle()
      )
    )

    // Filter out keys that already exist
    const newKeys = keysToSync.filter((_, index) => !existingKeys[index].data)

    if (newKeys.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'All keys already exist in the local database', 
          count: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Insert new keys into local database
    const { error: insertError } = await supabase.from('keys').insert(newKeys)

    if (insertError) {
      throw new Error(`Failed to insert keys: ${insertError.message}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully synced ${newKeys.length} keys`, 
        count: newKeys.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in sync-keys function:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message || 'Failed to sync keys',
        error: error.toString() 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
