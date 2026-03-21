
"use client";

import { useState, useEffect } from 'react';
import HeartStatusAura from "@/components/dashboard/HeartStatusAura";
import LoveCircleList from "@/components/dashboard/LoveCircle";
import { Activity, ArrowLeft, Watch, Info, HeartHandshake, Users2, RefreshCw, ChevronRight } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { LoveCircleChat } from '@/components/chat/LoveCircleChat';
import { PartyCircleChat } from '@/components/chat/PartyCircleChat';
import { WearablesSync } from '@/components/dashboard/WearablesSync';
import { playHeartbeat } from '@/lib/resonance';

/**
 * @fileOverview My Heart Page (Individual Analytics).
 * Visualizes the high-fidelity living pulse and provides entry to Holders and Witnesses.
 * Punctuation-free affirmations for expansive resonance.
 */
export default function MyHeartPage() {
  const router = useRouter();
  const { user } = useUser();
  const firestore = useFirestore();
  const [heartRate, setHeartRate] = useState(75);
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<'en' | 'de'>('en');
  
  const [holdersOpen, setHoldersOpen] = useState(false);
  const [witnessesOpen, setWitnessesOpen] = useState(false);
  const [syncOpen, setSyncOpen] = useState(false);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);
  
  const { data: profile } = useDoc(userDocRef);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('stayonbeat_lang');
    if (savedLang === 'DE' || savedLang === 'EN') {
      setLang(savedLang.toLowerCase() as 'en' | 'de');
    }

    const interval = setInterval(() => {
      setHeartRate(prev => {
        const drift = Math.random() > 0.5 ? 1 : -1;
        return Math.max(50, Math.min(160, prev + drift));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  const t = {
    en: {
      title: "My Heart",
      sub: "Sanctuary Pulse Analytics",
      demo: "Demo Mode · My Rhythm",
      holders: "The Holders",
      holdersSub: "Private Bonds",
      witnesses: "The Witnesses",
      witnessesSub: "Public Care",
      baseline: "Pulse Baseline",
      baselineSub: "Your biological zero point",
      baselineInfo: "Your Guardian is calibrated to this baseline. Thresholds adjust dynamically based on your resting rhythm. An accurate baseline means more precise protection 🌿",
      recalibrate: "Recalibrate Baseline",
      syncVia: "Set via"
    },
    de: {
      title: "Mein Herz",
      sub: "Sanctuary Puls-Analyse",
      demo: "Demo-Modus · Mein Rhythmus",
      holders: "Die Holder",
      holdersSub: "Privater Kreis",
      witnesses: "Die Witnesser",
      witnessesSub: "Gemeinsame Fürsorge",
      baseline: "Puls-Basis",
      baselineSub: "Dein biologischer Nullpunkt",
      baselineInfo: "Dein Guardian ist auf diese Basis kalibriert. Schwellenwerte passen sich dynamisch deinem Ruhe-Rhythmus an. Eine genaue Basis bedeutet präziseren Schutz 🌿",
      recalibrate: "Basis neu kalibrieren",
      syncVia: "Gesetzt via"
    }
  }[lang];

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] p-6 pb-32 font-headline overflow-x-hidden relative">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <header className="flex items-center gap-4 mb-8 shrink-0 z-10">
        <button 
          onClick={() => router.back()}
          className="p-3 bg-white/5 rounded-full border border-white/10 text-white/40 hover:text-white transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter">
            {t.title}
          </h1>
          <p className="text-[10px] text-[#10B981] font-black uppercase tracking-[0.3em]">
            {t.sub}
          </p>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 gap-8">
        <div className="flex flex-col items-center gap-4">
          <HeartStatusAura 
            heartRate={heartRate} 
            activeSubstances={[]} 
            mood={profile?.vibe?.currentLabel || (lang === 'en' ? "Steady" : "Stabil")}
            lang={lang}
          />
          <span className="text-[9px] uppercase tracking-widest text-slate-600 font-bold">
            {t.demo}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
          <button 
            onClick={() => setHoldersOpen(true)}
            className="w-full p-6 rounded-[2.5rem] bg-white/5 border border-[#10B981]/20 flex items-center justify-between hover:bg-[#10B981]/5 hover:border-[#10B981] transition-all group shadow-2xl"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-[#10B981]/10 rounded-2xl flex items-center justify-center border border-[#10B981]/20 group-hover:scale-110 transition-transform">
                <HeartHandshake size={28} className="text-[#10B981]" />
              </div>
              <div className="text-left">
                <p className="text-lg font-black uppercase tracking-tight">{t.holders}</p>
                <p className="text-[8px] font-bold text-[#10B981] uppercase tracking-widest">{t.holdersSub}</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-white/10 group-hover:text-white transition-all" />
          </button>

          <button 
            onClick={() => setWitnessesOpen(true)}
            className="w-full p-6 rounded-[2.5rem] bg-white/5 border border-amber-500/20 flex items-center justify-between hover:bg-amber-500/5 hover:border-amber-500 transition-all group shadow-2xl"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
                <Users2 size={28} className="text-amber-500" />
              </div>
              <div className="text-left">
                <p className="text-lg font-black uppercase tracking-tight">{t.witnesses}</p>
                <p className="text-[8px] font-bold text-amber-500 uppercase tracking-widest">{t.witnessesSub}</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-white/10 group-hover:text-white transition-all" />
          </button>
        </div>
        
        <div className="w-full max-w-sm bg-white/5 border border-[#EBFB3B]/20 rounded-[2rem] p-8 animate-in slide-in-from-bottom-4 duration-700 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#EBFB3B]/5 blur-3xl -z-10" />
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#EBFB3B]/10 rounded-xl border border-[#EBFB3B]/20">
                <Watch className="text-[#EBFB3B] w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] font-black uppercase text-[#EBFB3B] tracking-widest">
                  {t.baseline}
                </span>
                <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">
                  {t.baselineSub}
                </span>
              </div>
            </div>
            {profile?.pulseBaseline && (
              <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full border border-white/5">
                {t.syncVia} {profile.pulseBaseline.source.replace('_', ' ')}
              </span>
            )}
          </div>

          <div className="flex items-end gap-3 mb-6">
            <span className="text-5xl font-black text-white leading-none">
              {profile?.pulseBaseline?.restingBPM || '--'}
            </span>
            <span className="text-[10px] font-black text-white/20 mb-1 uppercase tracking-widest leading-none">RESTING BPM</span>
          </div>

          <div className="pt-6 border-t border-white/5 space-y-4">
            <div className="flex items-start gap-3">
              <Info size={16} className="text-[#EBFB3B] mt-0.5 shrink-0" />
              <p className="text-[10px] text-white/40 font-bold uppercase leading-relaxed tracking-wide">
                {t.baselineInfo}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 shrink-0 relative z-10 mt-12">
        <button 
          onClick={() => { playHeartbeat(); setSyncOpen(true); }}
          className="w-full py-6 rounded-[1.5rem] bg-[#EBFB3B] text-black text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_0_30px_rgba(235,251,59,0.3)] hover:scale-[1.02]"
        >
          <RefreshCw size={18} />
          {t.recalibrate}
        </button>

        <div className="flex flex-col items-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">The Love Circle</p>
          <LoveCircleList lang={lang} />
        </div>
      </div>

      <Dialog open={syncOpen} onOpenChange={setSyncOpen}>
        <DialogContent className="bg-black border-white/10 max-md p-0 rounded-[3rem] overflow-hidden flex flex-col h-auto max-h-[85vh]">
          <DialogTitle className="sr-only">{t.recalibrate}</DialogTitle>
          <div className="flex-1 overflow-y-auto">
            <WearablesSync onComplete={() => setSyncOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={holdersOpen} onOpenChange={setHoldersOpen}>
        <DialogContent className="bg-black border-white/10 max-w-2xl p-0 rounded-[3rem] overflow-hidden flex flex-col h-[85vh]">
          <DialogTitle className="sr-only">{t.holders}</DialogTitle>
          <LoveCircleChat />
        </DialogContent>
      </Dialog>

      <Dialog open={witnessesOpen} onOpenChange={setWitnessesOpen}>
        <DialogContent className="bg-black border-white/10 max-w-2xl p-0 rounded-[3rem] overflow-hidden flex flex-col h-[85vh]">
          <DialogTitle className="sr-only">{t.witnesses}</DialogTitle>
          <PartyCircleChat />
        </DialogContent>
      </Dialog>
    </div>
  );
}
