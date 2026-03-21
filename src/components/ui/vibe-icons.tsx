import React from "react";

/**
 * @fileOverview Resonance Icons Component.
 * Bespoke high-fidelity SVG icons for the sanctuary's Mood Check-in system.
 * Designed to touch consciousness and subconsciousness through light, clarity, and unity.
 */

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

export const RadiantIcon = ({ size = 48, className, color = "currentColor" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className}>
    <defs>
      <filter id="radiantGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <g filter="url(#radiantGlow)">
      <path d="M60 35c-5-8-20-8-25 0-5 8 0 20 10 25l15 10 15-10c10-5 15-17 10-25-5-8-20-8-25 0z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <line key={angle} x1="60" y1="60" x2={60 + 35 * Math.cos((angle * Math.PI) / 180)} y2={60 + 35 * Math.sin((angle * Math.PI) / 180)} stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      ))}
    </g>
  </svg>
);

export const HarmonyIcon = ({ size = 48, className, color = "currentColor" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className}>
    <g stroke={color} strokeWidth="4" strokeLinecap="round">
      <circle cx="50" cy="60" r="25" strokeOpacity="0.3" />
      <circle cx="70" cy="60" r="25" strokeOpacity="0.3" />
      <path d="M60 45c-5-5-12-5-15 0-3 5 0 12 15 20 15-8 18-15 15-20-3-5-10-5-15 0z" fill={color} fillOpacity="0.2" />
    </g>
  </svg>
);

export const CalmIcon = ({ size = 48, className, color = "currentColor" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className}>
    <path d="M60 90c0-30 25-50 25-50s-25 0-25 30c0-30-25-30-25-30s25 20 25 50z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="4" strokeLinejoin="round" />
    <line x1="60" y1="90" x2="60" y2="40" stroke={color} strokeWidth="2" strokeDasharray="4 4" />
  </svg>
);

export const HazyIcon = ({ size = 48, className, color = "currentColor" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className}>
    <circle cx="60" cy="60" r="30" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="2" strokeDasharray="8 4" />
    <circle cx="60" cy="60" r="20" fill={color} fillOpacity="0.15" />
    <circle cx="60" cy="60" r="10" fill={color} fillOpacity="0.2" />
  </svg>
);

export const HeldIcon = ({ size = 48, className, color = "currentColor" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className}>
    <path d="M35 75c0 15 15 25 25 25s25-10 25-25" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.4" />
    <path d="M60 65c-3-3-8-3-10 0-2 3 0 8 10 12 10-4 12-9 10-12-2-3-7-3-10 0z" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="2" />
    <path d="M30 60c5-5 10-2 10 5M90 60c-5-5-10-2-10 5" stroke={color} strokeWidth="3" strokeLinecap="round" />
  </svg>
);
