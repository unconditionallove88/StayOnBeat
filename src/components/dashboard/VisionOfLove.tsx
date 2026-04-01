'use client';

import React, { useState, useEffect } from 'react';
import { X, Wind, Eye, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { playHeartbeat } from '@/lib/resonance';

/**
 * @fileOverview "Vision of Love" (Presence & Grounding) Tool.
 * Visuals: Pure Emerald Field (#1b4d3e).
 * Wording: Welcome to Harmony. You are loved. Let's get back on beat together.
 * iPhone optimized: Single-screen immersive text resonance.
 */

interface VisionOfLoveProps {
  onClose: () => void;
}

const CONTENT = {
  en: {
    title: "Vision of Love",
    sub: "Welcome to Harmony. You are loved. Let's get back on beat together.",
    intro: "I respect myself",
    affirmations: [
      "Welcome to Harmony",
      "You are loved",
      "Back on beat together"
    ],
    button: "Enter Vision",
    return: "Return to Sanctuary"
  },
  de: {
    title: "Vision der Liebe",
    sub: "Willkommen in Harmonie heute. Du wirst geliebt heute. Gemeinsam im Takt heute.",
    intro: "Ich respektiere mich selbst",
    affirmations: [
      "Willkommen in Harmonie heute",
      "Du wirst geliebt heute",
      "Wieder im Takt heute"
    ],
    button: "Vision öffnen",
    return: "Zum Sanctuary zurückkehren"
  }
};

export function VisionOfLove({ onClose }: VisionOfLoveProps) {
  const [mode, setMode] = useState<'intro' | 'beauty'>('intro');
  const [lang, setLang] = useState<'en' | 'de'>('en');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);
  }, []);

  useEffect(() => {
    if (mode === 'beauty') {
      const interval = setInterval(() => {
        setIsFading(true);
        setTimeout(() => {
          setCurrentSlide((prev) => (prev + 1) % CONTENT.en.affirmations.length);
          setIsFading(false);
        }, 6000);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [mode]);

  const t = CONTENT[lang] || CONTENT.en;

  if (mode === 'beauty') {
    return (
      <div className="fixed inset-0 bg-[#1b4d3e] z-[1000] flex flex-col font-headline animate-in fade-in duration-1000 overflow-hidden pt-safe pb-safe">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-black/20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_0%,_transparent_70%)] animate-pulse" />

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div 
            className="transition-all duration-1000 transform"
            style={{ 
              opacity: isFading ? 0 : 1,
              translateY: isFading ? '20px' : '0px'
            }}
          >
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white drop-shadow-2xl leading-tight max-w-lg mx-auto">
              {t.affirmations[currentSlide]}
            </h2>
          </div>
        </div>

        <footer className="relative z-10 p-12 flex flex-col items-center gap-6">
          <div className="flex gap-2">
            {t.affirmations.map((_, i) => (
              <div key={i} className={cn("w-1.5 h-1.5 rounded-full transition-all duration-500", i === currentSlide ? "bg-white w-6" : "bg-white/20")} />
            ))}
          </div>
          <button 
            onClick={() => { playHeartbeat(); onClose(); }}
            className="px-8 py-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white font-black uppercase text-[10px] tracking-[0.4em] active:scale-95 transition-all hover:bg-white/10"
          >
            {t.return}
          </button>
        </footer>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-[1000] flex flex-col items-center justify-center px-8 text-center font-headline animate-in slide-in-from-bottom-4 duration-700 pb-safe pt-safe overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 p-3 bg-white/5 rounded-full border border-white/10 text-white/40 hover:text-white transition-all z-10"
      >
        <X size={20} />
      </button>

      <div className="relative z-10 space-y-12 max-w-md">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
          <div className="w-32 h-32 bg-primary/10 border-2 border-primary/30 rounded-full flex items-center justify-center relative z-10 shadow-2xl">
            <Eye size={48} className="text-primary animate-pulse" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white leading-none">
            {t.title}
          </h1>
          <p className="text-primary text-sm font-bold uppercase tracking-widest leading-relaxed max-w-[300px] mx-auto italic">
            {t.sub}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">
            "{t.intro}"
          </p>
        </div>

        <button 
          onClick={() => { playHeartbeat(); setMode('beauty'); }}
          className="w-full h-20 bg-[#1b4d3e] text-white rounded-3xl font-black text-xl uppercase tracking-widest active:scale-95 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-4"
        >
          {t.button}
          <Wind size={24} />
        </button>
      </div>

      <p className="absolute bottom-12 text-[8px] font-black text-white/20 uppercase tracking-[0.5em]">
        Created in harmony
      </p>
    </div>
  );
}
