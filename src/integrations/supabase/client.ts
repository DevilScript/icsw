
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use environment variables through Vite runtime configuration
// This prevents API keys from being directly visible in the code
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ifmrpxcnhebocyvcbcpn.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmbXJweGNuaGVib2N5dmNiY3BuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNTA3MDAsImV4cCI6MjA1OTYyNjcwMH0.0-31o_oJs04y9vpErCT1NT0LsibNA-PdfK8wrkCUNZE';

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
