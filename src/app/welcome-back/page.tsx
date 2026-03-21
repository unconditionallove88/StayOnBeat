
"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, ShieldCheck } from 'lucide-react';

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
      highlight: "SEE YOU AGAIN!",
      subtitle: "YOUR SAFETY PROFILE IS READY. LET’S GET YOU PROTECTED",
      button: "ACCESS DASHBOARD"
    },
    DE: {
      title: "HEY, SCHÖN DICH",
      highlight: "WIEDERZUSEHEN!",
      subtitle: "DEIN SICHERHEITSPROFIL IST BEREIT. SCHÜTZEN WIR DICH",
      button: "ZUM DASHBOARD GEHEN"
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen w-full bg-black text-white flex flex-col items-center pt-10 px-6 overflow-y-auto font-headline text-center">
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

      <div className="w-full max-w-xl flex flex-col items-center gap-10 py-10">
        <div className="h-[180px] w-full flex items-center justify-center">
          <Heart className="h-full w-full text-white fill-white animate-pulse-heart object-contain" />
        </div>

        <div className="space-y-4">
          <h1 className="text-[28px] font-black uppercase tracking-tighter leading-tight text-white">
            {content[lang].title} <br/>
            <span className="text-[#3EB489]">{content[lang].highlight}</span>
          </h1>
          <p className="text-base font-bold uppercase tracking-widest text-white/40 leading-tight">
            {content[lang].subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-6 w-full max-w-md pt-4">
          <button 
            onClick={() => router.push('/dashboard')}
            className="pill-button w-full bg-[#3EB489] text-black text-xl font-black neon-glow uppercase"
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
