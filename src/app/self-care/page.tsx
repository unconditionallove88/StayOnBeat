"use client"

import { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { playHeartbeat } from '@/lib/resonance';

/**
 * @fileOverview Breath of Love (Resonance Aura Ritual).
 * Optimized for iPhone: Single-screen layout, no scrolling.
 * Background: Sea color #54a5d5.
 * Visual: Large organic glowing disc breathing tenderly.
 * Text: Sequential Sunrise animation for Inhale/Exhale on one line.
 */

const CONTENT = {
  en: {
    title: "Breath of Love",
    inhale: "Inhale Love",
    exhale: "Exhale Love",
    guidance: "I flow with eternity I am home",
    button: "Return to Sanctuary"
  },
  de: {
    title: "Atem der Liebe",
    inhale: "Liebe einatmen",
    exhale: "Liebe ausatmen",
    guidance: "Ich fließe mit der Ewigkeit",
    button: "Zurück zum Sanctuary"
  },
  pt: {
    title: "Sopro de Amor",
    inhale: "Inspire Amor",
    exhale: "Expire Amor",
    guidance: "Eu fluo com a eternidade",
    button: "Retornar ao Santuário"
  },
  ru: {
    title: "Дыхание Любви",
    inhale: "Вдохни Любовь",
    exhale: "Выдохни Любовь",
    guidance: "Я дышу вечностью",
    button: "Вернуться в пространство"
  }
};

export default function SelfCare() {
  const router = useRouter();
  const [lang, setLang] = useState<'en' | 'de' | 'pt' | 'ru'>('en');

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de', 'pt', 'ru'].includes(savedLang)) setLang(savedLang);
  }, []);

  const t = CONTENT[lang] || CONTENT.en;

  const renderLetters = (text: string, delayBase: number) => {
    return text.split('').map((char, i) => (
      <span 
        key={i} 
        style={{ animationDelay: `${delayBase + (i * 0.1)}s` }}
        className="inline-block animate-letter-fade opacity-0"
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <main className="h-screen w-full bg-[#54a5d5] text-white flex flex-col font-headline relative overflow-hidden">
      {/* Subtle Depth Glows */}
      <div className="absolute inset-0 bg-white/5 blur-[120px] rounded-full pointer-events-none" />

      <header className="px-6 py-6 flex items-center justify-between z-50 shrink-0">
        <button 
          onClick={() => { playHeartbeat(); router.back(); }}
          className="text-white/60 hover:text-white transition-colors flex items-center gap-2 p-3 bg-white/10 rounded-full border border-white/20 backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full backdrop-blur-md">
          <Sparkles size={12} className="text-white animate-pulse" />
          <span className={cn("text-[9px] font-black uppercase text-white tracking-widest", lang === 'ru' && "italic font-serif")}>{t.title}</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center gap-12 px-6 pb-20">
        {/* Large Organic Resonance Disc */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
          {/* High-Contrast White Inner Glow */}
          <div className="absolute w-40 h-40 md:w-56 md:h-56 bg-white rounded-full animate-aura-tender blur-[40px]" />
          {/* Fresh Azure Outer Glow */}
          <div className="absolute w-56 h-56 md:w-72 md:h-72 bg-blue-400 rounded-full animate-aura-tender blur-[60px]" style={{ animationDelay: '0.2s' }} />
          {/* Organic Disc Core */}
          <div className="relative z-10 w-20 h-20 bg-white/30 backdrop-blur-2xl rounded-full border border-white/40 shadow-inner animate-pulse" />
        </div>

        <div className="space-y-10 w-full text-center">
          {/* Sequential Staggered Text on one line - 16s cycle */}
          <div className="h-16 flex items-center justify-center gap-4 relative">
            <div className={cn("text-3xl md:text-4xl font-black uppercase tracking-tighter flex whitespace-nowrap absolute inset-0 justify-center items-center", lang === 'ru' && "italic font-serif")}>
              <div className="flex">
                {renderLetters(t.inhale, 0)}
              </div>
            </div>
            <div className={cn("text-3xl md:text-4xl font-black uppercase tracking-tighter flex whitespace-nowrap absolute inset-0 justify-center items-center", lang === 'ru' && "italic font-serif")}>
              <div className="flex">
                {renderLetters(t.exhale, 8)}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className={cn(
              "text-base font-black uppercase tracking-[0.2em] text-white/80 leading-tight",
              lang === 'ru' && "italic font-serif"
            )}>
              {t.guidance}
            </p>
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto" />
          </div>
        </div>
      </div>

      <footer className="p-8 flex flex-col items-center justify-center shrink-0 pb-safe">
        <button 
          onClick={() => { playHeartbeat(); router.push('/dashboard'); }}
          className={cn(
            "w-full max-w-sm h-16 rounded-full font-black uppercase tracking-widest active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-3",
            "bg-[#1b3e4d] text-white/90 border border-white/10 backdrop-blur-md",
            lang === 'ru' && "italic font-serif"
          )}
        >
          {t.button}
        </button>
      </footer>
    </main>
  );
}