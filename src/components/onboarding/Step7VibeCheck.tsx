
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
 * High-fidelity Resonance Icons implemented with an organic color palette.
 */

const VIBE_OPTIONS = [
  { 
    id: 'radiant', 
    label: 'Radiant', 
    de: 'Strahlend', 
    icon: RadiantIcon, 
    description: 'Your light is shining bright today', 
    deDescription: 'Dein Licht leuchtet heute hell', 
    color: 'text-purple-400', 
    activeColor: 'bg-purple-500/10 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]' 
  },
  { 
    id: 'harmony', 
    label: 'In Harmony', 
    de: 'In Harmonie', 
    icon: HarmonyIcon, 
    description: 'You are aligned with your rhythm', 
    deDescription: 'Du bist im Einklang mit deinem Rhythmus', 
    color: 'text-[#EBFB3B]', 
    activeColor: 'bg-[#EBFB3B]/10 border-[#EBFB3B] shadow-[0_0_20px_rgba(235,251,59,0.3)]' 
  },
  { 
    id: 'calm', 
    label: 'Calm', 
    de: 'Beruhigt', 
    icon: CalmIcon, 
    description: 'Everything is exactly as it is supposed to be', 
    deDescription: 'Alles ist im Gleichgewicht und klar', 
    color: 'text-[#10B981]', 
    activeColor: 'bg-[#10B981]/10 border-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
  },
  { 
    id: 'hazy', 
    label: 'Hazy', 
    de: 'Verschwommen', 
    icon: HazyIcon, 
    description: 'It is okay to rest and be still', 
    deDescription: 'Es ist okay, sich auszuruhen', 
    color: 'text-slate-400', 
    activeColor: 'bg-slate-500/10 border-slate-500 shadow-[0_0_20px_rgba(107,114,128,0.3)]' 
  },
  { 
    id: 'overwhelmed', 
    label: 'Overwhelmed', 
    de: 'Überwältigt', 
    icon: HeldIcon, 
    description: 'You are held. Your circle is here', 
    deDescription: 'Du wirst gehalten. Dein Kreis ist hier', 
    color: 'text-blue-400', 
    activeColor: 'bg-blue-500/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
  },
];

interface Step7VibeCheckProps {
  onComplete: (vibeIds: string[]) => void;
  onBack?: () => void;
  isOnboarding?: boolean;
  finalOnboardingData?: OnboardingData;
}

export function Step7VibeCheck({ onComplete, onBack, isOnboarding = false, finalOnboardingData }: Step7VibeCheckProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const [lang, setLang] = useState<'EN' | 'DE'>('EN');
  const firestore = useFirestore();
  const { user } = useUser();

  useEffect(() => {
    const savedLang = localStorage.getItem('stayonbeat_lang');
    if (savedLang === 'DE' || savedLang === 'EN') setLang(savedLang as 'EN' | 'DE');
  }, []);

  const handleConfirm = () => {
    if (!selected || !user || !firestore) return;
    setIsSaving(true);
    const selectedVibe = VIBE_OPTIONS.find(v => v.id === selected);
    const nowISO = new Date().toISOString();
    const localizedLabel = lang === 'EN' ? selectedVibe?.label : selectedVibe?.de;

    const payload: any = isOnboarding && finalOnboardingData ? {
      uid: user.uid,
      name: finalOnboardingData.name,
      legal: { harmReductionAccepted: true, medicalDisclaimerAccepted: true, gdprAccepted: true, termsAcceptedAt: serverTimestamp() },
      biometrics: { weightKg: Number(finalOnboardingData.weight), heightCm: Number(finalOnboardingData.height) },
      trustLevel: "verified_adult",
      vibe: { 
        current: selected, 
        currentLabel: localizedLabel, 
        lastUpdated: serverTimestamp(), 
        history: [{ value: selected, recordedAt: nowISO, context: "onboarding" }] 
      },
      onboardingStatus: "completed", onboardingCompletedAt: serverTimestamp(),
      goals: finalOnboardingData.goals || [], healthConditions: finalOnboardingData.healthConditions || [], medications: finalOnboardingData.medications || []
    } : { 
      vibe: { 
        current: selected, 
        currentLabel: localizedLabel, 
        lastUpdated: serverTimestamp(), 
        history: arrayUnion({ value: selected, recordedAt: nowISO, context: "session_checkin" }) 
      } 
    };

    setDocumentNonBlocking(doc(firestore, 'users', user.uid), payload, { merge: true });
    setIsSaved(true); setIsSaving(false);
    setTimeout(() => { if (isOnboarding) setShowNotificationPrompt(true); else onComplete([selected]); }, 1500);
  };

  if (showNotificationPrompt) return <NotificationPrompt onClose={() => onComplete([selected!])} />;

  if (isSaved) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center text-center px-6 font-headline animate-in fade-in zoom-in-95 duration-1000">
        <h2 className="text-4xl font-black uppercase tracking-tighter text-[#10B981] mb-4">
          {lang === 'EN' ? 'Mood calibrated' : 'Stimmung kalibriert'}
        </h2>
        <p className="text-white/60 text-lg font-bold max-sm leading-tight">
          {lang === 'EN' ? 'StayOnBeat sees you. I am loved' : 'StayOnBeat sieht dich. Ich werde geliebt'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center font-headline max-xl mx-auto px-4 text-center relative">
      {onBack && (
        <button 
          onClick={onBack} 
          disabled={isSaving} 
          className="absolute top-0 left-4 text-white/40 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-50"
        >
          <ArrowLeft className="w-4 h-4" /> {lang === 'EN' ? 'BACK' : 'ZURÜCK'}
        </button>
      )}
      
      <div className="mt-12 mb-10">
        <h2 className="text-[28px] font-black uppercase mb-2 text-white leading-none tracking-tighter">
          {lang === 'EN' ? 'How is your mood today?' : 'Wie ist deine Stimmung heute?'}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3 w-full mb-12 overflow-y-auto max-h-[50vh] pr-2 custom-scrollbar">
        {VIBE_OPTIONS.map((vibe) => {
          const VibeIcon = vibe.icon;
          const isSelected = selected === vibe.id;
          return (
            <button 
              key={vibe.id} 
              onClick={() => setSelected(vibe.id)} 
              disabled={isSaving} 
              className={cn(
                "p-5 rounded-[2.5rem] border-2 flex items-center gap-6 transition-all active:scale-[0.98] text-left", 
                isSelected ? vibe.activeColor : "bg-[#0a0a0a] border-white/5 hover:border-white/20"
              )}
            >
              <div className="w-12 flex justify-center">
                <VibeIcon size={40} color="currentColor" className={isSelected ? vibe.color : "text-white/20"} />
              </div>
              <div className="flex flex-col">
                <span className={cn("font-black text-lg uppercase tracking-tight", isSelected ? "text-white" : "text-white/60")}>
                  {lang === 'EN' ? vibe.label : vibe.de}
                </span>
                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest leading-none mt-1">
                  {lang === 'EN' ? vibe.description : vibe.deDescription}
                </span>
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
            selected && !isSaving ? 'bg-[#10B981] text-black neon-glow' : 'bg-white/10 text-white/10 cursor-not-allowed opacity-50'
          )}
        >
          {isSaving ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (lang === 'EN' ? 'CONTINUE WITH LOVE' : 'MIT LIEBE WEITER')}
        </button>
        <p className="text-center text-[10px] text-[#10B981] font-black uppercase tracking-[0.5em]">
          Lokal verarbeitet mit Liebe
        </p>
      </div>
    </div>
  );
}
