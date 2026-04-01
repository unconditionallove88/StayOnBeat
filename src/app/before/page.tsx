
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { ArrowLeft, Droplets, Apple, Moon, Battery, ShieldCheck, Heart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * @fileOverview Phase: Before (Preparation Protocol).
 */

const CONTENT = {
  en: {
    title: "Preparation", subtitle: "Radiate from within", header: "Ready to shine?",
    description: "I respect myself",
    sections: { hydration: "Hydration", nutrition: "Nutrition", rest: "Rest", essentials: "Essentials" },
    hydrationAdvice: (liters: number) => `Based on your essence, drink ${liters} liters of water today Add electrolytes to maintain mineral balance`,
    nutritionAdvice: "Eat a solid balanced meal 3 hours before you head out Avoid heavy processed foods",
    restAdvice: "Prioritize restful sleep and be in bed before 23:00 to ensure your body recovers and stores energy for the light ahead",
    essentialsAdvice: "Charge your phone to 100% Check in with your circle and sync your Pulse baseline",
    button: "I am prepared",
    footerAdvice: "Preparation is the first act of self-care Radiate your truth from the inside out and your future self will thank you"
  },
  de: {
    title: "Vorbereitung", subtitle: "Von innen heraus strahlen", header: "Bereit zu strahlen?",
    description: "Ich respektiere mich selbst",
    sections: { hydration: "Hydrierung", nutrition: "Erährung", rest: "Erholung", essentials: "Essentials" },
    hydrationAdvice: (liters: number) => `Basierend auf deinem Körpergewicht trink heute ${liters} Liter Wasser Füge Elektrolyte hinzu um den Haushalt zu stabilisieren`,
    nutritionAdvice: "Iss 3 Stunden vor dem Aufbruch eine ausgewogene Mahlzeit Vermeide schwere verarbeitete Lebensmittel",
    restAdvice: "Priorisiere erholsamen Schlaf und sei vor 23:00 Uhr im Bett damit dein Körper regenerieren und Energie für das Licht sammeln kann",
    essentialsAdvice: "Lade dein Handy auf 100% Melde dich bei deinem Circle und kalibriere deine Pulse-Basis",
    button: "Ich bin bereit",
    footerAdvice: "Vorbereitung ist der erste Akt der Selbstfürsorge Strahle deine Wahrheit von innen nach außen und dein zukünftiges Ich wird es dir danken"
  }
};

export default function BeforePhase() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [lang, setLang] = useState<'en' | 'de'>('en');
  const [mounted, setMounted] = useState(false);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userDocRef);

  useEffect(() => {
    setMounted(true);
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);
  }, []);

  if (!mounted || isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-8">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full" />
          <Heart 
            size={64} 
            fill="#58c55a" 
            className="relative z-10 animate-pulse-heart text-[#58c55a]" 
            style={{ filter: 'blur(12px) drop-shadow(0 0 10px #58c55a)' }} 
          />
        </div>
        <Loader2 className="animate-spin text-primary/20" />
      </div>
    );
  }

  const t = CONTENT[lang] || CONTENT.en;
  const weight = profile?.biometrics?.weightKg || 75;
  const hydrationTarget = Math.round(weight * 0.035 * 10) / 10;

  const sections = [
    { title: t.sections.hydration, icon: <Droplets className="text-blue-400" size={24} />, advice: t.hydrationAdvice(hydrationTarget), color: "border-blue-500/20 bg-blue-500/5" },
    { title: t.sections.nutrition, icon: <Apple className="text-emerald-400" size={24} />, advice: t.nutritionAdvice, color: "border-emerald-500/20 bg-emerald-500/5" },
    { title: t.sections.rest, icon: <Moon className="text-purple-400" size={24} />, advice: t.restAdvice, color: "border-purple-500/20 bg-purple-500/5" },
    { title: t.sections.essentials, icon: <Battery className="text-amber-400" size={24} />, advice: t.essentialsAdvice, color: "border-amber-500/20 bg-amber-500/5" }
  ];

  return (
    <main className="min-h-screen bg-black text-white font-headline pb-32 relative overflow-x-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-500/5 blur-[120px] rounded-full -z-10" />

      <header className="px-6 py-8 border-b border-white/5 bg-black/80 backdrop-blur-xl flex items-center gap-4 sticky top-0 z-50">
        <button onClick={() => router.push("/dashboard")} className="p-3 bg-white/5 rounded-full border border-white/10 hover:border-primary transition-all"><ArrowLeft className="w-5 h-5 text-white/40" /></button>
        <div>
          <h1 className="text-xl font-black uppercase tracking-tighter">{t.title}</h1>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{t.subtitle}</p>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="px-6 py-10 max-w-xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <section className="text-center space-y-4">
            <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">{t.header}</h2>
            <p className="text-primary text-sm font-bold uppercase tracking-widest leading-relaxed max-w-[340px] mx-auto italic">
              "{t.description}"
            </p>
          </section>

          <div className="grid gap-4">
            {sections.map((section, idx) => (
              <div key={idx} className={cn("p-8 rounded-[2rem] border-2 transition-all group hover:scale-[1.02]", section.color)}>
                <div className="flex items-start gap-6">
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 shadow-lg shrink-0">{section.icon}</div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-black uppercase tracking-tight text-white">{section.title}</h3>
                    <p className="text-sm font-bold text-white/60 leading-relaxed uppercase tracking-wide">{section.advice}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 flex items-center gap-6">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0"><ShieldCheck className="text-emerald-500" size={24} /></div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 leading-relaxed">
              {t.footerAdvice}
            </p>
          </div>
        </div>
      </ScrollArea>

      <footer className="fixed bottom-0 left-0 right-0 h-[100px] bg-black/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-center px-6 z-50 pb-safe">
        <button onClick={() => router.push("/dashboard")} className="w-full max-sm py-6 bg-[#1b4d3e] text-white rounded-full font-black uppercase text-lg tracking-[0.1em] active:scale-95 transition-all shadow-lg shadow-primary/20">{t.button}</button>
      </footer>
    </main>
  );
}
