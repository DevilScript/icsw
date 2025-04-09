
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle, ChevronDown, Instagram } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const contributors = [
  { name: "Mo🍉", role: "Lead Developer", avatar: "https://i.ibb.co/wFD7JTdb/D3-D095-EF-D0-D5-47-A1-B382-BBA57-A1-DE014.jpg", instagram: "https://www.instagram.com/mo.icsw/" },
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
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.7,
            type: "spring",
            stiffness: 100
          }}
          className="mb-6"
        >
          <motion.div 
            className="text-4xl md:text-6xl font-bold tracking-tight inline-flex flex-wrap justify-center"
            animate={{ scale: [0.9, 1, 0.98] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          >
            <motion.span
              className="text-white mr-2"
              whileHover={{ 
                color: "#ffb3d1", 
                textShadow: "0 0 8px rgba(255,179,209,0.7)" 
              }}
            >
              ICS
            </motion.span>
            <motion.span 
              className="text-pastelPink"
              animate={{ 
                textShadow: ["0 0 4px rgba(255,179,209,0.4)", "0 0 15px rgba(255,179,209,0.8)", "0 0 4px rgba(255,179,209,0.4)"]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              W
            </motion.span>
          </motion.div>
          <motion.span 
            className="text-lg md:text-2xl text-gray-300 block mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Runner
          </motion.span>
        </motion.div>
        
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
            onClick={() => window.open('https://discord.gg/3CFe4KBks2', '_blank')}
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-pastelPink/0 via-pastelPink/30 to-pastelPink/0 -translate-x-full animate-shimmer group-hover:animate-shimmer"></span>
            <MessageCircle className="mr-2 h-5 w-5 group-hover:animate-bounce" />
            Join Discord
          </Button>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-pastelPink/30 text-pastelPink bg-gray-800/50 rounded-full shadow-[0_0_10px_rgba(255,179,209,0.15)] py-1 px-4">
              <span className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                Status: Online
              </span>
            </Badge>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="glass-effect border border-pastelPink/20 max-w-md mx-auto p-6 rounded-xl shadow-[0_0_15px_rgba(255,179,209,0.15)] animate-float mb-16"
        >
          <h3 className="text-white text-lg mb-6">Contributors</h3>
          <div className="flex flex-col gap-6">
            {contributors.map((contributor, index) => (
              <div key={index} className="flex flex-col items-center">
                <Avatar className="border border-pastelPink/30 h-16 w-16 mb-2">
                  <AvatarImage src={contributor.avatar} />
                  <AvatarFallback className="bg-gray-700 text-pastelPink text-lg">MO</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="text-white text-lg">{contributor.name}</p>
                  <p className="text-sm text-gray-400 mb-2">{contributor.role}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-pastelPink hover:bg-black/30 rounded-full h-8 w-8"
                    onClick={() => window.open(contributor.instagram, '_blank')}
                  >
                    <Instagram className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <a 
            href="#scripts" 
            className="block text-center text-white/70 hover:text-pastelPink transition-colors"
            aria-label="Scroll down to scripts section"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ChevronDown className="h-8 w-8 mx-auto" />
            </motion.div>
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
