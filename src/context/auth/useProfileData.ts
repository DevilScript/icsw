
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';

export const useProfileData = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const fetchUserProfile = async (userId: string) => {
    try {
      // Try to fetch the user's profile safely
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // Table might not exist yet
          console.log('Profiles table does not exist or is empty');
        } else {
          console.error('Error fetching user profile:', error);
        }
        return;
      }
      
      if (data) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  return {
    userProfile,
    setUserProfile,
    fetchUserProfile
  };
};
