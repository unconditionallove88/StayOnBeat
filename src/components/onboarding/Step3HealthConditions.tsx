
"use client"

import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { 
  Brain, 
  Wind, 
  Zap, 
  Sun, 
  Cloud, 
  Shield, 
  Orbit, 
  CircleDashed, 
  HeartPulse, 
  Droplets, 
  Lungs, 
  RefreshCcw, 
  FlaskConical, 
  LifeBuoy, 
  Activity,
  ArrowLeft 
} from 'lucide-react';

const SECTIONS = {
  EN: [
    {
      title: 'General health',
      items: [
        { id: 'epilepsy', icon: Brain, label: 'Epilepsy' },
        { id: 'asthma', icon: Wind, label: 'Asthma' },
        { id: 'migraines', icon: Zap, label: 'Migraines' },
      ],
    },
    {
      title: 'Mental health',
      items: [
        { id: 'adhd', icon: Brain, label: 'ADHD' },
        { id: 'anxiety', icon: Wind, label: 'Anxiety' },
        { id: 'depression', icon: Cloud, label: 'Depression' },
        { id: 'ptsd', icon: Shield, label: 'PTSD' },
        { id: 'bipolar', icon: Orbit, label: 'Bipolar disorder' },
        { id: 'schizophrenia', icon: CircleDashed, label: 'Schizophrenia' },
      ],
    },
    {
      title: 'Chronic & organs',
      items: [
        { id: 'circulatory', icon: HeartPulse, label: 'Circulatory system', desc: 'Heart, Blood vessels' },
        { id: 'urinary', icon: Droplets, label: 'Urinary system', desc: 'Kidneys, Bladder' },
        { id: 'respiratory', icon: Lungs, label: 'Respiratory system', desc: 'Lungs' },
        { id: 'gi-tract', icon: RefreshCcw, label: 'Gastrointestinal tract', desc: 'Stomach, Intestines' },
        { id: 'biliary', icon: FlaskConical, label: 'Biliary system', desc: 'Liver, Gallbladder' },
        { id: 'integumentary', icon: Sun, label: 'Integumentary system', desc: 'Skin' },
        { id: 'chronic-pain', icon: Activity, label: 'Chronic pain', desc: 'Persistent discomfort' },
      ],
    },
  ],
  DE: [
    {
      title: 'Allgemeine Gesundheit',
      items: [
        { id: 'epilepsy', icon: Brain, label: 'Epilepsie' },
        { id: 'asthma', icon: Wind, label: 'Asthma' },
        { id: 'migraines', icon: Zap, label: 'Migräne' },
      ],
    },
    {
      title: 'Psychische Gesundheit',
      items: [
        { id: 'adhd', icon: Brain, label: 'ADHS' },
        { id: 'anxiety', icon: Wind, label: 'Angststörung' },
        { id: 'depression', icon: Cloud, label: 'Depression' },
        { id: 'ptsd', icon: Shield, label: 'PTBS' },
        { id: 'bipolar', icon: Orbit, label: 'Bipolare Störung' },
        { id: 'schizophrenia', icon: CircleDashed, label: 'Schizophrenie' },
      ],
    },
    {
      title: 'Chronic & Organe',
      items: [
        { id: 'circulatory', icon: HeartPulse, label: 'Herz-Kreislauf-System', desc: 'Herz, Blutgefäße' },
        { id: 'urinary', icon: Droplets, label: 'Harnsystem', desc: 'Nieren, Blase' },
        { id: 'respiratory', icon: Lungs, label: 'Atmungssystem', desc: 'Lunge' },
        { id: 'gi-tract', icon: RefreshCcw, label: 'Magen-Darm-Trakt', desc: 'Magen, Darm' },
        { id: 'biliary', icon: FlaskConical, label: 'Galle & Leber', desc: 'Leber, Gallengänge' },
        { id: 'integumentary', icon: Sun, label: 'Haut & Gewebe', desc: 'Haut' },
        { id: 'chronic-pain', icon: Activity, label: 'Chronische Schmerzen', desc: 'Anhaltendes Unbehagen' },
      ],
    },
  ]
};

export function Step3HealthConditions({ 
  selected, 
  onComplete,
  onBack
}: { 
  selected: string[], 
  onComplete: (conditions: string[]) => void,
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

  const isNoneSelected = current.includes('none');

  const content = {
    EN: {
      header: 'Health conditions',
      sub: 'Pre-existing conditions disclosure',
      none: 'None of these apply',
      confirm: 'Continue',
    },
    DE: {
      header: 'Gesundheitszustand',
      sub: 'Offenlegung von Vorerkrankungen',
      none: 'Nichts davon trifft zu',
      confirm: 'Weiter',
    }
  };

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-center font-headline max-w-xl mx-auto px-4 text-center relative">
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

      <div className="flex-1 w-full overflow-y-auto max-h-[50vh] custom-scrollbar pr-2 mb-8 space-y-6">
        {SECTIONS[lang as 'EN' | 'DE'].map((section) => (
          <div key={section.title} className="space-y-3">
            <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-white/30 px-1 text-left">
              {section.title}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {section.items.map((item: any) => {
                const Icon = item.icon;
                const isActive = current.includes(item.id);
                return (
                  <div 
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all h-auto cursor-pointer ${
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
                          {item.label}
                        </div>
                        {item.desc && (
                          <div className="text-[8px] text-white/30 uppercase font-bold tracking-widest leading-none mt-1">
                            {item.desc}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center bg-white/5 px-4 py-2 rounded-xl border border-white/10 pointer-events-none ml-2">
                      <Switch 
                        checked={isActive}
                        className="data-[state=checked]:bg-[#3EB489]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="w-full flex flex-col gap-4 items-center shrink-0">
        <button
          onClick={() => toggle('none')}
          className={`w-full p-5 rounded-[1.5rem] border font-black text-[10px] uppercase tracking-[0.2em] transition-all h-[64px] ${
            isNoneSelected
              ? 'bg-[#3EB489]/10 border-[#3EB489] text-[#3EB489] neon-glow'
              : 'bg-[#0a0a0a] border-white/10 text-white/30'
          }`}
        >
          {content[lang as 'EN' | 'DE'].none}
        </button>

        <button
          onClick={() => onComplete(current)}
          disabled={current.length === 0}
          className={`pill-button w-full max-w-sm h-[64px] uppercase tracking-[0.2em] font-black text-xl transition-all ${
            current.length > 0
              ? 'bg-[#3EB489] text-black neon-glow caliber-btn active:scale-95'
              : 'bg-white/10 text-white/10 cursor-not-allowed border-2 border-white/5 opacity-50'
          }`}
        >
          {content[lang as 'EN' | 'DE'].confirm}
        </button>
      </div>
    </div>
  );
}
