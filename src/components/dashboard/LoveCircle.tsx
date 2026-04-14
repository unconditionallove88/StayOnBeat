
"use client";

import React, { useState } from "react";
import { Heart, Users, Star, Flame, Sparkles, User, ShieldCheck, Globe, Infinity, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { playHeartbeat } from "@/lib/resonance";

/**
 * @fileOverview Circle of Love (State of Love Mandala).
 * Built on 8 Archetypes: Brother, Mother, Sister, Romantic, Erotic, Friend, Human, Life.
 * Languages: EN (3 words), DE (4 words).
 */

const ARCHETYPES = [
  { id: 'brother', icon: ShieldCheck, color: "text-blue-400", bg: "bg-blue-500/10", en: "Brotherly Protection Love", de: "Brüderlicher Halt heute hier" },
  { id: 'mother', icon: Heart, color: "text-rose-400", bg: "bg-rose-500/10", en: "Motherly Care Love", de: "Mütterliche Fürsorge heute hier" },
  { id: 'sister', icon: User, color: "text-indigo-400", bg: "bg-indigo-500/10", en: "Sisterly Bond Love", de: "Schwesterlicher Schutz heute hier" },
  { id: 'romantic', icon: Star, color: "text-pink-400", bg: "bg-pink-500/10", en: "Romantic Unity Love", de: "Romantische Nähe heute hier" },
  { id: 'erotic', icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10", en: "Erotic Fire Love", de: "Erotische Spannung heute hier" },
  { id: 'friend', icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/10", en: "Friendship Trust Love", de: "Freundschaftlicher Bund heute hier" },
  { id: 'human', icon: Globe, color: "text-cyan-400", bg: "bg-cyan-500/10", en: "Humanity Unity Love", de: "Menschliche Einheit heute hier" },
  { id: 'life', icon: Infinity, color: "text-primary", bg: "bg-primary/10", en: "Pure Life Love", de: "Leben ist Liebe heute" },
];

export default function LoveCircle({ lang = "en", variant = "dashboard" }: { lang?: string, variant?: "dashboard" | "map" }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const isMap = variant === "map";
  
  const current = ARCHETYPES[activeTab];
  const t = {
    en: { title: "State of Love", sub: "Circle of Love", enter: "Enter State Now" },
    de: { title: "Zustand der Liebe heute", sub: "Circle of Love", enter: "Zustand jetzt betreten hier" }
  }[lang as 'en'|'de'] || { title: "State of Love", sub: "Circle of Love", enter: "Enter State Now" };

  return (
    <div 
      className={cn(
        "relative aspect-square rounded-full flex flex-col items-center justify-center transition-all duration-1000 font-headline overflow-hidden border-2",
        isMap 
          ? "w-[280px] md:w-[300px] bg-black/80 backdrop-blur-3xl border-white/5" 
          : "w-full max-w-[450px] mx-auto bg-white/[0.02] border-white/5 shadow-2xl"
      )}
      style={{ boxShadow: `0 0 100px ${current.color.replace('text-', '')}05` }}
    >
      {/* Background Archetype Pulse */}
      <div 
        className="absolute inset-0 opacity-20 animate-pulse-heart pointer-events-none" 
        style={{ background: `radial-gradient(circle at center, ${current.color.replace('text-', '')}33 0%, transparent 70%)` }} 
      />

      <div className="z-10 text-center mb-4 shrink-0 pt-8">
        <h3 className="text-white text-[10px] font-black uppercase tracking-[0.5em]">{t.title}</h3>
        <p className="text-primary text-[8px] font-bold uppercase tracking-widest opacity-60 mt-1">{t.sub}</p>
      </div>

      {/* Archetype Mandala */}
      <div className="relative flex-1 w-full flex items-center justify-center pointer-events-auto">
        {ARCHETYPES.map((arc, i) => {
          const angle = (i * 360) / ARCHETYPES.length;
          const radius = isMap ? 85 : 110;
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;
          const isActive = activeTab === i;

          return (
            <button
              key={arc.id}
              onClick={() => { playHeartbeat(); setActiveTab(i); }}
              className={cn(
                "absolute w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-500 border-2",
                isActive ? `${arc.bg} ${arc.color.replace('text-', 'border-')} scale-125 shadow-lg` : "bg-black/40 border-white/5 grayscale opacity-40 hover:grayscale-0 hover:opacity-100"
              )}
              style={{ transform: `translate(${x}px, ${y}px)` }}
            >
              <arc.icon className={cn("w-5 h-5 md:w-6 md:h-6", isActive ? arc.color : "text-white/40")} />
            </button>
          );
        })}

        {/* Central Unity Core */}
        <div className="w-24 h-24 md:w-32 md:h-32 bg-black rounded-full border-4 border-primary/20 flex flex-col items-center justify-center p-4 text-center animate-in zoom-in-50 duration-700">
          <current.icon className={cn("w-8 h-8 mb-2 animate-pulse", current.color)} />
          <span className="text-[7px] font-black uppercase tracking-widest text-white leading-tight">
            {lang === 'de' ? current.de : current.en}
          </span>
        </div>
      </div>

      <div className="z-10 shrink-0 pb-10 px-8 w-full mt-4">
        <button 
          onClick={() => router.push('/heart-status')}
          className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all group"
        >
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60 group-hover:text-primary">{t.enter}</span>
          <ArrowRight size={12} className="text-white/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </button>
      </div>
    </div>
  );
}
