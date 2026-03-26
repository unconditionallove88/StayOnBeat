
'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useUser, updateDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { ChevronDown, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RadiantIcon, HarmonyIcon, CalmIcon, HazyIcon, HeldIcon } from '@/components/ui/vibe-icons';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

/**
 * @fileOverview Vibe Mirror Component.
 * Full EN, DE, PT, RU support.
 * Updated: Color palette refined for prismatic resonance and F&B CC6 tones.
 */

const VIBES = [
  { 
    key: "radiant", 
    label: "Radiant", 
    de: "Strahlend", 
    pt: "Radiante",
    ru: "Сияющее",
    icon: RadiantIcon, 
    affirmation: {
      en: "Your light is shining bright today",
      de: "Dein Licht leuchtet heute hell",
      pt: "Sua luz está brilhando forte hoje",
      ru: "Твой свет сияет ярко сегодня"
    },
    color: "text-white", 
    bg: "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 opacity-80", 
    border: "border-white/40",
    isRainbow: true
  },
  { 
    key: "harmony", 
    label: "In Harmony", 
    de: "In Harmonie", 
    pt: "Em Harmonia",
    ru: "Гармоничное",
    icon: HarmonyIcon, 
    affirmation: {
      en: "You are aligned with your inner rhythm",
      de: "Du bist im Einklang mit deinem Rhythmus",
      pt: "Você está alinhado com seu ritmo interior",
      ru: "Ты в гармонии со своим внутренним ритмом"
    },
    color: "text-[#10B981]", 
    bg: "bg-[#10B981]/10", 
    border: "border-[#10B981]/30" 
  },
  { 
    key: "calm", 
    label: "Calm", 
    de: "Beruhigt", 
    pt: "Calmo",
    ru: "Спокойное",
    icon: CalmIcon, 
    affirmation: {
      en: "Everything is exactly as it is supposed to be",
      de: "Alles ist genau so wie es sein soll",
      pt: "Tudo está exatamente como deveria estar",
      ru: "Все именно так как должно быть"
    },
    color: "text-[#3B82F6]", 
    bg: "bg-[#3B82F6]/10", 
    border: "border-[#3B82F6]/30" 
  },
  { 
    key: "hazy", 
    label: "Hazy", 
    de: "Verschwommen", 
    pt: "Nebuloso",
    ru: "Туманное",
    icon: HazyIcon, 
    affirmation: {
      en: "It is okay to rest and be still",
      de: "Es ist okay sich auszuruhen",
      pt: "Tudo bem descansar e ficar em silêncio",
      ru: "Это нормально отдыхать и быть в тишине"
    },
    color: "text-[#93C5FD]", 
    bg: "bg-[#93C5FD]/10", 
    border: "border-[#93C5FD]/30" 
  },
  { 
    key: "overwhelmed", 
    label: "Overwhelmed", 
    de: "Überwältigt", 
    pt: "Sobrecarregado",
    ru: "Бережное",
    icon: HeldIcon, 
    affirmation: {
      en: "You are held. Your circle is here",
      de: "Du wirst gehalten Dein Kreis ist hier",
      pt: "Você é acolhido Seu círculo está aqui",
      ru: "Тебя поддерживают Твой круг рядом"
    },
    color: "text-[#cbd5e1]", 
    bg: "bg-[#cbd5e1]/10", 
    border: "border-[#cbd5e1]/30" 
  },
];

interface VibeMirrorProps {
  vibe: { current: string; currentEmoji?: string; currentLabel: string; };
  onVibeUpdate?: (newVibe: any) => void;
}

