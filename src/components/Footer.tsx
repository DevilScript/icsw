
import React from 'react';
import { Link } from "react-router-dom";
import { MessageCircle, Instagram, ExternalLink } from "lucide-react";
import LogoW from "@/components/icons/LogoW";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-b from-darkGray/30 to-deepBlack/90 backdrop-blur-lg border-t border-pastelPink/20 py-12 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div className="flex items-center gap-2 mb-6 md:mb-0">
            <LogoW className="h-7 w-7" />
            <span className="font-bold text-xl text-white">ICS<span className="text-pastelPink">W</span></span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#scripts" className="text-gray-300 hover:text-pastelPink transition-colors">
              Scripts
            </a>
            <a href="#features" className="text-gray-300 hover:text-pastelPink transition-colors">
              Features
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-700/50 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {currentYear} ICSW. All rights reserved.
          </p>
          
          <div className="flex gap-6">
            <a 
              href="https://discord.gg/3CFe4KBks2" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pastelPink transition-colors flex items-center gap-1"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span className="text-sm">Discord</span>
            </a>
            <a 
              href="https://www.instagram.com/mo.icsw/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pastelPink transition-colors flex items-center gap-1"
            >
              <Instagram className="h-3.5 w-3.5" />
              <span className="text-sm">Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
