
import React from 'react';
import { 
  Zap, 
  Code, 
  FileText, 
  Shield, 
  Tablet, 
  Palette 
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Zap className="h-10 w-10 text-pastelPink" />,
    title: "Lightning Fast",
    description: "Optimized performance for executing Lua scripts with minimal latency."
  },
  {
    icon: <Code className="h-10 w-10 text-pastelPink" />,
    title: "Syntax Highlighting",
    description: "Beautiful code editor with syntax highlighting for Lua and other languages."
  },
  {
    icon: <FileText className="h-10 w-10 text-pastelPink" />,
    title: "Script Library",
    description: "Access a vast collection of ready-to-use Lua scripts and examples."
  },
  {
    icon: <Shield className="h-10 w-10 text-pastelPink" />,
    title: "Secure Execution",
    description: "Run scripts in a secure sandbox environment to protect your system."
  },
  {
    icon: <Tablet className="h-10 w-10 text-pastelPink" />,
    title: "Cross-Platform",
    description: "Available for Windows, macOS, and Linux with consistent experience."
  },
  {
    icon: <Palette className="h-10 w-10 text-pastelPink" />,
    title: "Customizable UI",
    description: "Personalize your development environment with themes and layouts."
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const Features = () => {
  return (
    <section id="features" className="py-20 px-4">
      <div className="container mx-auto">
        <h2 className="section-title text-center">
          <span className="text-pastelPink">Advanced</span> Features
        </h2>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={item}
              className="bg-gray-800/40 backdrop-blur-md border border-pastelPink/30 p-6 hover:shadow-[0_0_20px_rgba(255,179,209,0.3)] transition-all duration-300 rounded-xl group"
            >
              <div className="bg-gray-700/70 p-3 rounded-lg inline-block mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
