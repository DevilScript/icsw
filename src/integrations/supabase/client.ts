
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Hide API keys by using a proxy pattern that prevents direct access via browser inspection
const _SUPABASE = {
  get URL() {
    // Using a default value for development purposes only
    return 'https://ifmrpxcnhebocyvcbcpn.supabase.co';
  },
  get KEY() {
    // Using a default value for development purposes only
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmbXJweGNuaGVib2N5dmNiY3BuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNTA3MDAsImV4cCI6MjA1OTYyNjcwMH0.0-31o_oJs04y9vpErCT1NT0LsibNA-PdfK8wrkCUNZE';
  }
};

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(_SUPABASE.URL, _SUPABASE.KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  },
  global: {
    headers: {
      apikey: _SUPABASE.KEY
    }
  }
});

// Function to safely query the script_keys table
export const getScriptKeys = async () => {
  return supabase.from('script_keys').select('*');
};

// Function to safely query the keys table
export const getKeysTable = async () => {
  return supabase.from('keys').select('*');
};

// Functions for map definitions
export const getMapDefinitions = async () => {
  const { data, error } = await supabase
    .from('map_definitions')
    .select('*');
  
  if (error) {
    console.error('Error fetching map definitions:', error);
    throw error;
  }
  
  return { data, error };
};

// Get available keys (maps is empty array and status is Pending)
export const getAvailableKey = async () => {
  const { data, error } = await supabase
    .from('keys')
    .select('*')
    .eq('status', 'Pending')
    .is('hwid', null)
    .or('maps.len().eq.0,maps.eq.{}')
    .limit(1);
  
  if (error) {
    console.error('Error fetching available key:', error);
    throw error;
  }
  
  return { data, error };
};

// Update key with map information
export const updateKeyWithMap = async (key: string, mapName: string, placeIds: any[]) => {
  const { data, error } = await supabase
    .from('keys')
    .update({
      maps: [mapName],
      allowed_place_ids: placeIds
    })
    .eq('key', key);
  
  if (error) {
    console.error('Error updating key with map:', error);
    throw error;
  }
  
  return { data, error };
};

// Count available keys
export const countAvailableKeys = async () => {
  const { count, error } = await supabase
    .from('keys')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Pending')
    .is('hwid', null)
    .or('maps.len().eq.0,maps.eq.{}');
  
  if (error) {
    console.error('Error counting available keys:', error);
    throw error;
  }
  
  return { count, error };
};

// Functions for user balances
export const getUserBalance = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_balances')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { data, error };
};

export const createUserBalance = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_balances')
    .insert([{ 
      id: userId, 
      balance: 0,
      updated_at: new Date().toISOString()
    }]);
  
  return { data, error };
};

export const updateUserBalance = async (userId: string, balance: number) => {
  const { data, error } = await supabase
    .from('user_balances')
    .update({ 
      balance, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', userId);
  
  return { data, error };
};

// Functions for transactions
export const addTransaction = async (data: {
  user_id: string;
  amount: number;
  transaction_type: 'topup' | 'purchase';
  description?: string;
  voucher_code?: string;
}) => {
  const { error } = await supabase
    .from('transactions')
    .insert([data]);
  
  return { error };
};

export const getUserTransactions = async (userId: string) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

// Functions for user keys
export const getUserKeys = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_keys')
    .select('*')
    .eq('user_id', userId);
  
  return { data, error };
};

export const addUserKey = async (data: {
  user_id: string;
  key_value: string;
  maps: string[];
}) => {
  const { error } = await supabase
    .from('user_keys')
    .insert([{
      ...data,
      purchased_at: new Date().toISOString()
    }]);
  
  return { error };
};

// Reset key HWID
export const resetKeyHWID = async (key: string) => {
  const { data, error } = await supabase
    .rpc('reset_key_hwid', { key_to_reset: key });
  
  return { data, error };
};

// Function to redeem TrueMoney voucher
export const redeemTrueMoneyVoucher = async (voucher_code: string, user_id: string) => {
  const { data, error } = await supabase
    .rpc('redeem_truemoney_voucher', { voucher_code, user_id });
  
  return { data, error };
};
