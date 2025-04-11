
import React from 'react';

interface LogoWProps {
  className?: string;
}

const LogoW = ({ className = "h-6 w-6" }: LogoWProps) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g className="text-pastelPink">
        <path
          d="M4 4L8 20L12 10L16 20L20 4"
          stroke="currentColor"
          strokeWidth="2.5"
        />
      </g>
    </svg>
  );
};

export default LogoW;
