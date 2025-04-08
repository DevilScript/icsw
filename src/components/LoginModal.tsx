
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Github, LogIn, Loader2, KeyRound, Instagram, Discord } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginModal = ({ open, onOpenChange }: LoginModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const { signIn, signInWithDiscord, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    
    if (!email || !password) {
      setAuthError('Please enter both email and password');
      return;
    }
    
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setAuthError(error.message);
        toast({
          variant: "destructive",
          title: "Sign in failed",
          description: error.message,
        });
      } else {
        onOpenChange(false); // Close the modal on success
        navigate('/'); // Redirect to home page
      }
    } catch (err: any) {
      setAuthError(err.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    }
  };

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

  const navigateToSignUp = () => {
    onOpenChange(false); // Close the modal
    navigate('/auth?tab=signup'); // Navigate to auth page with signup tab active
  };

  const navigateToForgotPassword = () => {
    onOpenChange(false); // Close the modal
    navigate('/auth?tab=forgot-password'); // Navigate to auth page with forgot password tab active
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800/95 backdrop-blur-xl border border-pastelPink/30 sm:max-w-md rounded-xl shadow-[0_0_30px_rgba(255,179,209,0.2)]">
        <DialogHeader>
          <DialogTitle className="text-xl text-center text-white">Welcome Back</DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            Sign in to your MoyxHubs account
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSignIn} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-gray-900/50 border-pastelPink/30 text-white focus:border-pastelPink/50"
              disabled={loading}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="password" className="text-white">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-900/50 border-pastelPink/30 text-white focus:border-pastelPink/50"
              disabled={loading}
            />
          </div>
          
          {authError && (
            <div className="text-red-400 text-sm">{authError}</div>
          )}
          
          <Button 
            type="submit"
            className="bg-gray-700/90 hover:bg-gray-600/90 text-white border border-pastelPink/30 w-full shadow-[0_0_10px_rgba(255,179,209,0.15)]"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </>
            )}
          </Button>
          
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-gray-800 px-2 text-gray-400">Or continue with</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="border-pastelPink/30 text-white bg-gray-700/70 hover:bg-gray-600/70 transition-colors w-full"
            onClick={handleDiscordSignIn}
            disabled={loading}
          >
            <Discord className="mr-2 h-4 w-4" />
            Discord
          </Button>
        </form>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button 
            variant="link" 
            className="text-pastelPink hover:text-white transition-colors"
            onClick={navigateToForgotPassword}
          >
            <KeyRound className="mr-2 h-4 w-4" />
            Forgot password?
          </Button>
          <Button 
            variant="link" 
            onClick={navigateToSignUp}
            className="text-pastelPink hover:text-white transition-colors"
          >
            Create account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
