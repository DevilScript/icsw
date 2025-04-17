import { useState } from 'react';
import { useProfileData } from '../context/auth/useProfileData';
import { DiscordLoginButton } from './DiscordLoginButton';

const ScriptSection = () => {
  const { profile, loading } = useProfileData();
  const [key, setKey] = useState('');
  const [scriptCode, setScriptCode] = useState('');
  const [error, setError] = useState('');

  const handleVerify = async () => {
    try {
      const response = await fetch('/api/verify-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        setScriptCode('');
      } else {
        setScriptCode(data.script_code);
        setError('');
      }
    } catch (err) {
      console.error('Verify error:', err);
      setError('Failed to verify key');
      setScriptCode('');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return (
      <div className="p-4">
        <p>Please login to unlock script</p>
        <DiscordLoginButton />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Unlock Script - {profile.username || 'User'}</h2>
      <input
        type="text"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="Enter your key"
        className="w-full p-2 border rounded"
      />
      <button
        onClick={handleVerify}
        className="mt-2 w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Unlock
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {scriptCode && (
        <pre className="mt-4 p-2 bg-gray-800 text-white rounded">{scriptCode}</pre>
      )}
    </div>
  );
};

export default ScriptSection;
