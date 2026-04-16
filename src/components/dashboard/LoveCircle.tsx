
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
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { playHeartbeat } from "@/lib/resonance";
import { RadiatingThirdEye } from "@/components/ui/radiating-third-eye";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * @fileOverview Organic Circle of Love (Aura Ring Edition).
 * Recreated to function as a tender Aura Ring.
 * Pulsation intensity is subtly linked to BPM (higher BPM = slightly more intense).
 */

const ARCHETYPES = [
  { id: 'brother', icon: ShieldCheck, color: "text-blue-200", bg: "bg-blue-500/5", en: "Brotherly Protection Love", de: "Brüderlicher Halt heute hier", sentence: "I am protected and held" },
  { id: 'mother', icon: Heart, color: "text-rose-200", bg: "bg-rose-500/5", en: "Motherly Care Love", de: "Mütterliche Fürsorge heute hier", sentence: "Nurturing love surrounds me" },
  { id: 'sister', icon: User, color: "text-indigo-200", bg: "bg-indigo-500/5", en: "Sisterly Bond Love", de: "Schwesterliche Bindung heute hier", sentence: "Shared strength in unity" },
  { id: 'romantic', icon: Star, color: "text-pink-200", bg: "bg-pink-500/5", en: "Romantic Unity Love", de: "Romantische Einheit heute hier", sentence: "Hearts beating as one" },
  { id: 'erotic', icon: Flame, color: "text-orange-200", bg: "bg-orange-500/5", en: "Erotic Fire Love", de: "Erotisches Feuer heute hier", sentence: "Passion flows through life" },
  { id: 'friend', icon: Users, color: "text-emerald-200", bg: "bg-emerald-500/5", en: "Friendship Trust Love", de: "Freundschaftliches Vertrauen heute hier", sentence: "Trust is our foundation" },
  { id: 'human', icon: Globe, color: "text-cyan-200", bg: "bg-cyan-500/5", en: "Humanity Unity Love", de: "Menschliche Einheit heute hier", sentence: "We are all connected" },
  { id: 'life', icon: Infinity, color: "text-primary", bg: "bg-primary/5", en: "Pure Life Love", de: "Reines Leben heute hier", sentence: "Existence is a gift" },
];

const MOCK_FRIENDS = [
  { id: 'f1', name: 'MAX', hr: 72, active: true },
  { id: 'f2', name: 'LUNA', hr: 88, active: true },
];

export default function LoveCircle({ lang = "en", variant = "dashboard", heartRate = 75 }: { lang?: string, variant?: "dashboard" | "map", heartRate?: number }) {
  const [activeArchetype, setActiveArchetype] = useState(7);
  const current = ARCHETYPES[activeArchetype];
  const currentLang = lang.toLowerCase() as 'en' | 'de';

  const pulseDuration = `${(60 / heartRate).toFixed(2)}s`;
  
  // Calculate pulse intensity based on BPM
  // Higher BPM = more expansion and higher opacity
  const pulseIntensity = heartRate > 120 ? 0.25 : (heartRate > 90 ? 0.15 : 0.08);
  const pulseOpacity = heartRate > 120 ? 0.4 : (heartRate > 90 ? 0.25 : 0.15);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="w-full max-w-[450px] mx-auto flex flex-col items-center gap-8 font-headline">
        <div className="relative aspect-square w-full rounded-full flex items-center justify-center transition-all duration-1000 overflow-visible">
          
          {/* Immersive Aura Ring Glow (Less intense by default, scales with BPM) */}
          <div 
            className="absolute inset-0 rounded-full blur-[100px] transition-all duration-1000" 
            style={{ 
              backgroundColor: 'hsl(var(--primary))',
              opacity: pulseOpacity,
              transform: `scale(${1 + (pulseIntensity * 0.5)})`,
              // We use a custom inline animation for the "tender" feel
              animation: `tender-aura-ring ${pulseDuration} ease-in-out infinite`
            }} 
          />
          
          {/* Style for the custom tender animation */}
          <style jsx>{`
            @keyframes tender-aura-ring {
              0%, 100% { transform: scale(1); opacity: ${pulseOpacity}; }
              50% { transform: scale(${1 + pulseIntensity}); opacity: ${pulseOpacity * 1.5}; }
            }
          `}</style>

          {/* Archetype Ring */}
          {ARCHETYPES.map((arc, i) => {
            const angle = (i * 360) / ARCHETYPES.length;
            const radius = 42; 
            const isActive = activeArchetype === i;

            return (
              <Tooltip key={arc.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => { playHeartbeat(); setActiveArchetype(i); }}
                    className={cn(
                      "absolute w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border-2 z-20 group",
                      isActive 
                        ? `${arc.bg} border-primary/40 scale-110 shadow-xl` 
                        : "bg-black/40 border-white/5 opacity-40 hover:opacity-100"
                    )}
                    style={{ 
                      left: `${50 + radius * Math.cos((angle * Math.PI) / 180)}%`,
                      top: `${50 + radius * Math.sin((angle * Math.PI) / 180)}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <arc.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-white/20")} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-black/95 border-white/10 px-4 py-2 rounded-xl text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                    {currentLang === 'de' ? arc.de : arc.en}
                  </p>
                  <p className="text-[8px] text-white/40 font-bold uppercase mt-1 italic">"{arc.sentence}"</p>
                </TooltipContent>
              </Tooltip>
            );
          })}

          {/* Unity Core (Mirror Reflection of Aura Ring) */}
          <div className="relative w-48 h-48 md:w-56 md:h-56 bg-black rounded-full border-2 border-white/5 flex items-center justify-center p-4 shadow-2xl z-10 overflow-hidden">
            {/* Ambient inner pulse */}
            <div 
              className="absolute inset-0 bg-primary/5 rounded-full transition-all duration-1000"
              style={{ 
                animation: `heart-beat-inner ${pulseDuration} ease-in-out infinite`,
                opacity: heartRate > 110 ? 0.2 : 0.1
              }}
            />

            {/* Friends Nodes */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {MOCK_FRIENDS.map((friend, idx) => {
                const fAngle = (idx * 360) / MOCK_FRIENDS.length + 45;
                const fRadius = 32; 
                return (
                  <div 
                    key={friend.id}
                    className="absolute flex flex-col items-center gap-1"
                    style={{ 
                      left: `${50 + fRadius * Math.cos((fAngle * Math.PI) / 180)}%`,
                      top: `${50 + fRadius * Math.sin((fAngle * Math.PI) / 180)}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center relative backdrop-blur-sm">
                      <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" style={{ animationDuration: pulseDuration }} />
                      <Sparkles size={11} className="text-primary" />
                    </div>
                    <span className="text-[7px] font-black text-white/20 uppercase tracking-tighter">{friend.name}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col items-center text-center gap-2 relative z-10">
              <div 
                className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10 mb-1 transition-all"
                style={{ 
                  animation: `heart-beat-inner ${pulseDuration} ease-in-out infinite`
                }}
              >
                <RadiatingThirdEye size={36} color="hsl(var(--primary))" className="opacity-80" />
              </div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/60 leading-none">
                {currentLang === 'de' ? current.de : current.en}
              </p>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
