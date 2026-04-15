
'use client';

import { useState, useEffect, Suspense } from 'react';
import HeartStatusAura from "@/components/dashboard/HeartStatusAura";
import LoveCircle from "@/components/dashboard/LoveCircle";
import { 
  ArrowLeft, 
  Watch, 
  Info, 
  RefreshCw, 
  ChevronRight, 
  PenLine, 
  Wind, 
  Eye, 
  Users2, 
  Globe, 
  Loader2 
} from "lucide-react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { LoveCircleChat } from '@/components/chat/LoveCircleChat';
import { PartyCircleChat } from '@/components/chat/PartyCircleChat';
import { WearablesSync } from '@/components/dashboard/WearablesSync';
import { LoveLetter } from '@/components/dashboard/LoveLetter';
import { VisionOfLove } from '@/components/dashboard/VisionOfLove';
import { playHeartbeat } from '@/lib/resonance';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * @fileOverview Inner Resonance Page.
 * Specialized view containing: Circle of Love, Love Letters, Breath, and Vision.
 */

function InnerHeartContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const firestore = useFirestore();
  const [heartRate, setHeartRate] = useState(75);
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<'en' | 'de'>('en');
  
  const [holdersOpen, setHoldersOpen] = useState(false);
  const [witnessesOpen, setWitnessesOpen] = useState(false);
  const [syncOpen, setSyncOpen] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [visionOpen, setVisionOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);

    if (searchParams.get('chat') === 'holders') setHoldersOpen(true);
    if (searchParams.get('chat') === 'spectators') setWitnessesOpen(true);

    const interval = setInterval(() => {
      setHeartRate(prev => {
        const drift = Math.random() > 0.5 ? 1 : -1;
        return Math.max(50, Math.min(160, prev + drift));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [searchParams]);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);
  
  const { data: profile } = useDoc(userDocRef);

  if (!mounted) return null;

  const t = {
    en: {
      title: "My Heart",
      sub: "Inside the Ring",
      resonance: "Inner Resonance",
      letters: "Love Letters",
      lettersSub: "Future Self",
      breath: "Breath of Love",
      breathSub: "Ritual Now",
      vision: "Vision of Love",
      visionSub: "Grounding Tool",
      baseline: "Pulse Baseline",
      baselineSub: "Your biological zero point",
      recalibrate: "Recalibrate Baseline",
      footer: "Sacred Inner Sanctuary"
    },
    de: {
      title: "Mein Herz heute",
      sub: "Im Aura-Ring heute",
      resonance: "Innere Resonanz heute",
      letters: "Liebesbriefe heute",
      lettersSub: "Zukünftiges Ich heute",
      breath: "Atem der Liebe heute",
      breathSub: "Ritual jetzt hier",
      vision: "Vision der Liebe heute",
      visionSub: "Erdungs Tool heute",
      baseline: "Puls Basis heute",
      baselineSub: "Dein biologischer Nullpunkt heute",
      recalibrate: "Basis neu kalibrieren",
      footer: "Heiliges Inneres Sanctuary"
    }
  }[lang];

  const handlePortal = (action: () => void) => {
    playHeartbeat();
    action();
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] p-6 pb-32 font-headline overflow-x-hidden relative">
      <header className="flex items-center gap-4 mb-8 shrink-0 z-10 pt-safe">
        <button 
          onClick={() => router.back()}
          className="p-3 bg-white/5 rounded-full border border-white/10 text-white/40 hover:text-white transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-white">{t.title}</h1>
          <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">{t.sub}</p>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="flex flex-col items-center gap-12 max-w-xl mx-auto pb-40">
          
          <LoveCircle lang={lang} variant="map" />

          {/* Emotional Portals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full px-4">
            <button 
              onClick={() => handlePortal(() => setLetterOpen(true))}
              className="p-6 rounded-[2.5rem] bg-white/[0.03] border border-white/10 flex flex-col items-center gap-3 hover:border-purple-500/30 transition-all group"
            >
              <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
                <PenLine size={24} className="text-purple-400" />
              </div>
              <div className="text-center">
                <p className="text-[11px] font-black uppercase text-white leading-none">{t.letters}</p>
                <p className="text-[7px] font-bold text-white/30 uppercase tracking-widest mt-1">{t.lettersSub}</p>
              </div>
            </button>

            <button 
              onClick={() => handlePortal(() => router.push('/self-care'))}
              className="p-6 rounded-[2.5rem] bg-white/[0.03] border border-white/10 flex flex-col items-center gap-3 hover:border-emerald-500/30 transition-all group"
            >
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <Wind size={24} className="text-emerald-400" />
              </div>
              <div className="text-center">
                <p className="text-[11px] font-black uppercase text-white leading-none">{t.breath}</p>
                <p className="text-[7px] font-bold text-white/30 uppercase tracking-widest mt-1">{t.breathSub}</p>
              </div>
            </button>

            <button 
              onClick={() => handlePortal(() => setVisionOpen(true))}
              className="p-6 rounded-[2.5rem] bg-white/[0.03] border border-white/10 flex flex-col items-center gap-3 hover:border-blue-500/30 transition-all group"
            >
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                <Eye size={24} className="text-blue-400" />
              </div>
              <div className="text-center">
                <p className="text-[11px] font-black uppercase text-white leading-none">{t.vision}</p>
                <p className="text-[7px] font-bold text-white/30 uppercase tracking-widest mt-1">{t.visionSub}</p>
              </div>
            </button>
          </div>

          {/* Baseline Card */}
          <div className="w-full bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group mx-4">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#EBFB3B]/5 blur-3xl -z-10" />
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-[#EBFB3B]/10 rounded-xl border border-[#EBFB3B]/20">
                <Watch className="text-[#EBFB3B] w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] font-black uppercase text-[#EBFB3B] tracking-widest">{t.baseline}</span>
                <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">{t.baselineSub}</span>
              </div>
            </div>
            <div className="flex items-end gap-3 mb-6">
              <span className="text-5xl font-black text-white leading-none">{profile?.pulseBaseline?.restingBPM || '--'}</span>
              <span className="text-[10px] font-black text-white/20 mb-1 uppercase tracking-widest leading-none">RESTING BPM</span>
            </div>
            <button 
              onClick={() => setSyncOpen(true)}
              className="w-full py-4 rounded-xl bg-[#EBFB3B] text-black text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <RefreshCw size={14} /> {t.recalibrate}
            </button>
          </div>

          <p className="text-[8px] font-black text-white/10 uppercase tracking-[0.5em] text-center">{t.footer}</p>
        </div>
      </ScrollArea>

      <Dialog open={syncOpen} onOpenChange={setSyncOpen}>
        <DialogContent className="bg-black border-white/10 max-md p-0 rounded-[3rem] overflow-hidden flex flex-col h-auto max-h-[85vh] shadow-[0_0_80px_rgba(0,0,0,0.9)]">
          <DialogTitle className="sr-only">Pulse Sync</DialogTitle>
          <div className="flex-1 overflow-y-auto"><WearablesSync onComplete={() => setSyncOpen(false)} /></div>
        </DialogContent>
      </Dialog>

      <Dialog open={holdersOpen} onOpenChange={setHoldersOpen}>
        <DialogContent className="bg-black border-white/10 max-w-2xl p-0 rounded-[3rem] overflow-hidden flex flex-col h-[85vh] shadow-[0_0_100px_rgba(0,0,0,0.9)]">
          <DialogTitle className="sr-only">The Holders</DialogTitle>
          <LoveCircleChat />
        </DialogContent>
      </Dialog>

      <Dialog open={witnessesOpen} onOpenChange={setWitnessesOpen}>
        <DialogContent className="bg-black border-white/10 max-w-2xl p-0 rounded-[3rem] overflow-hidden flex flex-col h-[85vh] shadow-[0_0_100px_rgba(0,0,0,0.9)]">
          <DialogTitle className="sr-only">The Spectators</DialogTitle>
          <PartyCircleChat />
        </DialogContent>
      </Dialog>

      <Dialog open={letterOpen} onOpenChange={setLetterOpen}>
        <DialogContent className="bg-black border-white/10 max-w-2xl p-0 rounded-[2rem] overflow-hidden flex flex-col h-auto max-h-[85vh] shadow-[0_0_100px_rgba(0,0,0,0.9)]">
          <DialogTitle className="sr-only">Love Letter</DialogTitle>
          <LoveLetter onComplete={() => setLetterOpen(false)} />
        </DialogContent>
      </Dialog>

      {visionOpen && <VisionOfLove onClose={() => setVisionOpen(false)} />}
    </div>
  );
}

export default function MyHeartPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-primary/20" /></div>}>
      <InnerHeartContent />
    </Suspense>
  );
}
