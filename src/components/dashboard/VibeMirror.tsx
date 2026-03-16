'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useUser, updateDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

/**
 * @fileOverview Vibe Mirror Component (Mood Chip).
 * Uses a Bottom Sheet (Sheet component) for an organic, mobile-native selection experience.
 */

const VIBES = [
  { 
    key: "radiant", 
    emoji: "🌈", 
    label: "Radiant", 
    de: "Strahlend",
    affirmation: "Your light is shining bright today. 🌈", 
    deAffirmation: "Dein Licht leuchtet heute hell. 🌈",
    color: "text-purple-400", 
    bg: "bg-purple-500/10", 
    border: "border-purple-500/30",
  },
  { 
    key: "harmony", 
    emoji: "✨", 
    label: "In Harmony", 
    de: "In Harmonie",
    affirmation: "You are aligned with your inner rhythm.", 
    deAffirmation: "Du bist im Einklang mit deinem Rhythmus.",
    color: "text-yellow-400", 
    bg: "bg-yellow-500/10", 
    border: "border-yellow-500/30",
  },
  { 
    key: "calm", 
    emoji: "🍃", 
    label: "Calm", 
    de: "Ruhig",
    affirmation: "Peace looks beautiful on you. 🍃", 
    deAffirmation: "Frieden steht dir gut. 🍃",
    color: "text-[#10B981]", 
    bg: "bg-[#10B981]/10", 
    border: "border-[#10B981]/30",
  },
  { 
    key: "hazy", 
    emoji: "☁️", 
    label: "Hazy", 
    de: "Verschwommen",
    affirmation: "It is okay to rest and be still. ☁️", 
    deAffirmation: "Es ist okay, sich auszuruhen. ☁️",
    color: "text-gray-400", 
    bg: "bg-gray-500/10", 
    border: "border-gray-500/30",
  },
  { 
    key: "overwhelmed", 
    emoji: "🌊", 
    label: "Overwhelmed", 
    de: "Überwältigt",
    affirmation: "You are held. Your circle is here. 🌊", 
    deAffirmation: "Du wirst gehalten. Dein Kreis ist hier. 🌊",
    color: "text-blue-400", 
    bg: "bg-blue-500/10", 
    border: "border-blue-500/30",
  },
];

interface VibeMirrorProps {
  vibe: {
    current: string;
    currentEmoji: string;
    currentLabel: string;
  };
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
    if (savedLang === 'DE' || savedLang === 'EN') {
      setLang(savedLang as 'EN' | 'DE');
    }
  }, []);

  const currentTheme = VIBES.find((v) => v.key === vibe?.current) || VIBES[2];

  const handleVibeSelect = (selected: typeof VIBES[0]) => {
    setIsSaving(true);
    if (user && firestore) {
      const userRef = doc(firestore, "users", user.uid);
      const newVibeData = {
        current: selected.key,
        currentEmoji: selected.emoji,
        currentLabel: lang === 'EN' ? selected.label : selected.de,
        lastUpdated: serverTimestamp(),
      };
      updateDocumentNonBlocking(userRef, { vibe: newVibeData });
      onVibeUpdate?.({ ...newVibeData, lastUpdated: new Date().toISOString() });
      
      // Artificial delay for feel
      setTimeout(() => {
        setIsSaving(false);
        setIsOpen(false);
      }, 400);
    } else {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* THE MOOD CHIP */}
      <button 
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex items-center gap-2.5 px-4 py-2.5 rounded-full border transition-all active:scale-95 group z-[60]",
          currentTheme.border,
          currentTheme.bg,
          "hover:bg-white/5"
        )}
      >
        <span className="text-lg leading-none group-hover:scale-110 transition-transform">
          {vibe?.currentEmoji || "🍃"}
        </span>
        <span className={cn(
          "text-[10px] font-black uppercase tracking-widest hidden sm:block",
          currentTheme.color
        )}>
          {vibe?.currentLabel || (lang === 'EN' ? "Calm" : "Ruhig")}
        </span>
        <ChevronDown size={12} className={cn("opacity-40", currentTheme.color)} />
      </button>

      {/* THE BOTTOM SHEET SELECTION */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="bottom" className="bg-black border-white/10 p-8 rounded-t-[3rem] h-auto max-h-[85vh] overflow-y-auto">
          <SheetHeader className="mb-8">
            <SheetTitle className="text-center text-xl font-black uppercase tracking-tighter text-white">
              {lang === 'EN' ? 'Heart Check-in' : 'Herz Check-in'}
            </SheetTitle>
            <p className="text-center text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">
              {lang === 'EN' ? 'How are you feeling right now?' : 'Wie fühlst du dich gerade?'}
            </p>
          </SheetHeader>

          <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
            {VIBES.map((v) => (
              <button
                key={v.key}
                onClick={() => handleVibeSelect(v)}
                disabled={isSaving}
                className={cn(
                  "flex items-center gap-6 p-5 rounded-[2rem] border-2 transition-all active:scale-[0.98] text-left group",
                  vibe?.current === v.key 
                    ? "bg-white/5 border-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.15)]" 
                    : "bg-[#0a0a0a] border-white/5 hover:border-white/20"
                )}
              >
                <span className="text-4xl group-hover:scale-110 transition-transform">{v.emoji}</span>
                <div className="flex flex-col">
                  <span className={cn(
                    "font-black text-sm uppercase tracking-tight",
                    vibe?.current === v.key ? "text-white" : "text-white/60"
                  )}>
                    {lang === 'EN' ? v.label : v.de}
                  </span>
                  <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest leading-none mt-1">
                    {lang === 'EN' ? v.affirmation : v.deAffirmation}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 max-w-md mx-auto">
            <p className="text-center text-[8px] text-white/10 font-black uppercase tracking-[0.5em]">
              StayOnBeat • Vibe Calibration
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
