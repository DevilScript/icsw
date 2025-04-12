import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.36.0';

const WEBHOOK_URL = 'https://discordapp.com/api/webhooks/1359559916129616034/sHuXXN7aJJQAvrRg97AiI9lQPCLqjF_7rurjsTdhTexlbZh1u66_AVhJeMBuAaSgTEfF';
const MOBILE_NUMBER = '0653835988';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { voucher_code, user_id } = await req.json();

    if (!voucher_code || !user_id) {
      return new Response(
        JSON.stringify({ error: 'Voucher code and user ID are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Validate voucher format (allow letters, numbers, and hyphens)
    const voucher_regex = /^[a-zA-Z0-9-]{18}$/;
    if (!voucher_regex.test(voucher_code)) {
      await supabase.from('logs').insert({
        user_id,
        action: 'voucher_validation_failed',
        details: JSON.stringify({ voucher_code, error: 'Invalid format' }),
      });
      return new Response(
        JSON.stringify({ error: 'Invalid voucher format', message: 'Voucher must be 18 characters (letters, numbers, or hyphens)' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Call TrueMoney API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout
    let truemoneyData;
    try {
      const truemoneyResponse = await fetch(
        `https://gift.truemoney.com/campaign/vouchers/${voucher_code}/redeem`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mobile: MOBILE_NUMBER,
            voucher_hash: voucher_code,
          }),
          signal: controller.signal,
        }
      );
      truemoneyData = await truemoneyResponse.json();
    } catch (error) {
      throw new Error('TrueMoney API timeout or network error');
    } finally {
      clearTimeout(timeoutId);
    }

    // Handle TrueMoney API errors
    if (truemoneyData.status?.code !== 'SUCCESS') {
      const errorMessage =
        truemoneyData.status?.code === 'VOUCHER_ALREADY_REDEEMED'
          ? 'VOUCHER_ALREADY_REDEEMED'
          : truemoneyData.status?.code === 'INVALID_VOUCHER'
          ? 'INVALID_VOUCHER'
          : truemoneyData.message || 'Failed to redeem voucher';
      await supabase.from('logs').insert({
        user_id,
        action: 'truemoney_api_failed',
        details: JSON.stringify({ voucher_code, error: errorMessage }),
      });
      return new Response(
        JSON.stringify({ error: 'Failed to redeem voucher', message: errorMessage }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const amount = parseFloat(truemoneyData.data?.amount_baht || truemoneyData.amount || '0');
    if (!amount || amount <= 0) {
      await supabase.from('logs').insert({
        user_id,
        action: 'invalid_amount',
        details: JSON.stringify({ voucher_code, amount }),
      });
      return new Response(
        JSON.stringify({ error: 'Invalid voucher amount' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Process balance update and transaction in a single transaction
    const { error: txError } = await supabase.rpc('process_topup', {
      p_user_id: user_id,
      p_amount: amount,
      p_voucher_code: voucher_code,
      p_description: 'TrueMoney Wallet Gift Voucher',
    });

    if (txError) {
      await supabase.from('logs').insert({
        user_id,
        action: 'transaction_failed',
        details: JSON.stringify({ voucher_code, error: txError.message }),
      });
      throw new Error('Failed to process transaction');
    }

    // Fetch user profile for webhook
    const { data: profileData } = await supabase
      .from('profiles')
      .select('nickname')
      .eq('id', user_id)
      .single();

    // Send webhook asynchronously
    setTimeout(async () => {
      try {
        await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            embeds: [{
              title: '💰 Topup Successful',
              description: `User **${profileData?.nickname || user_id}** has added **${amount} THB** to their account`,
              color: 5814783,
              timestamp: new Date().toISOString(),
            }],
          }),
        });
      } catch (webhookError) {
        console.error('Failed to send webhook:', webhookError);
        await supabase.from('webhook_retries').insert({
          payload: JSON.stringify({ user_id, amount, nickname: profileData?.nickname }),
          error: webhookError.message,
        });
      }
    }, 0);

    await supabase.from('logs').insert({
      user_id,
      action: 'topup_success',
      details: JSON.stringify({ voucher_code, amount }),
    });

    return new Response(
      JSON.stringify({ success: true, amount, message: 'Voucher redeemed successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    await supabase.from('logs').insert({
      user_id: user_id || 'unknown',
      action: 'topup_error',
      details: JSON.stringify({ error: error.message }),
    });
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});