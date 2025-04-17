import { useState } from 'react';
import { useProfileData } from '../context/auth/useProfileData';
import { DiscordLoginButton } from '../components/DiscordLoginButton';

const TopupPage = () => {
  const { profile, loading } = useProfileData();
  const [voucherHash, setVoucherHash] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRedeem = async () => {
    try {
      const response = await fetch('/api/redeem-truemoney', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voucher_hash: voucherHash }),
      });
      const data = await response.json();
      if (data.error) {
        console.error('Redeem error:', data.error);
        setError(data.error);
      } else {
        setSuccess('Payment processed successfully');
        setVoucherHash('');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to redeem voucher');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return (
      <div className="p-4">
        <p>Please login to top up</p>
        <DiscordLoginButton />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Top Up - Welcome, {profile.username || 'User'}
      </h1>
      <p>Balance: {profile.balance} THB</p>
      <div className="mt-4">
        <input
          type="text"
          value={voucherHash}
          onChange={(e) => setVoucherHash(e.target.value)}
          placeholder="Enter TrueMoney Voucher Hash"
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleRedeem}
          className="mt-2 w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Redeem
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </div>
  );
};

export default TopupPage;
