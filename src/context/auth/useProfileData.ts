
import { useState } from 'react';
import { supabase, getUserBalance, getUserKeys, createUserBalance } from '@/integrations/supabase/client';
import { UserProfile, UserBalance, UserKey } from './types';

// Type guard to check if an object has the required UserBalance properties
const isUserBalanceData = (data: any): data is UserBalance => {
  return (
    data && 
    typeof data === 'object' &&
    'id' in data && 
    'balance' in data && 
    'updated_at' in data &&
    typeof data.id === 'string' && 
    typeof data.balance === 'number' && 
    typeof data.updated_at === 'string'
  );
};

// Type guard to check if an object has the required UserKey properties
const isUserKeyData = (data: any): data is UserKey => {
  return (
    data && 
    typeof data === 'object' &&
    'id' in data && 
    'user_id' in data && 
    'key_value' in data && 
    'purchased_at' in data && 
    'maps' in data &&
    typeof data.id === 'string' && 
    typeof data.user_id === 'string' && 
    typeof data.key_value === 'string' && 
    typeof data.purchased_at === 'string' && 
    Array.isArray(data.maps)
  );
};

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
          
          // Safe type checking with non-null assertion after check
          if (newBalanceData && typeof newBalanceData === 'object') {
            const rawNewData = newBalanceData as any;
            
            if ('id' in rawNewData && 
                'balance' in rawNewData &&
                'updated_at' in rawNewData) {
              
              const validBalance: UserBalance = {
                id: String(rawNewData.id),
                balance: Number(rawNewData.balance),
                updated_at: String(rawNewData.updated_at)
              };
              setUserBalance(validBalance);
            }
          }
        } else {
          console.error('Error fetching user balance:', balanceError);
        }
      } else if (balanceData && typeof balanceData === 'object') {
        // Safe type checking with non-null assertion after check
        const rawData = balanceData as any;
        
        if ('id' in rawData && 
            'balance' in rawData &&
            'updated_at' in rawData) {
          
          const validBalance: UserBalance = {
            id: String(rawData.id),
            balance: Number(rawData.balance),
            updated_at: String(rawData.updated_at)
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
        const validKeysData = keysData.filter(key => 
          key && 
          typeof key === 'object' &&
          'id' in key &&
          'user_id' in key &&
          'key_value' in key &&
          'purchased_at' in key &&
          'maps' in key
        );
        
        const validKeys: UserKey[] = validKeysData.map(key => {
          const rawKey = key as any;  // Type assertion is safe here because we filtered above
          return {
            id: String(rawKey.id),
            user_id: String(rawKey.user_id),
            key_value: String(rawKey.key_value),
            purchased_at: String(rawKey.purchased_at),
            maps: Array.isArray(rawKey.maps) ? rawKey.maps : []
          };
        });
        
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
