
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TopupPage = () => {
  const { user, userBalance, refreshUserData } = useAuth();
  const [voucher, setVoucher] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user && !loading) {
      toast({
        title: "Authentication required",
        description: "Please login to access this page",
        variant: "destructive"
      });
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleVoucherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoucher(e.target.value);
  };

  const validateVoucher = (code: string) => {
    const regex = /^[a-zA-Z0-9]{18}$/;
    return regex.test(code);
  };

  const handleTopup = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to topup your account",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    if (!voucher) {
      toast({
        title: "Voucher required",
        description: "Please enter a TrueMoney voucher code",
        variant: "destructive"
      });
      return;
    }

    if (!validateVoucher(voucher)) {
      toast({
        title: "Invalid voucher",
        description: "Please enter a valid 18-character TrueMoney voucher code",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('redeem-truemoney', {
        body: { voucher_code: voucher, user_id: user.id }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Topup successful!",
          description: `Added ${data.amount} THB to your account`,
          className: "bg-gray-800 border-green-500 text-white",
        });
        setVoucher('');
        await refreshUserData();
      } else {
        toast({
          title: "Topup failed",
          description: data.message || "Please try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error during topup:', error);
      toast({
        title: "Topup failed",
        description: error.message || "An error occurred during topup",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-deepBlack via-darkGray/70 to-deepBlack text-white">
      {/* Custom cursor */}
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
      
      {/* Background elements */}
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
            className="max-w-md mx-auto glass-effect border border-pastelPink/30 p-8 rounded-xl shadow-[0_0_20px_rgba(255,179,209,0.15)]"
          >
            <h1 className="text-2xl font-bold text-center mb-2">Topup Your Account</h1>
            
            {userBalance && (
              <div className="text-center mb-6">
                <p className="text-gray-400">Current Balance</p>
                <p className="text-2xl font-bold text-pastelPink">{userBalance.balance.toFixed(2)} THB</p>
              </div>
            )}
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  TrueMoney Voucher Code
                </label>
                <Input 
                  value={voucher}
                  onChange={handleVoucherChange}
                  placeholder="Enter 18-character code"
                  className="bg-gray-900/50 border-pastelPink/30 focus:border-pastelPink"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Enter the code from your TrueMoney gift voucher
                </p>
              </div>
              
              <Button
                onClick={handleTopup}
                disabled={loading || !voucher}
                className="w-full bg-pastelPink hover:bg-pastelPink/80 text-black font-medium"
              >
                {loading ? 'Processing...' : 'Add Funds'}
              </Button>
              
              <div className="text-center text-sm text-gray-400">
                <p>Need help? Contact support via Discord</p>
              </div>
            </div>
          </motion.div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default TopupPage;
