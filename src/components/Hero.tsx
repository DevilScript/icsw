
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, ChevronDown } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-20">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-pastelPink/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-purple-400/10 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
          <span className="text-white">Neon</span>
          <span className="text-pastelPink animate-pulse">Script</span>
          <span className="text-white"> Runner</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
          The modern, elegant Lua script runner with powerful development tools 
          and a sleek interface designed for developers.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
          <Button 
            id="downloadBtn" 
            className="relative group overflow-hidden bg-gray-800/70 border-2 border-pastelPink hover:bg-gray-700/70 text-white text-lg py-6 px-8 rounded-md shadow-[0_0_15px_rgba(255,179,209,0.3)]"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-pastelPink/0 via-pastelPink/30 to-pastelPink/0 -translate-x-full animate-shimmer group-hover:animate-shimmer"></span>
            <Download className="mr-2 h-5 w-5 group-hover:animate-bounce" />
            Download Program
          </Button>
          
          <Button 
            variant="outline" 
            className="border-pastelPink/60 text-pastelPink hover:bg-pastelPink/10 rounded-md shadow-[0_0_10px_rgba(255,179,209,0.2)]"
          >
            View Documentation
          </Button>
        </div>
        
        <div className="bg-gray-800/30 backdrop-blur-md border border-pastelPink/20 max-w-md mx-auto p-4 rounded-xl shadow-[0_0_15px_rgba(255,179,209,0.2)] animate-float">
          <p className="text-sm text-gray-300 mb-2">Latest version: v2.5.0</p>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Windows 10/11</span>
            <span>macOS 11+</span>
            <span>Linux</span>
          </div>
        </div>
        
        <a href="#features" className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 hover:text-pastelPink transition-colors animate-bounce">
          <ChevronDown className="h-8 w-8" />
        </a>
      </div>
    </div>
  );
};

export default Hero;
