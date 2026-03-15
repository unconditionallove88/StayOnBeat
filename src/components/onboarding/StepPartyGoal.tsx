
"use client"

import { useState, useEffect } from 'react';
import { ArrowLeft, Target, Music, Users, Shield, Ban, ZapOff, Moon, GlassWater, Clock, Heart, Sparkles, Radio, Ear } from 'lucide-react';
import { cn } from '@/lib/utils';

const POSITIVE_GOALS = [
  { id: 'dance', icon: Music, label: 'Dance all night', de: 'Die ganze Nacht tanzen' },
  { id: 'social', icon: Users, label: 'Meet new people', de: 'Neue Leute treffen' },
  { id: 'forget-self', icon: Sparkles, label: 'Forget myself', de: 'Sich vergessen' },
  { id: 'intimacy', icon: Heart, label: 'Find intimacy', de: 'Intimität finden' },
  { id: 'hydrate', icon: GlassWater, label: 'Stay hydrated', de: 'Hydriert bleiben' },
  { id: 'safe', icon: Shield, label: 'Priority: Safety', de: 'Priorität: Sicherheit' },
  { id: 'discover', icon: Target, label: 'Discover music', de: 'Musik entdecken' },
];

const NEGATIVE_GOALS = [
  { id: 'no-mixing', icon: Ban, label: 'Avoid mixing', de: 'Kein Mischen' },
  { id: 'limit-dose', icon: ZapOff, label: 'Limit intake', de: 'Dosis begrenzen' },
  { id: 'early-end', icon: Clock, label: 'Leave early', de: 'Früh gehen' },
  { id: 'no-alcohol', icon: GlassWater, label: 'No alcohol', de: 'Kein Alkohol' },
  { id: 'rest-breaks', icon: Moon, label: 'Take breaks', de: 'Pausen machen' },
];

const RESONANCE_GOALS = [
  { id: 'radiate-presence', icon: Radio, label: 'Radiate Presence', de: 'Präsenz ausstrahlen' },
  { id: 'deep-listening', icon: Ear, label: 'Deep Listening', de: 'Tiefes Zuhören' },
  { id: 'shining-love', icon: Heart, label: 'Shining with Love', de: 'Mit Liebe strahlen' },
];

export function StepPartyGoal({ 
  onComplete, 
  onBack 
}: { 
  onComplete: (goals: string[]) => void, 
  onBack?: () => void 
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [lang, setLang] = useState<'EN' | 'DE'>('EN');

  useEffect(() => {
    const savedLang = localStorage.getItem('stayonbeat_lang');
    if (savedLang === 'DE' || savedLang === 'EN') {
      setLang(savedLang as 'EN' | 'DE');
    }
  }, []);

  const toggleGoal = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-center font-headline max-w-xl mx-auto px-4 text-center relative">
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-0 left-4 text-white/40 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-50"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      )}

      <div className="mt-12 mb-8">
        <h2 className="text-[22px] font-black uppercase mb-2 text-white leading-tight tracking-tighter">
          {lang === 'EN' ? 'Your focus' : 'Dein Fokus'}
        </h2>
        <p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px] max-w-[280px] mx-auto">
          {lang === 'EN' ? 'What is your main focus for the party?' : 'Was ist dein Hauptfokus für die Party?'}
        </p>
      </div>

      <div className="flex-1 w-full overflow-y-auto max-h-[55vh] custom-scrollbar pr-2 mb-8 space-y-8">
        {/* The Resonance Section */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#3EB489] text-left px-2">The Resonance</h3>
          <div className="grid grid-cols-1 gap-3">
            {RESONANCE_GOALS.map((goal) => (
              <button
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                className={cn(
                  "p-5 rounded-[1.5rem] border-2 flex items-center gap-6 transition-all active:scale-[0.98] text-left",
                  selected.includes(goal.id)
                    ? 'bg-[#3EB489]/10 border-[#3EB489] shadow-[0_0_20px_rgba(62,180,137,0.2)]'
                    : 'bg-[#0a0a0a] border-white/10 hover:border-white/30'
                )}
              >
                <div className={cn(
                  "p-3 rounded-xl",
                  selected.includes(goal.id) ? 'bg-[#3EB489] text-black' : 'bg-white/5 text-white/40'
                )}>
                  <goal.icon className="w-5 h-5" />
                </div>
                <span className={cn(
                  "font-black text-base uppercase tracking-tight",
                  selected.includes(goal.id) ? 'text-white' : 'text-white/60'
                )}>
                  {lang === 'EN' ? goal.label : goal.de}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-left px-2">Positive Intentions</h3>
          <div className="grid grid-cols-1 gap-3">
            {POSITIVE_GOALS.map((goal) => (
              <button
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                className={cn(
                  "p-5 rounded-[1.5rem] border-2 flex items-center gap-6 transition-all active:scale-[0.98] text-left",
                  selected.includes(goal.id)
                    ? 'bg-[#3EB489]/10 border-[#3EB489] neon-glow'
                    : 'bg-[#0a0a0a] border-white/10 hover:border-white/30'
                )}
              >
                <div className={cn(
                  "p-3 rounded-xl",
                  selected.includes(goal.id) ? 'bg-[#3EB489] text-black' : 'bg-white/5 text-white/40'
                )}>
                  <goal.icon className="w-5 h-5" />
                </div>
                <span className={cn(
                  "font-black text-base uppercase tracking-tight",
                  selected.includes(goal.id) ? 'text-white' : 'text-white/60'
                )}>
                  {lang === 'EN' ? goal.label : goal.de}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500/40 text-left px-2">Safety Boundaries</h3>
          <div className="grid grid-cols-1 gap-3">
            {NEGATIVE_GOALS.map((goal) => (
              <button
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                className={cn(
                  "p-5 rounded-[1.5rem] border-2 flex items-center gap-6 transition-all active:scale-[0.98] text-left",
                  selected.includes(goal.id)
                    ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
                    : 'bg-[#0a0a0a] border-white/10 hover:border-white/30'
                )}
              >
                <div className={cn(
                  "p-3 rounded-xl",
                  selected.includes(goal.id) ? 'bg-red-500 text-white' : 'bg-white/5 text-white/40'
                )}>
                  <goal.icon className="w-5 h-5" />
                </div>
                <span className={cn(
                  "font-black text-base uppercase tracking-tight",
                  selected.includes(goal.id) ? 'text-white' : 'text-white/60'
                )}>
                  {lang === 'EN' ? goal.label : goal.de}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center shrink-0">
        <button
          onClick={() => onComplete(selected)}
          disabled={selected.length === 0}
          className={cn(
            "pill-button w-full max-w-sm uppercase tracking-[0.2em] font-black text-xl h-[64px] transition-all",
            selected.length > 0
              ? 'bg-[#3EB489] text-black neon-glow active:scale-95'
              : 'bg-white/10 text-white/10 cursor-not-allowed border-2 border-white/5 opacity-50'
          )}
        >
          {lang === 'EN' ? 'Confirm goals' : 'Ziele bestätigen'}
        </button>
      </div>
    </div>
  );
}
