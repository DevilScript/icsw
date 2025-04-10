
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, X, Mail, Key, Lock, User } from 'lucide-react';
import { motion } from 'framer-motion';
import LogoW from '@/components/icons/LogoW';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AuthPage = () => {
  const { signUp, signIn, resetPassword, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('signin');
  const [forgotPassword, setForgotPassword] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

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

  const handlePasswordReset = async () => {
    if (!email) {
      setAuthError('Please enter your email');
      return;
    }
    
    setAuthError(null);
    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        setAuthError(error.message);
      } else {
        toast({
          title: "Password reset email sent",
          description: "Please check your email to reset your password",
          className: "bg-gray-800 border border-pastelPink text-white",
        });
        setForgotPassword(false);
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Password reset failed",
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
                {forgotPassword 
                  ? "Reset your password" 
                  : activeTab === 'signin' 
                    ? "Sign in to your account" 
                    : "Create a new account"}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex flex-col items-center justify-center py-4 space-y-4">
              {authError && (
                <Alert variant="destructive" className="bg-red-900/40 border-red-500 text-white">
                  <AlertDescription>{authError}</AlertDescription>
                </Alert>
              )}
              
              {forgotPassword ? (
                <motion.div 
                  className="w-full space-y-4"
                  variants={itemVariants}
                >
                  <div className="space-y-2">
                    <Label htmlFor="reset-email" className="text-white">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input 
                        id="reset-email"
                        type="email"
                        placeholder="your@email.com"
                        className="bg-gray-900/50 border-pastelPink/30 focus:border-pastelPink pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button 
                      type="button"
                      className="w-full bg-pastelPink hover:bg-pastelPink/80 text-black font-medium"
                      onClick={handlePasswordReset}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Send Reset Link'
                      )}
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="text-gray-400 hover:text-white"
                      onClick={() => {
                        setForgotPassword(false);
                        setAuthError(null);
                      }}
                    >
                      Back to Sign In
                    </Button>
                  </div>
                </motion.div>
              ) : (
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
                      <Label htmlFor="email" className="text-white">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input 
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          className="bg-gray-900/50 border-pastelPink/30 focus:border-pastelPink pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="password" className="text-white">Password</Label>
                        <Button 
                          type="button" 
                          variant="link" 
                          className="text-pastelPink/80 hover:text-pastelPink p-0 h-auto text-xs"
                          onClick={() => {
                            setForgotPassword(true);
                            setAuthError(null);
                          }}
                        >
                          Forgot password?
                        </Button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input 
                          id="password"
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
                  </TabsContent>
                  
                  <TabsContent value="signup" className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-white">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input 
                          id="signup-email"
                          type="email"
                          placeholder="your@email.com"
                          className="bg-gray-900/50 border-pastelPink/30 focus:border-pastelPink pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="nickname" className="text-white">Nickname</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input 
                          id="nickname"
                          type="text"
                          placeholder="Your nickname"
                          className="bg-gray-900/50 border-pastelPink/30 focus:border-pastelPink pl-10"
                          value={nickname}
                          onChange={(e) => setNickname(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-white">Password</Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input 
                          id="signup-password"
                          type="password"
                          placeholder="••••••••"
                          className="bg-gray-900/50 border-pastelPink/30 focus:border-pastelPink pl-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-white">Confirm Password</Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input 
                          id="confirm-password"
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
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-center pt-2 pb-6">
              <p className="text-sm text-gray-400 text-center">
                By continuing, you agree to ICSW's Terms of Service
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
