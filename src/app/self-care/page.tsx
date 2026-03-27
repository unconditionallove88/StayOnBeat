"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { playHeartbeat } from '@/lib/resonance';

/**
 * @fileOverview Breath of Love (Pure Resonance Ritual).
 * Optimized for iPhone: Single-screen layout, no scrolling.
 * Affirmations: Sequential Sunrise letter-by-letter fade in/out.
 * Rule: 3 words (EN) / 4 words (DE).
 */

const CONTENT = {
  en: {
    inhale: "Inhale Love",
    exhale: "Exhale Love",
    button: "Return to Sanctuary"
  },
  de: {
    inhale: "Liebe sanft einatmen",
    exhale: "Liebe sanft ausatmen",
    button: "Zum Sanctuary zurückkehren"
  }
};

export default function SelfCare() {
  const router = useRouter();
  const [lang, setLang] = useState<'en' | 'de'>('en');

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);
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
            <div className="text-4xl md:text-6xl font-black uppercase tracking-tighter flex whitespace-nowrap justify-center items-center transition-all">
              <div className="flex">
                {renderLetters(t.inhale, 0)}
              </div>
            </div>
            
            <div className="text-4xl md:text-6xl font-black uppercase tracking-tighter flex whitespace-nowrap justify-center items-center transition-all">
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
          className="px-8 py-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-md transition-all active:scale-95 group hover:bg-white/10"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80 group-hover:text-white transition-colors">
            {t.button}
          </span>
        </button>
      </footer>
    </main>
  );
}
