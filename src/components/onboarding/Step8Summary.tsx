
"use client"

import { useState, useEffect } from 'react';
import { Shield, Users, Activity, Phone, ArrowRight } from 'lucide-react';
import type { OnboardingData } from '@/app/onboarding/page';

export function Step9Summary({ 
  data,
  onComplete 
}: { 
  data: OnboardingData,
  onComplete: () => void 
}) {
  const [lang, setLang] = useState<'EN' | 'DE'>('EN');

  useEffect(() => {
    const savedLang = localStorage.getItem('stayonbeat_lang');
    if (savedLang === 'DE' || savedLang === 'EN') {
      setLang(savedLang as 'EN' | 'DE');
    }
  }, []);

  const content = {
    EN: {
      header: "CALIBRATED,",
      sub: "PROFILE READY • PROCEED TO FINAL HEART CHECK",
      health: "Health Profile",
      links: "Safety Links",
      lab: "Substance Lab",
      contact: "Emergency Contact",
      button: "Final Heart Check"
    },
    DE: {
      header: "KALIBRIERT,",
      sub: "PROFIL BEREIT • WEITER ZUM FINALE HEART CHECK",
      health: "Gesundheitsprofil",
      links: "Sicherheits-Links",
      lab: "Substanz-Labor",
      contact: "Notfallkontakt",
      button: "Finale Heart Check"
    }
  };

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-1000 min-h-[70vh] justify-center font-headline">
      <div className="relative mb-12">
        <div className="text-[12rem] md:text-[15rem] animate-bounce filter drop-shadow-[0_0_30px_rgba(62,180,137,0.6)]">
          🚀
        </div>
        <div className="absolute inset-0 bg-[#3EB489]/20 blur-[100px] rounded-full -z-10" />
      </div>

      <div className="text-center mb-16 space-y-4">
        <h2 className="font-headline text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none text-white">
          {content[lang].header} <br/>
          <span className="text-[#3EB489] drop-shadow-[0_0_20px_rgba(62,180,137,0.4)]">
            {data.name || 'USER'}
          </span>!
        </h2>
        <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-sm md:text-base">
          {content[lang].sub}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-20">
        {[
          { label: content[lang].health, icon: Activity, count: (data.medications?.length || 0) + (data.healthConditions?.length || 0) },
          { label: content[lang].links, icon: Users, count: 1 },
          { label: content[lang].lab, icon: Shield, count: data.substances?.length || 0 },
          { label: content[lang].contact, icon: Phone, count: data.verification ? 1 : 0 },
        ].map((item) => (
          <div key={item.label} className="bg-[#0a0a0a] border-2 border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center gap-4 group hover:border-[#3EB489] transition-all duration-500 hover:scale-105">
            <item.icon className="w-10 h-10 text-[#3EB489] group-hover:scale-110 transition-transform" />
            <div className="text-center">
              <span className="block font-headline font-black uppercase tracking-[0.3em] text-[10px] text-white/40 mb-2">{item.label}</span>
              <span className="text-3xl font-headline font-black text-white">{item.count}</span>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={onComplete}
        className="pill-button w-full max-w-md bg-[#3EB489] text-black text-2xl py-10 neon-glow font-headline font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
      >
        {content[lang].button} <ArrowRight className="w-8 h-8" />
      </button>
    </div>
  );
}
