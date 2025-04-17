import { useEffect, useState } from 'react';
import { useProfileData } from '../context/auth/useProfileData';
import { DiscordLoginButton } from '../components/DiscordLoginButton';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

const HistoryPage = () => {
  const { profile, loading } = useProfileData();
  const supabase = useSupabaseClient();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!profile) return;

      const { data, error } = await supabase
        .from('truemoney_transactions')
        .select('*')
        .eq('user_id', profile.user_id);

      if (error) {
        console.error('Error fetching transactions:', error);
        setError('Failed to load transaction history');
      } else {
        setTransactions(data || []);
      }
    };

    fetchTransactions();
  }, [profile, supabase]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return (
      <div className="p-4">
        <p>Please login to view history</p>
        <DiscordLoginButton />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Transaction History - {profile.username || 'User'}
      </h1>
      <div className="mt-4">
        {transactions.length === 0 ? (
          <p>No transactions found</p>
        ) : (
          transactions.map((tx) => (
            <div key={tx.id} className="mb-2 p-2 border rounded">
              <p>Amount: {tx.amount} THB</p>
              <p>Status: {tx.status}</p>
              <p>Date: {new Date(tx.created_at).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default HistoryPage;
