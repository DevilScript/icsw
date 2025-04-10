
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import ScriptSection from '@/components/ScriptSection';
import DownloadSection from '@/components/DownloadSection';
import Community from '@/components/Community';
import SupportSection from '@/components/SupportSection';
import Footer from '@/components/Footer';

const Index = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Handle hash navigation on initial load
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
    
    // Handle scrollTo from state (from navigation through other pages)
    if (location.state && location.state.scrollTo) {
      const sectionId = location.state.scrollTo;
      const element = document.getElementById(sectionId);
      
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
      
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  
  return (
    <div className="bg-deepBlack text-white">
      <Hero />
      <Features />
      <ScriptSection />
      <DownloadSection />
      <Community />
      <SupportSection />
      <Footer />
    </div>
  );
};

export default Index;
