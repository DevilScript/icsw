
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Code, 
  FileText, 
  Discord, 
  User, 
  Menu, 
  X 
} from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-neonPink/30">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Code className="text-neonPink h-6 w-6" />
          <span className="font-bold text-xl text-white">Neon<span className="text-neonPink">Script</span></span>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#download" className="text-white hover:text-neonPink transition-colors">
            Download
          </a>
          <a href="#scripts" className="text-white hover:text-neonPink transition-colors">
            Scripts
          </a>
          <a href="#features" className="text-white hover:text-neonPink transition-colors">
            Features
          </a>
          <a href="#community" className="text-white hover:text-neonPink transition-colors">
            Community
          </a>

          <div className="flex items-center gap-3">
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="text-white hover:text-neonPink hover:bg-black/30">
                <Discord className="h-5 w-5" />
              </Button>
            </a>
            
            <Button className="neon-button">
              <User className="mr-2 h-4 w-4" />
              Login
            </Button>
          </div>
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
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95 border-b border-neonPink/30 py-4 px-4">
          <div className="flex flex-col space-y-4">
            <a 
              href="#download" 
              className="text-white hover:text-neonPink px-3 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Download
            </a>
            <a 
              href="#scripts" 
              className="text-white hover:text-neonPink px-3 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Scripts
            </a>
            <a 
              href="#features" 
              className="text-white hover:text-neonPink px-3 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#community" 
              className="text-white hover:text-neonPink px-3 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Community
            </a>
            
            <div className="flex items-center gap-2 pt-2">
              <a 
                href="https://discord.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-neonPink px-3 py-2 rounded-md flex items-center"
              >
                <Discord className="h-5 w-5 mr-2" /> Discord
              </a>
              
              <Button className="neon-button w-full mt-2">
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
