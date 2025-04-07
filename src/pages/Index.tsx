
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import ScriptSection from '@/components/ScriptSection';
import Footer from '@/components/Footer';
import LoginModal from '@/components/LoginModal';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Handle login button click
  const handleLoginClick = () => {
    if (user) {
      // If logged in, navigate to profile or dashboard in the future
      return;
    }
    setLoginModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-deepBlack via-darkGray/70 to-deepBlack text-white relative overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-pastelPink/5 rounded-full filter blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-gray-500/5 rounded-full filter blur-[100px]"></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-gray-600/5 rounded-full filter blur-[80px]"></div>
      </div>
      
      {/* Login modal */}
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
      
      {/* Login button (fixed position) */}
      <div className="fixed bottom-6 right-6 z-40 md:hidden">
        <Button 
          onClick={handleLoginClick}
          className="rounded-full glass-effect border border-pastelPink/30 h-14 w-14 p-0 flex items-center justify-center shadow-[0_0_15px_rgba(255,179,209,0.2)]"
        >
          <User className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Main content */}
      <div className="relative z-10">
        <Navbar onLoginClick={handleLoginClick} />
        <Hero />
        <ScriptSection />
        <Features />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
