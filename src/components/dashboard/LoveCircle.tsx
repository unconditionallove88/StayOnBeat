
"use client";

import React from "react";
import { Users, AlertTriangle, Navigation, Heart, Sparkles, Plus, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

/**
 * @fileOverview Love Circle Component (The Radiant Unity Orb).
 * Redesigned to touch the subconscious through light, clarity, and purity.
 * Represents unconditional love, trust, and collective resonance.
 * Variant="map" is a focused "Eye of Compassion".
 */

interface Friend {
  name: string;
  status: 'steady' | 'elevated' | 'intense';
  color: string;
  avatar: string;
}

interface LoveCircleProps {
  lang?: "en" | "de";
  variant?: "dashboard" | "map";
}

export default function LoveCircle({ 
  lang = "en",
  variant = "dashboard"
}: LoveCircleProps) {
  const isEn = lang === "en";
  const router = useRouter();
  const isMap = variant === "map";
  
  // Mock circle data representing the shared resonance
  const circle: Friend[] = [
    { name: "Sarah", status: "steady", color: "#10B981", avatar: "S" }, 
    { name: "Max", status: "intense", color: "#DC2626", avatar: "M" },
    { name: "Marc", status: "elevated", color: "#F59E0B", avatar: "M" }
  ];

  const handleFriendClick = (friend: Friend) => {
    if (friend.status !== 'steady') {
      router.push(`/map?focus=${friend.name.toLowerCase()}&status=${friend.status}`);
    }
  };

  const hasDistress = circle.some(p => p.status !== 'steady');
  
  const worstStatus = circle.reduce((acc, curr) => {
    if (curr.status === 'intense') return 'intense';
    if (curr.status === 'elevated' && acc !== 'intense') return 'elevated';
    return acc;
  }, 'steady' as 'steady' | 'elevated' | 'intense');

  const circlePulseColor = worstStatus === 'intense' ? "#DC2626" : worstStatus === 'elevated' ? "#F59E0B" : "#10B981";

  const t = {
    en: {
      title: "Love Circle",
      sub: "Radiant Unity",
      souls: "Active Souls",
      distress: "Care Needed",
      sync: "Collective Resonance"
    },
    de: {
      title: "Circle of Love",
      sub: "Strahlende Einheit",
      souls: "Verbundene Seelen",
      distress: "Fürsorge benötigt",
      sync: "Gemeinsame Resonanz"
    }
  }[lang];

  return (
    <div 
      className={cn(
        "relative aspect-square rounded-full flex flex-col items-center justify-center transition-all duration-1000 font-headline overflow-hidden border-2",
        isMap 
          ? "w-[240px] md:w-[260px] bg-black/60 backdrop-blur-3xl pointer-events-auto shadow-[0_0_60px_rgba(0,0,0,0.8)]" 
          : "w-full max-w-[400px] mx-auto bg-white/[0.02] shadow-[0_0_80px_rgba(16,185,129,0.05)]"
      )}
      style={{ 
        borderColor: `${circlePulseColor}30`,
        boxShadow: isMap ? `0 0 40px ${circlePulseColor}15` : `0 0 100px ${circlePulseColor}05`
      }}
    >
      {/* 1. RADIANT RESONANCE LAYERS (Subconscious anchors for safety and unity) */}
      <div 
        className="absolute inset-0 opacity-30 animate-pulse-heart pointer-events-none" 
        style={{ 
          background: `radial-gradient(circle at center, ${circlePulseColor}22 0%, transparent 70%)`,
          animationDuration: worstStatus === 'intense' ? '1.5s' : '4s'
        }} 
      />
      
      {/* 2. HEADER: PURITY & CLARITY */}
      {!isMap && (
        <div className="text-center z-10 shrink-0 pt-10 mb-2">
          <div className="flex flex-col items-center gap-2">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-700",
              worstStatus === 'steady' ? "bg-[#10B981]/10 border border-[#10B981]/30" : 
              "bg-red-600/10 border border-red-600/30"
            )}>
              <ShieldCheck size={18} style={{ color: circlePulseColor }} className="animate-pulse" />
            </div>
            <h3 className="text-white text-[10px] font-black uppercase tracking-[0.5em] drop-shadow-md">
              {t.title}
            </h3>
            <p className="text-[8px] font-bold text-[#10B981] uppercase tracking-widest opacity-60">
              {t.sub}
            </p>
          </div>
        </div>
      )}

      {/* 3. SOUL NODES: UNITY & TRUST */}
      <div className={cn("flex-1 w-full flex items-center justify-center px-6 z-10 overflow-hidden", isMap ? "pt-4" : "")}>
        <div className={cn("flex flex-wrap justify-center", isMap ? "gap-3" : "gap-5 md:gap-8")}>
          {circle.map((person, i) => (
            <div key={i} className="flex flex-col items-center gap-2 group/node">
              <button 
                onClick={() => handleFriendClick(person)}
                className={cn(
                  "relative rounded-full flex items-center justify-center font-black text-black transition-all duration-700 hover:scale-110 active:scale-95 group/avatar",
                  isMap ? "w-12 h-12 text-[11px]" : "w-16 h-16 text-xs",
                  person.status === 'intense' && "animate-alert-pulse",
                )}
                style={{ 
                  backgroundColor: person.status === 'intense' ? '#DC2626' : person.status === 'elevated' ? '#F59E0B' : '#10B981',
                  boxShadow: `0 0 25px ${person.status === 'intense' ? 'rgba(220,38,38,0.4)' : 'rgba(16,185,129,0.2)'}`
                }}
              >
                {/* UNITY RINGS */}
                <div className={cn(
                  "absolute inset-[-6px] rounded-full border border-white/5 transition-opacity group-hover/node:opacity-100 opacity-40",
                  person.status !== 'steady' && "border-white/20 animate-ping"
                )} />

                <span className="group-hover/avatar:scale-110 transition-transform relative z-10 uppercase tracking-tighter">{person.avatar}</span>
                
                {person.status !== 'steady' && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-black rounded-full border border-white/20 flex items-center justify-center shadow-2xl z-20">
                    <Heart size={10} className="text-white fill-white" />
                  </div>
                )}
              </button>
              {!isMap && (
                <span className={cn(
                  "text-[8px] font-black uppercase tracking-widest transition-colors",
                  person.status === 'intense' ? "text-red-500" : person.status === 'elevated' ? "text-amber-500" : "text-white/40"
                )}>
                  {person.name}
                </span>
              )}
            </div>
          ))}
          
          <button 
            className={cn(
              "rounded-full border-2 border-dashed border-white/10 bg-white/5 flex items-center justify-center text-white/20 hover:text-[#10B981] hover:border-[#10B981]/40 hover:bg-[#10B981]/5 transition-all duration-500",
              isMap ? "w-12 h-12" : "w-16 h-16"
            )}
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* 4. RESONANCE FOOTER: COLLECTIVE CARE */}
      <div className={cn("z-10 shrink-0 w-full", isMap ? "pb-6 px-6" : "pb-10 px-10")}>
        {hasDistress ? (
          <button 
            onClick={() => router.push('/map?focus=max&status=intense')}
            className={cn(
              "w-full rounded-2xl flex flex-col items-center justify-center transition-all active:scale-95 group/sos bg-red-600/10 border border-red-600/20 py-3",
              isMap ? "animate-in slide-in-from-bottom-2" : ""
            )}
          >
            <div className="flex items-center gap-2">
              <Navigation size={10} className="text-red-500 animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-red-500">{t.distress}</span>
            </div>
          </button>
        ) : (
          <div className="text-center opacity-30 flex flex-col items-center gap-1">
            <Sparkles size={12} className="text-[#10B981]" />
            <p className="text-[7px] font-black text-white uppercase tracking-[0.6em]">{t.sync}</p>
          </div>
        )}
      </div>
    </div>
  );
}
