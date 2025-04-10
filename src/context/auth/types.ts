
import { Session, User } from '@supabase/supabase-js';

export type UserProfile = {
  nickname: string;
  avatar_url?: string;
};

export type UserBalance = {
  balance: number;
  updated_at: string;
};

export type UserKey = {
  id: string;
  key_value: string;
  maps: string[];
  purchased_at: string;
};

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  userBalance: UserBalance | null;
  userKeys: UserKey[] | null;
  signUp: (email: string, password: string, nickname: string) => Promise<{
    error: Error | null;
    data: any | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: any | null;
  }>;
  signInWithDiscord: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{
    error: Error | null;
    data: any | null;
  }>;
  loading: boolean;
  refreshUserData: () => Promise<void>;
};
