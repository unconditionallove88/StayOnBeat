
"use client";

import React from "react";
import { HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  heartRate: number;
  activeSubstances: string[];
  lang?: "en" | "de" | "pt" | "ru";
  mood?: string; // Kept for logic but removed from visual rendering as requested
}

/**
 * @fileOverview Inner Resonance Visualization (Aura).
 * Refined for minimalism: Removed redundant status labels.
 * Supports EN, DE, PT, RU.
 * Refined RU typography for a "written" feel.
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
  const pulseDuration = isHighRisk ? "1.5s" : isElevated ? "2.5s" : "4s";

  const labels = {
    en: { resonance: "My Inner Resonance", intense: "Intense", elevated: "Elevated", steady: "Steady" },
    de: { resonance: "Meine Innere Resonanz", intense: "Intensiv", elevated: "Erhöht", steady: "Stabil" },
    pt: { resonance: "Minha Ressonância", intense: "Intenso", elevated: "Elevado", steady: "Estável" },
    ru: { resonance: "Внутренний Резонанс", intense: "Интенсивный", elevated: "Завышен", steady: "Умеренный" }
  };

  const t = labels[lang as keyof typeof labels] || labels.en;

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8 relative font-headline cursor-pointer group animate-in fade-in duration-1000">
      {/* Organic Glow Rings */}
      <div 
        className="absolute w-64 h-64 md:w-80 md:h-80 rounded-full blur-[100px] opacity-20 animate-pulse transition-all duration-1000" 
        style={{ backgroundColor: stateColor, animationDuration: pulseDuration }} 
      />
      <div 
        className="absolute w-48 h-48 md:w-64 md:h-64 rounded-full blur-3xl opacity-30 animate-pulse transition-all duration-1000" 
        style={{ backgroundColor: stateColor, animationDuration: '5s' }} 
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
        <div className="relative">
          <HeartHandshake 
            className="w-24 h-24 md:w-28 md:h-28 drop-shadow-2xl transition-all duration-700" 
            style={{ color: stateColor, opacity: 0.8 }} 
          />
        </div>
      </div>

      <div className="mt-10 md:mt-12 text-center z-10 space-y-1">
        <p className={cn(
          "text-white/20 text-[9px] md:text-[10px] uppercase tracking-[0.6em] font-black",
          lang === 'ru' && "italic font-serif"
        )}>
          {t.resonance}
        </p>
        <h2 className={cn(
          "text-white text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none",
          lang === 'ru' && "italic font-serif"
        )}
        style={{ color: stateColor }}
        >
          {isHighRisk ? t.intense : isElevated ? t.elevated : t.steady}
        </h2>
      </div>
    </div>
  );
}
