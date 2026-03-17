import React from "react";

/**
 * @fileOverview HarmonyYinYangIcon Component.
 * A bespoke icon representing the balance of Brain (Logic) and Heart (Emotion).
 */

interface HarmonyYinYangIconProps {
  size?: number;
  className?: string;
}

export const HarmonyYinYangIcon = ({ 
  size = 24, 
  className 
}: HarmonyYinYangIconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 120 120" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <filter id="harmonyGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Outer Circle */}
    <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="4" filter="url(#harmonyGlow)" />
    
    {/* S-Curve Separator */}
    <path 
      d="M60 10C60 10 90 30 90 60C90 90 60 110 60 110" 
      stroke="currentColor" 
      strokeWidth="4" 
      strokeLinecap="round"
    />
    <path 
      d="M60 10C60 10 30 30 30 60C30 90 60 110 60 110" 
      stroke="currentColor" 
      strokeWidth="4" 
      strokeLinecap="round" 
      opacity="0.3"
    />

    {/* The Brain Side (Right) */}
    <path 
      d="M75 40c-3 0-6 2-6 5s3 5 6 5c0 3 3 5 6 5" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round"
    />
    <circle cx="75" cy="70" r="4" fill="currentColor" />

    {/* The Heart Side (Left) */}
    <path 
      d="M45 45c-2-3-5-3-7-1-2 2-1 5 1 7l6 4 6-4c2-2 3-5 1-7-2-2-5-2-7 1" 
      fill="currentColor" 
      opacity="0.8"
    />
    <circle cx="45" cy="80" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);
