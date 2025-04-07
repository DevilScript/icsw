
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import ScriptSection from '@/components/ScriptSection';
import DownloadSection from '@/components/DownloadSection';
import Community from '@/components/Community';
import Footer from '@/components/Footer';
import LoginModal from '@/components/LoginModal';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

const Index = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-deepBlack text-white relative overflow-x-hidden">
      {/* Login modal */}
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
      
      {/* Login button (fixed position) */}
      <div className="fixed bottom-6 right-6 z-40 md:hidden">
        <Button 
          onClick={() => setLoginModalOpen(true)}
          className="rounded-full neon-button h-14 w-14 p-0 flex items-center justify-center"
        >
          <User className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Main content */}
      <Navbar />
      <Hero />
      <Features />
      <ScriptSection />
      <DownloadSection />
      <Community />
      <Footer />
    </div>
  );
};

export default Index;
