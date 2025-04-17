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

    const { key } = await req.json();
    if (!key) {
      return new Response(JSON.stringify({ error: 'Missing key' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      );
    }

    const { data: keyData, error: keyError } = await secondarySupabase
      .from('keys')
      .select('id, map, script_code')
      .eq('key', key)
      .eq('user_id', user.id)
      .eq('status', 'Wait')
      .single();

    if (keyError || !keyData) {
      return new Response(JSON.stringify({ error: 'Verify Failed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // อัพเดท status เป็น Active
    const { error: updateError } = await secondarySupabase
      .from('keys')
      .update({ status: 'Active' })
      .eq('id', keyData.id);

    if (updateError) {
      console.error('Update key error:', updateError);
      return new Response(JSON.stringify({ error: 'Failed to activate key' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    return new Response(JSON.stringify({ script_code: keyData.script_code }), {
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