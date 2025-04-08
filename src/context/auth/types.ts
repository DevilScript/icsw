
import { Session, User } from '@supabase/supabase-js';

export type UserProfile = {
  nickname: string;
  avatar_url?: string;
};

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
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
};
