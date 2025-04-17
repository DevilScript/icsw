import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';

export const useAuthMethods = (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>
) => {
  const signInWithDiscord = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'discord'
    });
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  };

  return {
    signInWithDiscord,
    signOut
  };
};
