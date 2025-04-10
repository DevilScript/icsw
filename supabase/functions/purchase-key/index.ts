
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

    const { user_id, map_name } = await req.json();

    // Validate input
    if (!user_id || !map_name) {
      return new Response(
        JSON.stringify({ error: 'User ID and map name are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Get map details from map_definitions table
    const { data: mapData, error: mapError } = await supabase
      .from('map_definitions')
      .select('*')
      .eq('name', map_name)
      .single();

    if (mapError || !mapData) {
      return new Response(
        JSON.stringify({ error: 'Map not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Check user balance
    const { data: userData, error: userError } = await supabase
      .from('user_balances')
      .select('balance')
      .eq('id', user_id)
      .single();

    if (userError || !userData) {
      return new Response(
        JSON.stringify({ error: 'User balance not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Check if user has enough balance
    if (userData.balance < mapData.price) {
      return new Response(
        JSON.stringify({ 
          error: 'Insufficient balance',
          current_balance: userData.balance,
          required: mapData.price
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Check if the user already has a key
    const { data: existingUserKey, error: keyError } = await supabase
      .from('user_keys')
      .select('*')
      .eq('user_id', user_id)
      .single();

    let keyData;
    
    if (!existingUserKey) {
      // User doesn't have a key, get a new one from available keys
      const { data: availableKeys, error: availableKeysError } = await supabase
        .from('keys')
        .select('*')
        .eq('status', 'Pending')
        .is('hwid', null)
        .or('maps.len().eq.0,maps.eq.{}')
        .limit(1);

      if (availableKeysError || !availableKeys || availableKeys.length === 0) {
        return new Response(
          JSON.stringify({ error: 'No keys available' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }

      keyData = availableKeys[0];

      // Update the key with map info
      await supabase
        .from('keys')
        .update({
          maps: [map_name],
          allowed_place_ids: mapData.allowed_place_ids
        })
        .eq('key', keyData.key);

      // Add key to user_keys
      await supabase
        .from('user_keys')
        .insert({
          user_id,
          key_value: keyData.key,
          maps: [map_name]
        });
    } else {
      // User already has a key, update it
      const existingMaps = existingUserKey.maps || [];
      
      // Check if the map is already in the user's key
      if (existingMaps.includes(map_name)) {
        return new Response(
          JSON.stringify({ 
            error: 'Map already purchased',
            key: existingUserKey.key_value,
            maps: existingMaps
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      // Get the key from keys table
      const { data: keyDetails, error: keyDetailsError } = await supabase
        .from('keys')
        .select('*')
        .eq('key', existingUserKey.key_value)
        .single();

      if (keyDetailsError || !keyDetails) {
        return new Response(
          JSON.stringify({ error: 'Key details not found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }

      keyData = keyDetails;
      
      // Update existing maps array
      const updatedMaps = [...existingMaps, map_name];
      
      // Get current allowed_place_ids
      const currentPlaceIds = keyDetails.allowed_place_ids || [];
      
      // Add new allowed_place_ids
      const updatedPlaceIds = [
        ...currentPlaceIds,
        ...mapData.allowed_place_ids
      ];
      
      // Update user_keys
      await supabase
        .from('user_keys')
        .update({
          maps: updatedMaps
        })
        .eq('user_id', user_id)
        .eq('key_value', existingUserKey.key_value);
      
      // Update the key
      await supabase
        .from('keys')
        .update({
          maps: updatedMaps,
          allowed_place_ids: updatedPlaceIds
        })
        .eq('key', existingUserKey.key_value);
    }

    // Deduct balance
    const newBalance = userData.balance - mapData.price;
    await supabase
      .from('user_balances')
      .update({
        balance: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq('id', user_id);

    // Record transaction
    await supabase
      .from('transactions')
      .insert({
        user_id,
        amount: -mapData.price,
        transaction_type: 'purchase',
        description: `Purchase of ${map_name} map`
      });

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
            title: '🛒 Purchase Successful',
            description: `User **${profileData?.nickname || user_id}** has purchased **${map_name}** for **${mapData.price} THB**`,
            fields: [
              {
                name: 'Key',
                value: keyData.key,
                inline: true
              },
              {
                name: 'New Balance',
                value: `${newBalance} THB`,
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

    // Check if keys are running low (less than 10) and notify via webhook
    const { count } = await supabase
      .from('keys')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Pending')
      .is('hwid', null)
      .or('maps.len().eq.0,maps.eq.{}');

    if (count !== null && count < 10) {
      try {
        await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            embeds: [{
              title: '⚠️ Low Key Stock Alert',
              description: `Only **${count}** keys left in stock!`,
              color: 16711680, // Red
              timestamp: new Date().toISOString()
            }]
          })
        });
      } catch (webhookError) {
        console.error('Failed to send low stock webhook:', webhookError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        key: keyData.key,
        maps: existingUserKey ? [...existingUserKey.maps, map_name] : [map_name],
        new_balance: newBalance,
        message: 'Purchase successful'
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
