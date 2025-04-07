
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  React.useEffect(() => {
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
    
    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters');
      return;
    }
    
    try {
      const { error } = await signUp(email, password);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-deepBlack via-darkGray/70 to-deepBlack flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-gray-800/40 backdrop-blur-md border border-pastelPink/20 shadow-[0_0_15px_rgba(255,179,209,0.15)]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">Welcome to NeonScript</CardTitle>
            <CardDescription className="text-center text-gray-400">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <Tabs defaultValue="signin" className="w-full">
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
                  </div>
                  {authError && (
                    <div className="text-red-400 text-sm mt-2">{authError}</div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
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
                      'Sign In'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
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
                    <p className="text-xs text-gray-400">Password must be at least 6 characters</p>
                  </div>
                  {authError && (
                    <div className="text-red-400 text-sm mt-2">{authError}</div>
                  )}
                </CardContent>
                <CardFooter>
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
                      'Create Account'
                    )}
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
