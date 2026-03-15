
"use client";

import React from "react";
import { HeartHandshake } from "lucide-react";

interface Props {
  heartRate: number;
  activeSubstances: string[];
  lang?: "en" | "de";
  mood?: string;
}

/**
 * @fileOverview HeartStatusAura Component.
 * Visualizes the user's physiological rhythm with a high-fidelity "breathing" animated aura.
 * Calibrated with Light Green (#90EE90) for the steady state.
 */
export default function HeartStatusAura({ heartRate, activeSubstances, mood = "Steady", lang = "en" }: Props) {
  const normalizedSubs = activeSubstances.map(s => s.toLowerCase());
  const hasPoppers = normalizedSubs.some(s => s.includes('poppers'));

  // Determine the "State"
  const isHighRisk = heartRate > 130 || (hasPoppers && heartRate > 100);
  const isElevated = heartRate > 100 || activeSubstances.length > 2;
  
  // High-fidelity color palette
  const stateColor = isHighRisk ? "#DC2626" : isElevated ? "#F59E0B" : "#90EE90"; 
  const pulseDuration = isHighRisk ? "1s" : isElevated ? "2s" : "4s";

  return (
    <div className="flex flex-col items-center justify-center p-8 relative font-headline">
      {/* The Breathing Aura */}
      <div 
        className="absolute w-56 h-56 rounded-full blur-3xl opacity-20 animate-pulse transition-all duration-1000"
        style={{ backgroundColor: stateColor, animationDuration: pulseDuration }}
      />
      
      {/* The Central Heart Icon (Love & Care theme) */}
      <div 
        className="relative z-10 w-32 h-32 rounded-full flex items-center justify-center border-4 shadow-2xl transition-all duration-1000"
        style={{ 
          borderColor: `${stateColor}40`, 
          backgroundColor: `${stateColor}10`,
          boxShadow: `0 0 50px ${stateColor}20` 
        }}
      >
        <HeartHandshake size={64} style={{ color: stateColor }} className="drop-shadow-lg" />
      </div>

      {/* Status Text */}
      <div className="mt-8 text-center z-10">
        <p className="text-white/30 text-[10px] uppercase tracking-[0.4em] font-black mb-2">
          {lang === "en" ? `My Heart: ${mood}` : `Mein Herz: ${mood}`}
        </p>
        <h2 className="text-white text-3xl font-black uppercase tracking-tighter leading-none">
          {isHighRisk ? (lang === 'en' ? "Intense" : "Intensiv") : isElevated ? (lang === 'en' ? "Elevated" : "Erhöht") : (lang === 'en' ? "Steady" : "Stetig")}
        </h2>
      </div>
    </div>
  );
}
