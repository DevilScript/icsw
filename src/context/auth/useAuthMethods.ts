
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';

export const useAuthMethods = (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>
) => {
  const signUp = async (email: string, password: string, nickname: string) => {
    setLoading(true);
    
    try {
      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nickname
          }
        }
      });
      
      return result;
    } catch (error) {
      console.error('Error during sign up:', error);
      return { error, data: null };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const result = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      return result;
    } catch (error) {
      console.error('Error during sign in:', error);
      return { error, data: null };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    
    try {
      const result = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth-reset`
      });
      
      return result;
    } catch (error) {
      console.error('Error during password reset:', error);
      return { error, data: null };
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
    signUp,
    signIn,
    resetPassword,
    signOut
  };
};
