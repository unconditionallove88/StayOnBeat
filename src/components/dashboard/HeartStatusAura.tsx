
"use client";

import React from "react";
import { HeartHandshake, Shield, Users2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  heartRate: number;
  activeSubstances: string[];
  lang?: "en" | "de";
  mood?: string;
  onHoldersClick?: () => void;
  onWitnessesClick?: () => void;
}

/**
 * @fileOverview HeartStatusAura Component.
 * Visualizes the user's physiological rhythm with a high-fidelity "breathing" animated aura.
 * Now features interactive nodes for The Holders and The Witnesses inside the heart circle.
 */
export default function HeartStatusAura({ 
  heartRate, 
  activeSubstances, 
  mood = "Steady", 
  lang = "en",
  onHoldersClick,
  onWitnessesClick
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
    <div className="flex flex-col items-center justify-center p-8 relative font-headline">
      {/* The Breathing Aura */}
      <div 
        className="absolute w-64 h-64 rounded-full blur-3xl opacity-20 animate-pulse transition-all duration-1000"
        style={{ backgroundColor: stateColor, animationDuration: pulseDuration }}
      />
      
      {/* The Central Heart Container */}
      <div 
        className="relative z-10 w-48 h-48 rounded-full flex items-center justify-center border-4 shadow-2xl transition-all duration-1000"
        style={{ 
          borderColor: `${stateColor}40`, 
          backgroundColor: `${stateColor}10`,
          boxShadow: `0 0 60px ${stateColor}20` 
        }}
      >
        <HeartHandshake size={80} style={{ color: stateColor }} className="drop-shadow-lg opacity-40 absolute inset-0 m-auto" />

        {/* INTERACTIVE NODES */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* HOLDERS NODE */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onHoldersClick?.();
            }}
            className="absolute -left-2 w-14 h-14 bg-black/80 border-2 border-[#10B981] rounded-full flex items-center justify-center text-[#10B981] shadow-lg shadow-[#10B981]/20 active:scale-90 transition-all pointer-events-auto hover:bg-[#10B981] hover:text-black group"
          >
            <Shield size={20} className="group-hover:scale-110 transition-transform" />
            <span className="absolute -bottom-6 text-[7px] font-black uppercase tracking-widest text-[#10B981] whitespace-nowrap">Holders</span>
          </button>

          {/* WITNESSES NODE */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onWitnessesClick?.();
            }}
            className="absolute -right-2 w-14 h-14 bg-black/80 border-2 border-amber-500 rounded-full flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/20 active:scale-90 transition-all pointer-events-auto hover:bg-amber-500 hover:text-black group"
          >
            <Users2 size={20} className="group-hover:scale-110 transition-transform" />
            <span className="absolute -bottom-6 text-[7px] font-black uppercase tracking-widest text-amber-500 whitespace-nowrap">Witnesses</span>
          </button>
        </div>
      </div>

      {/* Status Text */}
      <div className="mt-12 text-center z-10">
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
