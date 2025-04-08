import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User, Provider } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';

type UserProfile = {
  nickname: string;
  avatar_url?: string;
};

type AuthContextType = {
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      // Check if the profiles table exists first
      const { data: tableExists, error: checkError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1)
        .then(response => {
          // If we can query the table, it exists
          return { data: true, error: null };
        })
        .catch(error => {
          // If we get an error, the table might not exist
          console.error('Error checking profiles table:', error);
          return { data: false, error };
        });
      
      if (!tableExists) {
        console.log('Profiles table does not exist yet');
        return;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }
      
      if (data) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
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
            description: "You have successfully signed in.",
          });
        }
        
        if (event === 'SIGNED_OUT') {
          setUserProfile(null);
          toast({
            title: "Signed out",
            description: "You have been signed out.",
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

  const signUp = async (email: string, password: string, nickname: string) => {
    setLoading(true);
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname: nickname
        },
        emailRedirectTo: 'https://neon-script-haven.lovable.app/'
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
      provider: 'discord',
      options: {
        redirectTo: 'https://neon-script-haven.lovable.app/'
      }
    });
    setLoading(false);
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    const result = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://neon-script-haven.lovable.app/auth?tab=reset-password',
    });
    setLoading(false);
    return result;
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  };

  const value = {
    session,
    user,
    userProfile,
    signUp,
    signIn,
    signInWithDiscord,
    signOut,
    resetPassword,
    loading,
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
