
import React from 'react';
import { Link } from "react-router-dom";
import { Code } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-blue-900/90 border-t border-neonPink/20 py-10 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-2 mb-6 md:mb-0">
            <Code className="text-neonPink h-6 w-6" />
            <span className="font-bold text-xl text-white">Neon<span className="text-neonPink">Script</span></span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#download" className="text-gray-300 hover:text-neonPink transition-colors">
              Download
            </a>
            <a href="#scripts" className="text-gray-300 hover:text-neonPink transition-colors">
              Scripts
            </a>
            <a href="#features" className="text-gray-300 hover:text-neonPink transition-colors">
              Features
            </a>
            <a href="#community" className="text-gray-300 hover:text-neonPink transition-colors">
              Community
            </a>
            <a href="#" className="text-gray-300 hover:text-neonPink transition-colors">
              Documentation
            </a>
            <a href="#" className="text-gray-300 hover:text-neonPink transition-colors">
              Blog
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {currentYear} NeonScript. All rights reserved.
          </p>
          
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 text-sm hover:text-neonPink transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 text-sm hover:text-neonPink transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 text-sm hover:text-neonPink transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
