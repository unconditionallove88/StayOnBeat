"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Heart } from 'lucide-react';

/**
 * @fileOverview Welcome Back Calibration Page.
 * Visuals refined for subtle influence and "Inside Out" vision.
 * Updated: Organic iconography replacement (CircleDot -> Heart).
 */

export default function WelcomeBack() {
  const router = useRouter();
  const [lang, setLang] = useState<'EN' | 'DE'>('EN');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('stayonbeat_lang');
    if (savedLang === 'DE' || savedLang === 'EN') {
      setLang(savedLang as 'EN' | 'DE');
    }
  }, []);

  const handleLangChange = (newLang: 'EN' | 'DE') => {
    setLang(newLang);
    localStorage.setItem('stayonbeat_lang', newLang);
  };

  const content = {
    EN: {
      title: "HEY, NICE TO",
      highlight: "SEE YOU AGAIN",
      subtitle: "YOUR SAFETY PROFILE IS READY LET’S GET YOU CALIBRATED",
      button: "ACCESS DASHBOARD"
    },
    DE: {
      title: "HEY, SCHÖN DICH",
      highlight: "WIEDERZUSEHEN",
      subtitle: "DEIN SICHERHEITSPROFIL IST BEREIT SCHÜTZEN WIR DICH",
      button: "ZUM DASHBOARD GEHEN"
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen w-full bg-black text-white flex flex-col items-center pt-10 px-6 overflow-y-auto font-headline text-center relative overflow-hidden">
      {/* Subtle Resonance Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-primary/5 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      
      {/* Language Toggle */}
      <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 z-50 mb-10">
        <button 
          onClick={() => handleLangChange('EN')}
          className={`text-[10px] font-black tracking-[0.3em] transition-all ${lang === 'EN' ? 'text-[#3EB489]' : 'text-white/40'}`}
        >
          EN
        </button>
        <span className="text-white/10 font-black">|</span>
        <button 
          onClick={() => handleLangChange('DE')}
          className={`text-[10px] font-black tracking-[0.3em] transition-all ${lang === 'DE' ? 'text-[#3EB489]' : 'text-white/40'}`}
        >
          DE
        </button>
      </div>

      <div className="w-full max-w-xl flex flex-col items-center gap-10 py-10 relative z-10">
        <div className="h-[180px] w-full flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-radiate-out" />
            <Heart size={80} fill="#10B981" className="text-primary animate-pulse-heart relative z-10" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-[28px] font-black uppercase tracking-tighter leading-tight text-white">
            {content[lang].title} <br/>
            <span className="text-[#3EB489]">{content[lang].highlight}</span>
          </h1>
          <p className="text-base font-bold uppercase tracking-widest text-white/40 leading-tight max-w-[280px] mx-auto">
            {content[lang].subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-6 w-full max-w-md pt-4">
          <button 
            onClick={() => router.push('/dashboard')}
            className="pill-button w-full bg-[#3EB489] text-black text-xl font-black neon-glow uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-emerald-500/20 h-[72px]"
          >
            {content[lang].button}
          </button>
          
          <div className="flex items-center justify-center gap-3 text-white/20">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Guardian Protocol v2.5</span>
          </div>
        </div>
      </div>
    </main>
  );
}
