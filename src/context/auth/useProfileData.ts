import { useEffect, useState } from 'react';
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import type { Database } from '../../types/supabase';

export type ProfileData = {
  user_id: string;
  username: string | null;
  balance: number;
  avatar_url: string | null;
};

export const useProfileData = () => {
  const supabase = useSupabaseClient<Database>();
  const session = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, username, balance, avatar_url')
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } else {
        setProfile(data || null);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [session, supabase]);

  return { profile, loading };
};
