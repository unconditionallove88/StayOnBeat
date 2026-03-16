
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Droplets, Apple, Moon, Battery, ShieldCheck, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Phase: Before (Preparation Protocol).
 * Provides high-fidelity guidance on hydration, nutrition, and rest.
 * Fully localized for English and German.
 */

const CONTENT = {
  en: {
    title: "Preparation",
    subtitle: "Calibrate body & mind",
    header: "Ready for the journey?",
    description: "I love and respect my body enough to prepare it for the experience ahead. 🌿",
    sections: [
      {
        title: "Hydration",
        icon: <Droplets className="text-blue-400" size={24} />,
        advice: "Drink 1-2 liters of water throughout the day. Add electrolytes to maintain mineral balance.",
        color: "border-blue-500/20 bg-blue-500/5"
      },
      {
        title: "Nutrition",
        icon: <Apple className="text-emerald-400" size={24} />,
        advice: "Eat a solid, balanced meal 3 hours before you head out. Avoid heavy, processed foods.",
        color: "border-emerald-500/20 bg-emerald-500/5"
      },
      {
        title: "Rest",
        icon: <Moon className="text-purple-400" size={24} />,
        advice: "Prioritize 7-8 hours of sleep or a 20-minute power nap to store energy for the night.",
        color: "border-purple-500/20 bg-purple-500/5"
      },
      {
        title: "Essentials",
        icon: <Battery className="text-amber-400" size={24} />,
        advice: "Charge your phone to 100%. Check in with your circle and sync your Pulse baseline.",
        color: "border-amber-500/20 bg-amber-500/5"
      }
    ],
    button: "I am prepared 💚"
  },
  de: {
    title: "Vorbereitung",
    subtitle: "Körper & Geist kalibrieren",
    header: "Bereit für die Reise?",
    description: "Ich liebe und respektiere meinen Körper genug, um ihn auf das bevorstehende Erlebnis vorzubereiten. 🌿",
    sections: [
      {
        title: "Hydrierung",
        icon: <Droplets className="text-blue-400" size={24} />,
        advice: "Trink über den Tag verteilt 1-2 Liter Wasser. Füge Elektrolyte hinzu, um den Mineralhaushalt zu stabilisieren.",
        color: "border-blue-500/20 bg-blue-500/5"
      },
      {
        title: "Ernährung",
        icon: <Apple className="text-emerald-400" size={24} />,
        advice: "Iss 3 Stunden vor dem Aufbruch eine feste, ausgewogene Mahlzeit. Vermeide schwere, verarbeitete Lebensmittel.",
        color: "border-emerald-500/20 bg-emerald-500/5"
      },
      {
        title: "Erholung",
        icon: <Moon className="text-purple-400" size={24} />,
        advice: "Priorisiere 7-8 Stunden Schlaf oder einen 20-minütigen Power-Nap, um Energie für die Nacht zu tanken.",
        color: "border-purple-500/20 bg-purple-500/5"
      },
      {
        title: "Essentials",
        icon: <Battery className="text-amber-400" size={24} />,
        advice: "Lade dein Handy auf 100%. Melde dich bei deinem Circle und kalibriere deinen Pulse-Baseline.",
        color: "border-amber-500/20 bg-amber-500/5"
      }
    ],
    button: "Ich bin bereit 💚"
  }
};

export default function BeforePhase() {
  const router = useRouter();
  const [lang, setLang] = useState<'en' | 'de'>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('stayonbeat_lang');
    if (savedLang === 'DE') setLang('de');
  }, []);

  if (!mounted) return null;

  const t = CONTENT[lang];

  return (
    <main className="min-h-screen bg-black text-white font-headline pb-32 relative overflow-x-hidden">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-500/5 blur-[120px] rounded-full -z-10" />

      <header className="px-6 py-8 border-b border-white/5 bg-black/80 backdrop-blur-xl flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/dashboard")}
            className="p-3 bg-white/5 rounded-full border border-white/10 hover:border-[#10B981] transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white/40" />
          </button>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tighter">{t.title}</h1>
            <p className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.3em]">{t.subtitle}</p>
          </div>
        </div>
        <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
          <Heart size={20} className="text-emerald-500 fill-emerald-500" />
        </div>
      </header>

      <div className="px-6 py-10 max-w-xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <section className="text-center space-y-4">
          <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">{t.header}</h2>
          <p className="text-white/40 text-sm font-bold uppercase tracking-widest leading-relaxed max-w-[300px] mx-auto">
            {t.description}
          </p>
        </section>

        <div className="grid gap-4">
          {t.sections.map((section, idx) => (
            <div 
              key={idx} 
              className={cn(
                "p-8 rounded-[2.5rem] border-2 transition-all group hover:scale-[1.02]",
                section.color
              )}
            >
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 shadow-lg shrink-0">
                  {section.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black uppercase tracking-tight text-white">{section.title}</h3>
                  <p className="text-sm font-bold text-white/60 leading-relaxed uppercase tracking-wide">
                    {section.advice}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex items-center gap-6">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
            <ShieldCheck className="text-emerald-500" size={24} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 leading-relaxed">
            Preparation is the first act of care. Your future self will thank you for the choices you make now. 💚
          </p>
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 h-[100px] bg-black/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-center px-6 z-50">
        <button 
          onClick={() => router.push("/dashboard")}
          className="w-full max-w-sm py-6 bg-[#10B981] text-black rounded-full font-black uppercase text-lg tracking-[0.1em] neon-glow active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
        >
          {t.button}
        </button>
      </footer>
    </main>
  );
}
