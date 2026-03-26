
"use client"

import { useState, useEffect } from 'react';
import { Heart, Coffee, Moon, ArrowLeft, Wind, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { playHeartbeat } from '@/lib/resonance';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * @fileOverview Eternity Breathing Sanctuary.
 * A high-fidelity infinity resonance experience.
 * Features a Lemniscate (8) animation sliding in unison with the breath.
 * Full localization for EN, DE, PT, RU.
 */

const CONTENT = {
  en: {
    title: "Inner Resonance",
    breathing: "Eternity Breathing",
    inhale: "Inhale Light",
    exhale: "Exhale Peace",
    guidance: "I flow with eternity. Inhale light. Exhale peace. My breath is a gift.",
    header: "I live inside out",
    headerHighlight: "with an open heart",
    items: [
      { label: "Hydrate", sub: "Small sips" },
      { label: "Anchor", sub: "Feel feet" },
      { label: "Rest", sub: "Close eyes" }
    ],
    button: "Return to Sanctuary"
  },
  de: {
    title: "Innere Resonanz",
    breathing: "Ewiges Atmen",
    inhale: "Licht einatmen",
    exhale: "Frieden ausatmen",
    guidance: "Ich fließe mit der Ewigkeit. Licht einatmen. Frieden ausatmen. Mein Atem ist ein Geschenk.",
    header: "Ich lebe von innen nach außen",
    headerHighlight: "mit offenem Herzen",
    items: [
      { label: "Hydrieren", sub: "Kleine Schlucke" },
      { label: "Ankern", sub: "Füße spüren" },
      { label: "Ruhen", sub: "Augen schließen" }
    ],
    button: "Zurück zum Sanctuary"
  },
  pt: {
    title: "Ressonância Interior",
    breathing: "Respiração da Eternidade",
    inhale: "Inspire Luz",
    exhale: "Expire Paz",
    guidance: "Eu fluo com a eternidade. Inspire luz. Expire paz. Minha respiração é um presente.",
    header: "Eu vivo de dentro para fora",
    headerHighlight: "com o coração aberto",
    items: [
      { label: "Hidratar", sub: "Pequenos goles" },
      { label: "Ancorar", sub: "Sinta os pés" },
      { label: "Descansar", sub: "Feche os olhos" }
    ],
    button: "Retornar ao Santuário"
  },
  ru: {
    title: "Внутренний Резонанс",
    breathing: "Дыхание Вечности",
    inhale: "Вдохни Свет",
    exhale: "Выдохни Покой",
    guidance: "Я дышу вечностью. Вдохни свет. Выдохни покой. Твой вдох — это дар.",
    header: "Я живу изнутри наружу",
    headerHighlight: "с открытым сердцем",
    items: [
      { label: "Гидратация", sub: "Глоток воды" },
      { label: "Заземление", sub: "Почувствуйте стопы" },
      { label: "Отдых", sub: "Закройте глаза" }
    ],
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
    <main className="min-h-screen bg-black text-white flex flex-col font-headline relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-500/5 blur-[120px] rounded-full -z-10" />

      <header className="px-6 py-8 flex items-center justify-between sticky top-0 z-50 shrink-0">
        <button 
          onClick={() => { playHeartbeat(); router.back(); }}
          className="text-white/40 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest p-3 bg-white/5 rounded-full border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-[#10B981]/10 border border-[#10B981]/30 rounded-full">
          <Sparkles size={12} className="text-[#10B981] animate-pulse" />
          <span className={cn("text-[9px] font-black uppercase text-[#10B981] tracking-widest", lang === 'ru' && "italic font-serif")}>{t.title}</span>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto px-6 py-12 space-y-16 pb-40 touch-pan-y">
          
          {/* Eternity Breath Animation */}
          <div className="relative flex flex-col items-center justify-center w-full h-64">
            <svg viewBox="0 0 200 100" className="w-full max-w-sm drop-shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              {/* The Infinity Path */}
              <path
                id="infinityPath"
                d="M 50 50 C 50 20 20 20 20 50 C 20 80 50 80 50 50 C 50 20 80 20 80 50 C 80 80 50 80 50 50"
                fill="none"
                stroke="rgba(16, 185, 129, 0.1)"
                strokeWidth="2"
                transform="scale(2) translate(-25, -25)"
              />
              
              {/* Glowing Trace Path */}
              <path
                d="M 50 50 C 50 20 20 20 20 50 C 20 80 50 80 50 50 C 50 20 80 20 80 50 C 80 80 50 80 50 50"
                fill="none"
                stroke="#10B981"
                strokeWidth="0.5"
                strokeDasharray="1, 10"
                className="opacity-20"
                transform="scale(2) translate(-25, -25)"
              />

              {/* The Breath Particle - Sliding on 8 */}
              <circle r="3" fill="#10B981" className="shadow-[0_0_15px_#10B981]">
                <animateMotion
                  dur="8s"
                  repeatCount="indefinite"
                  path="M 50 50 C 50 20 20 20 20 50 C 20 80 50 80 50 50 C 50 20 80 20 80 50 C 80 80 50 80 50 50"
                  rotate="auto"
                />
              </circle>

              {/* Central Pulsing Heart Glow */}
              <circle cx="100" cy="50" r="10" fill="#10B981" className={cn(
                "transition-all duration-[4000ms] ease-in-out",
                isInhaling ? "opacity-20 scale-150 blur-xl" : "opacity-5 scale-100 blur-md"
              )} />
            </svg>

            <div className="mt-12 text-center space-y-3">
              <h2 className={cn(
                "text-3xl font-black uppercase tracking-tighter transition-all duration-[4000ms] ease-in-out",
                isInhaling ? "text-[#10B981] scale-110" : "text-white/40 scale-100",
                lang === 'ru' && "italic font-serif"
              )}>
                {isInhaling ? t.inhale : t.exhale}
              </h2>
              <p className={cn(
                "text-[10px] font-black text-white/20 uppercase tracking-[0.4em] animate-pulse",
                lang === 'ru' && "italic font-serif"
              )}>
                {t.breathing}
              </p>
            </div>
          </div>

          {/* Language of Love Guidance */}
          <div className="space-y-8 w-full text-center">
            <div className="space-y-4 px-4">
              <p className={cn(
                "text-xl font-black uppercase tracking-tighter text-white leading-tight",
                lang === 'ru' && "italic font-serif"
              )}>
                {t.guidance}
              </p>
              <div className="w-8 h-1 bg-[#10B981]/20 rounded-full mx-auto" />
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className={cn("text-2xl font-black uppercase tracking-tighter leading-none", lang === 'ru' && "italic font-serif")}>
                  {t.header} <br/> <span className="text-[#3EB489]">{t.headerHighlight}</span>
                </h1>
              </div>

              <div className="grid grid-cols-3 gap-3 w-full">
                {t.items.map((item, i) => {
                  const Icons = [Coffee, Wind, Moon];
                  const Icon = Icons[i];
                  return (
                    <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-[2rem] flex flex-col items-center gap-2 group hover:border-emerald-500/40 transition-all">
                      <Icon className="w-5 h-5 text-[#3EB489]" />
                      <div className="text-center">
                        <h3 className={cn("font-black uppercase tracking-widest text-[8px]", lang === 'ru' && "italic font-serif")}>{item.label}</h3>
                        <p className={cn("text-[7px] font-bold text-white/30 uppercase tracking-tighter", lang === 'ru' && "italic font-serif")}>{item.sub}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      <footer className="fixed bottom-0 left-0 right-0 h-[100px] bg-black/90 backdrop-blur-xl border-t border-white/5 flex flex-col items-center justify-center px-6 z-50">
        <button 
          onClick={() => { playHeartbeat(); router.push('/dashboard'); }}
          className={cn(
            "w-full max-w-sm bg-[#3EB489] text-black h-16 rounded-full font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(62,180,137,0.3)] flex items-center justify-center gap-3",
            lang === 'ru' && "italic font-serif"
          )}
        >
          {t.button}
        </button>
      </footer>
    </main>
  );
}