export function VibeMirror({ vibe, onVibeUpdate }: VibeMirrorProps) {
  const firestore = useFirestore();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lang, setLang] = useState<'en' | 'de' | 'pt' | 'ru'>('en');

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de', 'pt', 'ru'].includes(savedLang)) setLang(savedLang);
  }, []);

  const currentTheme = VIBES.find((v) => v.key === vibe?.current) || VIBES[2];
  const CurrentIcon = currentTheme.icon;

  const handleVibeSelect = (selected: typeof VIBES[0]) => {
    setIsSaving(true);
    if (user && firestore) {
      const userRef = doc(firestore, "users", user.uid);
      const labelMap = { en: selected.label, de: selected.de, pt: selected.pt, ru: selected.ru };
      const newVibeData = {
        current: selected.key,
        currentLabel: labelMap[lang],
        lastUpdated: serverTimestamp(),
      };
      updateDocumentNonBlocking(userRef, { vibe: newVibeData });
      onVibeUpdate?.({ ...newVibeData, lastUpdated: new Date().toISOString() });
      setTimeout(() => { setIsSaving(false); setIsOpen(false); }, 400);
    } else setIsSaving(false);
  };

  const getLocalizedLabel = (v: typeof VIBES[0]) => {
    if (lang === 'de') return v.de;
    if (lang === 'pt') return v.pt;
    if (lang === 'ru') return v.ru;
    return v.label;
  };

  const UI = {
    en: { header: "Check Your Vibe", sub: "I honor my current state", footer: "Processed locally with love" },
    de: { header: "Stimmungs Check-in", sub: "Ich achte auf meinen Zustand", footer: "Lokal verarbeitet mit Liebe" },
    pt: { header: "Sincronia de Humor", sub: "Eu honro meu estado atual", footer: "Processado localmente com amor" },
    ru: { header: "Проверка Настроения", sub: "Я принимаю свое состояние", footer: "Обработано локально с любовью" }
  }[lang];

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className={cn(
          "flex items-center gap-3 px-5 py-3 rounded-full border transition-all active:scale-95 group", 
          currentTheme.border, 
          !currentTheme.isRainbow && currentTheme.bg,
          currentTheme.isRainbow && "bg-white/5 relative overflow-hidden",
          "hover:bg-white/5 shadow-lg"
        )}
      >
        {currentTheme.isRainbow && (
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-yellow-500/20 via-green-500/20 via-blue-500/20 to-purple-500/20 animate-pulse" />
        )}
        <span className="group-hover:scale-110 transition-transform flex items-center justify-center relative z-10">
          <CurrentIcon size={20} color="currentColor" className={currentTheme.isRainbow ? "text-white" : currentTheme.color} />
        </span>
        <span className={cn("text-[10px] font-black uppercase tracking-widest hidden sm:block relative z-10", currentTheme.isRainbow ? "text-white" : currentTheme.color, lang === 'ru' && "italic font-serif")}>
          {getLocalizedLabel(currentTheme)}
        </span>
        <ChevronDown size={12} className={cn("opacity-40 relative z-10", currentTheme.isRainbow ? "text-white" : currentTheme.color)} />
      </button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="bottom" className="bg-black border-white/10 p-8 rounded-t-[3.5rem] h-auto max-h-[90vh] overflow-y-auto shadow-[0_-30px_100px_rgba(0,0,0,0.8)]">
          <SheetHeader className="mb-10">
            <div className="w-16 h-16 bg-[#10B981]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#10B981]/20">
              <Heart className="text-[#10B981]" size={32} />
            </div>
            <SheetTitle className={cn("text-center text-2xl font-black uppercase tracking-tighter text-white", lang === 'ru' && "italic font-serif")}>
              {UI.header}
            </SheetTitle>
            <p className={cn("text-center text-[10px] font-black uppercase tracking-[0.4em] mt-2 text-[#10B981]", lang === 'ru' && "italic font-serif")}>
              {UI.sub}
            </p>
          </SheetHeader>
          
          <div className="grid grid-cols-1 gap-3 max-w-md mx-auto pb-10">
            {VIBES.map((v) => {
              const VibeIcon = v.icon;
              const isActive = vibe?.current === v.key;
              const label = getLocalizedLabel(v);
              return (
                <button 
                  key={v.key} 
                  onClick={() => handleVibeSelect(v)} 
                  disabled={isSaving} 
                  className={cn(
                    "flex items-center gap-6 p-6 rounded-[2.5rem] border-2 transition-all active:scale-[0.98] text-left group relative overflow-hidden", 
                    isActive ? `bg-white/5 ${v.border} shadow-2xl` : "bg-[#0a0a0a] border-white/5 hover:border-white/20"
                  )}
                >
                  {v.isRainbow && isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-yellow-500/10 via-green-500/10 via-blue-500/10 to-purple-500/10 animate-pulse" />
                  )}
                  <div className="w-12 flex justify-center group-hover:scale-110 transition-transform relative z-10">
                    <VibeIcon size={40} color="currentColor" className={isActive ? (v.isRainbow ? "text-white" : v.color) : "text-white/20"} />
                  </div>
                  <div className="flex flex-col relative z-10">
                    <span className={cn("font-black text-base uppercase tracking-tight", isActive ? "text-white" : "text-white/60", lang === 'ru' && "italic font-serif")}>
                      {label}
                    </span>
                    <span className={cn("text-[10px] font-bold text-white/20 uppercase tracking-widest leading-none mt-1", lang === 'ru' && "italic font-serif")}>
                      {v.affirmation[lang]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          
          <div className="mt-4 pt-6 border-t border-white/5 max-w-md mx-auto">
            <p className={cn("text-center text-[10px] text-[#10B981] font-black uppercase tracking-[0.5em]", lang === 'ru' && "italic font-serif")}>
              {UI.footer}
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
