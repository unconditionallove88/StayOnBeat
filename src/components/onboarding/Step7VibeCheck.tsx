
'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Leaf } from 'lucide-react';
import { useFirestore, useUser, setDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { HarmonyYinYangIcon } from '@/components/ui/harmony-yin-yang-icon';
import type { OnboardingData } from '@/app/onboarding/page';
import NotificationPrompt from '@/components/dashboard/NotificationPrompt';

/**
 * @fileOverview Mood Check-in Onboarding Step.
 * Footers highlighted in emerald green with emoji removed.
 */

const VIBE_OPTIONS = [
  { id: 'radiant', emoji: '🌈', label: 'Radiant', de: 'Strahlend', description: 'Your light is shining bright today', deDescription: 'Dein Licht leuchtet heute hell', color: 'border-purple-500/20 text-purple-400', activeColor: 'bg-purple-500/10 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]' },
  { id: 'harmony', emoji: '☯️', label: 'In Harmony', de: 'In Harmonie', customIcon: <HarmonyYinYangIcon size={48} className="text-[#EBFB3B]" />, description: 'You are aligned with your rhythm', deDescription: 'Du bist im Einklang mit deinem Rhythmus', color: 'border-[#EBFB3B]/20 text-[#EBFB3B]', activeColor: 'bg-[#EBFB3B]/10 border-[#EBFB3B] shadow-[0_0_20px_rgba(235,251,59,0.3)]' },
  { id: 'calm', emoji: '🍃', label: 'Calm', de: 'Beruhigt', customIcon: <Leaf size={48} className="text-[#10B981]" />, description: 'Everything is exactly as it is supposed to be', deDescription: 'Alles ist im Gleichgewicht und klar', color: 'border-[#10B981]/20 text-[#10B981]', activeColor: 'bg-[#10B981]/10 border-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.3)]' },
  { id: 'hazy', emoji: '☁️', label: 'Hazy', de: 'Verschwommen', description: 'It is okay to rest and be still', deDescription: 'Es ist okay, sich auszuruhen', color: 'border-gray-500/20 text-gray-400', activeColor: 'bg-gray-500/10 border-gray-500 shadow-[0_0_20px_rgba(107,114,128,0.3)]' },
  { id: 'overwhelmed', emoji: '🌊', label: 'Overwhelmed', de: 'Überwältigt', description: 'You are held. Your circle is here', deDescription: 'Du wirst gehalten. Dein Kreis ist hier', color: 'border-blue-500/20 text-blue-400', activeColor: 'bg-blue-500/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' },
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
      uid: user.uid, name: finalOnboardingData.name,
      legal: { harmReductionAccepted: true, medicalDisclaimerAccepted: true, gdprAccepted: true, termsAcceptedAt: serverTimestamp() },
      biometrics: { weightKg: Number(finalOnboardingData.weight), heightCm: Number(finalOnboardingData.height) },
      trustLevel: "verified_adult",
      vibe: { current: selected, currentEmoji: selectedVibe?.emoji, currentLabel: localizedLabel, lastUpdated: serverTimestamp(), history: [{ value: selected, emoji: selectedVibe?.emoji, recordedAt: nowISO, context: "onboarding" }] },
      onboardingStatus: "completed", onboardingCompletedAt: serverTimestamp(),
      goals: finalOnboardingData.goals || [], healthConditions: finalOnboardingData.healthConditions || [], medications: finalOnboardingData.medications || []
    } : { vibe: { current: selected, currentEmoji: selectedVibe?.emoji, currentLabel: localizedLabel, lastUpdated: serverTimestamp(), history: arrayUnion({ value: selected, emoji: selectedVibe?.emoji, recordedAt: nowISO, context: "session_checkin" }) } };

    setDocumentNonBlocking(doc(firestore, 'users', user.uid), payload, { merge: true });
    setIsSaved(true); setIsSaving(false);
    setTimeout(() => { if (isOnboarding) setShowNotificationPrompt(true); else onComplete([selected]); }, 1500);
  };

  if (showNotificationPrompt) return <NotificationPrompt onClose={() => onComplete([selected!])} />;

  if (isSaved) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center text-center px-6 font-headline animate-in fade-in zoom-in-95 duration-1000">
        <h2 className="text-4xl font-black uppercase tracking-tighter text-[#10B981] mb-4">{lang === 'EN' ? 'Mood calibrated' : 'Stimmung kalibriert'}</h2>
        <p className="text-white/60 text-lg font-bold max-sm leading-tight">{lang === 'EN' ? 'StayOnBeat sees you. I am loved' : 'StayOnBeat sieht dich. Ich werde geliebt'}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center font-headline max-xl mx-auto px-4 text-center relative">
      {onBack && <button onClick={onBack} disabled={isSaving} className="absolute top-0 left-4 text-white/40 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-50"><ArrowLeft className="w-4 h-4" /> {lang === 'EN' ? 'BACK' : 'ZURÜCK'}</button>}
      <div className="mt-12 mb-10"><h2 className="text-[28px] font-black uppercase mb-2 text-white leading-none tracking-tighter">{lang === 'EN' ? 'How is your mood today?' : 'Wie ist deine Stimmung heute?'}</h2></div>
      <div className="grid grid-cols-1 gap-3 w-full mb-12 overflow-y-auto max-h-[50vh] pr-2">
        {VIBE_OPTIONS.map((vibe) => (
          <button key={vibe.id} onClick={() => setSelected(vibe.id)} disabled={isSaving} className={cn("p-5 rounded-[2rem] border-2 flex items-center gap-6 transition-all active:scale-[0.98] text-left", selected === vibe.id ? vibe.activeColor : "bg-[#0a0a0a] border-white/5 hover:border-white/20")}>
            <div className="w-12 flex justify-center">{vibe.customIcon ? React.cloneElement(vibe.customIcon as React.ReactElement, { size: 40 }) : <span className="text-4xl">{vibe.emoji}</span>}</div>
            <div className="flex flex-col"><span className={cn("font-black text-lg uppercase tracking-tight", selected === vibe.id ? "text-white" : "text-white/60")}>{lang === 'EN' ? vibe.label : vibe.de}</span><span className="text-[10px] font-black text-[#10B981] uppercase tracking-widest leading-none">{lang === 'EN' ? vibe.description : vibe.deDescription}</span></div>
          </button>
        ))}
      </div>
      <div className="flex flex-col items-center gap-6 w-full">
        <button onClick={handleConfirm} disabled={!selected || isSaving} className={cn("pill-button w-full max-w-sm uppercase tracking-[0.2em] font-black text-xl h-[64px] transition-all", selected && !isSaving ? 'bg-[#10B981] text-black neon-glow' : 'bg-white/10 text-white/10 cursor-not-allowed opacity-50')}>{isSaving ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (lang === 'EN' ? 'CONTINUE WITH LOVE' : 'MIT LIEBE WEITER')}</button>
        <p className="text-center text-[10px] text-[#10B981] font-black uppercase tracking-[0.5em]">{lang === 'EN' ? 'Received with Unconditional Love' : 'Mit bedingungsloser Liebe empfangen'}</p>
      </div>
    </div>
  );
}
