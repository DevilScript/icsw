
import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import DiscordIcon from './icons/DiscordIcon';

const SupportSection = () => {
  return (
    <section id="support" className="py-16 md:py-24 bg-gradient-to-b from-deepBlack via-gray-900 to-deepBlack text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Need <span className="text-pastelPink">Help?</span> We've Got You Covered
            </h2>
            
            <p className="text-gray-300 mb-8">
              Our dedicated support team is ready to assist you with any questions or issues you might encounter. 
              Join our Discord community for real-time support or reach out to us directly.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="mt-1 bg-pastelPink/20 rounded-full p-2 mr-4">
                  <DiscordIcon className="h-5 w-5 text-pastelPink" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Join Our Discord</h3>
                  <p className="text-gray-400 text-sm">
                    Connect with our community and get instant support from our team and other users.
                  </p>
                  <a 
                    href="https://discord.gg/invite-link" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-pastelPink hover:text-pastelPink/80 text-sm inline-block mt-1"
                  >
                    Join Server →
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-1 bg-pastelPink/20 rounded-full p-2 mr-4">
                  <svg className="h-5 w-5 text-pastelPink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email Support</h3>
                  <p className="text-gray-400 text-sm">
                    Send us an email for any technical issues or business inquiries.
                  </p>
                  <a 
                    href="mailto:support@icsw.gg" 
                    className="text-pastelPink hover:text-pastelPink/80 text-sm inline-block mt-1"
                  >
                    support@icsw.gg
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-1 bg-pastelPink/20 rounded-full p-2 mr-4">
                  <svg className="h-5 w-5 text-pastelPink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Knowledge Base</h3>
                  <p className="text-gray-400 text-sm">
                    Browse our comprehensive guides and FAQs for quick solutions to common questions.
                  </p>
                  <a 
                    href="#" 
                    className="text-pastelPink hover:text-pastelPink/80 text-sm inline-block mt-1"
                  >
                    Visit Knowledge Base →
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-gray-800/50 backdrop-blur-sm border border-pastelPink/20 rounded-xl p-8 shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-6">Send Us a Message</h3>
            
            <form className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-300">Name</label>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="Your name" 
                  className="bg-gray-900/50 border-pastelPink/30 focus:border-pastelPink" 
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="discord" className="text-sm font-medium text-gray-300">Discord Username</label>
                <Input 
                  id="discord" 
                  type="text" 
                  placeholder="Your Discord username" 
                  className="bg-gray-900/50 border-pastelPink/30 focus:border-pastelPink" 
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-gray-300">Subject</label>
                <Input 
                  id="subject" 
                  type="text" 
                  placeholder="What's this about?" 
                  className="bg-gray-900/50 border-pastelPink/30 focus:border-pastelPink" 
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-gray-300">Message</label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us how we can help..." 
                  className="min-h-[120px] bg-gray-900/50 border-pastelPink/30 focus:border-pastelPink" 
                />
              </div>
              
              <Button className="w-full bg-pastelPink hover:bg-pastelPink/80 text-black font-medium">
                Send Message
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
