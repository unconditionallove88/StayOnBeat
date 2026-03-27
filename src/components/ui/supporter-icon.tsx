import React from "react";

/**
 * @fileOverview SupporterIcon Component.
 * A bespoke icon representing a human with raised hands (inspired by the Algiz rune).
 * Symbolizes protection, connection, and sanctuary.
 */

interface SupporterIconProps {
  size?: number;
  className?: string;
}

export const SupporterIcon = ({ 
  size = 24, 
  className 
}: SupporterIconProps) => (
  <svg 
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
    {/* Head */}
    <circle cx="12" cy="5" r="2" />
    {/* Torso/Body */}
    <path d="M12 7v12" />
    {/* Raised Arms (Algiz Shape) */}
    <path d="M5 5l7 5 7-5" />
  </svg>
);
