
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle, Github, Twitter } from "lucide-react";

const Community = () => {
  return (
    <section id="community" className="py-20 px-4 bg-gradient-to-b from-blue-900/30 to-deepBlack/90">
      <div className="container mx-auto text-center">
        <h2 className="section-title">
          Join Our <span className="text-pastelPink">Community</span>
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
            className="bg-gray-800/40 backdrop-blur-md border border-pastelPink/40 p-8 flex flex-col items-center hover:shadow-[0_0_20px_rgba(255,179,209,0.3)] transition-all duration-300 rounded-xl group"
          >
            <div className="bg-gray-700/70 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
              <MessageCircle className="h-8 w-8 text-pastelPink" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Discord</h3>
            <p className="text-gray-400 mb-4">Join our server with over 10,000 members</p>
            <Button variant="outline" className="w-full border-pastelPink/60 text-pastelPink hover:bg-pastelPink/10 rounded-md">
              Join Server
            </Button>
          </a>
          
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-gray-800/40 backdrop-blur-md border border-pastelPink/40 p-8 flex flex-col items-center hover:shadow-[0_0_20px_rgba(255,179,209,0.3)] transition-all duration-300 rounded-xl group"
          >
            <div className="bg-gray-700/70 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
              <Github className="h-8 w-8 text-pastelPink" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">GitHub</h3>
            <p className="text-gray-400 mb-4">Contribute to the project and report issues</p>
            <Button variant="outline" className="w-full border-pastelPink/60 text-pastelPink hover:bg-pastelPink/10 rounded-md">
              View Repo
            </Button>
          </a>
          
          <a 
            href="https://twitter.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-gray-800/40 backdrop-blur-md border border-pastelPink/40 p-8 flex flex-col items-center hover:shadow-[0_0_20px_rgba(255,179,209,0.3)] transition-all duration-300 rounded-xl group"
          >
            <div className="bg-gray-700/70 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
              <Twitter className="h-8 w-8 text-pastelPink" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Twitter</h3>
            <p className="text-gray-400 mb-4">Follow us for the latest updates and news</p>
            <Button variant="outline" className="w-full border-pastelPink/60 text-pastelPink hover:bg-pastelPink/10 rounded-md">
              Follow Us
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Community;
