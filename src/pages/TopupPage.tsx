import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TopupPage = () => {
  const { user, userBalance, refreshUserData } = useAuth();
  const [voucher, setVoucher] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBalanceAnimation, setShowBalanceAnimation] = useState(false);
  const [oldBalance, setOldBalance] = useState(0);
  const [newBalance, setNewBalance] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (userBalance) {
      setNewBalance(userBalance.balance);
    }
  }, [userBalance]);

  useEffect(() => {
    if (!user && !loading) {
      toast({
        title: 'Authentication required',
        description: 'Please login to access this page',
        variant: 'destructive',
      });
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const extractVoucherFromUrl = (input: string): string => {
    // Check if input is a URL and extract the voucher code
    if (input.includes('gift.truemoney.com')) {
      const urlParams = new URLSearchParams(input.split('?')[1] || '');
      return urlParams.get('v') || input;
    }
    return input;
  };

  const handleVoucherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.trim();
    const cleanedVoucher = extractVoucherFromUrl(input).replace(/[^a-zA-Z0-9]/g, '');
    setVoucher(cleanedVoucher);
  };

  const validateVoucher = (code: string) => {
    const regex = /^[a-zA-Z0-9]{18}$|^[a-zA-Z0-9]{35}$/;
    if (!regex.test(code)) {
      toast({
        title: 'Invalid voucher',
        description: 'Voucher must be 18 or 35 characters (letters and numbers only). Example: 019629c02c5071adbf9e8a88ba65887ed22',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const handleTopup = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please login to topup your account',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    if (!voucher) {
      toast({
        title: 'Voucher required',
        description: 'Please enter a TrueMoney voucher code',
        variant: 'destructive',
      });
      return;
    }

    if (!validateVoucher(voucher)) {
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      if (userBalance) {
        setOldBalance(userBalance.balance);
      }

      const { data, error } = await supabase.functions.invoke('redeem-truemoney', {
        body: { voucher_code: voucher, user_id: user.id },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (error) {
        throw new Error(error.message || 'Unknown error');
      }

      if (data.success) {
        setShowBalanceAnimation(true);
        setNewBalance(oldBalance + data.amount);
        toast({
          title: 'Topup successful!',
          description: `Added ${data.amount} THB to your account`,
          className: 'bg-gray-800 border-green-500 text-white',
        });
        setVoucher('');
        await refreshUserData();
        setTimeout(() => setShowBalanceAnimation(false), 3000);
      } else {
        const errorMessage =
          data.message === 'VOUCHER_ALREADY_REDEEMED'
            ? 'This voucher has already been used.'
            : data.message === 'INVALID_VOUCHER'
            ? 'The voucher code is invalid. Please check and try again.'
            : data.message || 'Failed to redeem voucher. Please try again.';
        toast({
          title: 'Topup failed',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Error during topup:', error);
      toast({
        title: 'Topup failed',
        description:
          error.name === 'AbortError'
            ? 'Request timed out. Please try again.'
            : error.message || 'An error occurred during topup',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

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
        .section-hover:hover {
          background-color: rgba(255, 179, 209, 0.05);
          box-shadow: 0 0 20px rgba(255, 179, 209, 0.2);
          transform: translateY(-2px);
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
            className="max-w-md mx-auto glass-effect border border-pastelPink/30 p-8 rounded-xl shadow-[0_0_20px_rgba(255,179,209,0.15)]"
          >
            <h1 className="text-2xl font-bold text-center mb-2">Topup Your Account</h1>

            <div className="text-center mb-6">
              <p className="text-gray-400">Current Balance</p>
              <AnimatePresence mode="wait">
                {showBalanceAnimation ? (
                  <motion.div
                    key="balance-animation"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative h-10"
                  >
                    <motion.p
                      initial={{ y: 0, opacity: 1 }}
                      animate={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-2xl font-bold text-pastelPink absolute w-full"
                    >
                      {oldBalance.toFixed(2)} THB
                    </motion.p>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="text-2xl font-bold text-pastelPink absolute w-full"
                    >
                      {newBalance.toFixed(2)} THB
                    </motion.p>
                  </motion.div>
                ) : (
                  <motion.p
                    key="balance-static"
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    className="text-2xl font-bold text-pastelPink"
                  >
                    {userBalance ? userBalance.balance.toFixed(2) : '0.00'} THB
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  TrueMoney Voucher Code
                </label>
                <Input
                  value={voucher}
                  onChange={handleVoucherChange}
                  placeholder="e.g., 019629c02c5071adbf9e8a88ba65887ed22"
                  className="bg-gray-900/50 border-pastelPink/30 focus:border-pastelPink"
                  maxLength={35}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {voucher.length}/35 characters entered. Enter the voucher code only (letters and numbers). If you have a URL, copy the code after "?v=".
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