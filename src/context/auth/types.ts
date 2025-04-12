
import { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  nickname?: string;
  avatar_url?: string;
  created_at: string;
}

export interface UserBalance {
  id: string;
  balance: number;
  updated_at: string;
}

export interface UserKey {
  id: string;
  user_id: string;
  key_value: string;
  maps: string[];
  purchased_at: string;
}

export interface MapDefinition {
  id: string;
  name: string;
  price: number;
  status: string;
  features: string[];
  allowed_place_ids: number[];
}

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  userBalance: UserBalance | null;
  userKeys: UserKey[] | null;
  signInWithDiscord: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  refreshUserData: () => Promise<void>;
}
