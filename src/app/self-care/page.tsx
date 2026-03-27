"use client"

import { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { playHeartbeat } from '@/lib/resonance';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * @fileOverview Breath of Love (Resonance Aura Ritual).
 * A high-fidelity meditative experience.
 * Background: Sea color #54a5d5.
 * Visual: High-contrast white and blue glowing aura breathing tenderly.
 * Text: "Inhale Love" and "Exhale Love" on one line with letter-by-letter staggered animation.
 */

const CONTENT = {
  en: {
    title: "Breath of Love",
    inhale: "Inhale Love",
    exhale: "Exhale Love",
    guidance: "I flow with eternity I am home Relaxation is my nature",
    button: "Return to Sanctuary"
  },
  de: {
    title: "Atem der Liebe",
    inhale: "Liebe einatmen",
    exhale: "Liebe ausatmen",
    guidance: "Ich fließe mit der Ewigkeit Ich bin zu Hause Entspannung ist meine Natur",
    button: "Zurück zum Sanctuary"
  },
  pt: {
    title: "Sopro de Amor",
    inhale: "Inspire Amor",
    exhale: "Expire Amor",
    guidance: "Eu fluo com a eternidade Estou em casa Relaxamento é minha natureza",
    button: "Retornar ao Santuário"
  },
  ru: {
    title: "Дыхание Любви",
    inhale: "Вдохни Любовь",
    exhale: "Выдохни Любовь",
    guidance: "Я дышу вечностью Я дома Расслабление моя природа",
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
        style={{ animationDelay: `${delayBase + (i * 0.15)}s` }}
        className="inline-block animate-letter-fade opacity-0"
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <main className="min-h-screen bg-[#54a5d5] text-white flex flex-col font-headline relative overflow-hidden">
      <div className="absolute inset-0 bg-white/5 blur-[120px] rounded-full pointer-events-none" />

      <header className="px-6 py-8 flex items-center justify-between sticky top-0 z-50 shrink-0">
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

      <ScrollArea className="flex-1">
        <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-6 py-12 space-y-16 pb-40 touch-pan-y min-h-[75vh]">
          
          {/* Enhanced Resonance Aura */}
          <div className="relative w-72 h-72 flex items-center justify-center mb-12">
            {/* High-Contrast White Inner Glow */}
            <div className="absolute w-48 h-48 bg-white rounded-full animate-aura-tender blur-[40px]" />
            {/* Fresh Azure Outer Glow */}
            <div className="absolute w-64 h-64 bg-blue-400 rounded-full animate-aura-tender blur-[60px]" style={{ animationDelay: '0.2s' }} />
            {/* Tender Core */}
            <div className="relative z-10 w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 flex items-center justify-center shadow-inner">
               <Sparkles className="w-6 h-6 text-white/60 animate-pulse" />
            </div>
          </div>

          <div className="space-y-16 w-full text-center">
            {/* Enlarged Staggered Text */}
            <div className="h-20 flex items-center justify-center gap-8">
              <div className={cn("text-4xl md:text-5xl font-black uppercase tracking-tighter flex whitespace-nowrap", lang === 'ru' && "italic font-serif")}>
                <div className="flex">
                  {renderLetters(t.inhale, 0)}
                </div>
                <span className="mx-6 opacity-20 text-2xl">|</span>
                <div className="flex">
                  {renderLetters(t.exhale, 4)}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <p className={cn(
                "text-lg font-black uppercase tracking-widest text-white/80 leading-tight max-w-[320px] mx-auto",
                lang === 'ru' && "italic font-serif"
              )}>
                {t.guidance}
              </p>
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto" />
            </div>
          </div>
        </div>
      </ScrollArea>

      <footer className="fixed bottom-0 left-0 right-0 h-[120px] bg-black/10 backdrop-blur-md flex flex-col items-center justify-center px-6 z-50 pb-safe">
        <button 
          onClick={() => { playHeartbeat(); router.push('/dashboard'); }}
          className={cn(
            "w-full max-sm h-16 rounded-full font-black uppercase tracking-widest active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-3",
            "bg-[#1b3e4d] text-white",
            lang === 'ru' && "italic font-serif"
          )}
        >
          {t.button}
        </button>
      </footer>
    </main>
  );
}