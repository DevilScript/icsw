
import React from 'react';

const DiscordIcon: React.FC<{ className?: string, size?: number }> = ({ 
  className = "", 
  size = 24 
}) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="9" cy="12" r="1"/>
      <circle cx="15" cy="12" r="1"/>
      <path d="M7.5 7.2A14.1 14.1 0 0 1 16 7a4 4 0 0 1 4 4v2a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6v-2a4 4 0 0 1 3.5-4z"/>
      <path d="M18 21a8 8 0 0 0 1-4v-1"/>
      <path d="M6 21a8 8 0 0 1-1-4v-1"/>
    </svg>
  );
};

export default DiscordIcon;
