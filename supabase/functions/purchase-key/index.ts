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

    const secondarySupabase = createClient(
      'https://eusxbcbwyhjtfjplwtst.supabase.co',
      Deno.env.get('SECONDARY_SUPABASE_ANON_KEY') ?? ''
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const { map } = await req.json();
    if (!map) {
      return new Response(JSON.stringify({ error: 'Missing map' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // ตรวจสอบ balance
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile || profile.balance < 100) {
      return new Response(JSON.stringify({ error: 'Insufficient balance' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // ดึง key ที่มี status = Pending
    const { data: key, error: keyError } = await secondarySupabase
      .from('keys')
      .select('id, map')
      .eq('status', 'Pending')
      .eq('map', map)
      .single();

    if (keyError || !key) {
      return new Response(JSON.stringify({ error: 'No available keys' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // อัพเดท key โดย append map ใหม่
    const existingMaps = Array.isArray(key.map) ? key.map : [key.map];
    const updatedMaps = [...new Set([...existingMaps, map])];

    const { error: updateError } = await secondarySupabase
      .from('keys')
      .update({
        map: updatedMaps,
        status: 'Wait',
        user_id: user.id,
        username: profile.username,
      })
      .eq('id', key.id);

    if (updateError) {
      console.error('Update key error:', updateError);
      return new Response(JSON.stringify({ error: 'Failed to update key' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // อัพเดท balance
    const { error: balanceError } = await supabase
      .from('profiles')
      .update({ balance: profile.balance - 100 })
      .eq('user_id', user.id);

    if (balanceError) {
      console.error('Balance update error:', balanceError);
      return new Response(JSON.stringify({ error: 'Failed to update balance' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    return new Response(JSON.stringify({ message: 'Key purchased successfully' }), {
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
