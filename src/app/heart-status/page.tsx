
"use client";

import { useState, useEffect } from 'react';
import HeartStatusAura from "@/components/dashboard/HeartStatusAura";
import LoveCircleList from "@/components/dashboard/LoveCircle";
import { Activity, ArrowLeft, Watch, Info, Shield, Users2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { LoveCircleChat } from '@/components/chat/LoveCircleChat';
import { PartyCircleChat } from '@/components/chat/PartyCircleChat';

/**
 * @fileOverview Love Circle Detailed Rhythm Page.
 * Visualizes the high-fidelity living pulse and provides entry to Holders and Witnesses.
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

    // Simulate slight HR variance
    const interval = setInterval(() => {
      setHeartRate(prev => {
        const drift = Math.random() > 0.5 ? 1 : -1;
        return Math.max(50, Math.min(160, prev + drift));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] p-6 pb-32 font-headline overflow-x-hidden relative">
      {/* Background Grid */}
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
          <h1 className="text-2xl font-black uppercase tracking-tighter">Love Circle</h1>
          <p className="text-[10px] text-[#10B981] font-black uppercase tracking-[0.3em]">Sanctuary Pulse Analytics</p>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 gap-8">
        {/* 1. THE AURA (Visual Individual State) */}
        <div className="flex flex-col items-center gap-4">
          <HeartStatusAura 
            heartRate={heartRate} 
            activeSubstances={[]} 
            mood={profile?.vibe?.currentLabel || "Steady"}
            lang={lang}
          />
          <span className="text-[9px] uppercase tracking-widest text-slate-600 font-bold">
            Demo Mode · My Rhythm
          </span>
        </div>

        {/* 2. CHAT ENTRY POINTS - EXCLUSIVE TO THIS PAGE */}
        <div className="grid grid-cols-2 gap-6 w-full max-w-sm">
          <button 
            onClick={() => setHoldersOpen(true)}
            className="aspect-square rounded-[2.5rem] bg-white/5 border border-[#10B981]/20 flex flex-col items-center justify-center gap-4 hover:bg-[#10B981]/5 hover:border-[#10B981] transition-all group shadow-2xl"
          >
            <div className="w-14 h-14 bg-[#10B981]/10 rounded-2xl flex items-center justify-center border border-[#10B981]/20 group-hover:scale-110 transition-transform">
              <Shield size={28} className="text-[#10B981]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-tight">The Holders</p>
              <p className="text-[8px] font-bold text-[#10B981] uppercase tracking-widest">Private Bonds</p>
            </div>
          </button>

          <button 
            onClick={() => setWitnessesOpen(true)}
            className="aspect-square rounded-[2.5rem] bg-white/5 border border-amber-500/20 flex flex-col items-center justify-center gap-4 hover:bg-amber-500/5 hover:border-amber-500 transition-all group shadow-2xl"
          >
            <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Users2 size={28} className="text-amber-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-tight">The Witnesses</p>
              <p className="text-[8px] font-bold text-amber-500 uppercase tracking-widest">Public Care</p>
            </div>
          </button>
        </div>
        
        {/* 3. BASELINE INFO CARD */}
        {profile?.pulseBaseline ? (
          <div className="w-full max-w-sm bg-white/5 border border-[#EBFB3B]/20 rounded-[2rem] p-6 animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Watch className="text-[#EBFB3B] w-5 h-5" />
                <span className="text-[10px] font-black uppercase text-[#EBFB3B] tracking-widest">Pulse Baseline</span>
              </div>
              <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest px-2 py-1 bg-white/5 rounded-full">Set via {profile.pulseBaseline.source.replace('_', ' ')}</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-white">{profile.pulseBaseline.restingBPM}</span>
              <span className="text-xs font-bold text-white/40 mb-1">RESTING BPM</span>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 flex items-start gap-3">
              <span className="text-[#EBFB3B] mt-0.5"><Info size={14} /></span>
              <p className="text-[9px] text-white/40 font-bold uppercase leading-relaxed tracking-wide">
                Your Guardian is calibrated to this baseline. Thresholds adjust dynamically based on your resting rhythm. 🌿
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="space-y-6 shrink-0 relative z-10 mt-12">
        <button 
          onClick={() => router.push('/dashboard?sync=true')}
          className="w-full py-6 rounded-[1.5rem] bg-[#EBFB3B] text-black text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_0_30px_rgba(235,251,59,0.3)]"
        >
          <Activity size={18} />
          Recalibrate Baseline
        </button>

        <LoveCircleList lang={lang} />
      </div>

      {/* Chat Dialogs */}
      <Dialog open={holdersOpen} onOpenChange={setHoldersOpen}>
        <DialogContent className="bg-black border-white/10 max-w-2xl p-0 rounded-[3rem] overflow-hidden flex flex-col h-[85vh]">
          <DialogTitle className="sr-only">The Holders</DialogTitle>
          <LoveCircleChat />
        </DialogContent>
      </Dialog>

      <Dialog open={witnessesOpen} onOpenChange={setWitnessesOpen}>
        <DialogContent className="bg-black border-white/10 max-w-2xl p-0 rounded-[3rem] overflow-hidden flex flex-col h-[85vh]">
          <DialogTitle className="sr-only">The Witnesses</DialogTitle>
          <PartyCircleChat />
        </DialogContent>
      </Dialog>
    </div>
  );
}
