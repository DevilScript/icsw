
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuth } from '@/context/auth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LogoW from './icons/LogoW';
import DiscordIcon from './icons/DiscordIcon';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginModal = ({ open, onOpenChange }: LoginModalProps) => {
  const { signInWithDiscord, loading } = useAuth();
  const navigate = useNavigate();

  const handleDiscordSignIn = async () => {
    await signInWithDiscord();
    onOpenChange(false);
  };

  const navigateToAuthPage = () => {
    onOpenChange(false);
    navigate('/auth');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800/95 backdrop-blur-xl border border-pastelPink/30 sm:max-w-md rounded-xl shadow-[0_0_30px_rgba(255,179,209,0.2)] overflow-hidden">
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
        
        {/* Animated border effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-pastelPink/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-pastelPink/50 to-transparent"></div>
          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-pastelPink/50 to-transparent"></div>
          <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-pastelPink/50 to-transparent"></div>
        </div>
        
        <DialogHeader>
          <motion.div 
            className="flex justify-center mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <LogoW className="h-10 w-10 text-pastelPink" />
          </motion.div>
          
          <DialogTitle className="text-xl text-center text-white">Welcome Back</DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            Sign in to your ICSW account
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          <Button 
            onClick={handleDiscordSignIn}
            className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <DiscordIcon className="mr-2 h-5 w-5" />
                Continue with Discord
              </>
            )}
          </Button>
        </div>
        
        <DialogFooter className="flex justify-center">
          <p className="text-sm text-gray-400">
            By continuing, you agree to ICSW's Terms of Service
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
