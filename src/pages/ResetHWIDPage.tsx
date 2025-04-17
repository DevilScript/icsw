import { useState, useEffect } from 'react';
import { useProfileData } from '../context/auth/useProfileData';
import { DiscordLoginButton } from '../components/DiscordLoginButton';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

const ResetHWIDPage = () => {
  const { profile, loading } = useProfileData();
  const supabase = useSupabaseClient();
  const [keys, setKeys] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchKeys = async () => {
      if (!profile) return;

      const { data, error } = await supabase
        .from('keys')
        .select('id, map')
        .eq('user_id', profile.user_id);

      if (error) {
        console.error('Error fetching keys:', error);
        setError('Failed to load keys');
      } else {
        setKeys(data || []);
      }
    };

    fetchKeys();
  }, [profile, supabase]);

  const handleResetHWID = async (keyId: string) => {
    try {
      const response = await fetch('/api/reset-hwid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key_id: keyId }),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setSuccess('HWID reset successfully');
      }
    } catch (err) {
      console.error('Reset HWID error:', err);
      setError('Failed to reset HWID');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return (
      <div className="p-4">
        <p>Please login to reset HWID</p>
        <DiscordLoginButton />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Reset HWID - {profile.username || 'User'}
      </h1>
      <div className="mt-4">
        <h2>Purchased Maps:</h2>
        {keys.length === 0 ? (
          <p>No maps purchased</p>
        ) : (
          <ul>
            {keys.map((key) => (
              <li key={key.id}>
                Maps: {(Array.isArray(key.map) ? key.map : [key.map]).join(', ')}
                <button
                  onClick={() => handleResetHWID(key.id)}
                  className="ml-4 bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                >
                  Reset HWID
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </div>
  );
};

export default ResetHWIDPage;
