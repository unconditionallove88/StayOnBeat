
"use client"

import { useState, useEffect } from 'react';
import { Heart, Coffee, Moon, ArrowLeft, Wind, CircleDot } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { playHeartbeat } from '@/lib/resonance';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * @fileOverview Self-Care & Stillness Sanctuary.
 * A high-fidelity grounding experience featuring box-breathing guidance.
 * Full localization for EN, DE, PT, RU.
 * Vision: Living inside out with an open heart.
 */

const CONTENT = {
  en: {
    title: "Inner Resonance",
    breathText: {
      inhale: "Inhale Peace",
      hold1: "Hold Presence",
      exhale: "Exhale Tension",
      hold2: "Hold Stillness"
    },
    seconds: "Seconds",
    protocol: "Box Breathing Protocol",
    header: "I live inside out",
    headerHighlight: "with an open heart",
    description: "Gently anchor yourself to the present moment Your light radiates from within and creates your sanctuary",
    items: [
      { label: "Hydrate", sub: "Small sips" },
      { label: "Anchor", sub: "Feel feet" },
      { label: "Rest", sub: "Close eyes" }
    ],
    button: "Return to Sanctuary"
  },
  de: {
    title: "Innere Resonanz",
    breathText: {
      inhale: "Frieden einatmen",
      hold1: "Präsenz halten",
      exhale: "Spannung ausatmen",
      hold2: "Stille halten"
    },
    seconds: "Sekunden",
    protocol: "Box-Breathing-Protokoll",
    header: "Ich lebe von innen nach außen",
    headerHighlight: "mit offenem Herzen",
    description: "Verankere dich sanft im gegenwärtigen Moment Dein Licht strahlt von innen und erschafft dein Sanctuary",
    items: [
      { label: "Hydrieren", sub: "Kleine Schlucke" },
      { label: "Ankern", sub: "Füße spüren" },
      { label: "Ruhen", sub: "Augen schließen" }
    ],
    button: "Zurück zum Sanctuary"
  },
  pt: {
    title: "Ressonância Interior",
    breathText: {
      inhale: "Inspire Paz",
      hold1: "Segure a Presença",
      exhale: "Expire a Tensão",
      hold2: "Segure a Quietude"
    },
    seconds: "Segundos",
    protocol: "Protocolo de Respiração Quadrada",
    header: "Eu vivo de dentro para fora",
    headerHighlight: "com o coração aberto",
    description: "Acore-se suavemente no momento presente Sua luz irradia de dentro e cria seu santuário",
    items: [
      { label: "Hidratar", sub: "Pequenos goles" },
      { label: "Ancorar", sub: "Sinta os pés" },
      { label: "Descansar", sub: "Feche os olhos" }
    ],
    button: "Retornar ao Santuário"
  },
  ru: {
    title: "Внутренний Резонанс",
    breathText: {
      inhale: "Вдохните Мир",
      hold1: "Удерживайте Присутствие",
      exhale: "Выдохните Напряжение",
      hold2: "Удерживайте Тишину"
    },
    seconds: "Секунд",
    protocol: "Техника Квадратного Дыхания",
    header: "Я живу изнутри наружу",
    headerHighlight: "с открытым сердцем",
    description: "Мягко заякоритесь в настоящем моменте Ваш свет сияет изнутри и создает ваше пространство",
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
  const [breathState, setBreathState] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [timer, setCountdown] = useState(4);

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de', 'pt', 'ru'].includes(savedLang)) setLang(savedLang);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          setBreathState((current) => {
            if (current === 'inhale') return 'hold1';
            if (current === 'hold1') return 'exhale';
            if (current === 'exhale') return 'hold2';
            return 'inhale';
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

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
          <CircleDot size={12} className="text-[#10B981] animate-pulse" />
          <span className="text-[9px] font-black uppercase text-[#10B981] tracking-widest">{t.title}</span>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto px-6 py-12 space-y-12 pb-40 touch-pan-y">
          
          <div className="relative flex flex-col items-center justify-center">
            {/* Expanded inside-out glow */}
            <div className={cn(
              "absolute rounded-full bg-emerald-500/10 blur-3xl transition-all duration-[4000ms] ease-in-out",
              breathState === 'inhale' ? "w-96 h-96 opacity-40 scale-125" : "w-64 h-64 opacity-20 scale-100"
            )} />
            
            <div className={cn(
              "relative w-48 h-48 rounded-full border-4 flex items-center justify-center transition-all duration-[4000ms] ease-in-out shadow-2xl shadow-emerald-500/20",
              breathState === 'inhale' ? "scale-110 border-emerald-400 bg-emerald-500/10" : "scale-90 border-white/10 bg-white/5"
            )}>
              <div className="text-center space-y-1">
                <span className="text-4xl font-black tabular-nums text-white">{timer}</span>
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-500">{t.seconds}</p>
              </div>
            </div>

            <div className="mt-10 text-center space-y-2">
              <h2 className="text-3xl font-black uppercase tracking-tighter animate-pulse">
                {t.breathText[breathState]}
              </h2>
              <p className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.4em]">{t.protocol}</p>
            </div>
          </div>

          <div className="space-y-6 w-full text-center">
            <div className="space-y-2">
              <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">
                {t.header} <br/> <span className="text-[#3EB489]">{t.headerHighlight}</span>
              </h1>
              <p className="text-xs font-bold text-white/40 leading-tight max-w-[280px] mx-auto uppercase tracking-widest">
                {t.description}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full">
              {t.items.map((item, i) => {
                const Icons = [Coffee, Wind, Moon];
                const Icon = Icons[i];
                return (
                  <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-[2rem] flex flex-col items-center gap-2 group hover:border-emerald-500/40 transition-all">
                    <Icon className="w-5 h-5 text-[#3EB489]" />
                    <div className="text-center">
                      <h3 className="font-black uppercase tracking-widest text-[8px]">{item.label}</h3>
                      <p className="text-[7px] font-bold text-white/30 uppercase tracking-tighter">{item.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>

      <footer className="fixed bottom-0 left-0 right-0 h-[100px] bg-black/90 backdrop-blur-xl border-t border-white/5 flex flex-col items-center justify-center px-6 z-50">
        <button 
          onClick={() => { playHeartbeat(); router.push('/dashboard'); }}
          className="w-full max-w-sm bg-[#3EB489] text-black h-16 rounded-full font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(62,180,137,0.3)] flex items-center justify-center gap-3"
        >
          <CircleDot size={20} />
          {t.button}
        </button>
      </footer>
    </main>
  );
}
