
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use environment variables through Vite runtime configuration
// This prevents API keys from being directly visible in the code
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ifmrpxcnhebocyvcbcpn.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'public_anon_key';

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
