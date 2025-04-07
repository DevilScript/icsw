
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const contributors = [
  { name: "Alex Chen", role: "Lead Developer", avatar: "AC" },
  { name: "Sara Kim", role: "UI Designer", avatar: "SK" },
  { name: "Marcus Lee", role: "Script Engineer", avatar: "ML" },
];

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-20">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-pastelPink/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-gray-600/10 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto text-center relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
        >
          <span className="text-white">Neon</span>
          <span className="text-pastelPink animate-pulse">Script</span>
          <span className="text-white"> Runner</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10"
        >
          The modern, elegant Lua script runner with powerful development tools 
          and a sleek interface designed for developers.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12"
        >
          <Button 
            id="discordBtn" 
            className="relative group overflow-hidden bg-gray-800/70 border-2 border-pastelPink/30 hover:bg-gray-700/70 text-white text-lg py-6 px-8 rounded-md shadow-[0_0_15px_rgba(255,179,209,0.2)]"
            onClick={() => window.open('https://discord.com', '_blank')}
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-pastelPink/0 via-pastelPink/30 to-pastelPink/0 -translate-x-full animate-shimmer group-hover:animate-shimmer"></span>
            <MessageCircle className="mr-2 h-5 w-5 group-hover:animate-bounce" />
            Join Discord
          </Button>
          
          <Button 
            variant="outline" 
            className="border-pastelPink/30 text-pastelPink hover:bg-pastelPink/10 rounded-md shadow-[0_0_10px_rgba(255,179,209,0.15)]"
          >
            View Documentation
          </Button>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="glass-effect border border-pastelPink/20 max-w-md mx-auto p-4 rounded-xl shadow-[0_0_15px_rgba(255,179,209,0.15)] animate-float"
        >
          <h3 className="text-white text-lg mb-4">Contributors</h3>
          <div className="flex flex-col gap-3">
            {contributors.map((contributor, index) => (
              <div key={index} className="flex items-center gap-3 text-left">
                <Avatar className="border border-pastelPink/30">
                  <AvatarImage src={`/placeholder.svg`} />
                  <AvatarFallback className="bg-gray-700 text-pastelPink">{contributor.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white">{contributor.name}</p>
                  <p className="text-xs text-gray-400">{contributor.role}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        <a href="#scripts" className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 hover:text-pastelPink transition-colors animate-bounce">
          <ChevronDown className="h-8 w-8" />
        </a>
      </div>
    </div>
  );
};

export default Hero;
