
import { Session, User } from '@supabase/supabase-js';

export type UserProfile = {
  id: string;
  nickname: string;
  avatar_url?: string;
  created_at: string;
};

export type UserBalance = {
  id: string;
  balance: number;
  updated_at: string;
};

export type UserKey = {
  id: string;
  user_id: string;
  key_value: string;
  maps: string[];
  purchased_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  amount: number;
  transaction_type: string;
  description: string;
  voucher_code?: string;
  created_at: string;
};

export type MapDefinition = {
  id: string;
  name: string;
  price: number;
  status: string;
  features: string[];
  allowed_place_ids: string[];
};

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  userBalance: UserBalance | null;
  userKeys: UserKey[] | null;
  signInWithDiscord: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  refreshUserData: () => Promise<void>;
};
