
"use client";

import React from "react";
import { HeartHandshake, CircleDot } from "lucide-react";
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
 */
export default function HeartStatusAura({ 
  heartRate, 
  activeSubstances, 
  mood = "Steady", 
  lang = "en"
}: Props) {
  const normalizedSubs = activeSubstances.map(s => s.toLowerCase());
  const hasPoppers = normalizedSubs.some(s => s.includes('poppers'));

  const isHighRisk = heartRate > 130 || (hasPoppers && heartRate > 100);
  const isElevated = heartRate > 100 || activeSubstances.length > 2;
  
  const stateColor = isHighRisk ? "#DC2626" : isElevated ? "#F59E0B" : "#10B981"; 
  const pulseDuration = isHighRisk ? "1s" : isElevated ? "2s" : "4s";

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8 relative font-headline cursor-pointer group">
      <div 
        className="absolute w-64 h-64 md:w-80 md:h-80 rounded-full blur-[80px] opacity-10 animate-pulse transition-all duration-1000"
        style={{ backgroundColor: stateColor, animationDuration: pulseDuration }}
      />
      <div 
        className="absolute w-40 h-40 md:w-56 md:h-56 rounded-full blur-3xl opacity-20 animate-pulse transition-all duration-1000"
        style={{ backgroundColor: stateColor, animationDuration: '3s' }}
      />
      
      <div 
        className="relative z-10 w-44 h-44 md:w-52 md:h-52 rounded-full flex items-center justify-center border-4 shadow-2xl transition-all duration-1000 group-hover:scale-105"
        style={{ 
          borderColor: `${stateColor}40`, 
          backgroundColor: `rgba(0,0,0,0.6)`,
          boxShadow: `0 0 60px ${stateColor}20` 
        }}
      >
        <div className="relative">
          <HeartHandshake 
            className="w-20 h-20 md:w-24 md:h-24 drop-shadow-lg opacity-60" 
            style={{ color: stateColor }} 
          />
          {isHighRisk && (
            <CircleDot className="absolute -top-2 -right-2 text-white animate-pulse" size={24} />
          )}
        </div>
      </div>

      <div className="mt-8 md:mt-12 text-center z-10">
        <p className="text-white/20 text-[9px] md:text-[10px] uppercase tracking-[0.5em] font-black mb-2">
          {lang === "en" ? "My Resonance" : "Meine Resonanz"}
        </p>
        <h2 className="text-white text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none mb-2">
          {isHighRisk ? (lang === 'en' ? "Intense" : "Intensiv") : isElevated ? (lang === 'en' ? "Elevated" : "Erhöht") : (lang === 'en' ? "Steady" : "Stabil")}
        </h2>
        <div className="flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{mood}</p>
        </div>
      </div>
    </div>
  );
}
