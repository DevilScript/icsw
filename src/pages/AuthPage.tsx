
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, LogIn, User, X } from 'lucide-react';
import DiscordIcon from '@/components/icons/DiscordIcon';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const { signIn, signUp, signInWithDiscord, resetPassword, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const getTabFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') || 'signin';
  };

  const [activeTab, setActiveTab] = useState(getTabFromUrl());

  useEffect(() => {
    setActiveTab(getTabFromUrl());
  }, [location]);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    
    if (!email || !password) {
      setAuthError('Please enter both email and password');
      return;
    }
    
    if (!nickname) {
      setAuthError('Please enter a nickname');
      return;
    }
    
    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters');
      return;
    }
    
    try {
      const { error } = await signUp(email, password, nickname);
      if (error) {
        setAuthError(error.message);
        toast({
          variant: "destructive",
          title: "Sign up failed",
          description: error.message,
        });
      } else {
        toast({
          title: "Account created",
          description: "Please check your email to confirm your account.",
        });
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    
    if (!email) {
      setAuthError('Please enter your email address');
      return;
    }
    
    try {
      const { error } = await resetPassword(email);
      if (error) {
        setAuthError(error.message);
        toast({
          variant: "destructive",
          title: "Password reset failed",
          description: error.message,
        });
      } else {
        toast({
          title: "Password reset email sent",
          description: "Please check your email for instructions to reset your password.",
        });
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
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Discord sign in failed",
        description: err.message,
      });
    }
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
      
      <div className="w-full max-w-md">
        <Card className="bg-gray-800/40 backdrop-blur-md border border-pastelPink/20 shadow-[0_0_15px_rgba(255,179,209,0.15)] relative">
          {/* Close button in the top right corner */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2 text-gray-400 hover:text-white hover:bg-gray-700/50"
            onClick={() => navigate('/')}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">Welcome to <span className="text-white">Moyx</span><span className="text-pastelPink">Hubs</span></CardTitle>
            <CardDescription className="text-center text-gray-400">
              {activeTab === 'signin' && "Sign in to your account"}
              {activeTab === 'signup' && "Create a new account"}
            </CardDescription>
          </CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-700/50 border border-pastelPink/20">
              <TabsTrigger value="signin" className="data-[state=active]:bg-gray-600/50 data-[state=active]:text-pastelPink">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-gray-600/50 data-[state=active]:text-pastelPink">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
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
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Password</Label>
                    <Input 
                      id="password" 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-gray-900/50 border-pastelPink/30 text-white focus:border-pastelPink/50"
                      disabled={loading}
                    />
                    <div className="flex justify-end">
                      <Button 
                        variant="link" 
                        type="button"
                        className="text-xs text-pastelPink hover:text-white transition-colors p-0 h-auto"
                        onClick={handleForgotPassword}
                      >
                        Forgot password?
                      </Button>
                    </div>
                  </div>
                  {authError && (
                    <div className="text-red-400 text-sm mt-2">{authError}</div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-gray-700/90 hover:bg-gray-600/90 text-white border border-pastelPink/30 shadow-[0_0_10px_rgba(255,179,209,0.15)]"
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
                  
                  <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-gray-800/40 px-2 text-gray-400">Or continue with</span>
                    </div>
                  </div>
                  
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full border-pastelPink/30 text-white bg-gray-700/70 hover:bg-gray-600/70 transition-colors"
                    onClick={handleDiscordSignIn}
                    disabled={loading}
                  >
                    <DiscordIcon className="mr-2 h-4 w-4" />
                    Discord
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="nickname" className="text-white">Nickname</Label>
                    <Input 
                      id="nickname" 
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="Your nickname"
                      className="bg-gray-900/50 border-pastelPink/30 text-white focus:border-pastelPink/50"
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
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
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Password</Label>
                    <Input 
                      id="password" 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-gray-900/50 border-pastelPink/30 text-white focus:border-pastelPink/50"
                      disabled={loading}
                    />
                    <p className="text-xs text-gray-400">Password must be at least 6 characters</p>
                  </div>
                  {authError && (
                    <div className="text-red-400 text-sm mt-2">{authError}</div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-gray-700/90 hover:bg-gray-600/90 text-white border border-pastelPink/30 shadow-[0_0_10px_rgba(255,179,209,0.15)]"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        <User className="mr-2 h-4 w-4" />
                        Create Account
                      </>
                    )}
                  </Button>
                  
                  <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-gray-800/40 px-2 text-gray-400">Or continue with</span>
                    </div>
                  </div>
                  
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full border-pastelPink/30 text-white bg-gray-700/70 hover:bg-gray-600/70 transition-colors"
                    onClick={handleDiscordSignIn}
                    disabled={loading}
                  >
                    <DiscordIcon className="mr-2 h-4 w-4" />
                    Discord
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
