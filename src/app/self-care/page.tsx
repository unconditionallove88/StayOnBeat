
"use client"

import { useState, useEffect } from 'react';
import { Heart, ArrowLeft, Wind, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { playHeartbeat } from '@/lib/resonance';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * @fileOverview Breath of Love (Eternity Ouroboros).
 * A high-fidelity infinity resonance experience.
 * Features a wide horizontal eternity cobra eating its own tail.
 * Background color: Beautiful sea color #54a5d5.
 * Snake color: Bespoke teal #66b2b2.
 * Rhythm: 4s Inhale / 4s Exhale.
 * Full localization for EN, DE, PT, RU.
 */

const CONTENT = {
  en: {
    title: "Breath of Love",
    breathing: "Eternity Breathing",
    inhale: "Inhale Love",
    exhale: "Exhale Peace",
    guidance: "I flow with eternity. I am home. Relaxation is my nature.",
    header: "I live inside out",
    headerHighlight: "with an open heart",
    button: "Return to Sanctuary"
  },
  de: {
    title: "Atem der Liebe",
    breathing: "Ewiges Atmen",
    inhale: "Liebe einatmen",
    exhale: "Frieden ausatmen",
    guidance: "Ich fließe mit der Ewigkeit. Ich bin zu Hause. Entspannung ist meine Natur.",
    header: "Ich lebe von innen nach außen",
    headerHighlight: "mit offenem Herzen",
    button: "Zurück zum Sanctuary"
  },
  pt: {
    title: "Sopro de Amor",
    breathing: "Respiração da Eternidade",
    inhale: "Inspire Amor",
    exhale: "Expire Paz",
    guidance: "Eu fluo com a eternidade. Estou em casa. Relaxamento é minha natureza.",
    header: "Eu vivo de dentro para fora",
    headerHighlight: "com o coração aberto",
    button: "Retornar ao Santuário"
  },
  ru: {
    title: "Дыхание Любви",
    breathing: "Дыхание Вечности",
    inhale: "Вдохни Любовь",
    exhale: "Выдохни Покой",
    guidance: "Я дышу вечностью. Я дома. Расслабление — моя природа.",
    header: "Я живу изнутри наружу",
    headerHighlight: "с открытым сердцем",
    button: "Вернуться в пространство"
  }
};

export default function SelfCare() {
  const router = useRouter();
  const [lang, setLang] = useState<'en' | 'de' | 'pt' | 'ru'>('en');
  const [isInhaling, setIsInhaling] = useState(true);

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de', 'pt', 'ru'].includes(savedLang)) setLang(savedLang);

    const interval = setInterval(() => {
      setIsInhaling((prev) => !prev);
    }, 4000); // 4s inhale, 4s exhale cycle

    return () => clearInterval(interval);
  }, []);

  const t = CONTENT[lang] || CONTENT.en;

  return (
    <main className="min-h-screen bg-[#54a5d5] text-white flex flex-col font-headline relative overflow-hidden transition-colors duration-1000">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white/5 blur-[120px] rounded-full pointer-events-none" />

      <header className="px-6 py-8 flex items-center justify-between sticky top-0 z-50 shrink-0">
        <button 
          onClick={() => { playHeartbeat(); router.back(); }}
          className="text-white/60 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest p-3 bg-white/10 rounded-full border border-white/20 backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full backdrop-blur-md">
          <Sparkles size={12} className="text-white animate-pulse" />
          <span className={cn("text-[9px] font-black uppercase text-white tracking-widest", lang === 'ru' && "italic font-serif")}>{t.title}</span>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto px-6 py-12 space-y-12 pb-40 touch-pan-y h-full min-h-[70vh]">
          
          {/* Eternity Ouroboros Animation - Wide Infinity in #66b2b2 */}
          <div className="relative flex flex-col items-center justify-center w-full h-[44vh] transition-transform duration-1000">
            <svg 
              viewBox="0 0 400 200" 
              className="w-full h-full drop-shadow-[0_0_40px_rgba(102,178,178,0.4)] filter"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="cobraGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#66b2b2" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#4d8a8a" stopOpacity="1" />
                  <stop offset="100%" stopColor="#66b2b2" stopOpacity="0.8" />
                </linearGradient>
                <filter id="headGlow">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* The Infinity Body (Ouroboros Path) - Wide Layout */}
              <path
                id="infinityPath"
                d="M 200 100 C 200 20 40 20 40 100 C 40 180 200 180 200 100 C 200 20 360 20 360 100 C 360 180 200 180 200 100"
                fill="none"
                stroke="rgba(102, 178, 178, 0.2)"
                strokeWidth="16"
                strokeLinecap="round"
                className="opacity-50"
              />
              
              {/* Glowing Inner Trace */}
              <path
                d="M 200 100 C 200 20 40 20 40 100 C 40 180 200 180 200 100 C 200 20 360 20 360 100 C 360 180 200 180 200 100"
                fill="none"
                stroke="#66b2b2"
                strokeWidth="1"
                strokeDasharray="6 12"
                className="opacity-40"
              />

              {/* The Cobra Head - Sliding tenderly on the infinity symbol */}
              <g filter="url(#headGlow)">
                <circle r="10" fill="#66b2b2" className="shadow-[0_0_30px_#66b2b2]">
                  <animateMotion
                    dur="8s"
                    repeatCount="indefinite"
                    path="M 200 100 C 200 20 40 20 40 100 C 40 180 200 180 200 100 C 200 20 360 20 360 100 C 360 180 200 180 200 100"
                    rotate="auto"
                  />
                </circle>
                {/* Visual Detail for the relaxed head */}
                <circle r="4" fill="white" opacity="0.7">
                  <animateMotion
                    dur="8s"
                    repeatCount="indefinite"
                    path="M 200 100 C 200 20 40 20 40 100 C 40 180 200 180 200 100 C 200 20 360 20 360 100 C 360 180 200 180 200 100"
                    rotate="auto"
                  />
                </circle>
              </g>

              {/* Breathing Glow Pulse - Central Heart */}
              <circle cx="200" cy="100" r="50" fill="#66b2b2" className={cn(
                "transition-all duration-[4000ms] ease-in-out",
                isInhaling ? "opacity-25 scale-150 blur-3xl" : "opacity-10 scale-100 blur-xl"
              )} />
            </svg>

            <div className="mt-8 text-center space-y-3">
              <h2 className={cn(
                "text-4xl font-black uppercase tracking-tighter transition-all duration-[4000ms] ease-in-out",
                isInhaling ? "text-white scale-110" : "text-white/40 scale-100",
                lang === 'ru' && "italic font-serif"
              )}>
                {isInhaling ? t.inhale : t.exhale}
              </h2>
              <p className={cn(
                "text-[10px] font-black text-white/30 uppercase tracking-[0.4em] animate-pulse",
                lang === 'ru' && "italic font-serif"
              )}>
                {t.breathing}
              </p>
            </div>
          </div>

          {/* Language of Love Guidance */}
          <div className="space-y-10 w-full text-center">
            <div className="space-y-4 px-4">
              <p className={cn(
                "text-xl font-black uppercase tracking-tighter text-white/90 leading-tight max-w-[300px] mx-auto",
                lang === 'ru' && "italic font-serif"
              )}>
                {t.guidance}
              </p>
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto" />
            </div>

            <div className="space-y-2">
              <h1 className={cn("text-2xl font-black uppercase tracking-tighter leading-none text-white", lang === 'ru' && "italic font-serif")}>
                {t.header} <br/> <span className="text-emerald-300/80">{t.headerHighlight}</span>
              </h1>
              <p className={cn("text-[9px] font-bold text-white/40 uppercase tracking-[0.3em] mt-4", lang === 'ru' && "italic font-serif")}>
                Feel home. You are loved.
              </p>
            </div>
          </div>
        </div>
      </ScrollArea>

      <footer className="fixed bottom-0 left-0 right-0 h-[120px] bg-black/10 backdrop-blur-md flex flex-col items-center justify-center px-6 z-50">
        <button 
          onClick={() => { playHeartbeat(); router.push('/dashboard'); }}
          className={cn(
            "w-full max-w-sm bg-white text-[#54a5d5] h-16 rounded-full font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-3",
            lang === 'ru' && "italic font-serif"
          )}
        >
          {t.button}
        </button>
      </footer>
    </main>
  );
}
