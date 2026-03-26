
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
 * Sequential pulsation: Inner heart beats first (Lub-Dub), then aura radiates.
 * Featuring a beautiful blurry heart icon for high-fidelity organic feel.
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
  
  const stateColor = isHighRisk ? "#DC2626" : isElevated ? "#F59E0B" : "#10B981"; 
  const loopDuration = isHighRisk ? "2s" : isElevated ? "3s" : "4s";

  const labels = {
    en: { resonance: "My Inner Resonance" },
    de: { resonance: "Meine Innere Resonanz" },
    pt: { resonance: "Minha Ressonância" },
    ru: { resonance: "Внутренний Резонанс" }
  };

  const t = labels[lang as keyof typeof labels] || labels.en;

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8 relative font-headline cursor-pointer group animate-in fade-in duration-1000">
      {/* Living Aura Glow Ring - Pulsates sequentially after the inner heart */}
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
        {/* Blurry Living Heart - Pulsates Lub-Dub then rests */}
        <div className="relative">
          <div 
            className="flex items-center justify-center"
            style={{ 
              animation: `heart-beat-inner ${loopDuration} ease-in-out infinite`
            }}
          >
            <Heart 
              className="w-24 h-24 md:w-28 md:h-28 drop-shadow-2xl transition-all duration-700" 
              style={{ 
                color: stateColor, 
                fill: stateColor,
                filter: 'blur(4px)',
                opacity: 0.8
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
