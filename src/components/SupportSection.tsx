
import React from 'react';
import { motion } from 'framer-motion';

const SupportSection = () => {
  return (
    <section id="support" className="py-20 px-4 bg-gradient-to-b from-deepBlack to-darkGray/40">
      <div className="container mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="section-title text-center"
        >
          <span className="text-pastelPink">Support</span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center text-gray-300 max-w-2xl mx-auto mb-12"
        >
          We support a wide range of games and executors.
        </motion.p>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Supported Maps */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="glass-effect border border-pastelPink/30 p-6 rounded-xl shadow-[0_0_15px_rgba(255,179,209,0.15)]"
          >
            <h3 className="text-xl font-semibold mb-4 text-center">Supported Maps</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="h-2 w-2 bg-pastelPink rounded-full mr-3"></span>
                <span>AnimeFruit</span>
              </li>
              <li className="flex items-center">
                <span className="h-2 w-2 bg-pastelPink rounded-full mr-3"></span>
                <span>Basketball Legends</span>
              </li>
            </ul>
          </motion.div>
          
          {/* Supported Executors */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="glass-effect border border-pastelPink/30 p-6 rounded-xl shadow-[0_0_15px_rgba(255,179,209,0.15)]"
          >
            <h3 className="text-xl font-semibold mb-4 text-center">Supported Executors</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="h-2 w-2 bg-pastelPink rounded-full mr-3"></span>
                <span>Awp</span>
              </li>
              <li className="flex items-center">
                <span className="h-2 w-2 bg-pastelPink rounded-full mr-3"></span>
                <span>Wave</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
