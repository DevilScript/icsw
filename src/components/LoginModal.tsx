
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
import DiscordIcon from '@/components/icons/DiscordIcon';
import { useAuth } from '@/context/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginModal = ({ open, onOpenChange }: LoginModalProps) => {
  const { signInWithDiscord, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDiscordSignIn = async () => {
    try {
      await signInWithDiscord();
      onOpenChange(false);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Discord sign in failed",
        description: err.message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800/95 backdrop-blur-xl border border-pastelPink/30 sm:max-w-md rounded-xl shadow-[0_0_30px_rgba(255,179,209,0.2)]">
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
        
        <DialogHeader>
          <DialogTitle className="text-xl text-center text-white">Welcome Back</DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            Sign in to your MoyxHubs account
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-8">
          <Button 
            variant="outline" 
            className="border-pastelPink/30 text-white bg-gray-700/70 hover:bg-gray-600/70 transition-colors w-full max-w-xs"
            onClick={handleDiscordSignIn}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <DiscordIcon className="mr-2 h-4 w-4" />
                Continue with Discord
              </>
            )}
          </Button>
        </div>
        
        <DialogFooter className="flex justify-center">
          <p className="text-sm text-gray-400">
            By continuing, you agree to MoyxHubs' Terms of Service and Privacy Policy
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
