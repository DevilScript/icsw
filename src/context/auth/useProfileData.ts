
import { useState } from 'react';
import { supabase, getUserBalance, getUserKeys, createUserBalance } from '@/integrations/supabase/client';
import { UserProfile, UserBalance, UserKey } from './types';

export const useProfileData = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userBalance, setUserBalance] = useState<UserBalance | null>(null);
  const [userKeys, setUserKeys] = useState<UserKey[] | null>(null);

  const fetchUserProfile = async (userId: string) => {
    try {
      // Try to fetch the user's profile safely
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        if (profileError.code === 'PGRST116') {
          // Table might not exist yet
          console.log('Profiles table does not exist or is empty');
        } else {
          console.error('Error fetching user profile:', profileError);
        }
      } else if (profileData) {
        setUserProfile(profileData as UserProfile);
      }

      // Fetch user balance
      const { data: balanceData, error: balanceError } = await getUserBalance(userId);
      
      if (balanceError) {
        if (balanceError.code === 'PGRST116') {
          // Create a new balance entry if it doesn't exist
          await createUserBalance(userId);
          // Try fetching again
          const { data: newBalanceData } = await getUserBalance(userId);
          if (newBalanceData) {
            // Ensure the data conforms to the UserBalance type
            if ('id' in newBalanceData && 'balance' in newBalanceData) {
              setUserBalance(newBalanceData as UserBalance);
            }
          }
        } else {
          console.error('Error fetching user balance:', balanceError);
        }
      } else if (balanceData) {
        // Ensure the data conforms to the UserBalance type
        if ('id' in balanceData && 'balance' in balanceData) {
          setUserBalance(balanceData as UserBalance);
        }
      }

      // Fetch user keys
      const { data: keysData, error: keysError } = await getUserKeys(userId);
      
      if (keysError) {
        console.error('Error fetching user keys:', keysError);
      } else if (keysData && Array.isArray(keysData)) {
        // Make sure we only set valid key data
        const validKeys = keysData.filter(key => 
          key && 'key_value' in key && 'user_id' in key
        );
        setUserKeys(validKeys as UserKey[]);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const refreshUserData = async (userId: string) => {
    await fetchUserProfile(userId);
  };

  return {
    userProfile,
    setUserProfile,
    userBalance,
    setUserBalance,
    userKeys,
    setUserKeys,
    fetchUserProfile,
    refreshUserData
  };
};
