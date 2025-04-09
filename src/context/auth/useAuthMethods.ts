
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';

export const useAuthMethods = (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>
) => {
  const signUp = async (email: string, password: string, nickname: string) => {
    setLoading(true);
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname: nickname
        }
      }
    });
    setLoading(false);
    return result;
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    return result;
  };

  const signInWithDiscord = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'discord'
    });
    setLoading(false);
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    const result = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    return result;
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  };

  return {
    signUp,
    signIn,
    signInWithDiscord,
    resetPassword,
    signOut
  };
};
