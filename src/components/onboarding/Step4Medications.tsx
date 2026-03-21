
"use client"

import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Pill, FlaskConical, Brain, Moon, Dna, ShieldAlert, ArrowLeft } from 'lucide-react';

const MEDS = {
  EN: [
    { id: 'ssri', icon: Pill, label: 'SSRIs', desc: 'e.g. Sertraline, Fluoxetine, Escitalopram' },
    { id: 'snri', icon: FlaskConical, label: 'SNRIs', desc: 'e.g. Venlafaxine, Duloxetine' },
    { id: 'adhd', icon: Brain, label: 'ADHD meds', desc: 'e.g. Ritalin, Vyvanse, Concerta' },
    { id: 'benzo', icon: Moon, label: 'Benzos', desc: 'e.g. Xanax, Valium, Diazepam' },
    { id: 'antipsychotic', icon: Dna, label: 'Antipsychotics', desc: 'e.g. Quetiapine, Olanzapine' },
    { id: 'maoi', icon: ShieldAlert, label: 'MAOIs', desc: 'e.g. Rare/older antidepressants' },
  ],
  DE: [
    { id: 'ssri', icon: Pill, label: 'SSRIs', desc: 'z.B. Sertralin, Fluoxetin, Escitalopram' },
    { id: 'snri', icon: FlaskConical, label: 'SNRIs', desc: 'z.B. Venlafaxine, Duloxetin' },
    { id: 'adhd', icon: Brain, label: 'ADHS Meds', desc: 'z.B. Ritalin, Vyvanse, Concerta' },
    { id: 'benzo', icon: Moon, label: 'Benzos', desc: 'z.B. Xanax, Valium, Diazepam' },
    { id: 'antipsychotic', icon: Dna, label: 'Antipsychotika', desc: 'z.B. Quetiapin, Olanzapin' },
    { id: 'maoi', icon: ShieldAlert, label: 'MAO-Hemmer', desc: 'Seltene/ältere Antidepressiva' },
  ]
};

export function Step4Medications({ 
  selected, 
  onComplete, 
  onSkip,
  onBack
}: { 
  selected: string[], 
  onComplete: (meds: string[]) => void, 
  onSkip?: () => void,
  onBack?: () => void
}) {
  const [current, setCurrent] = useState<string[]>(selected);
  const [lang, setLang] = useState<'EN' | 'DE'>('EN');

  useEffect(() => {
    const savedLang = localStorage.getItem('stayonbeat_lang');
    if (savedLang === 'DE' || savedLang === 'EN') {
      setLang(savedLang as 'EN' | 'DE');
    }
  }, []);

  const toggle = (id: string) => {
    if (id === 'none') {
      setCurrent(['none']);
      return;
    }

    setCurrent(prev => {
      const filtered = prev.filter(x => x !== 'none');
      if (filtered.includes(id)) {
        return filtered.filter(x => x !== id);
      }
      return [...filtered, id];
    });
  };

  const content = {
    EN: {
      header: 'Health profile',
      sub: 'Select any medications you are currently taking',
      none: 'None of the above',
      confirm: onSkip ? 'Confirm changes' : 'Confirm & continue',
    },
    DE: {
      header: 'Gesundheitsprofil',
      sub: 'Wähle die Medikamente aus, die du gerade nimmst',
      none: 'Nichts davon trifft zu',
      confirm: onSkip ? 'Änderungen bestätigen' : 'Bestätigen & weiter',
    }
  };

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-center font-headline max-xl mx-auto px-4 text-center relative">
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-0 left-4 text-white/40 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-50"
        >
          <ArrowLeft className="w-4 h-4" /> BACK
        </button>
      )}

      <div className="mt-12 mb-8">
        <h2 className="text-[22px] font-black uppercase mb-2 text-white leading-tight tracking-tighter">
          {content[lang].header}
        </h2>
        <p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px] max-w-[280px] mx-auto">
          {content[lang].sub}
        </p>
      </div>

      <div className="flex-1 w-full overflow-y-auto max-h-[50vh] custom-scrollbar pr-2 mb-8 space-y-3">
        {MEDS[lang].map((med) => {
          const Icon = med.icon;
          const isActive = current.includes(med.id);
          return (
            <div
              key={med.id}
              onClick={() => toggle(med.id)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all h-[72px] cursor-pointer ${
                isActive 
                  ? 'bg-[#1A1A1A] border-[#3EB489]/50' 
                  : 'bg-[#0a0a0a] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-4 text-left">
                <div className={isActive ? 'text-[#3EB489]' : 'text-white/40'}>
                  <Icon size={24} />
                </div>
                <div>
                  <div className={`font-black text-xs uppercase tracking-tight ${isActive ? 'text-[#3EB489]' : 'text-white/70'}`}>
                    {med.label}
                  </div>
                  <div className="text-[8px] text-white/30 uppercase font-bold tracking-widest leading-none">
                    {med.desc}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center bg-white/5 px-4 py-2 rounded-xl border border-white/10 pointer-events-none">
                <Switch 
                  checked={isActive}
                  className="data-[state=checked]:bg-[#3EB489]"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-full flex flex-col gap-4 items-center shrink-0">
        <button
          onClick={() => toggle('none')}
          className={`w-full p-5 rounded-[1.5rem] border font-black text-[10px] uppercase tracking-[0.2em] transition-all h-[64px] ${
            current.includes('none')
              ? 'bg-[#3EB489]/10 border-[#3EB489] text-[#3EB489] neon-glow'
              : 'bg-[#0a0a0a] border-white/10 text-white/30'
          }`}
        >
          {content[lang].none}
        </button>

        <button
          onClick={() => onComplete(current)}
          disabled={current.length === 0}
          className={`pill-button w-full max-w-sm h-[64px] uppercase tracking-[0.2em] font-black text-xl transition-all ${
            current.length > 0
              ? 'bg-[#3EB489] text-black neon-glow active:scale-95'
              : 'bg-white/10 text-white/10 cursor-not-allowed border-2 border-white/5 opacity-50'
          }`}
        >
          {content[lang].confirm}
        </button>

        {onSkip && (
          <button onClick={onSkip} className="text-[10px] font-black uppercase text-white/20 tracking-[0.5em] hover:text-white transition-colors">
            {lang === 'EN' ? 'Skip - no changes' : 'Überspringen - keine Änderungen'}
          </button>
        )}
      </div>
    </div>
  );
}
