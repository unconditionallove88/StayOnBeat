'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Heart } from 'lucide-react';
import { useFirestore, useUser, setDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { RadiantIcon, HarmonyIcon, CalmIcon, HazyIcon, HeldIcon } from '@/components/ui/vibe-icons';
import type { OnboardingData } from '@/app/onboarding/page';
import NotificationPrompt from '@/components/dashboard/NotificationPrompt';

/**
 * @fileOverview Mood Check-in Onboarding Step.
 * Action Buttons synchronized to the wise dark green #1b4d3e.
 * TR Language added.
 */

interface Step7VibeCheckProps {
  onComplete: (vibe: string[]) => void;
  onBack?: () => void;
  isOnboarding?: boolean;
  finalOnboardingData?: OnboardingData;
}

const VIBE_OPTIONS = [
  { 
    id: 'radiant', label: 'Radiant', de: 'Strahlend', pt: 'Radiante', tr: 'Işıldayan',
    icon: RadiantIcon, description: 'Your light is shining bright today', deDescription: 'Dein Licht leuchtet heute hell',
    ptDescription: 'Sua luz está brilhando forte hoje', trDescription: 'Işığın bugün çok parlak parlıyor',
    color: 'text-white', activeColor: 'bg-gradient-to-r from-red-500/10 via-yellow-500/10 via-green-500/10 via-blue-500/10 to-purple-500/10 border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.2)]',
    isRainbow: true
  },
  { 
    id: 'harmony', label: 'In Harmony', de: 'In Harmonie', pt: 'Em Harmonia', tr: 'Uyum İçinde',
    icon: HarmonyIcon, description: 'You are aligned with your rhythm', deDescription: 'Du bist im Einklang mit deinem Rhythmus',
    ptDescription: 'Você está alinhado com seu ritmo', trDescription: 'İç ritminle tam bir uyumdasın',
    color: 'text-[#58c55a]', activeColor: 'bg-[#58c55a]/10 border-[#58c55a] shadow-[0_0_20px_rgba(88,197,90,0.3)]' 
  },
  { 
    id: 'calm', label: 'Calm', de: 'Beruhigt', pt: 'Calmo', tr: 'Sakin',
    icon: CalmIcon, description: 'Everything is exactly as it is supposed to be', deDescription: 'Alles ist im Gleichgewicht und klar',
    ptDescription: 'Tudo está exatamente como deveria estar', trDescription: 'Her şey tam olması gerektiği gibi',
    color: 'text-[#3B82F6]', activeColor: 'bg-[#3B82F6]/10 border-[#3B82F6] shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
  },
  { 
    id: 'hazy', label: 'Hazy', de: 'Verschwommen', pt: 'Nebuloso', tr: 'Puslu',
    icon: HazyIcon, description: 'It is okay to rest and be still', deDescription: 'Es ist okay sich auszuruhen',
    ptDescription: 'Tudo bem descansar e ficar em silêncio', trDescription: 'Dinlenmek ve sessiz kalmak normaldir',
    color: 'text-[#93C5FD]', activeColor: 'bg-[#93C5FD]/10 border-[#93C5FD] shadow-[0_0_20px_rgba(147,197,253,0.3)]' 
  },
  { 
    id: 'overwhelmed', label: 'Overwhelmed', de: 'Überwältigt', pt: 'Sobrecarregado', tr: 'Bunalmış',
    icon: HeldIcon, description: 'You are held. Your circle is here', deDescription: 'Du wirst gehalten Dein Kreis ist hier',
    ptDescription: 'Você é acolhido Seu círculo está aqui', trDescription: 'Destekleniyorsun Çemberin seninle burada',
    color: 'text-[#cbd5e1]', activeColor: 'bg-[#cbd5e1]/10 border-[#cbd5e1] shadow-[0_0_20px_rgba(203,213,225,0.3)]' 
  },
];

const CONTENT = {
  EN: { header: 'How is your mood today?', success: 'Mood calibrated', sub: 'StayOnBeat sees you I am loved', back: 'BACK', footer: 'Processed locally with love', btn: 'CONTINUE WITH LOVE' },
  DE: { header: 'Wie ist deine Stimmung heute?', success: 'Stimmung kalibriert', sub: 'StayOnBeat sieht dich Ich werde geliebt', back: 'ZURÜCK', footer: 'Lokal verarbeitet mit Liebe', btn: 'MIT LIEBE WEITER' },
  PT: { header: 'Como está seu humor hoje?', success: 'Humor calibrado', sub: 'StayOnBeat vê você Eu sou amado', back: 'VOLTAR', footer: 'Processado localmente com amor', btn: 'CONTINUAR COM AMOR' },
  TR: { header: 'Bugün ruh halin nasıl?', success: 'Ruh hali kalibre edildi', sub: 'StayOnBeat seni görüyor seviliyorum', back: 'GERİ', footer: 'Sevgiyle yerel olarak işlendi', btn: 'SEVGİYLE DEVAM ET' }
};

export function Step7VibeCheck({ onComplete, onBack, isOnboarding = false, finalOnboardingData }: Step7VibeCheckProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const [lang, setLang] = useState<'EN' | 'DE' | 'PT' | 'TR'>('EN');
  const firestore = useFirestore();
  const { user } = useUser();

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toUpperCase() as any;
    if (['EN', 'DE', 'PT', 'TR'].includes(savedLang)) setLang(savedLang);
  }, []);

  const t = CONTENT[lang] || CONTENT.EN;

  const handleConfirm = () => {
    if (!selected || !user || !firestore) return;
    setIsSaving(true);
    const selectedVibe = VIBE_OPTIONS.find(v => v.id === selected);
    const label = lang === 'EN' ? selectedVibe?.label : lang === 'DE' ? selectedVibe?.de : lang === 'PT' ? selectedVibe?.pt : selectedVibe?.tr;

    const payload: any = isOnboarding && finalOnboardingData ? {
      uid: user.uid, name: finalOnboardingData.name, trustLevel: "verified_adult",
      vibe: { current: selected, currentLabel: label, lastUpdated: serverTimestamp(), history: [{ value: selected, recordedAt: new Date().toISOString(), context: "onboarding" }] },
      onboardingStatus: "completed", onboardingCompletedAt: serverTimestamp(),
      goals: finalOnboardingData.goals || [], healthConditions: finalOnboardingData.healthConditions || [], medications: finalOnboardingData.medications || []
    } : { vibe: { current: selected, currentLabel: label, lastUpdated: serverTimestamp(), history: arrayUnion({ value: selected, recordedAt: new Date().toISOString(), context: "session_checkin" }) } };

    setDocumentNonBlocking(doc(firestore, 'users', user.uid), payload, { merge: true });
    setIsSaved(true); setIsSaving(false);
    setTimeout(() => { if (isOnboarding) setShowNotificationPrompt(true); else onComplete([selected!]); }, 1500);
  };

  if (showNotificationPrompt) return <NotificationPrompt onClose={() => onComplete([selected!])} />;

  if (isSaved) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center text-center px-6 font-headline animate-in fade-in zoom-in-95 duration-1000">
        <h2 className="text-4xl font-black uppercase tracking-tighter text-primary mb-4">{t.success}</h2>
        <p className="text-white/60 text-lg font-bold max-sm leading-tight">{t.sub}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center font-headline max-xl mx-auto px-4 text-center relative">
      {onBack && <button onClick={onBack} disabled={isSaving} className="absolute top-0 left-4 text-white/40 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-50"><ArrowLeft className="w-4 h-4" /> {t.back}</button>}
      <div className="mt-12 mb-10"><h2 className="text-[28px] font-black uppercase mb-2 text-white leading-none tracking-tighter">{t.header}</h2></div>
      <div className="grid grid-cols-1 gap-3 w-full mb-12 overflow-y-auto max-h-[50vh] pr-2 custom-scrollbar">
        {VIBE_OPTIONS.map((vibe) => {
          const VibeIcon = vibe.icon;
          const isSelected = selected === vibe.id;
          const label = lang === 'EN' ? vibe.label : lang === 'DE' ? vibe.de : lang === 'PT' ? vibe.pt : vibe.tr;
          const desc = lang === 'EN' ? vibe.description : lang === 'DE' ? vibe.deDescription : lang === 'PT' ? vibe.ptDescription : vibe.trDescription;
          return (
            <button key={vibe.id} onClick={() => setSelected(vibe.id)} disabled={isSaving} className={cn("p-5 rounded-[2.5rem] border-2 flex items-center gap-6 transition-all active:scale-[0.98] text-left relative overflow-hidden", isSelected ? vibe.activeColor : "bg-[#0a0a0a] border-white/5 hover:border-white/20")}>
              {vibe.isRainbow && isSelected && (
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-yellow-500/10 via-green-500/10 via-blue-500/10 to-purple-500/10 animate-pulse" />
              )}
              <div className="w-12 flex justify-center relative z-10">
                <VibeIcon size={40} color="currentColor" className={isSelected ? (vibe.isRainbow ? "text-white" : vibe.color) : "text-white/20"} />
              </div>
              <div className="flex flex-col relative z-10">
                <span className="font-black text-lg uppercase tracking-tight">{isSelected ? "text-white" : "text-white/60"}</span>
                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest leading-none mt-1">{desc}</span>
              </div>
            </button>
          );
        })}
      </div>
      <div className="flex flex-col items-center gap-6 w-full">
        <button 
          onClick={handleConfirm} 
          disabled={!selected || isSaving} 
          className={cn(
            "pill-button w-full max-w-sm uppercase tracking-[0.2em] font-black text-xl h-[64px] transition-all", 
            selected && !isSaving ? 'bg-[#1b4d3e] text-white neon-glow' : 'bg-white/10 text-white/10 cursor-not-allowed opacity-50'
          )}
        >
          {isSaving ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : t.btn}
        </button>
        <p className="text-center text-[10px] text-primary font-black uppercase tracking-[0.5em]">{t.footer}</p>
      </div>
    </div>
  );
}
