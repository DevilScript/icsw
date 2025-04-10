
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.36.0'

const WEBHOOK_URL = "https://discordapp.com/api/webhooks/1359559916129616034/sHuXXN7aJJQAvrRg97AiI9lQPCLqjF_7rurjsTdhTexlbZh1u66_AVhJeMBuAaSgTEfF";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { user_id } = await req.json();

    // Validate input
    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Get user's key
    const { data: userKey, error: userKeyError } = await supabase
      .from('user_keys')
      .select('key_value')
      .eq('user_id', user_id)
      .single();

    if (userKeyError || !userKey) {
      return new Response(
        JSON.stringify({ error: 'No key found for this user' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Reset HWID using RPC function
    const { data: resetResult, error: resetError } = await supabase
      .rpc('reset_key_hwid', { key_to_reset: userKey.key_value });

    if (resetError) {
      throw resetError;
    }

    if (!resetResult) {
      return new Response(
        JSON.stringify({ error: 'Failed to reset HWID' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Get user profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('nickname')
      .eq('id', user_id)
      .single();

    // Send webhook
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          embeds: [{
            title: '🔄 HWID Reset',
            description: `User **${profileData?.nickname || user_id}** has reset their HWID`,
            fields: [
              {
                name: 'Key',
                value: userKey.key_value,
                inline: true
              }
            ],
            color: 5814783, // Light pink
            timestamp: new Date().toISOString()
          }]
        })
      });
    } catch (webhookError) {
      console.error('Failed to send webhook:', webhookError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'HWID reset successful'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
