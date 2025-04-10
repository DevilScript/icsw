
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarLinksProps {
  onClose?: () => void;
  isMobile?: boolean;
}

const NavbarLinks = ({ onClose, isMobile = false }: NavbarLinksProps) => {
  const navigate = useNavigate();
  
  const handleClick = (path: string) => {
    if (onClose) onClose();
    
    // Handle hash navigation
    if (path.startsWith('#')) {
      // If we're on the home page, just scroll to the section
      if (window.location.pathname === '/') {
        const element = document.querySelector(path);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // If we're on another page, go to the home page and then scroll
        navigate('/', { state: { scrollTo: path.substring(1) } });
      }
    } else {
      navigate(path);
    }
  };
  
  const className = isMobile 
    ? "text-white hover:text-pastelPink px-3 py-2 rounded-md" 
    : "text-white hover:text-pastelPink transition-colors";
    
  return (
    <>
      <button 
        onClick={() => handleClick('#scripts')}
        className={className}
      >
        Scripts
      </button>
      
      <button
        onClick={() => handleClick('/store')}
        className={className}
      >
        Store
      </button>
      
      <button
        onClick={() => handleClick('/topup')}
        className={className}
      >
        Topup
      </button>
      
      <button 
        onClick={() => handleClick('#support')}
        className={className}
      >
        Support
      </button>
    </>
  );
};

export default NavbarLinks;
