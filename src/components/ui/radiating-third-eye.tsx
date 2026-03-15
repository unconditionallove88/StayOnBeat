import React from "react";

/**
 * @fileOverview RadiatingThirdEye Component.
 * A high-fidelity SVG icon representing intuition, witnessing, and collective care.
 */

interface RadiatingThirdEyeProps {
  size?: number;
  color?: string;
  className?: string;
}

export const RadiatingThirdEye = ({ 
  size = 48, 
  color = "#10B981",
  className 
}: RadiatingThirdEyeProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 120 120" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    {/* Radiating Lines (Intuition Waves) */}
    <g stroke={color} strokeWidth="3" strokeLinecap="round" filter="url(#glow)" opacity="0.8">
      <path d="M60 15V25M42 22l5 8M78 22l-5 8M28 35l8 6M92 35l-8 6" />
    </g>
    {/* Eye Outline */}
    <path d="M20 70c15-25 35-35 40-35s25 10 40 35c-15 25-35 35-40 35s-25-10-40-35z" 
          stroke={color} strokeWidth="4" strokeLinecap="round" filter="url(#glow)" />
    {/* Heart Pupil */}
    <path d="M60 75c-2-3-6-4-8-2-3 3-2 8 2 11l6 5 6-5c4-3 5-8 2-11-2-2-6-1-8 2z" 
          fill={color} filter="url(#glow)" />
  </svg>
);
