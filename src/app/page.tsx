
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview High-Fidelity Landing Sanctuary.
 * Features the core value proposition and entry points for the StayOnBeat journey.
 * Adheres to the Emerald Green on Black aesthetic.
 */

export default function Home() {
  const router = useRouter();
  const [lang, setLang] = useState<'EN' | 'DE'>('EN');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = typeof window !== 'undefined' ? localStorage.getItem('stayonbeat_lang') : 'EN';
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
      slogan: "Unconditional love for your journey. 🌿",
      valueProp: "A safe sanctuary for harm reduction, health monitoring, and your circle of love.",
      getStarted: "Join the Circle",
      signIn: "Welcome Home (Sign In)",
      footer: "Protected by GDPR • Encrypted with Love"
    },
    DE: {
      slogan: "Bedingungslose Liebe für deine Reise. 🌿",
      valueProp: "Ein sicheres Sanctuary für Schadensminimierung, Gesundheitsmonitoring und deinen Circle of Love.",
      getStarted: "Werde Teil des Kreises",
      signIn: "Willkommen Zuhause (Anmelden)",
      footer: "DSGVO-geschützt • Mit Liebe verschlüsselt"
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-between py-12 px-6 overflow-y-auto font-headline relative">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Language Toggle */}
      <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/10 z-50 shrink-0">
        <button 
          onClick={() => handleLangChange('EN')}
          className={cn("text-[10px] font-black tracking-[0.3em] transition-all", lang === 'EN' ? 'text-primary' : 'text-white/40')}
        >
          EN
        </button>
        <span className="text-white/10 font-black">|</span>
        <button 
          onClick={() => handleLangChange('DE')}
          className={cn("text-[10px] font-black tracking-[0.3em] transition-all", lang === 'DE' ? 'text-primary' : 'text-white/40')}
        >
          DE
        </button>
      </div>

      <div className="flex flex-col items-center w-full max-w-xl text-center flex-1 justify-center py-12 relative z-10">
        {/* Branding Section */}
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="relative">
            <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
              <Heart 
                size={64} 
                fill="currentColor" 
                className="text-primary animate-pulse-heart drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]"
              />
            </div>
          </div>
          <h1 className="mt-8 text-5xl md:text-6xl font-black tracking-tighter uppercase leading-none text-white text-center">
            STAY<span className="text-primary">ON</span>BEAT
          </h1>
          <p className="text-primary font-bold mt-3 tracking-[0.2em] uppercase text-xs italic">
            {content[lang].slogan}
          </p>
        </div>
        
        {/* Value Prop Section */}
        <div className="w-full max-w-sm space-y-4 mb-12">
          <div className="flex items-start gap-4 p-6 bg-white/5 rounded-[2rem] border border-white/10 text-left group hover:border-primary/30 transition-all shadow-2xl">
            <ShieldCheck className="text-primary mt-1 flex-shrink-0" size={24} />
            <p className="text-sm font-bold text-white/60 leading-relaxed uppercase tracking-widest leading-tight">
              {content[lang].valueProp}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <button 
            onClick={() => router.push('/auth?mode=signup')}
            className="pill-button w-full bg-primary text-black text-xl font-black neon-glow active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-primary/20 uppercase tracking-[0.1em]"
          >
            {content[lang].getStarted}
          </button>

          <button 
            onClick={() => router.push('/auth?mode=signin')}
            className="pill-button w-full bg-white/5 border-2 border-primary/20 text-primary text-lg font-black hover:bg-white/10 transition-all active:scale-95 uppercase tracking-[0.1em]"
          >
            {content[lang].signIn}
          </button>
        </div>
      </div>

      <footer className="w-full text-center mt-12 relative z-10">
        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
          {content[lang].footer}
        </p>
      </footer>
    </main>
  );
}
