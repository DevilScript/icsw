
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/auth';
import { motion } from "framer-motion";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, RefreshCw } from 'lucide-react';

const ResetHWIDPage = () => {
  const [resetting, setResetting] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  
  const { user, userKeys } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to reset your HWID",
        variant: "destructive"
      });
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleReset = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to reset your HWID",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    
    if (!userKeys || userKeys.length === 0) {
      toast({
        title: "No key found",
        description: "You don't have any keys to reset",
        variant: "destructive"
      });
      return;
    }
    
    setResetting(true);
    try {
      const { data, error } = await supabase.functions.invoke('reset-hwid', {
        body: { user_id: user.id }
      });
      
      if (error) throw error;
      
      if (data.success) {
        toast({
          title: "HWID Reset successful!",
          description: "You can now use your key on a different device",
          className: "bg-gray-800 border-green-500 text-white",
        });
        setResetComplete(true);
      } else {
        toast({
          title: "HWID Reset failed",
          description: data.message || "Please try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error during HWID reset:', error);
      toast({
        title: "HWID Reset failed",
        description: error.message || "An error occurred during reset",
        variant: "destructive"
      });
    } finally {
      setResetting(false);
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
            <h1 className="text-2xl font-bold text-center mb-2">Reset HWID</h1>
            <p className="text-center text-gray-400 mb-8">
              Reset your hardware ID to use your key on a different device
            </p>
            
            {!user ? (
              <div className="text-center">
                <p className="text-gray-400 mb-4">Please login to continue</p>
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-pastelPink hover:bg-pastelPink/80 text-black font-medium"
                >
                  Login
                </Button>
              </div>
            ) : !userKeys || userKeys.length === 0 ? (
              <div className="text-center">
                <p className="text-gray-400 mb-4">You don't have any keys to reset</p>
                <Button 
                  onClick={() => navigate('/store')}
                  className="bg-pastelPink hover:bg-pastelPink/80 text-black font-medium"
                >
                  Buy a Script
                </Button>
              </div>
            ) : resetComplete ? (
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                    <RefreshCw className="h-8 w-8 text-green-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Reset Complete!</h3>
                <p className="text-gray-400 mb-6">
                  Your key has been reset and can now be used on a different device.
                </p>
                <Button 
                  onClick={() => navigate('/scripts')}
                  className="bg-pastelPink hover:bg-pastelPink/80 text-black font-medium"
                >
                  Go to Scripts
                </Button>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Your Key</h3>
                  <div className="bg-gray-900/50 border border-pastelPink/20 rounded p-3 font-mono text-sm overflow-x-auto">
                    {userKeys[0].key_value}
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Purchased Maps</h3>
                    <ul className="list-disc pl-5">
                      {userKeys[0].maps.map((map, index) => (
                        <li key={index} className="text-gray-300">{map}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="border-t border-pastelPink/10 pt-6">
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-4 mb-6">
                    <p className="text-yellow-300 text-sm">
                      <strong>Warning:</strong> You can only reset your HWID once per day. Make sure you need to do this before proceeding.
                    </p>
                  </div>
                  
                  <Button
                    onClick={handleReset}
                    disabled={resetting}
                    className="w-full bg-pastelPink hover:bg-pastelPink/80 text-black font-medium"
                  >
                    {resetting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reset HWID
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default ResetHWIDPage;
