
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, ChevronDown } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-20">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-neonPink/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-purple-600/20 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="text-white">Neon</span>
          <span className="neon-text">Script</span>
          <span className="text-white"> Runner</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          The modern, elegant Lua script runner with powerful development tools 
          and a sleek interface designed for developers.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button id="downloadBtn" className="neon-button group animate-neon-pulse text-lg py-6 px-8">
            <Download className="mr-2 h-5 w-5 group-hover:animate-float" />
            Download Program
          </Button>
          
          <Button variant="outline" className="border-pastelPink/50 text-pastelPink hover:bg-pastelPink/10">
            View Documentation
          </Button>
        </div>
        
        <div className="glass-card max-w-md mx-auto p-4 animate-float">
          <p className="text-sm text-gray-400 mb-2">Latest version: v2.5.0</p>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Windows 10/11</span>
            <span>macOS 11+</span>
            <span>Linux</span>
          </div>
        </div>
        
        <a href="#features" className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 hover:text-white transition-colors animate-bounce">
          <ChevronDown className="h-8 w-8" />
        </a>
      </div>
    </div>
  );
};

export default Hero;
