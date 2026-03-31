"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview High-Fidelity Landing Sanctuary (Entrance).
 * Languages: EN, DE.
 * Affirmations: 3 words (EN) / 4 words (DE)
 */

export default function Home() {
  const router = useRouter();
  const [lang, setLang] = useState<'EN' | 'DE'>('EN');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = typeof window !== 'undefined' ? localStorage.getItem('stayonbeat_lang') : 'EN';
    if (['EN', 'DE'].includes(savedLang as string)) setLang(savedLang as any);
  }, []);

  const handleLangChange = (newLang: 'EN' | 'DE') => {
    setLang(newLang);
    localStorage.setItem('stayonbeat_lang', newLang);
  };

  const content = {
    EN: { 
      slogan: "Life is resonant", 
      valueProp: "Unconditional love always", 
      getStarted: "Join the Circle", 
      signIn: "Welcome Home", 
      footer: "Encrypted with Love" 
    },
    DE: { 
      slogan: "Das Leben ist resonant", 
      valueProp: "Bedingungslose Liebe immerzu hier", 
      getStarted: "Werde Teil des Kreises", 
      signIn: "Willkommen Zuhause", 
      footer: "Mit Liebe verschlüsselt hier" 
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-between py-12 px-6 overflow-y-auto font-headline relative overflow-hidden pt-safe pb-safe">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 blur-[150px] rounded-full pointer-events-none animate-pulse" />

      <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/10 z-50 shrink-0 shadow-2xl overflow-x-auto max-w-full no-scrollbar">
        {['EN', 'DE'].map((l, i) => (
          <div key={l} className="flex items-center gap-4">
            <button onClick={() => handleLangChange(l as any)} className={cn("text-[10px] font-black tracking-[0.3em] transition-all whitespace-nowrap", lang === l ? 'text-primary' : 'text-white/40')}>{l}</button>
            {i < 1 && <span className="text-white/10 font-black">|</span>}
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center w-full max-w-xl text-center flex-1 justify-center py-12 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="flex flex-col items-center justify-center mb-16">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 w-48 h-48 bg-primary/10 blur-[80px] rounded-full" />
            <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20 shadow-[0_0_50px_rgba(27,77,62,0.15)] relative z-10">
              <Heart 
                size={64} 
                fill="#10B981" 
                className="text-[#10B981] animate-pulse-heart" 
                style={{ filter: 'blur(12px) drop-shadow(0 0 10px #10B981)' }} 
              />
            </div>
          </div>
          <h1 className="mt-10 text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none text-white text-center">STAY<span className="text-primary">ON</span>BEAT</h1>
          <p className="text-primary font-bold mt-4 tracking-[0.3em] uppercase text-[10px] italic opacity-80">{content[lang].slogan}</p>
        </div>
        
        <div className="w-full max-md space-y-4 mb-16">
          <div className="flex items-start gap-5 p-8 bg-white/[0.03] rounded-[2.5rem] border border-white/10 text-center group hover:border-primary/30 transition-all shadow-2xl backdrop-blur-sm justify-center">
            <ShieldCheck className="text-primary mt-1 flex-shrink-0" size={24} />
            <p className="text-sm font-bold text-white/60 leading-tight uppercase tracking-widest leading-relaxed italic">{content[lang].valueProp}</p>
          </div>
        </div>

        <div className="flex flex-col gap-5 w-full max-sm mx-auto">
          <button onClick={() => router.push('/auth?mode=signup')} className="pill-button w-full bg-[#1b4d3e] text-white text-xl font-black active:scale-95 shadow-lg uppercase tracking-[0.1em] transition-all">{content[lang].getStarted}</button>
          <button onClick={() => router.push('/auth?mode=signin')} className="pill-button w-full bg-white/[0.03] border-2 border-primary/20 text-primary text-lg font-black active:scale-95 uppercase tracking-[0.1em] backdrop-blur-sm">{content[lang].signIn}</button>
        </div>
      </div>

      <footer className="w-full text-center mt-12 relative z-10">
        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-2">{content[lang].footer}</p>
        <div className="w-8 h-1 bg-primary/20 rounded-full mx-auto" />
      </footer>
    </main>
  );
}
