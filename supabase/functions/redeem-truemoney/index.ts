
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.36.0'

const WEBHOOK_URL = "https://discordapp.com/api/webhooks/1359559916129616034/sHuXXN7aJJQAvrRg97AiI9lQPCLqjF_7rurjsTdhTexlbZh1u66_AVhJeMBuAaSgTEfF";
const MOBILE_NUMBER = "0653835988";

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

    const { voucher_code, user_id } = await req.json();

    // Validate input
    if (!voucher_code || !user_id) {
      return new Response(
        JSON.stringify({ error: 'Voucher code and user ID are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Validate voucher format with regex
    const voucher_regex = /^[a-zA-Z0-9]{18}$/;
    if (!voucher_regex.test(voucher_code)) {
      return new Response(
        JSON.stringify({ error: 'Invalid voucher format' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Send request to TrueMoney API
    const truemoneyResponse = await fetch(
      `https://gift.truemoney.com/campaign/vouchers/${voucher_code}/redeem`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: MOBILE_NUMBER,
          voucher_hash: voucher_code,
        }),
      }
    );

    const truemoneyData = await truemoneyResponse.json();
    
    // If there's an error in the TrueMoney API response
    if (truemoneyData.status?.code !== 'SUCCESS' && !truemoneyData.amount) {
      return new Response(
        JSON.stringify({ 
          error: 'Failed to redeem voucher',
          message: truemoneyData.message || 'Unknown error'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Calculate the amount from TrueMoney response or use a default
    const amount = truemoneyData.amount || truemoneyData.data?.amount || 100.0;

    // Update user balance in database
    const { data: userData, error: userError } = await supabase
      .from('user_balances')
      .select('balance')
      .eq('id', user_id)
      .single();

    if (userError && userError.code === 'PGRST116') {
      // User balance doesn't exist, create it
      await supabase
        .from('user_balances')
        .insert({ id: user_id, balance: amount });
    } else if (userError) {
      throw userError;
    } else {
      // Update existing balance
      await supabase
        .from('user_balances')
        .update({ 
          balance: userData.balance + amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', user_id);
    }

    // Record the transaction
    await supabase
      .from('transactions')
      .insert({
        user_id,
        amount,
        transaction_type: 'topup',
        description: 'TrueMoney Wallet Gift Voucher',
        voucher_code
      });

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
            title: '💰 Topup Successful',
            description: `User **${profileData?.nickname || user_id}** has added **${amount} THB** to their account`,
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
        amount,
        message: 'Voucher redeemed successfully'
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
