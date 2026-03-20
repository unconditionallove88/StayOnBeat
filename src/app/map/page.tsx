
"use client"

import { useState, useEffect, Suspense } from 'react';
import { ArrowLeft, Target, Shield, Loader2, Heart, PhoneCall, AlertTriangle, X } from 'lucide-react';
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
 * Refined: Love Circle reimagined as a floating Sanctuary Orb radar.
 * Optimised for organic interaction on iPhone and clear tactical viewing on Web.
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

        {/* User Pointer - Centered but tactical */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center transition-all duration-1000">
          <div className={cn("transition-all duration-1000", !isSharing && "grayscale opacity-50")}>
            <div className="relative flex items-center justify-center w-24 h-24 md:w-32 md:h-32">
              <div className={cn("absolute w-full h-full rounded-full opacity-20 animate-ping", isGuardActive ? "bg-red-500" : "bg-emerald-400")} />
              <div className="relative z-10 bg-black/40 p-3 md:p-4 rounded-full backdrop-blur-sm border border-white/10">
                <RadiatingThirdEye size={48} className="md:w-16 md:h-16" color={isGuardActive ? "#ef4444" : "#10b981"} />
              </div>
            </div>
          </div>
          <div className="mt-3 bg-black/80 px-3 py-1 rounded-full border border-white/10 inline-block">
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap">I am here. 💚</span>
          </div>
        </div>

        {/* Friend Node: Max (Intense Status) */}
        {isSharing && (
          <div className="absolute top-[25%] left-[30%] animate-bounce" style={{ animationDuration: '3000ms' }}>
             <div className={cn(
               "w-6 h-6 md:w-8 md:h-8 rounded-full border-[2px] md:border-[3px] border-white shadow-[0_0_30px_rgba(220,38,38,0.6)] flex items-center justify-center",
               isFriendDistress ? "bg-red-600 animate-pulse" : "bg-[#3EB489]"
             )}>
               <Heart size={10} className="text-white fill-white md:w-3.5 md:h-3.5" />
             </div>
             <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-0.5 rounded-full border border-white/10 whitespace-nowrap">
               <span className="text-[7px] md:text-[8px] font-black uppercase">{focusName ? `${focusName.toUpperCase()} (${focusStatus?.toUpperCase()})` : "Circle"}</span>
             </div>
          </div>
        )}

        {/* Safety Hubs */}
        <div className="absolute bottom-[35%] right-[20%]">
           <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-600 rounded-2xl flex items-center justify-center border-2 border-white shadow-[0_0_30px_rgba(16,185,129,0.5)] animate-pulse">
             <Shield className="w-5 h-5 md:w-6 md:h-6 text-white" />
           </div>
           <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-emerald-600/20 px-3 py-1.5 rounded-xl border border-emerald-500/40 whitespace-nowrap">
             <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#10B981]">Safety Hub A</span>
           </div>
        </div>
      </div>

      <div className="relative z-10 p-4 md:p-8 flex flex-col h-full pointer-events-none">
        {/* Top Nav: Back and Privacy */}
        <div className="flex justify-between items-start pointer-events-auto w-full max-w-7xl mx-auto shrink-0">
          <Link href="/dashboard" className="bg-black/80 backdrop-blur-xl p-3 md:p-4 rounded-full border border-white/10 hover:border-[#3EB489] transition-all">
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
          </Link>
          
          <div className="bg-black/80 backdrop-blur-md px-4 py-3 md:px-6 md:py-4 rounded-[2rem] border border-white/10 flex items-center gap-4">
            <div className="flex flex-col items-end gap-1">
              <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-white/40">Presence</span>
              <span className={cn("text-[8px] md:text-[10px] font-bold uppercase", isSharing ? "text-[#3EB489]" : "text-white/40")}>{isSharing ? "Sharing" : "Private"}</span>
            </div>
            <Switch checked={isSharing} onCheckedChange={setIsSharing} className="data-[state=checked]:bg-[#3EB489] scale-75 md:scale-100" />
          </div>
        </div>
        
        {/* Main Interface Wrapper: Floating ORB Layout */}
        <div className="flex-1 flex flex-col md:flex-row justify-end items-end gap-6 w-full max-w-7xl mx-auto pointer-events-none pt-6">
          
          {/* Side Info Panel (Left side on Web) */}
          {!isFriendDistress && showPulseInfo && (
            <div className="mt-auto md:mt-0 md:mr-auto pointer-events-auto bg-black/90 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 max-w-[240px] animate-in fade-in slide-in-from-left-4 duration-1000 space-y-2 relative">
              <button 
                onClick={() => setShowPulseInfo(false)}
                className="absolute top-4 right-4 text-white/20 hover:text-white"
              >
                <X size={14} />
              </button>
              <div className="flex items-center gap-2">
                <Target className="w-3 h-3 text-[#3EB489]" />
                <span className="text-[8px] font-black uppercase text-[#3EB489] tracking-widest">I respect my limits</span>
              </div>
              <p className="text-[11px] font-bold leading-tight text-white/80">I love and respect myself enough to decide when I want to be seen. 💚</p>
            </div>
          )}

          {/* Floating Radar Console */}
          <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-4 pointer-events-auto mt-auto md:mt-0 pb-6 md:pb-0">
            
            {/* Friend SOS Banner - Tactical stack */}
            {isFriendDistress && (
              <div className="bg-red-600 border-2 border-white/20 rounded-[2.5rem] p-6 shadow-[0_0_50px_rgba(220,38,38,0.4)] animate-in slide-in-from-right-4 duration-500 space-y-4 max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center border border-white/30 shrink-0">
                    <AlertTriangle size={24} className="text-white animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tighter leading-none">{focusName} needs care</h3>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-white/60 mt-1">Pulse {focusStatus}</p>
                  </div>
                </div>
                
                <button 
                  onClick={handleNotifyAwarenessForFriend}
                  className="w-full h-14 bg-white text-red-600 rounded-xl font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
                >
                  <PhoneCall size={14} /> NOTIFY AWARENESS FOR {focusName?.toUpperCase()}
                </button>
              </div>
            )}

            {/* The Circular Love Circle Orb */}
            <div className="relative group">
              <LoveCircle lang={lang} variant="map" />
              
              {/* Overlay SOS button - Floating outside or inside the orb context */}
              {!isFriendDistress && (
                <button 
                  onClick={() => setSosActive(true)} 
                  className="absolute -top-4 -left-4 md:-top-6 md:-left-6 w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full border-2 border-white flex items-center justify-center shadow-[0_0_40px_rgba(220,38,38,0.4)] active:scale-95 transition-all z-20"
                >
                  <Shield className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </button>
              )}
            </div>
          </div>
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
