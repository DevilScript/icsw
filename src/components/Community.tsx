
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle, Github, Twitter } from "lucide-react";

const Community = () => {
  return (
    <section id="community" className="py-20 px-4 bg-gradient-to-b from-blue-900/80 to-deepBlack/90">
      <div className="container mx-auto text-center">
        <h2 className="section-title">
          Join Our <span className="neon-text">Community</span>
        </h2>
        
        <p className="text-gray-300 max-w-2xl mx-auto mb-12">
          Connect with other developers, share your scripts, get help, and stay updated 
          with the latest NeonScript news and releases.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <a 
            href="https://discord.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-gray-800/70 border border-pastelPink p-8 flex flex-col items-center hover:shadow-[0_0_15px_rgba(255,42,109,0.4)] transition-all duration-300 rounded-lg"
          >
            <MessageCircle className="h-12 w-12 text-neonPink mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Discord</h3>
            <p className="text-gray-400 mb-4">Join our server with over 10,000 members</p>
            <Button variant="outline" className="w-full border-neonPink/50 text-neonPink hover:bg-neonPink/10">
              Join Server
            </Button>
          </a>
          
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-gray-800/70 border border-pastelPink p-8 flex flex-col items-center hover:shadow-[0_0_15px_rgba(255,42,109,0.4)] transition-all duration-300 rounded-lg"
          >
            <Github className="h-12 w-12 text-neonPink mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">GitHub</h3>
            <p className="text-gray-400 mb-4">Contribute to the project and report issues</p>
            <Button variant="outline" className="w-full border-neonPink/50 text-neonPink hover:bg-neonPink/10">
              View Repo
            </Button>
          </a>
          
          <a 
            href="https://twitter.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-gray-800/70 border border-pastelPink p-8 flex flex-col items-center hover:shadow-[0_0_15px_rgba(255,42,109,0.4)] transition-all duration-300 rounded-lg"
          >
            <Twitter className="h-12 w-12 text-neonPink mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Twitter</h3>
            <p className="text-gray-400 mb-4">Follow us for the latest updates and news</p>
            <Button variant="outline" className="w-full border-neonPink/50 text-neonPink hover:bg-neonPink/10">
              View Repo
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Community;
