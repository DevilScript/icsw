
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Code, 
  MessageCircle, 
  User, 
  Menu, 
  X 
} from "lucide-react";
import { Link } from "react-router-dom";

interface NavbarProps {
  onLoginClick: () => void;
}

const Navbar = ({ onLoginClick }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-lg border-b border-pastelPink/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Code className="text-pastelPink h-6 w-6" />
            <span className="font-bold text-xl text-white">Neon<span className="text-pastelPink">Script</span></span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center justify-center space-x-8 flex-1">
            <a href="#download" className="text-white hover:text-pastelPink transition-colors">
              Download
            </a>
            <a href="#scripts" className="text-white hover:text-pastelPink transition-colors">
              Scripts
            </a>
            <a href="#features" className="text-white hover:text-pastelPink transition-colors">
              Features
            </a>
            <a href="#community" className="text-white hover:text-pastelPink transition-colors">
              Community
            </a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="text-white hover:text-pastelPink hover:bg-black/30">
                <MessageCircle className="h-5 w-5" />
              </Button>
            </a>
            
            <Button 
              className="bg-gray-800/70 hover:bg-gray-700/80 text-white border border-pastelPink rounded-md shadow-[0_0_10px_rgba(255,179,209,0.2)]"
              onClick={onLoginClick}
            >
              <User className="mr-2 h-4 w-4" />
              Login
            </Button>
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
              href="#download" 
              className="text-white hover:text-pastelPink px-3 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Download
            </a>
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
            <a 
              href="#community" 
              className="text-white hover:text-pastelPink px-3 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Community
            </a>
            
            <div className="flex items-center gap-2 pt-2">
              <a 
                href="https://discord.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-pastelPink px-3 py-2 rounded-md flex items-center"
              >
                <MessageCircle className="h-5 w-5 mr-2" /> Discord
              </a>
              
              <Button 
                className="bg-gray-800/70 hover:bg-gray-700/80 text-white border border-pastelPink rounded-md w-full mt-2 shadow-[0_0_10px_rgba(255,179,209,0.2)]"
                onClick={() => {
                  setIsMenuOpen(false);
                  onLoginClick();
                }}
              >
                <User className="mr-2 h-4 w-4" />
                Login
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
