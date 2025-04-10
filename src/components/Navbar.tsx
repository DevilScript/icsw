
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  User, 
  Menu, 
  X, 
  LogOut,
  CreditCard,
  ShoppingCart,
  Clock,
  RefreshCw,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '@/context/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface NavbarProps {
  onLoginClick: () => void;
}

const Navbar = ({ onLoginClick }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSupportDialogOpen, setIsSupportDialogOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [discordId, setDiscordId] = useState('');
  const [sendingSupport, setSendingSupport] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { user, userProfile, userBalance, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Track scroll position to change navbar background
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleSupportSubmit = async () => {
    if (!supportMessage.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a message",
        variant: "destructive"
      });
      return;
    }

    const userIdentifier = user ? (userProfile?.nickname || user.email) : discordId;
    
    if (!user && !discordId.trim()) {
      toast({
        title: "Discord ID required",
        description: "Please enter your Discord ID",
        variant: "destructive"
      });
      return;
    }

    setSendingSupport(true);
    try {
      const response = await fetch("https://discordapp.com/api/webhooks/1359627280980377780/EJoE6FIUTwpmzI_MD9CFCdeA1ers_nKTfHcBw9NIuCn0r_-uY6Ifqbq0YX2RDkA0-id_", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          embeds: [{
            title: "Support Request",
            description: supportMessage,
            color: 16738740, // Pastel pink
            fields: [
              {
                name: "User",
                value: userIdentifier,
                inline: true
              },
              {
                name: "Status",
                value: user ? "Logged In" : "Not Logged In",
                inline: true
              },
              {
                name: "Page",
                value: location.pathname,
                inline: true
              }
            ],
            timestamp: new Date().toISOString()
          }]
        }),
      });

      if (response.ok) {
        toast({
          title: "Support request sent",
          description: "We'll get back to you soon!",
          className: "bg-gray-800 border-green-500 text-white",
        });
        setIsSupportDialogOpen(false);
        setSupportMessage('');
        setDiscordId('');
      } else {
        throw new Error("Failed to send support request");
      }
    } catch (error) {
      console.error("Error sending support:", error);
      toast({
        title: "Failed to send",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setSendingSupport(false);
    }
  };

  // Get avatar from Discord if available
  const getAvatarUrl = () => {
    if (user?.app_metadata?.provider === 'discord' && user?.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url;
    }
    return null;
  };

  // Get display name
  const getDisplayName = () => {
    // First try to get from our profile table
    if (userProfile?.nickname) {
      return userProfile.nickname;
    }
    
    // Then try Discord display name
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    
    // Finally fallback to email
    return user?.email?.split('@')[0] || 'Account';
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/40 backdrop-blur-lg border-b border-pastelPink/20' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="font-bold text-xl text-white">
              ICS<span className="text-pastelPink">W</span>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center justify-center space-x-8 flex-1">
            <a href="#scripts" className="text-white hover:text-pastelPink transition-colors">
              Scripts
            </a>
            <Link to="/store" className="text-white hover:text-pastelPink transition-colors">
              Store
            </Link>
            <Link to="/topup" className="text-white hover:text-pastelPink transition-colors">
              Topup
            </Link>
            <a href="#support" className="text-white hover:text-pastelPink transition-colors">
              Support
            </a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-pastelPink hover:bg-black/30"
              onClick={() => setIsSupportDialogOpen(true)}
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    className="bg-gray-800/70 hover:bg-gray-700/80 text-white border border-pastelPink/30 rounded-md shadow-[0_0_10px_rgba(255,179,209,0.15)]"
                  >
                    {getAvatarUrl() ? (
                      <Avatar className="h-5 w-5 mr-2">
                        <AvatarImage src={getAvatarUrl() || ""} />
                        <AvatarFallback className="bg-gray-700 text-pastelPink text-xs">
                          {getDisplayName().substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <User className="mr-2 h-4 w-4" />
                    )}
                    {getDisplayName()}
                    {userBalance && (
                      <span className="ml-2 text-pastelPink font-semibold">
                        {userBalance.balance.toFixed(2)} THB
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800/95 backdrop-blur-xl border border-pastelPink/30 text-white">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  
                  <DropdownMenuItem 
                    className="hover:bg-gray-700 cursor-pointer"
                    onClick={() => navigate('/topup')}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Topup
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    className="hover:bg-gray-700 cursor-pointer"
                    onClick={() => navigate('/history')}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    History
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    className="hover:bg-gray-700 cursor-pointer"
                    onClick={() => navigate('/reset-hwid')}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset HWID
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className="bg-gray-700" />
                  
                  <DropdownMenuItem 
                    className="hover:bg-gray-700 cursor-pointer"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                className="bg-gray-800/70 hover:bg-gray-700/80 text-white border border-pastelPink/30 rounded-md shadow-[0_0_10px_rgba(255,179,209,0.15)]"
                onClick={() => navigate('/auth')}
              >
                <User className="mr-2 h-4 w-4" />
                Login
              </Button>
            )}
          </div>
          
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-lg border-b border-pastelPink/20 py-4 px-4 animate-fade-in">
          <div className="flex flex-col space-y-4">
            <a 
              href="#scripts" 
              className="text-white hover:text-pastelPink px-3 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Scripts
            </a>
            <Link 
              to="/store" 
              className="text-white hover:text-pastelPink px-3 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Store
            </Link>
            <Link 
              to="/topup" 
              className="text-white hover:text-pastelPink px-3 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Topup
            </Link>
            <a 
              href="#support" 
              className="text-white hover:text-pastelPink px-3 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Support
            </a>
            
            <div className="pt-2 space-y-2">
              <button 
                className="text-white hover:text-pastelPink px-3 py-2 rounded-md flex items-center w-full"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsSupportDialogOpen(true);
                }}
              >
                <MessageCircle className="h-5 w-5 mr-2" /> Contact Support
              </button>
              
              {user ? (
                <>
                  {userBalance && (
                    <div className="px-3 py-2 text-pastelPink font-semibold">
                      Balance: {userBalance.balance.toFixed(2)} THB
                    </div>
                  )}
                  
                  <Link 
                    to="/history" 
                    className="text-white hover:text-pastelPink px-3 py-2 rounded-md flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Clock className="h-5 w-5 mr-2" /> History
                  </Link>
                  
                  <Link 
                    to="/reset-hwid" 
                    className="text-white hover:text-pastelPink px-3 py-2 rounded-md flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <RefreshCw className="h-5 w-5 mr-2" /> Reset HWID
                  </Link>
                  
                  <Button 
                    className="bg-gray-800/70 hover:bg-gray-700/80 text-white border border-pastelPink/30 rounded-md w-full mt-2 shadow-[0_0_10px_rgba(255,179,209,0.15)]"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleSignOut();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button 
                  className="bg-gray-800/70 hover:bg-gray-700/80 text-white border border-pastelPink/30 rounded-md w-full mt-2 shadow-[0_0_10px_rgba(255,179,209,0.15)]"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/auth');
                  }}
                >
                  <User className="mr-2 h-4 w-4" />
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Support Dialog */}
      <Dialog open={isSupportDialogOpen} onOpenChange={setIsSupportDialogOpen}>
        <DialogContent className="bg-gray-800/95 backdrop-blur-xl border border-pastelPink/30 text-white">
          <DialogHeader>
            <DialogTitle>Contact Support</DialogTitle>
            <DialogDescription className="text-gray-400">
              Send us a message and we'll get back to you as soon as possible.
            </DialogDescription>
          </DialogHeader>
          
          {!user && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Discord ID
              </label>
              <Input 
                value={discordId}
                onChange={e => setDiscordId(e.target.value)}
                placeholder="Moyx#5001"
                className="bg-gray-900/50 border-pastelPink/30 focus:border-pastelPink"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Message
            </label>
            <Textarea 
              value={supportMessage}
              onChange={e => setSupportMessage(e.target.value)}
              placeholder="Here"
              className="min-h-[100px] bg-gray-900/50 border-pastelPink/30 focus:border-pastelPink"
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsSupportDialogOpen(false)}
              className="border-pastelPink/30 text-white"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSupportSubmit}
              disabled={sendingSupport}
              className="bg-pastelPink hover:bg-pastelPink/80 text-black font-medium"
            >
              {sendingSupport ? 'Sending...' : 'Send Message'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navbar;
