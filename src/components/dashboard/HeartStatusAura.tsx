
"use client";

import React from "react";
import { HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  heartRate: number;
  activeSubstances: string[];
  lang?: "en" | "de";
  mood?: string;
}

/**
 * @fileOverview Love Circle Visualization.
 * Serves as a pure, radiant visual of the user's inner rhythm.
 * Interactive nodes moved to the detailed status page for visual clarity.
 */
export default function HeartStatusAura({ 
  heartRate, 
  activeSubstances, 
  mood = "Steady", 
  lang = "en"
}: Props) {
  const normalizedSubs = activeSubstances.map(s => s.toLowerCase());
  const hasPoppers = normalizedSubs.some(s => s.includes('poppers'));

  // Determine the "State"
  const isHighRisk = heartRate > 130 || (hasPoppers && heartRate > 100);
  const isElevated = heartRate > 100 || activeSubstances.length > 2;
  
  // High-fidelity color palette
  const stateColor = isHighRisk ? "#DC2626" : isElevated ? "#F59E0B" : "#90EE90"; 
  const pulseDuration = isHighRisk ? "1s" : isElevated ? "2s" : "4s";

  return (
    <div className="flex flex-col items-center justify-center p-8 relative font-headline cursor-pointer group">
      {/* The Breathing Aura */}
      <div 
        className="absolute w-64 h-64 rounded-full blur-3xl opacity-20 animate-pulse transition-all duration-1000 group-hover:opacity-30"
        style={{ backgroundColor: stateColor, animationDuration: pulseDuration }}
      />
      
      {/* The Central Heart Container */}
      <div 
        className="relative z-10 w-48 h-48 rounded-full flex items-center justify-center border-4 shadow-2xl transition-all duration-1000 group-hover:scale-105"
        style={{ 
          borderColor: `${stateColor}40`, 
          backgroundColor: `${stateColor}10`,
          boxShadow: `0 0 60px ${stateColor}20` 
        }}
      >
        <HeartHandshake size={80} style={{ color: stateColor }} className="drop-shadow-lg opacity-40 absolute inset-0 m-auto" />
      </div>

      {/* Status Text */}
      <div className="mt-12 text-center z-10">
        <p className="text-white/30 text-[10px] uppercase tracking-[0.4em] font-black mb-2">
          {lang === "en" ? `My Mood: ${mood}` : `Meine Stimmung: ${mood}`}
        </p>
        <h2 className="text-white text-3xl font-black uppercase tracking-tighter leading-none">
          {isHighRisk ? (lang === 'en' ? "Intense" : "Intensiv") : isElevated ? (lang === 'en' ? "Elevated" : "Erhöht") : (lang === 'en' ? "Steady" : "Stetig")}
        </h2>
      </div>
    </div>
  );
}
