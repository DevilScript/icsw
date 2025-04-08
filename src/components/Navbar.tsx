
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Code, 
  MessageCircle, 
  User, 
  Menu, 
  X, 
  LogOut,
  Instagram
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

interface NavbarProps {
  onLoginClick: () => void;
}

const Navbar = ({ onLoginClick }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-lg border-b border-pastelPink/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Code className="text-pastelPink h-6 w-6" />
            <Link to="/" className="font-bold text-xl text-white">
              Moyx<span className="text-pastelPink">Hubs</span>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center justify-center space-x-8 flex-1">
            <a href="#scripts" className="text-white hover:text-pastelPink transition-colors">
              Scripts
            </a>
            <a href="#features" className="text-white hover:text-pastelPink transition-colors">
              Features
            </a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a href="https://discord.gg/3CFe4KBks2" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="text-white hover:text-pastelPink hover:bg-black/30">
                <MessageCircle className="h-5 w-5" />
              </Button>
            </a>
            
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
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800/95 backdrop-blur-xl border border-pastelPink/30 text-white">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
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
            <a 
              href="#features" 
              className="text-white hover:text-pastelPink px-3 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            
            <div className="flex items-center gap-2 pt-2">
              <a 
                href="https://discord.gg/3CFe4KBks2" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-pastelPink px-3 py-2 rounded-md flex items-center"
              >
                <MessageCircle className="h-5 w-5 mr-2" /> Discord
              </a>
              
              {user ? (
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
    </nav>
  );
};

export default Navbar;
