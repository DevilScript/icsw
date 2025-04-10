
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
        // Only set the user profile if we have valid data
        const validProfile: UserProfile = {
          id: profileData.id,
          nickname: profileData.nickname || '',
          avatar_url: profileData.avatar_url || undefined,
          created_at: profileData.created_at
        };
        setUserProfile(validProfile);
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
            // Validate the data matches our UserBalance type
            if (typeof newBalanceData.id === 'string' && 
                typeof newBalanceData.balance === 'number' &&
                typeof newBalanceData.updated_at === 'string') {
              const validBalance: UserBalance = {
                id: newBalanceData.id,
                balance: newBalanceData.balance,
                updated_at: newBalanceData.updated_at
              };
              setUserBalance(validBalance);
            }
          }
        } else {
          console.error('Error fetching user balance:', balanceError);
        }
      } else if (balanceData) {
        // Validate the data matches our UserBalance type
        if (typeof balanceData.id === 'string' && 
            typeof balanceData.balance === 'number' &&
            typeof balanceData.updated_at === 'string') {
          const validBalance: UserBalance = {
            id: balanceData.id,
            balance: balanceData.balance,
            updated_at: balanceData.updated_at
          };
          setUserBalance(validBalance);
        }
      }

      // Fetch user keys
      const { data: keysData, error: keysError } = await getUserKeys(userId);
      
      if (keysError) {
        console.error('Error fetching user keys:', keysError);
      } else if (keysData && Array.isArray(keysData)) {
        // Make sure we only set valid key data
        const validKeys: UserKey[] = keysData
          .filter(key => 
            key && 
            typeof key.id === 'string' &&
            typeof key.user_id === 'string' &&
            typeof key.key_value === 'string' &&
            typeof key.purchased_at === 'string' &&
            Array.isArray(key.maps)
          )
          .map(key => ({
            id: key.id,
            user_id: key.user_id,
            key_value: key.key_value,
            maps: key.maps || [],
            purchased_at: key.purchased_at
          }));
        
        setUserKeys(validKeys);
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
