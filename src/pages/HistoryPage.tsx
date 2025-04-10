import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/auth';
import { motion } from "framer-motion";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getUserTransactions } from '@/integrations/supabase/client';
import { History, Download, ArrowDown, ArrowUp } from 'lucide-react';
import { format } from 'date-fns';
import { Transaction } from '@/context/auth/types';

const HistoryPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      toast({
        title: "Authentication required",
        description: "Please login to view your history",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    
    const fetchTransactions = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await getUserTransactions(user.id);
        if (error) throw error;
        
        if (data && Array.isArray(data)) {
          const validTransactionData = data.filter((tx): tx is NonNullable<typeof tx> => 
            tx !== null && 
            typeof tx === 'object' &&
            'id' in tx && 
            'user_id' in tx && 
            'amount' in tx && 
            'transaction_type' in tx &&
            'created_at' in tx
          );
          
          const validTransactions: Transaction[] = validTransactionData.map(tx => {
            return {
              id: String(tx.id),
              user_id: String(tx.user_id),
              amount: Number(tx.amount),
              transaction_type: String(tx.transaction_type),
              description: tx.description ? String(tx.description) : '',
              voucher_code: tx.voucher_code ? String(tx.voucher_code) : undefined,
              created_at: String(tx.created_at)
            };
          });
          
          setTransactions(validTransactions);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast({
          title: "Failed to load history",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, [user]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-deepBlack via-darkGray/70 to-deepBlack text-white flex justify-center items-center">
        <div className="animate-spin text-pastelPink">
          <History size={32} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-deepBlack via-darkGray/70 to-deepBlack text-white">
      <style>
        {`
        body {
          cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'><circle cx='8' cy='8' r='6' fill='rgba(255,179,209,0.5)' /></svg>"), auto;
        }
        a, button, [role="button"], select, input, label {
          cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'><circle cx='10' cy='10' r='8' fill='rgba(255,179,209,0.8)' /></svg>"), pointer !important;
        }
        `}
      </style>
      
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-pastelPink/5 rounded-full filter blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-gray-500/5 rounded-full filter blur-[100px]"></div>
      </div>
      
      <div className="relative z-10">
        <Navbar onLoginClick={() => navigate('/auth')} />
        
        <div className="container mx-auto px-4 pt-32 pb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-3xl font-bold text-center mb-2">Transaction History</h1>
            <p className="text-center text-gray-400 mb-8">View your past purchases and topups</p>
            
            <div className="glass-effect border border-pastelPink/30 p-6 rounded-xl shadow-[0_0_20px_rgba(255,179,209,0.15)]">
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <Download className="h-12 w-12 mx-auto mb-3 text-gray-500" />
                  <p className="text-gray-400">No transactions found</p>
                  <Button 
                    variant="link" 
                    onClick={() => navigate('/topup')}
                    className="text-pastelPink mt-2"
                  >
                    Make your first topup
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border border-pastelPink/10 p-4 rounded-lg bg-gray-900/30 flex justify-between items-center"
                    >
                      <div>
                        <div className="flex items-center">
                          {transaction.amount > 0 ? (
                            <ArrowDown className="h-4 w-4 mr-2 text-green-400" />
                          ) : (
                            <ArrowUp className="h-4 w-4 mr-2 text-pastelPink" />
                          )}
                          <span className="font-medium">
                            {transaction.description || 
                              (transaction.transaction_type === 'topup' ? 'Added funds' : 'Purchase')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                          {format(new Date(transaction.created_at), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                      <div className={`font-semibold ${transaction.amount > 0 ? 'text-green-400' : 'text-pastelPink'}`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)} THB
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default HistoryPage;
