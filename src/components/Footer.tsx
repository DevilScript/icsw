
import React from 'react';
import { Link } from "react-router-dom";
import { Code } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-b from-darkGray/30 to-deepBlack/90 backdrop-blur-lg border-t border-pastelPink/20 py-12 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div className="flex items-center gap-2 mb-6 md:mb-0">
            <Code className="text-pastelPink h-6 w-6" />
            <span className="font-bold text-xl text-white">Moyx<span className="text-pastelPink">Hubs</span></span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#scripts" className="text-gray-300 hover:text-pastelPink transition-colors">
              Scripts
            </a>
            <a href="#features" className="text-gray-300 hover:text-pastelPink transition-colors">
              Features
            </a>
            <a href="#" className="text-gray-300 hover:text-pastelPink transition-colors">
              Documentation
            </a>
            <a href="#" className="text-gray-300 hover:text-pastelPink transition-colors">
              Blog
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-700/50 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {currentYear} MoyxHubs. All rights reserved.
          </p>
          
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 text-sm hover:text-pastelPink transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 text-sm hover:text-pastelPink transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 text-sm hover:text-pastelPink transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
