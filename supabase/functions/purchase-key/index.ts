
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
    // Create Supabase client for local database
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create Supabase client for external database
    const externalSupabaseUrl = 'https://eusxbcbwyhjtfjplwtst.supabase.co';
    const externalSupabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1c3hiY2J3eWhqdGZqcGx3dHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNTEzOTksImV4cCI6MjA1OTkyNzM5OX0.d6DTqwlZ4X69orabNA0tzxrucsnVv531dqzUcsxum6E';
    const externalSupabase = createClient(externalSupabaseUrl, externalSupabaseKey);

    const { user_id, map_name } = await req.json();

    // Validate input
    if (!user_id || !map_name) {
      return new Response(
        JSON.stringify({ error: 'User ID and map name are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Get map definition from database
    const { data: mapData, error: mapError } = await supabase
      .from('map_definitions')
      .select('*')
      .eq('name', map_name)
      .single();

    if (mapError) {
      return new Response(
        JSON.stringify({ error: 'Map not found', message: mapError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Get user balance from database
    const { data: balanceData, error: balanceError } = await supabase
      .from('user_balances')
      .select('balance')
      .eq('id', user_id)
      .single();

    if (balanceError) {
      return new Response(
        JSON.stringify({ error: 'User balance not found', message: balanceError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Check if user has enough balance
    const mapPrice = parseFloat(mapData.price);
    const userBalance = parseFloat(balanceData.balance);

    if (userBalance < mapPrice) {
      return new Response(
        JSON.stringify({ 
          error: 'Insufficient balance',
          message: `You need ${mapPrice} THB to purchase this map`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Get an available key from both databases, prioritizing the local one
    let keyData = null;
    let keyError = null;
    let isExternalKey = false;

    // First, try to get a key from the local database
    const localKeyResult = await supabase
      .from('keys')
      .select('*')
      .eq('status', 'Pending')
      .is('hwid', null)
      .or('maps.len().eq.0,maps.eq.{}')
      .limit(1)
      .single();

    if (localKeyResult.error) {
      console.log('No local key available, trying external database');
      // If no local key is available, try the external database
      const externalKeyResult = await externalSupabase
        .from('keys')
        .select('*')
        .eq('status', 'Pending')
        .is('hwid', null)
        .limit(1)
        .single();

      if (externalKeyResult.error) {
        return new Response(
          JSON.stringify({ 
            error: 'No keys available',
            message: 'No keys are available for purchase at this time'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      keyData = externalKeyResult.data;
      isExternalKey = true;
    } else {
      keyData = localKeyResult.data;
    }

    // Begin transaction: Update user balance
    const newBalance = userBalance - mapPrice;
    const { error: updateBalanceError } = await supabase
      .from('user_balances')
      .update({ 
        balance: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq('id', user_id);

    if (updateBalanceError) {
      return new Response(
        JSON.stringify({ 
          error: 'Failed to update balance',
          message: updateBalanceError.message
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Record the transaction
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id,
        amount: mapPrice,
        transaction_type: 'purchase',
        description: `Purchase of ${map_name} map`
      });

    if (transactionError) {
      console.error('Error recording transaction:', transactionError);
      // Continue anyway, as this is not critical
    }

    // Update the key with map information in the appropriate database
    let updateKeyError = null;
    
    if (isExternalKey) {
      // Update in external database
      const { error } = await externalSupabase
        .from('keys')
        .update({
          maps: [map_name],
          allowed_place_ids: mapData.allowed_place_ids
        })
        .eq('id', keyData.id);
        
      updateKeyError = error;
    } else {
      // Update in local database
      const { error } = await supabase
        .from('keys')
        .update({
          maps: [map_name],
          allowed_place_ids: mapData.allowed_place_ids
        })
        .eq('id', keyData.id);
        
      updateKeyError = error;
    }

    if (updateKeyError) {
      // Attempt to rollback the balance changes
      await supabase
        .from('user_balances')
        .update({ 
          balance: userBalance,
          updated_at: new Date().toISOString()
        })
        .eq('id', user_id);

      return new Response(
        JSON.stringify({ 
          error: 'Failed to update key',
          message: updateKeyError.message
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Associate the key with the user
    const { error: userKeyError } = await supabase
      .from('user_keys')
      .insert({
        user_id,
        key_value: keyData.key,
        maps: [map_name],
        purchased_at: new Date().toISOString()
      });

    if (userKeyError) {
      console.error('Error associating key with user:', userKeyError);
      // Not rolling back here as the key is already updated
    }

    // Fetch user profile for webhook
    const { data: profileData } = await supabase
      .from('profiles')
      .select('nickname')
      .eq('id', user_id)
      .single();

    // Send webhook to Discord
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          embeds: [{
            title: '🛒 Purchase Successful',
            description: `User **${profileData?.nickname || user_id}** purchased **${map_name}** for **${mapPrice} THB**`,
            color: 5814783, // Light pink
            fields: [
              {
                name: "Key",
                value: `\`${keyData.key}\``,
                inline: true
              },
              {
                name: "New Balance",
                value: `${newBalance.toFixed(2)} THB`,
                inline: true
              },
              {
                name: "Source",
                value: isExternalKey ? "External Database" : "Local Database",
                inline: true
              }
            ],
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
        message: `Successfully purchased ${map_name} map`,
        key: keyData.key,
        new_balance: newBalance,
        key_source: isExternalKey ? "external" : "local"
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error processing purchase:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
