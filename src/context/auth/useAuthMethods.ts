import { useCallback } from 'react';
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import type { User } from '@supabase/supabase-js';
import { Database } from '../../types/supabase';
import { AuthMethods } from './types';

export const useAuthMethods = (): AuthMethods => {
  const supabase = createClient<Database>(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
  const session = useSession();

  const signInWithDiscord = useCallback(async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: 'https://icsw.lovable.app',
        scopes: 'identify',
      },
    });

    if (error) {
      console.error('Discord sign-in error:', error);
      throw error;
    }

    return data;
  }, [supabase]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }, [supabase]);

  const syncUserProfile = useCallback(async (user: User) => {
    const discordUsername = user.user_metadata.global_name || user.user_metadata.name || 'Unknown User';
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        username: discordUsername,
        avatar_url: user.user_metadata.avatar_url,
        balance: 0,
      });

    if (error) {
      console.error('Profile sync error:', error);
      throw error;
    }

    console.log('Profile synced:', data);
    return data;
  }, [supabase]);

  if (session?.user && !session.user.user_metadata.synced) {
    syncUserProfile(session.user).then(() => {
      supabase.auth.updateUser({ data: { synced: true } });
    });
  }

  return {
    user: session?.user ?? null,
    signInWithDiscord,
    signOut,
    syncUserProfile,
  };
};
