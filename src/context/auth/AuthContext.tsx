
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';
import { AuthContextType } from './types';
import { useProfileData } from './useProfileData';
import { useAuthMethods } from './useAuthMethods';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  
  const { 
    userProfile, 
    setUserProfile, 
    userBalance, 
    userKeys, 
    fetchUserProfile, 
    refreshUserData
  } = useProfileData();
  
  const { signInWithDiscord, signOut } = useAuthMethods(setLoading, setUserProfile);

  const refreshUserDataWrapper = async () => {
    if (user) {
      await refreshUserData(user.id);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          // Use setTimeout to prevent potential Supabase auth deadlocks
          if (session?.user) {
            setTimeout(() => {
              fetchUserProfile(session.user.id);
            }, 0);
          }
          
          toast({
            title: "Welcome!",
            description: "Signed in successfully",
            className: "bg-gray-800 border border-pastelPink text-white",
          });
        }
        
        if (event === 'SIGNED_OUT') {
          setUserProfile(null);
          toast({
            title: "Goodbye!",
            description: "Signed out successfully",
            className: "bg-gray-800 border border-pastelPink text-white",
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const value: AuthContextType = {
    session,
    user,
    userProfile,
    userBalance,
    userKeys,
    signInWithDiscord,
    signOut,
    loading,
    refreshUserData: refreshUserDataWrapper
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
