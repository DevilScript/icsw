
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
      <g>
        <text
          x="0"
          y="16"
          fontSize="16"
          fontWeight="bold"
          fill="currentColor"
        >
          ICS<tspan fill="#ffb3d1">W</tspan>
        </text>
      </g>
    </svg>
  );
};

export default LogoW;
