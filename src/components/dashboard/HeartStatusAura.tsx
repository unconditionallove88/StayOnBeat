
"use client";

import React from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  heartRate: number;
  activeSubstances: string[];
  lang?: "en" | "de" | "pt" | "ru";
  mood?: string; 
}

/**
 * @fileOverview Inner Resonance Visualization (Living Heart Aura).
 * Sequential pulsation: Aura glows first, then inner heart beats.
 * Updated: More lovable emerald green color for the inner heart.
 * Supports EN, DE, PT, RU.
 */
export default function HeartStatusAura({ 
  heartRate, 
  activeSubstances, 
  lang = "en"
}: Props) {
  const normalizedSubs = activeSubstances.map(s => s.toLowerCase());
  const hasPoppers = normalizedSubs.some(s => s.includes('poppers'));

  const isHighRisk = heartRate > 130 || (hasPoppers && heartRate > 100);
  const isElevated = heartRate > 100 || activeSubstances.length > 2;
  
  // High-fidelity emerald for the lovable core
  const EMERALD = "#10B981";
  const stateColor = isHighRisk ? "#DC2626" : isElevated ? "#F59E0B" : EMERALD; 
  
  const loopDuration = isHighRisk ? "3s" : isElevated ? "4.5s" : "6s";

  const labels = {
    en: { resonance: "My Inner Resonance" },
    de: { resonance: "Meine Innere Resonanz" },
    pt: { resonance: "Minha Ressonância" },
    ru: { resonance: "Внутренний Резонанс" }
  };

  const t = labels[lang as keyof typeof labels] || labels.en;

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8 relative font-headline cursor-pointer group animate-in fade-in duration-1000">
      {/* Aura Pulsates FIRST in the loop */}
      <div 
        className="absolute w-64 h-64 md:w-80 md:h-80 rounded-full blur-[100px] opacity-20 transition-all duration-1000" 
        style={{ 
          backgroundColor: stateColor, 
          animation: `aura-pulse-outer ${loopDuration} ease-in-out infinite` 
        }} 
      />
      
      {/* Interactive Outer Shell */}
      <div 
        className="relative z-10 w-48 h-48 md:w-56 md:h-56 rounded-full flex items-center justify-center border-2 shadow-2xl transition-all duration-1000 group-hover:scale-105 group-active:scale-95" 
        style={{ 
          borderColor: `${stateColor}30`, 
          backgroundColor: `rgba(0,0,0,0.7)`, 
          boxShadow: `0 0 80px ${stateColor}15` 
        }}
      >
        {/* Subtle Ethereal Heart Pulsates SECOND in the loop */}
        <div className="relative">
          <div 
            className="flex items-center justify-center"
            style={{ 
              animation: `heart-beat-inner ${loopDuration} ease-in-out infinite`
            }}
          >
            <Heart 
              className="w-24 h-24 md:w-28 md:h-28 transition-all duration-700" 
              style={{ 
                color: stateColor, 
                fill: stateColor,
                filter: 'blur(12px)',
                opacity: 0.6,
                filter: `blur(12px) drop-shadow(0 0 15px ${stateColor === EMERALD ? '#10B981' : stateColor})`
              }} 
            />
          </div>
        </div>
      </div>

      <div className="mt-10 md:mt-12 text-center z-10 space-y-1">
        <p className={cn(
          "text-white/40 text-[10px] md:text-[11px] uppercase tracking-[0.6em] font-black",
          lang === 'ru' && "italic font-serif"
        )}>
          {t.resonance}
        </p>
      </div>
    </div>
  );
}
