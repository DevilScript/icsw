
import React from 'react';
import { 
  Zap, 
  Code, 
  FileText, 
  Shield, 
  Tablet, 
  Palette 
} from "lucide-react";

const features = [
  {
    icon: <Zap className="h-10 w-10 text-neonPink" />,
    title: "Lightning Fast",
    description: "Optimized performance for executing Lua scripts with minimal latency."
  },
  {
    icon: <Code className="h-10 w-10 text-neonPink" />,
    title: "Syntax Highlighting",
    description: "Beautiful code editor with syntax highlighting for Lua and other languages."
  },
  {
    icon: <FileText className="h-10 w-10 text-neonPink" />,
    title: "Script Library",
    description: "Access a vast collection of ready-to-use Lua scripts and examples."
  },
  {
    icon: <Shield className="h-10 w-10 text-neonPink" />,
    title: "Secure Execution",
    description: "Run scripts in a secure sandbox environment to protect your system."
  },
  {
    icon: <Tablet className="h-10 w-10 text-neonPink" />,
    title: "Cross-Platform",
    description: "Available for Windows, macOS, and Linux with consistent experience."
  },
  {
    icon: <Palette className="h-10 w-10 text-neonPink" />,
    title: "Customizable UI",
    description: "Personalize your development environment with themes and layouts."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 px-4">
      <div className="container mx-auto">
        <h2 className="section-title text-center">
          <span className="neon-text">Advanced</span> Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="neon-border p-6 hover:shadow-[0_0_15px_rgba(255,42,109,0.4)] transition-all duration-300"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
