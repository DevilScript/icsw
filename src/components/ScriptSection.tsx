
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ScriptSection = () => {
  const navigate = useNavigate();

  const scripts = [
    {
      id: 1,
      name: "Universal ESP",
      description: "See players, items, and objects through walls with customizable colors and distance markers.",
      features: [
        "Player ESP with health bars",
        "Item ESP with rarity colors",
        "Customizable ESP settings",
        "Distance markers"
      ],
      price: "300 THB"
    },
    {
      id: 2,
      name: "Silent Aim",
      description: "Enhance your aim with subtle aim correction that won't trigger anti-cheat systems.",
      features: [
        "Customizable aim smoothing",
        "Target priority settings",
        "Adjustable FOV",
        "Anti-detection measures"
      ],
      price: "450 THB"
    },
    {
      id: 3,
      name: "Speed Hack",
      description: "Move faster in-game with adjustable speed multipliers and detection evasion.",
      features: [
        "Adjustable speed multipliers",
        "Auto-correction for server validation",
        "Quick toggle hotkeys",
        "Detection evasion"
      ],
      price: "250 THB"
    }
  ];

  return (
    <section id="scripts" className="py-16 md:py-24 bg-gradient-to-b from-gray-900 to-deepBlack text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Premium <span className="text-pastelPink">Scripts</span>
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Our exclusive collection of highly optimized premium scripts for various games, 
            designed to give you the competitive edge while staying undetected.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {scripts.map((script, index) => (
            <motion.div
              key={script.id}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-gray-800/50 backdrop-blur-sm border border-pastelPink/20 rounded-xl p-6 shadow-lg hover:shadow-pastelPink/10 transition-all hover:border-pastelPink/30"
            >
              <h3 className="text-xl font-semibold mb-3 text-pastelPink">{script.name}</h3>
              <p className="text-gray-300 mb-4">{script.description}</p>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Key Features:</h4>
                <ul className="text-sm space-y-1 text-gray-300">
                  {script.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <span className="inline-block w-4 h-4 mr-2 mt-0.5 text-pastelPink">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex items-center justify-between mt-auto pt-3">
                <span className="text-pastelPink font-semibold">{script.price}</span>
                <Button 
                  onClick={() => navigate('/store')}
                  variant="outline" 
                  className="border-pastelPink/40 text-pastelPink hover:bg-pastelPink/10"
                >
                  View in Store
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button 
            onClick={() => navigate('/store')}
            className="bg-pastelPink hover:bg-pastelPink/80 text-black font-medium px-8 py-6"
          >
            Browse All Scripts
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ScriptSection;
