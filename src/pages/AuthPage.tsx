
import React, { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, X } from 'lucide-react';
import DiscordIcon from '@/components/icons/DiscordIcon';

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
              Sign in to your account
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="flex flex-col w-full gap-6">
              <Button 
                type="button"
                variant="outline" 
                className="w-full border-pastelPink/30 text-white bg-gray-700/70 hover:bg-gray-600/70 transition-colors py-6"
                onClick={handleDiscordSignIn}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <DiscordIcon className="mr-2 h-5 w-5" />
                    Continue with Discord
                  </>
                )}
              </Button>
            </div>
            
            <p className="text-sm text-gray-400 mt-4 text-center">
              By continuing, you agree to MoyxHubs' Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
