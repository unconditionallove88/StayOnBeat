
"use client";

import React, { useState } from "react";
import { 
  Heart, 
  Users, 
  Star, 
  Flame, 
  User, 
  ShieldCheck, 
  Globe, 
  Infinity, 
  ArrowRight,
  Eye,
  Wind,
  PhoneCall,
  ShieldAlert,
  Users2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { playHeartbeat } from "@/lib/resonance";
import { RadiatingThirdEye } from "@/components/ui/radiating-third-eye";

/**
 * @fileOverview Revolutionary Mandala of Love (Circle of Love).
 * Built on 8 Archetypes: Brother, Mother, Sister, Romantic, Erotic, Friend, Human, Life.
 * Functions as a central portal to Holders, Awareness, Vision, and Breath.
 * Rhythmic Rules: EN (3 words), DE (4 words).
 */

const ARCHETYPES = [
  { id: 'brother', icon: ShieldCheck, color: "text-blue-400", bg: "bg-blue-500/10", en: "Brotherly Protection Love", de: "Brüderlicher Halt heute hier" },
  { id: 'mother', icon: Heart, color: "text-rose-400", bg: "bg-rose-500/10", en: "Motherly Care Love", de: "Mütterliche Fürsorge heute hier" },
  { id: 'sister', icon: User, color: "text-indigo-400", bg: "bg-indigo-500/10", en: "Sisterly Bond Love", de: "Schwesterliche Bindung heute hier" },
  { id: 'romantic', icon: Star, color: "text-pink-400", bg: "bg-pink-500/10", en: "Romantic Unity Love", de: "Romantische Einheit heute hier" },
  { id: 'erotic', icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10", en: "Erotic Fire Love", de: "Erotisches Feuer heute hier" },
  { id: 'friend', icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/10", en: "Friendship Trust Love", de: "Freundschaftliches Vertrauen heute hier" },
  { id: 'human', icon: Globe, color: "text-cyan-400", bg: "bg-cyan-500/10", en: "Humanity Unity Love", de: "Menschliche Einheit heute hier" },
  { id: 'life', icon: Infinity, color: "text-primary", bg: "bg-primary/10", en: "Pure Life Love", de: "Reines Leben heute hier" },
];

export default function LoveCircle({ lang = "en", variant = "dashboard" }: { lang?: string, variant?: "dashboard" | "map" }) {
  const router = useRouter();
  const [activeArchetype, setActiveArchetype] = useState(7); // Default to Life Love
  const isMap = variant === "map";
  
  const current = ARCHETYPES[activeArchetype];
  
  const t = {
    en: { 
      title: "Mandala of Love", 
      sub: "State of Being",
      holders: "The Holders",
      awareness: "Awareness Team",
      vision: "Vision Tool",
      breath: "Breath Ritual",
      enter: "Enter State Now"
    },
    de: { 
      title: "Mandala der Liebe heute", 
      sub: "Zustand des Seins heute",
      holders: "Die Holder heute",
      awareness: "Awareness Team heute",
      vision: "Vision Tool heute",
      breath: "Atem Ritual heute",
      enter: "Zustand jetzt betreten hier"
    }
  }[lang as 'en'|'de'] || { 
    title: "Mandala of Love", 
    sub: "State of Being",
    holders: "The Holders",
    awareness: "Awareness Team",
    vision: "Vision Tool",
    breath: "Breath Ritual",
    enter: "Enter State Now" 
  };

  const handleNav = (path: string) => {
    playHeartbeat();
    router.push(path);
  };

  return (
    <div className="w-full max-w-[500px] mx-auto flex flex-col items-center gap-8 font-headline">
      {/* Revolutionary Mandala Visual */}
      <div 
        className={cn(
          "relative aspect-square rounded-full flex items-center justify-center transition-all duration-1000 overflow-visible",
          isMap ? "w-[280px]" : "w-full"
        )}
      >
        {/* Dynamic Background Aura */}
        <div 
          className="absolute inset-0 rounded-full blur-[80px] opacity-20 animate-pulse transition-all duration-1000" 
          style={{ backgroundColor: current.color.replace('text-', '') }} 
        />

        {/* The Archetype Mandala Ring */}
        {ARCHETYPES.map((arc, i) => {
          const angle = (i * 360) / ARCHETYPES.length;
          const radius = 42; // percentage
          const isActive = activeArchetype === i;

          return (
            <button
              key={arc.id}
              onClick={() => { playHeartbeat(); setActiveArchetype(i); }}
              className={cn(
                "absolute w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-500 border-2 z-20 group shadow-2xl",
                isActive 
                  ? `${arc.bg} ${arc.color.replace('text-', 'border-')} scale-125 shadow-primary/20` 
                  : "bg-black/60 border-white/5 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:scale-110"
              )}
              style={{ 
                left: `${50 + radius * Math.cos((angle * Math.PI) / 180)}%`,
                top: `${50 + radius * Math.sin((angle * Math.PI) / 180)}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <arc.icon className={cn("w-5 h-5 md:w-6 md:h-6", isActive ? arc.color : "text-white/40")} />
              
              {/* Archetype Label Tooltip (Subtle) */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                <span className="text-[7px] font-black uppercase text-white bg-black/80 px-2 py-1 rounded-full border border-white/10 tracking-widest">
                  {lang === 'de' ? arc.de : arc.en}
                </span>
              </div>
            </button>
          );
        })}

        {/* Central Unity Core & Portals */}
        <div className="relative w-48 h-48 md:w-56 md:h-56 bg-black rounded-full border-4 border-primary/20 flex items-center justify-center p-4 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10">
          <div className="absolute inset-4 rounded-full border border-white/5 animate-[spin_30s_linear_infinite]" />
          
          <div className="flex flex-col items-center text-center gap-2 relative z-10">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30 mb-1">
              <RadiatingThirdEye size={36} color="#10B981" />
            </div>
            <h3 className="text-white text-[9px] font-black uppercase tracking-[0.4em] leading-tight">
              {t.title}
            </h3>
            <p className={cn("text-[7px] font-bold uppercase tracking-widest leading-none", current.color)}>
              {lang === 'de' ? current.de : current.en}
            </p>
          </div>

          {/* Core Portals (Inner Circular Ring) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* The Holders Link */}
            <button 
              onClick={() => handleNav('/heart-status')}
              className="absolute top-[15%] left-1/2 -translate-x-1/2 pointer-events-auto p-2 hover:text-primary transition-all group"
            >
              <Users2 size={16} className="text-white/20 group-hover:text-primary" />
              <span className="sr-only">{t.holders}</span>
            </button>

            {/* Awareness Team Link */}
            <button 
              onClick={() => handleNav('/map')}
              className="absolute bottom-[15%] left-1/2 -translate-x-1/2 pointer-events-auto p-2 hover:text-red-500 transition-all group"
            >
              <ShieldAlert size={16} className="text-white/20 group-hover:text-red-500" />
              <span className="sr-only">{t.awareness}</span>
            </button>

            {/* Vision of Love Link */}
            <button 
              onClick={() => handleNav('/dashboard?vision=true')}
              className="absolute left-[15%] top-1/2 -translate-y-1/2 pointer-events-auto p-2 hover:text-blue-400 transition-all group"
            >
              <Eye size={16} className="text-white/20 group-hover:text-blue-400" />
              <span className="sr-only">{t.vision}</span>
            </button>

            {/* Breath of Love Link */}
            <button 
              onClick={() => handleNav('/self-care')}
              className="absolute right-[15%] top-1/2 -translate-y-1/2 pointer-events-auto p-2 hover:text-emerald-400 transition-all group"
            >
              <Wind size={16} className="text-white/20 group-hover:text-emerald-400" />
              <span className="sr-only">{t.breath}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      {!isMap && (
        <div className="w-full max-w-sm animate-in slide-in-from-bottom-4 duration-1000 delay-300">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button 
              onClick={() => handleNav('/heart-status')}
              className="p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center gap-2 hover:border-primary transition-all"
            >
              <Users2 size={20} className="text-primary" />
              <span className="text-[8px] font-black uppercase tracking-widest text-white/40">{t.holders}</span>
            </button>
            <button 
              onClick={() => handleNav('/awareness')}
              className="p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center gap-2 hover:border-red-500 transition-all"
            >
              <ShieldAlert size={20} className="text-red-500" />
              <span className="text-[8px] font-black uppercase tracking-widest text-white/40">{t.awareness}</span>
            </button>
          </div>
          <button 
            onClick={() => handleNav('/heart-status')}
            className="w-full h-16 bg-[#1b4d3e] text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-primary/20"
          >
            {t.enter} <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
