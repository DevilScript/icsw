
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';

export const useAuthMethods = (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const signInWithDiscord = async () => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) {
        console.error('Error during Discord sign in:', error);
      }
    } catch (error) {
      console.error('Error during Discord sign in:', error);
    } finally {
      setLoading(false);
    }
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
