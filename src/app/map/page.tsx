
"use client"

import { useState, useEffect, Suspense } from 'react';
import { ArrowLeft, Target, Shield, Loader2, Heart, PhoneCall, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { SOSAlert } from '@/components/dashboard/SOSAlert';
import { RadiatingThirdEye } from '@/components/ui/radiating-third-eye';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import LoveCircle from '@/components/dashboard/LoveCircle';

/**
 * @fileOverview High-Fidelity Radar Map ("The Pulse").
 * Enhanced: Friend SOS mode. If focused on a friend in trouble, allows Holders to notify the Awareness Team.
 * Refined: Integrated contextual naming for SOSAlert.
 */

function MapContent() {
  const searchParams = useSearchParams();
  const { user } = useUser();
  const firestore = useFirestore();
  const [sosActive, setSosActive] = useState(false);
  const [isSharing, setIsSharing] = useState(true);
  const [showPulseInfo, setShowPulseInfo] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [lang, setLang] = useState<'en' | 'de'>('en');
  
  // SOS Context
  const focusName = searchParams.get('focus');
  const focusStatus = searchParams.get('status');
  const isFriendDistress = !!focusName && focusStatus !== 'steady';

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);
  
  const { data: profile } = useDoc(userDocRef);
  const isGuardActive = profile?.guardActive || false;

  useEffect(() => {
    const savedLang = localStorage.getItem('stayonbeat_lang');
    if (savedLang === 'DE' || savedLang === 'EN') {
      setLang(savedLang.toLowerCase() as 'en' | 'de');
    }

    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleNotifyAwarenessForFriend = () => {
    setSosActive(true);
  };

  if (isLoading) {
    return (
      <main className="h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20" />
          <Loader2 className="w-12 h-12 animate-spin text-emerald-500 relative z-10" />
        </div>
        <p className="text-emerald-500 font-black uppercase tracking-widest text-[10px] animate-pulse">Tuning into the collective pulse...</p>
      </main>
    );
  }

  return (
    <main className="h-screen bg-black text-white relative overflow-hidden font-headline animate-in fade-in duration-700">
      <div className="absolute inset-0 bg-[#080808]">
        {/* Radar Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%">
            <pattern id="radarGrid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#3EB489" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#radarGrid)" />
          </svg>
        </div>

        {/* User Pointer */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className={cn("transition-all duration-1000", !isSharing && "grayscale opacity-50 scale-75")}>
            <div className="relative flex items-center justify-center w-32 h-32">
              <div className={cn("absolute w-full h-full rounded-full opacity-20 animate-ping", isGuardActive ? "bg-red-500" : "bg-emerald-400")} />
              <div className="relative z-10 bg-black/40 p-4 rounded-full backdrop-blur-sm border border-white/10">
                <RadiatingThirdEye size={64} color={isGuardActive ? "#ef4444" : "#10b981"} />
              </div>
            </div>
          </div>
          <div className="mt-4 bg-black/80 px-4 py-1.5 rounded-full border border-white/10 inline-block">
            <span className="text-[10px] font-black uppercase tracking-widest text-white">I am here. 💚</span>
          </div>
        </div>

        {/* Friend Node: Max (Intense Status) */}
        {isSharing && (
          <div className="absolute top-[30%] left-[40%] animate-bounce" style={{ animationDuration: '3000ms' }}>
             <div className={cn(
               "w-8 h-8 rounded-full border-[3px] border-white shadow-[0_0_30px_rgba(220,38,38,0.6)] flex items-center justify-center",
               isFriendDistress ? "bg-red-600 animate-pulse" : "bg-[#3EB489]"
             )}>
               <Heart size={14} className="text-white fill-white" />
             </div>
             <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 px-3 py-1 rounded-full border border-white/10 whitespace-nowrap">
               <span className="text-[8px] font-black uppercase">{focusName ? `${focusName.toUpperCase()} (${focusStatus?.toUpperCase()})` : "Circle"}</span>
             </div>
          </div>
        )}

        {/* Safety Hubs */}
        <div className="absolute bottom-[25%] right-[35%]">
           <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center border-2 border-white shadow-[0_0_30px_rgba(16,185,129,0.5)] animate-pulse">
             <Shield className="w-6 h-6 text-white" />
           </div>
           <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-emerald-600/20 px-4 py-2 rounded-xl border border-emerald-500/40 whitespace-nowrap">
             <span className="text-[10px] font-black uppercase tracking-widest text-[#10B981]">Safety Hub A</span>
           </div>
        </div>
      </div>

      <div className="relative z-10 p-6 flex flex-col h-full pointer-events-none">
        <div className="flex justify-between items-start pointer-events-auto w-full max-w-4xl mx-auto">
          <Link href="/dashboard" className="bg-black/80 backdrop-blur-xl p-4 rounded-full border border-white/10 hover:border-[#3EB489] transition-all">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          
          <div className="flex flex-col items-end gap-3 max-w-[200px]">
            <div className="bg-black/80 backdrop-blur-md px-6 py-4 rounded-[2.5rem] border border-white/10 flex flex-col items-end gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40 text-right leading-tight">Radiate presence to Holders & Witnesses</span>
              <div className="flex items-center gap-3">
                <span className={cn("text-[10px] font-bold uppercase", isSharing ? "text-[#3EB489]" : "text-white/40")}>{isSharing ? "On" : "Off"}</span>
                <Switch checked={isSharing} onCheckedChange={setIsSharing} className="data-[state=checked]:bg-[#3EB489]" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-auto space-y-4 pointer-events-auto w-full max-w-xl mx-auto pb-8">
          
          {/* Friend SOS Banner */}
          {isFriendDistress && (
            <div className="bg-red-600 border-2 border-white/20 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(220,38,38,0.4)] animate-in slide-in-from-bottom-4 duration-500 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30">
                  <AlertTriangle size={32} className="text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">{focusName} needs care</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mt-1">Pulse {focusStatus} • Location Verified</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleNotifyAwarenessForFriend}
                  className="w-full h-20 bg-white text-red-600 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all"
                >
                  <PhoneCall size={20} /> NOTIFY AWARENESS TEAM FOR {focusName?.toUpperCase()}
                </button>
                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40 text-center">
                  Only use this if {focusName} is unresponsive or in immediate danger.
                </p>
              </div>
            </div>
          )}

          {!isFriendDistress && showPulseInfo && (
            <div className="bg-black/90 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 max-w-[280px] animate-in fade-in slide-out-to-left duration-1000 space-y-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#3EB489]" />
                <span className="text-[10px] font-black uppercase text-[#3EB489] tracking-widest">I respect my limits</span>
              </div>
              <p className="text-sm font-bold leading-tight text-white/80">I love and respect myself enough to decide when I want to be seen. The Pulse is my rhythm. 💚</p>
            </div>
          )}

          {/* Contextual Action */}
          {!isFriendDistress && (
            <>
              <LoveCircle lang={lang} />
              <button 
                onClick={() => setSosActive(true)} 
                className="w-full bg-red-600 h-24 rounded-full font-black uppercase text-base tracking-widest flex items-center justify-center gap-4 shadow-[0_0_50px_rgba(220,38,38,0.4)] active:scale-95 transition-all"
              >
                <Shield className="w-8 h-8" /> Need Immediate Support
              </button>
            </>
          )}
        </div>
      </div>
      {sosActive && (
        <SOSAlert 
          onClose={() => setSosActive(false)} 
          friendName={focusName || undefined}
          friendStatus={focusStatus || undefined}
        />
      )}
    </main>
  );
}

export default function MapView() {
  return (
    <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-[#10B981]" /></div>}>
      <MapContent />
    </Suspense>
  );
}
