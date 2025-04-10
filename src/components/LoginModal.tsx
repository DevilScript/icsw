
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, User } from "lucide-react";
import { useAuth } from '@/context/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import LogoW from './icons/LogoW';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginModal = ({ open, onOpenChange }: LoginModalProps) => {
  const { signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('signin');

  const handleSignIn = async () => {
    if (!email || !password) {
      setAuthError('Please fill in all fields');
      return;
    }
    
    setAuthError(null);
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setAuthError(error.message);
      } else {
        onOpenChange(false);
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: err.message,
      });
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword || !nickname) {
      setAuthError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setAuthError('Passwords do not match');
      return;
    }
    
    setAuthError(null);
    try {
      const { error } = await signUp(email, password, nickname);
      
      if (error) {
        setAuthError(error.message);
      } else {
        toast({
          title: "Account created",
          description: "Please check your email to verify your account",
          className: "bg-gray-800 border border-pastelPink text-white",
        });
        setActiveTab('signin');
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: err.message,
      });
    }
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
        
        <div className="flex flex-col items-center justify-center py-4 space-y-4">
          {authError && (
            <Alert variant="destructive" className="bg-red-900/40 border-red-500 text-white">
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}
          
          <Tabs 
            defaultValue="signin" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-gray-900/50">
              <TabsTrigger value="signin" className="data-[state=active]:bg-pastelPink/20">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-pastelPink/20">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="modal-email" className="text-white">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    id="modal-email"
                    type="email"
                    placeholder="your@email.com"
                    className="bg-gray-900/50 border-pastelPink/30 focus:border-pastelPink pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="modal-password" className="text-white">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    id="modal-password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-gray-900/50 border-pastelPink/30 focus:border-pastelPink pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                type="button"
                className="w-full bg-pastelPink hover:bg-pastelPink/80 text-black font-medium"
                onClick={handleSignIn}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
              
              <div className="flex justify-center">
                <Button 
                  type="button" 
                  variant="link" 
                  className="text-pastelPink/80 hover:text-pastelPink"
                  onClick={navigateToAuthPage}
                >
                  Need more options?
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="signup" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="modal-signup-email" className="text-white">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    id="modal-signup-email"
                    type="email"
                    placeholder="your@email.com"
                    className="bg-gray-900/50 border-pastelPink/30 focus:border-pastelPink pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="modal-nickname" className="text-white">Nickname</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    id="modal-nickname"
                    type="text"
                    placeholder="Your nickname"
                    className="bg-gray-900/50 border-pastelPink/30 focus:border-pastelPink pl-10"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="modal-signup-password" className="text-white">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    id="modal-signup-password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-gray-900/50 border-pastelPink/30 focus:border-pastelPink pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="modal-confirm-password" className="text-white">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    id="modal-confirm-password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-gray-900/50 border-pastelPink/30 focus:border-pastelPink pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                type="button"
                className="w-full bg-pastelPink hover:bg-pastelPink/80 text-black font-medium"
                onClick={handleSignUp}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
              
              <div className="flex justify-center">
                <Button 
                  type="button" 
                  variant="link" 
                  className="text-pastelPink/80 hover:text-pastelPink"
                  onClick={navigateToAuthPage}
                >
                  Need more options?
                </Button>
              </div>
            </TabsContent>
          </Tabs>
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
