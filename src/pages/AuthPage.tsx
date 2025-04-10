
import React, { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, X } from 'lucide-react';
import DiscordIcon from '@/components/icons/DiscordIcon';
import { motion } from 'framer-motion';
import LogoW from '@/components/icons/LogoW';

const AuthPage = () => {
  const { signInWithDiscord, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleDiscordSignIn = async () => {
    try {
      await signInWithDiscord();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Discord sign in failed",
        description: err.message,
      });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-deepBlack via-darkGray/70 to-deepBlack flex items-center justify-center p-4">
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
      
      {/* Background effects */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pastelPink/5 rounded-full filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gray-600/5 rounded-full filter blur-[80px]"></div>
      </div>
      
      <motion.div 
        className="w-full max-w-md z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className="bg-gray-800/40 backdrop-blur-md border border-pastelPink/20 shadow-[0_0_15px_rgba(255,179,209,0.15)] relative overflow-hidden">
            {/* Animated border effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-pastelPink/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-pastelPink/50 to-transparent"></div>
              <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-pastelPink/50 to-transparent"></div>
              <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-pastelPink/50 to-transparent"></div>
            </div>
            
            {/* Close button in the top right corner */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-2 text-gray-400 hover:text-white hover:bg-gray-700/50 z-10"
              onClick={() => navigate('/')}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <CardHeader className="space-y-1 relative">
              <motion.div 
                className="flex justify-center mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <LogoW className="h-12 w-12 text-pastelPink" />
              </motion.div>
              
              <CardTitle className="text-2xl text-center text-white">
                Welcome to <span className="text-white">ICS</span><span className="text-pastelPink">W</span>
              </CardTitle>
              <CardDescription className="text-center text-gray-400">
                Connect with your Discord account
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex flex-col items-center justify-center py-6 space-y-6">
              <motion.div 
                className="flex flex-col w-full gap-6"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  type="button"
                  className="w-full bg-[#5865F2] hover:bg-[#4752C4] transition-colors py-6 text-white border-none"
                  onClick={handleDiscordSignIn}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <DiscordIcon className="mr-2 h-5 w-5" />
                      Continue with Discord
                    </>
                  )}
                </Button>
              </motion.div>
              
              <motion.div 
                className="w-full max-w-xs mx-auto"
                variants={itemVariants}
              >
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700/50"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-gray-800/70 px-2 text-gray-400">Secure Connection</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.p 
                className="text-sm text-gray-400 text-center"
                variants={itemVariants}
              >
                By continuing, you agree to ICSW's Terms of Service
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
