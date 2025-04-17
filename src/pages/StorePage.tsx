import { useState } from 'react';
import { useProfileData } from '../context/auth/useProfileData';
import { DiscordLoginButton } from '../components/DiscordLoginButton';
import { createClient } from '@supabase/supabase-js';

const secondarySupabase = createClient(
  'https://eusxbcbwyhjtfjplwtst.supabase.co',
  'your-secondary-supabase-anon-key'
);

const StorePage = () => {
  const { profile, loading } = useProfileData();
  const [error, setError] = useState('');
  const [stock, setStock] = useState<{ map: string; count: number }[]>([]);

  useEffect(() => {
    const fetchStock = async () => {
      const { data, error } = await secondarySupabase
        .from('keys')
        .select('map')
        .eq('status', 'Pending');

      if (error) {
        console.error('Error fetching stock:', error);
        setError('Failed to load stock');
      } else {
        const stockCount = data.reduce((acc, curr) => {
          acc[curr.map] = (acc[curr.map] || 0) + 1;
          return acc;
        }, {});
        setStock(Object.entries(stockCount).map(([map, count]) => ({ map, count })));
      }
    };

    fetchStock();
  }, []);

  const handlePurchase = async (map: string) => {
    try {
      const response = await fetch('/api/purchase-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ map }),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        alert('Key purchased successfully');
      }
    } catch (err) {
      console.error('Purchase error:', err);
      setError('Failed to purchase key');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return (
      <div className="p-4">
        <p>Please login to access the store</p>
        <DiscordLoginButton />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Store - Welcome, {profile.username || 'User'}
      </h1>
      <p>Balance: {profile.balance} THB</p>
      <div className="mt-4">
        {stock.map(({ map, count }) => (
          <div key={map} className="mb-2">
            <p>{map}: {count} in stock</p>
            <button
              onClick={() => handlePurchase(map)}
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              Buy {map} (100 THB)
            </button>
          </div>
        ))}
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default StorePage;
