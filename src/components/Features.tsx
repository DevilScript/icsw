
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const Features = () => {
  const features = [
    {
      title: "Contributors",
      items: ["Moyx", "Suphakit P.", "You"]
    },
    {
      title: "Supported Maps",
      items: ["Ninja Legends", "Clicker Simulator", "Build a Boat", "Coming Soon"]
    },
    {
      title: "Supported Executors",
      items: ["Script-Ware", "Synapse X", "KRNL", "Fluxus"]
    }
  ];

  return (
    <section id="features" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 25px rgba(255,179,209,0.3)",
                backgroundColor: "rgba(255,179,209,0.1)"
              }}
              className="section-hover transition-all duration-300 glass-effect border border-pastelPink/30 p-6 rounded-xl shadow-[0_0_15px_rgba(255,179,209,0.15)]"
            >
              <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
              <ul className="space-y-2">
                {feature.items.map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center text-gray-300"
                  >
                    <CheckCircle2 className="h-5 w-5 text-pastelPink mr-2" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
