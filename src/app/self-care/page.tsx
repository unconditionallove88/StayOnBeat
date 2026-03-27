"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { playHeartbeat } from '@/lib/resonance';

/**
 * @fileOverview Breath of Love (Pure Resonance Ritual).
 * Optimized for iPhone: Single-screen layout, no scrolling.
 * Background: Sea color #54a5d5.
 * Visual: Pure large text "Inhale Love" and "Exhale Love" on one line.
 * Animation: Sequential Sunrise letter-by-letter fade in/out.
 * Navigation: Subtle, tender return tab with white wording.
 */

const CONTENT = {
  en: {
    inhale: "Inhale Love",
    exhale: "Exhale Love",
    button: "Return to Sanctuary"
  },
  de: {
    inhale: "Liebe einatmen",
    exhale: "Liebe ausatmen",
    button: "Zurück zum Sanctuary"
  },
  pt: {
    inhale: "Inspire Amor",
    exhale: "Expire Amor",
    button: "Retornar ao Santuário"
  },
  ru: {
    inhale: "Вдохни Любовь",
    exhale: "Выдохни Любовь",
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

  // Staggered letter animation helper
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
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full text-center space-y-12">
          {/* Sequential Staggered Text on one line - 16s cycle */}
          <div className="flex items-center justify-center gap-12 relative min-h-[120px]">
            <div className={cn(
              "text-4xl md:text-6xl font-black uppercase tracking-tighter flex whitespace-nowrap justify-center items-center transition-all",
              lang === 'ru' && "italic font-serif"
            )}>
              <div className="flex">
                {renderLetters(t.inhale, 0)}
              </div>
            </div>
            
            <div className={cn(
              "text-4xl md:text-6xl font-black uppercase tracking-tighter flex whitespace-nowrap justify-center items-center transition-all",
              lang === 'ru' && "italic font-serif"
            )}>
              <div className="flex">
                {renderLetters(t.exhale, 8)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle, tender return tab */}
      <footer className="p-12 flex flex-col items-center justify-center shrink-0 pb-16">
        <button 
          onClick={() => { playHeartbeat(); router.push('/dashboard'); }}
          className={cn(
            "px-8 py-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-md transition-all active:scale-95 group hover:bg-white/10",
            lang === 'ru' && "italic font-serif"
          )}
        >
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80 group-hover:text-white transition-colors">
            {t.button}
          </span>
        </button>
      </footer>
    </main>
  );
}
