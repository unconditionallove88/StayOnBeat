
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview High-Fidelity Landing Sanctuary (Entrance).
 * Updated with new slogans: "Based on love and rhythm of life".
 * Simplified value prop: "Sanctuary for risk reduction and collective care".
 * Punctuation-free for resonance.
 */

export default function Home() {
  const router = useRouter();
  const [lang, setLang] = useState<'EN' | 'DE' | 'PT' | 'RU'>('EN');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = typeof window !== 'undefined' ? localStorage.getItem('stayonbeat_lang') : 'EN';
    if (['EN', 'DE', 'PT', 'RU'].includes(savedLang as string)) setLang(savedLang as any);
  }, []);

  const handleLangChange = (newLang: 'EN' | 'DE' | 'PT' | 'RU') => {
    setLang(newLang);
    localStorage.setItem('stayonbeat_lang', newLang);
  };

  const content = {
    EN: { 
      slogan: "Based on love and rhythm of life", 
      valueProp: "Sanctuary for risk reduction and collective care", 
      getStarted: "Join the Circle", 
      signIn: "Welcome Home", 
      footer: "Protected by GDPR • Encrypted with Love" 
    },
    DE: { 
      slogan: "Basierend auf Liebe und dem Rhythmus des Lebens", 
      valueProp: "Sanctuary für Risk-Reduction und kollektive Fürsorge", 
      getStarted: "Werde Teil des Kreises", 
      signIn: "Willkommen Zuhause", 
      footer: "DSGVO-geschützt • Mit Liebe verschlüsselt" 
    },
    PT: { 
      slogan: "Baseado no amor e no ritmo da vida", 
      valueProp: "Santuário para redução de riscos e cuidado coletivo", 
      getStarted: "Junte-se ao Círculo", 
      signIn: "Bem-vindo ao Lar", 
      footer: "Protegido por GDPR • Criptografado com Amor" 
    },
    RU: { 
      slogan: "Основано на любви и ритме жизни", 
      valueProp: "Пространство для снижения рисков и коллективной заботы", 
      getStarted: "Присоединяйся к Нам", 
      signIn: "Мы рады Тебе", 
      footer: "Зашифровано с Любовью" 
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-between py-12 px-6 overflow-y-auto font-headline relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 blur-[150px] rounded-full pointer-events-none animate-radiate-out" />

      <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/10 z-50 shrink-0 shadow-2xl overflow-x-auto max-w-full no-scrollbar">
        {['EN', 'DE', 'PT', 'RU'].map((l, i) => (
          <div key={l} className="flex items-center gap-4">
            <button onClick={() => handleLangChange(l as any)} className={cn("text-[10px] font-black tracking-[0.3em] transition-all whitespace-nowrap", lang === l ? 'text-primary' : 'text-white/40')}>{l}</button>
            {i < 3 && <span className="text-white/10 font-black">|</span>}
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center w-full max-w-xl text-center flex-1 justify-center py-12 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="flex flex-col items-center justify-center mb-16">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 w-48 h-48 bg-white/5 blur-[60px] rounded-full animate-pulse" />
            <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20 shadow-[0_0_50px_rgba(16,185,129,0.15)] relative z-10">
              <Heart size={64} fill="currentColor" className="text-primary animate-pulse-heart" />
            </div>
          </div>
          <h1 className="mt-10 text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none text-white text-center">STAY<span className="text-primary">ON</span>BEAT</h1>
          <p className={cn("text-primary font-bold mt-4 tracking-[0.3em] uppercase text-xs italic opacity-80", lang === 'RU' && "font-serif")}>{content[lang].slogan}</p>
        </div>
        
        <div className="w-full max-md space-y-4 mb-16">
          <div className="flex items-start gap-5 p-8 bg-white/[0.03] rounded-[2.5rem] border border-white/10 text-center group hover:border-primary/30 transition-all shadow-2xl backdrop-blur-sm justify-center">
            <ShieldCheck className="text-primary mt-1 flex-shrink-0" size={24} />
            <p className={cn("text-sm font-bold text-white/60 leading-tight uppercase tracking-widest leading-relaxed", lang === 'RU' && "italic font-serif")}>{content[lang].valueProp}</p>
          </div>
        </div>

        <div className="flex flex-col gap-5 w-full max-w-sm">
          <button onClick={() => router.push('/auth?mode=signup')} className={cn("pill-button w-full bg-primary text-black text-xl font-black neon-glow active:scale-95 shadow-lg uppercase tracking-[0.1em] transition-all", lang === 'RU' && "italic font-serif")}>{content[lang].getStarted}</button>
          <button onClick={() => router.push('/auth?mode=signin')} className={cn("pill-button w-full bg-white/[0.03] border-2 border-primary/20 text-primary text-lg font-black active:scale-95 uppercase tracking-[0.1em] backdrop-blur-sm", lang === 'RU' && "italic font-serif")}>{content[lang].signIn}</button>
        </div>
      </div>

      <footer className="w-full text-center mt-12 relative z-10">
        <p className={cn("text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-2", lang === 'RU' && "italic font-serif")}>{content[lang].footer}</p>
        <div className="w-8 h-1 bg-primary/20 rounded-full mx-auto" />
      </footer>
    </main>
  );
}
