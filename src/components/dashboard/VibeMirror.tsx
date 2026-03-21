
'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useUser, updateDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { ChevronDown, Leaf, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HarmonyYinYangIcon } from '@/components/ui/harmony-yin-yang-icon';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

/**
 * @fileOverview Vibe Mirror Component.
 * Footers highlighted in emerald green with emoji removed.
 */

const VIBES = [
  { key: "radiant", emoji: "🌈", label: "Radiant", de: "Strahlend", affirmation: "Your light is shining bright today 🌈", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
  { key: "harmony", emoji: "☯️", label: "In Harmony", de: "In Harmonie", customIcon: <HarmonyYinYangIcon size={32} className="text-[#EBFB3B]" />, affirmation: "You are aligned with your inner rhythm", color: "text-[#EBFB3B]", bg: "bg-[#EBFB3B]/10", border: "border-[#EBFB3B]/30" },
  { key: "calm", emoji: "🍃", label: "Calm", de: "Beruhigt", customIcon: <Leaf size={32} className="text-[#10B981]" />, affirmation: "Everything is exactly as it is supposed to be 🍃", color: "text-[#10B981]", bg: "bg-[#10B981]/10", border: "border-[#10B981]/30" },
  { key: "hazy", emoji: "☁️", label: "Hazy", de: "Verschwommen", affirmation: "It is okay to rest and be still ☁️", color: "text-gray-400", bg: "bg-gray-500/10", border: "border-gray-500/30" },
  { key: "overwhelmed", emoji: "🌊", label: "Overwhelmed", de: "Überwältigt", affirmation: "You are held. Your circle is here 🌊", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
];

interface VibeMirrorProps {
  vibe: { current: string; currentEmoji: string; currentLabel: string; };
  onVibeUpdate?: (newVibe: any) => void;
}

export function VibeMirror({ vibe, onVibeUpdate }: VibeMirrorProps) {
  const firestore = useFirestore();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lang, setLang] = useState<'EN' | 'DE'>('EN');

  useEffect(() => {
    const savedLang = localStorage.getItem('stayonbeat_lang');
    if (savedLang === 'DE' || savedLang === 'EN') setLang(savedLang as 'EN' | 'DE');
  }, []);

  const currentTheme = VIBES.find((v) => v.key === vibe?.current) || VIBES[2];

  const handleVibeSelect = (selected: typeof VIBES[0]) => {
    setIsSaving(true);
    if (user && firestore) {
      const userRef = doc(firestore, "users", user.uid);
      const newVibeData = {
        current: selected.key, currentEmoji: selected.emoji,
        currentLabel: lang === 'EN' ? selected.label : selected.de,
        lastUpdated: serverTimestamp(),
      };
      updateDocumentNonBlocking(userRef, { vibe: newVibeData });
      onVibeUpdate?.({ ...newVibeData, lastUpdated: new Date().toISOString() });
      setTimeout(() => { setIsSaving(false); setIsOpen(false); }, 400);
    } else setIsSaving(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={cn("flex items-center gap-2.5 px-4 py-3 rounded-full border transition-all active:scale-95 group", currentTheme.border, currentTheme.bg, "hover:bg-white/5 shadow-lg")}>
        <span className="text-xl group-hover:scale-110 transition-transform flex items-center justify-center">{currentTheme.key === 'harmony' ? <HarmonyYinYangIcon size={20} className={currentTheme.color} /> : currentTheme.key === 'calm' ? <Leaf size={20} className={currentTheme.color} /> : (vibe?.currentEmoji || "🤲")}</span>
        <span className={cn("text-[10px] font-black uppercase tracking-widest hidden sm:block", currentTheme.color)}>{vibe?.currentLabel || (lang === 'EN' ? "Calm" : "Beruhigt")}</span>
        <ChevronDown size={12} className={cn("opacity-40", currentTheme.color)} />
      </button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="bottom" className="bg-black border-white/10 p-8 rounded-t-[3.5rem] h-auto max-h-[90vh] overflow-y-auto shadow-[0_-30px_100px_rgba(0,0,0,0.8)]">
          <SheetHeader className="mb-10">
            <div className="w-16 h-16 bg-[#10B981]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#10B981]/20"><Heart className="text-[#10B981]" size={32} /></div>
            <SheetTitle className="text-center text-2xl font-black uppercase tracking-tighter text-white">{lang === 'EN' ? 'Check Your Vibe' : 'Stimmungs Check-in'}</SheetTitle>
            <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] mt-2 text-[#10B981]">{lang === 'EN' ? 'I honor my current state' : 'Ich achte auf meinen Zustand'}</p>
          </SheetHeader>
          <div className="grid grid-cols-1 gap-3 max-w-md mx-auto pb-10">
            {VIBES.map((v) => (
              <button key={v.key} onClick={() => handleVibeSelect(v)} disabled={isSaving} className={cn("flex items-center gap-6 p-6 rounded-[2.5rem] border-2 transition-all active:scale-[0.98] text-left group", vibe?.current === v.key ? `bg-white/5 ${v.key === 'harmony' ? 'border-[#EBFB3B]' : 'border-[#10B981]'} shadow-2xl` : "bg-[#0a0a0a] border-white/5 hover:border-white/20")}>
                <div className="w-12 flex justify-center group-hover:scale-110 transition-transform">{v.customIcon ? v.customIcon : <span className="text-4xl">{v.emoji}</span>}</div>
                <div className="flex flex-col"><span className={cn("font-black text-base uppercase tracking-tight", vibe?.current === v.key ? "text-white" : "text-white/60")}>{lang === 'EN' ? v.label : v.de}</span></div>
              </button>
            ))}
          </div>
          <div className="mt-4 pt-6 border-t border-white/5 max-w-md mx-auto">
            <p className="text-center text-[10px] text-[#10B981] font-black uppercase tracking-[0.5em]">{lang === 'EN' ? 'Received with Unconditional Love' : 'Mit bedingungsloser Liebe empfangen'}</p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
