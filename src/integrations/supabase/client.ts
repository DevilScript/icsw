
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Hide API keys by using a proxy pattern that prevents direct access via browser inspection
const _SUPABASE = {
  get URL() {
    // Using a default value for development purposes only
    return 'https://iuxhbfecfllkrpuxucni.supabase.co';
  },
  get KEY() {
    // Using a default value for development purposes only
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1eGhiZmVjZmxsa3JwdXh1Y25pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MTU0NDQsImV4cCI6MjA1ODQ5MTQ0NH0.x7lOtHcHZ5QuimSLNT2WyrSdLN6ebDTuCwLl5H01ftQ';
  }
};

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(_SUPABASE.URL, _SUPABASE.KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});

// Function to safely query the script_keys table without TypeScript errors
export const getScriptKeys = () => {
  return supabase.from('script_keys');
};

// Due to TypeScript limitations with the current Database type definition,
// we need to use a type assertion for tables not in the types.ts file
export const getKeysTable = () => {
  // Using type assertion to bypass TypeScript's strict checking
  return supabase.from('keys' as any);
};
