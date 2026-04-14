
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
  ShieldAlert,
  Users2,
  Activity,
  Thermometer
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { playHeartbeat } from "@/lib/resonance";
import { RadiatingThirdEye } from "@/components/ui/radiating-third-eye";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * @fileOverview Organic Circle of Love.
 * Built on 8 Archetypes with Friend Resonance integration.
 * Portals lead to Holders, Immediate Help, Vision, and Breath.
 */

const ARCHETYPES = [
  { id: 'brother', icon: ShieldCheck, color: "text-blue-400", bg: "bg-blue-500/10", en: "Brotherly Protection Love", de: "Brüderlicher Halt heute hier", sentence: "I am protected and held" },
  { id: 'mother', icon: Heart, color: "text-rose-400", bg: "bg-rose-500/10", en: "Motherly Care Love", de: "Mütterliche Fürsorge heute hier", sentence: "Nurturing love surrounds me" },
  { id: 'sister', icon: User, color: "text-indigo-400", bg: "bg-indigo-500/10", en: "Sisterly Bond Love", de: "Schwesterliche Bindung heute hier", sentence: "Shared strength in unity" },
  { id: 'romantic', icon: Star, color: "text-pink-400", bg: "bg-pink-500/10", en: "Romantic Unity Love", de: "Romantische Einheit heute hier", sentence: "Hearts beating as one" },
  { id: 'erotic', icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10", en: "Erotic Fire Love", de: "Erotisches Feuer heute hier", sentence: "Passion flows through life" },
  { id: 'friend', icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/10", en: "Friendship Trust Love", de: "Freundschaftliches Vertrauen heute hier", sentence: "Trust is our foundation" },
  { id: 'human', icon: Globe, color: "text-cyan-400", bg: "bg-cyan-500/10", en: "Humanity Unity Love", de: "Menschliche Einheit heute hier", sentence: "We are all connected" },
  { id: 'life', icon: Infinity, color: "text-primary", bg: "bg-primary/10", en: "Pure Life Love", de: "Reines Leben heute hier", sentence: "Existence is a gift" },
];

const MOCK_FRIENDS = [
  { id: 'f1', name: 'MAX', hr: 72, temp: 36.6, active: true },
  { id: 'f2', name: 'LUNA', hr: 88, temp: 37.1, active: true },
  { id: 'f3', name: 'SOUL', hr: 65, temp: 36.4, active: true },
];

export default function LoveCircle({ lang = "en", variant = "dashboard" }: { lang?: string, variant?: "dashboard" | "map" }) {
  const router = useRouter();
  const [activeArchetype, setActiveArchetype] = useState(7);
  const isMap = variant === "map";
  
  const current = ARCHETYPES[activeArchetype];
  const currentLang = lang.toLowerCase() as 'en' | 'de';
  
  const t = {
    en: { 
      sub: "State of Being",
      holders: "The Holders",
      help: "Immediate Help",
      vision: "Vision of Love",
      breath: "Breath of Love",
      enter: "Enter resonance now",
      vitals: "Live Resonance"
    },
    de: { 
      sub: "Zustand des Seins heute",
      holders: "Die Holder heute",
      help: "Sofortige Hilfe heute",
      vision: "Vision der Liebe heute",
      breath: "Atem der Liebe heute",
      enter: "Resonanz jetzt betreten",
      vitals: "Live Resonanz"
    }
  }[currentLang] || { 
    sub: "State of Being",
    holders: "The Holders",
    help: "Immediate Help",
    vision: "Vision of Love",
    breath: "Breath of Love",
    enter: "Enter resonance now",
    vitals: "Live Resonance"
  };

  const handleNav = (path: string) => {
    playHeartbeat();
    router.push(path);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="w-full max-w-[500px] mx-auto flex flex-col items-center gap-8 font-headline">
        <div 
          className={cn(
            "relative aspect-square rounded-full flex items-center justify-center transition-all duration-1000 overflow-visible",
            isMap ? "w-[300px]" : "w-full"
          )}
        >
          {/* Radiant Background Aura */}
          <div 
            className="absolute inset-0 rounded-full blur-[80px] opacity-20 animate-pulse transition-all duration-1000" 
            style={{ backgroundColor: current.color.replace('text-', '') }} 
          />

          {/* Archetype Ring */}
          {ARCHETYPES.map((arc, i) => {
            const angle = (i * 360) / ARCHETYPES.length;
            const radius = 44; 
            const isActive = activeArchetype === i;

            return (
              <Tooltip key={arc.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => { playHeartbeat(); setActiveArchetype(i); }}
                    className={cn(
                      "absolute w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-500 border-2 z-20 group shadow-2xl",
                      isActive 
                        ? `${arc.bg} ${arc.color.replace('text-', 'border-')} scale-125` 
                        : "bg-black/60 border-white/5 grayscale opacity-40 hover:grayscale-0 hover:opacity-100"
                    )}
                    style={{ 
                      left: `${50 + radius * Math.cos((angle * Math.PI) / 180)}%`,
                      top: `${50 + radius * Math.sin((angle * Math.PI) / 180)}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <arc.icon className={cn("w-5 h-5 md:w-6 md:h-6", isActive ? arc.color : "text-white/40")} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-black/90 border-white/10 px-4 py-2 rounded-xl text-center">
                  <p className={cn("text-[10px] font-black uppercase tracking-widest", arc.color)}>
                    {currentLang === 'de' ? arc.de : arc.en}
                  </p>
                  <p className="text-[8px] text-white/40 font-bold uppercase mt-1 italic">"{arc.sentence}"</p>
                </TooltipContent>
              </Tooltip>
            );
          })}

          {/* Central Unity Core */}
          <div className="relative w-52 h-52 md:w-64 md:h-64 bg-black rounded-full border-2 border-primary/10 flex items-center justify-center p-4 shadow-[0_0_60px_rgba(0,0,0,0.9)] z-10">
            {/* Friends Resonance Grid */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {MOCK_FRIENDS.map((friend, idx) => {
                const fAngle = (idx * 360) / MOCK_FRIENDS.length;
                const fRadius = 32; 
                return (
                  <div 
                    key={friend.id}
                    className="absolute flex flex-col items-center gap-1 animate-in fade-in zoom-in duration-1000"
                    style={{ 
                      left: `${50 + fRadius * Math.cos((fAngle * Math.PI) / 180)}%`,
                      top: `${50 + fRadius * Math.sin((fAngle * Math.PI) / 180)}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" style={{ animationDuration: `${(60/friend.hr) * 1000}ms` }} />
                      <Users2 size={12} className="text-primary relative z-10" />
                    </div>
                    <div className="bg-black/60 px-1.5 py-0.5 rounded-full border border-white/5 flex flex-col items-center">
                      <span className="text-[6px] font-black text-white/60">{friend.name}</span>
                      <div className="flex items-center gap-1">
                        <Activity size={6} className="text-red-400" />
                        <span className="text-[5px] font-bold text-white/40">{friend.hr}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col items-center text-center gap-2 relative z-10">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 mb-1">
                <RadiatingThirdEye size={32} color="#10B981" />
              </div>
              <p className={cn("text-[8px] font-bold uppercase tracking-[0.2em] leading-none transition-colors duration-500", current.color)}>
                {currentLang === 'de' ? current.de : current.en}
              </p>
            </div>

            {/* Nav Portals (Inner ring) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={() => handleNav('/heart-status')} className="absolute top-[12%] left-1/2 -translate-x-1/2 pointer-events-auto p-2 text-white/20 hover:text-primary transition-all">
                    <Users2 size={18} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-zinc-900 border-white/10 text-[9px] font-black uppercase text-primary">{t.holders}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={() => handleNav('/map?sos=true')} className="absolute bottom-[12%] left-1/2 -translate-x-1/2 pointer-events-auto p-2 text-white/20 hover:text-red-500 transition-all">
                    <ShieldAlert size={18} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-zinc-900 border-white/10 text-[9px] font-black uppercase text-red-500">{t.help}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={() => handleNav('/dashboard?vision=true')} className="absolute left-[12%] top-1/2 -translate-y-1/2 pointer-events-auto p-2 text-white/20 hover:text-blue-400 transition-all">
                    <Eye size={18} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" className="bg-zinc-900 border-white/10 text-[9px] font-black uppercase text-blue-400">{t.vision}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={() => handleNav('/self-care')} className="absolute right-[12%] top-1/2 -translate-y-1/2 pointer-events-auto p-2 text-white/20 hover:text-emerald-400 transition-all">
                    <Wind size={18} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-zinc-900 border-white/10 text-[9px] font-black uppercase text-emerald-400">{t.breath}</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Organic Action Portal */}
        {!isMap && (
          <div className="w-full max-w-sm animate-in slide-in-from-bottom-4 duration-1000 delay-300">
            <button 
              onClick={() => handleNav('/heart-status')}
              className="w-full h-20 bg-primary/10 border-2 border-primary/20 backdrop-blur-xl text-white rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-4 active:scale-95 transition-all shadow-2xl hover:bg-primary/20 hover:border-primary/40 group"
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart size={20} className="text-primary fill-primary" />
              </div>
              {t.enter}
              <ArrowRight size={18} className="text-primary group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-center text-[8px] font-black uppercase tracking-[0.5em] text-white/20 mt-6">
              Circle of Love • Collective Resonance
            </p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
