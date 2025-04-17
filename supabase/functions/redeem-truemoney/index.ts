import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Database } from '../../../types.ts';
import { corsHeaders } from '../../_shared/cors.ts';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const { voucher_hash } = await req.json();
    if (!voucher_hash) {
      return new Response(JSON.stringify({ error: 'Missing voucher_hash' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const response = await fetch('https://gift.truemoney.com/campaign/voucher_redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voucher_hash }),
    });

    const redeemData = await response.json();
    if (redeemData.status !== 'success') {
      return new Response(JSON.stringify({ error: 'Invalid or used voucher' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const amount = parseFloat(redeemData.amount_baht);

    // เริ่ม transaction
    const { error: txError } = await supabase.rpc('update_balance_and_log_transaction', {
      p_user_id: user.id,
      p_amount: amount,
      p_voucher_hash: voucher_hash,
    });

    if (txError) {
      console.error('Transaction error:', txError);
      return new Response(JSON.stringify({ error: 'Failed to process transaction' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    return new Response(JSON.stringify({ message: 'Payment processed', amount }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
