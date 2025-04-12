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

    // Extract voucher code from URL if provided
    let cleanedVoucher = voucher_code;
    if (voucher_code.includes('gift.truemoney.com')) {
      const urlParams = new URLSearchParams(voucher_code.split('?')[1] || '');
      cleanedVoucher = urlParams.get('v') || voucher_code;
    }

    // Validate voucher format (alphanumeric, any length)
    const voucher_regex = /^[a-zA-Z0-9]+$/;
    if (!voucher_regex.test(cleanedVoucher)) {
      return new Response(
        JSON.stringify({
          error: 'Invalid voucher format',
          message: 'Voucher must contain only letters and numbers',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Call TrueMoney API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    let truemoneyData;
    try {
      const truemoneyResponse = await fetch(
        `https://gift.truemoney.com/campaign/vouchers/${cleanedVoucher}/redeem`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mobile: MOBILE_NUMBER,
            voucher_hash: cleanedVoucher,
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
      return new Response(
        JSON.stringify({ error: 'Failed to redeem voucher', message: errorMessage }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const amount = parseFloat(truemoneyData.data?.amount_baht || truemoneyData.amount || '0');
    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid voucher amount' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Process balance update and transaction
    const { error: txError } = await supabase.rpc('process_topup', {
      p_user_id: user_id,
      p_amount: amount,
      p_voucher_code: cleanedVoucher,
      p_description: 'TrueMoney Wallet Gift Voucher',
    });

    if (txError) {
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
            embeds: [
              {
                title: '💰 Topup Successful',
                description: `User **${profileData?.nickname || user_id}** has added **${amount} THB** to their account`,
                color: 5814783,
                timestamp: new Date().toISOString(),
              },
            ],
          }),
        });
      } catch (webhookError) {
        console.error('Failed to send webhook:', webhookError);
      }
    }, 0);

    return new Response(
      JSON.stringify({ success: true, amount, message: 'Voucher redeemed successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});