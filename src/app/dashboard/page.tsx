
'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  User, 
  LogOut, 
  Loader2, 
  Bot, 
  Sprout, 
  Watch, 
  Shield, 
  Sun, 
  Moon, 
  Sparkles,
  Microscope,
  Settings2,
  ChevronDown
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Step6SubstanceLab as PulseLab } from '@/components/onboarding/Step6SubstanceLab';
import { VibeMirror } from '@/components/dashboard/VibeMirror';
import { SOSAlert } from '@/components/dashboard/SOSAlert';
import { RadiatingThirdEye } from '@/components/ui/radiating-third-eye';
import PulseGuardianBanner from '@/components/dashboard/PulseGuardianBanner';
import GuardianStatusBar from '@/components/dashboard/GuardianStatusBar';
import GuardianSimulator from '@/components/dashboard/GuardianSimulator';
import HeartStatusAura from '@/components/dashboard/HeartStatusAura';
import LoveCircle from '@/components/dashboard/LoveCircle';
import { CoCreation } from '@/components/dashboard/CoCreation';
import { WearablesSync } from '@/components/dashboard/WearablesSync';
import { AssistantPortal } from '@/components/chat/AssistantPortal';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser, useFirestore, useDoc, useMemoFirebase, useAuth } from '@/firebase';
import { doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { checkSafetyStatus } from '@/lib/guardian';
import { playHeartbeat } from '@/lib/resonance';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

function SkyIcon() {
  const [icon, setIcon] = useState<React.ReactNode>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour < 18;

    if (isDay) {
      setIcon(
        <div className="relative group flex-shrink-0">
          <Sun className="w-5 h-5 md:w-7 md:h-7 text-yellow-400 fill-yellow-400 animate-pulse shadow-[0_0_30px_rgba(250,204,21,0.4)]" />
          <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full animate-ping opacity-30" />
        </div>
      );
    } else {
      setIcon(
        <div className="relative flex items-center justify-center flex-shrink-0">
          <div className="relative">
            <Moon className="w-4 h-4 md:w-6 md:h-6 text-slate-100 fill-slate-100/10 shadow-[0_0:20px_rgba(255,255,255,0.3)] rotate-[-15deg]" />
            <Sparkles className="absolute -top-3 -right-3 w-2 h-2 text-white animate-pulse" />
            <Sparkles className="absolute -bottom-2 -left-2 w-1.5 h-1.5 text-white/60 animate-pulse delay-700" />
          </div>
        </div>
      );
    }
  }, []);

  return icon;
}

const AFFIRMATIONS = {
  EN: ["I am loved.", "Truth is love.", "Joy is now.", "I accept all.", "Unity is peace."],
  DE: ["Ich bin geliebt.", "Wahrheit ist liebe.", "Freude ist jetzt.", "Ich akzeptiere alles.", "Einheit ist frieden."]
};

const TOOLTIPS = {
  en: {
    vibe: "Mood Check-in",
    cocreation: "Co-Creation",
    assistant: "AI Assistant",
    profile: "My Profile",
    logout: "Step away"
  },
  de: {
    vibe: "Stimmungs Check-in",
    cocreation: "Ko-Kreation",
    assistant: "KI-Assistent",
    profile: "Mein Profil",
    logout: "Abmelden"
  }
};

export default function Dashboard() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const [mounted, setMounted] = useState(false);
  const [affirmation, setAffirmation] = useState("");
  const [lang, setLang] = useState<'en' | 'de'>('en');
  
  const [simHeartRate, setSimHeartRate] = useState(75);
  const [simSubstanceCount, setSimSubstanceCount] = useState(0);
  const [activeSubstances, setActiveSubstances] = useState<string[]>([]);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('stayonbeat_lang');
    const currentLang = (savedLang === 'DE' || savedLang === 'EN' ? savedLang.toLowerCase() : 'en') as 'en' | 'de';
    setLang(currentLang);

    const pool = AFFIRMATIONS[currentLang.toUpperCase() as 'EN' | 'DE'];
    setAffirmation(pool[Math.floor(Math.random() * pool.length)]);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.replace("/auth");
    });
    return () => unsubscribe();
  }, [auth, router]);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);
  
  const { data: firestoreProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

  const [labOpen, setLabOpen] = useState(false);
  const [aiBotOpen, setAiBotOpen] = useState(false);
  const [coCreationOpen, setCoCreationOpen] = useState(false);
  const [syncOpen, setSyncOpen] = useState(false);
  const [showSOS, setShowSOS] = useState(false);

  const medicalProfile = {
    healthConditions: firestoreProfile?.healthConditions || [],
    medications: firestoreProfile?.medications || []
  };

  const safetyStatus = checkSafetyStatus(
    { heartRate: simHeartRate }, 
    activeSubstances, 
    firestoreProfile?.pulseBaseline?.restingBPM,
    medicalProfile
  );

  const isLocked = safetyStatus.isLocked;
  const cautionThreshold = 100 / (safetyStatus.riskMultiplier || 1.0);
  const isCaution = !isLocked && (simHeartRate > cautionThreshold || activeSubstances.length >= 3);
  const guardianStatus: 'safe' | 'caution' | 'locked' = isLocked ? 'locked' : (isCaution ? 'caution' : 'safe');

  const handleLogout = async () => {
    playHeartbeat();
    await auth.signOut();
    localStorage.clear();
    router.push('/');
  };

  const handlePortalClick = (action: () => void) => {
    playHeartbeat();
    action();
  };

  if (!mounted || isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <Heart size={48} fill="#10B981" stroke="#10B981" className="animate-pulse-heart glow-green" />
        <Loader2 className="animate-spin text-[#10B981]/20" />
      </div>
    );
  }

  const displayName = firestoreProfile?.name || "Valued Soul";
  const t = TOOLTIPS[lang];

  return (
    <main className="min-h-screen bg-black text-white flex flex-col h-screen overflow-hidden font-headline">
      <div className="px-4 md:px-6 py-4 md:py-6 bg-black/40 backdrop-blur-xl border-b border-white/5 z-50 shrink-0">
        <header className="flex justify-between items-center max-w-4xl mx-auto w-full gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-black text-[#10B981] uppercase tracking-[0.4em]">
              Sanctuary Hub
            </p>
            <h1 className="text-lg md:text-3xl font-black uppercase tracking-tighter flex items-center gap-2 md:gap-4 truncate overflow-hidden">
              <span className="truncate">{lang === 'en' ? `SHINE, ${displayName}` : `STRAHLE, ${displayName}`}</span>
              <SkyIcon />
            </h1>
          </div>
          
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <div onClick={() => playHeartbeat()}>
                  <VibeMirror vibe={firestoreProfile?.vibe} />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-zinc-900 border-white/10 text-white font-bold uppercase text-[9px] tracking-widest px-4 py-2">
                {t.vibe}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => handlePortalClick(() => setCoCreationOpen(true))} 
                  className="p-1.5 md:p-2.5 bg-[#90EE90]/10 rounded-full border border-[#90EE90]/30 hover:border-[#90EE90] transition-colors active:scale-95"
                >
                  <Sprout className="w-4 h-4 md:w-5 md:h-5 text-[#90EE90]" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-zinc-900 border-white/10 text-[#90EE90] font-bold uppercase text-[9px] tracking-widest px-4 py-2">
                {t.cocreation}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => handlePortalClick(() => setAiBotOpen(true))} 
                  className="p-1.5 md:p-2.5 bg-blue-600/10 rounded-full border border-blue-500/30 transition-colors active:scale-95"
                >
                  <Bot className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-zinc-900 border-white/10 text-blue-400 font-bold uppercase text-[9px] tracking-widest px-4 py-2">
                {t.assistant}
              </TooltipContent>
            </Tooltip>
            
            <div onClick={() => playHeartbeat()}>
              <PulseGuardianBanner lang={lang} variant="icon" />
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link 
                  href="/profile" 
                  onClick={() => playHeartbeat()}
                  className="p-1.5 md:p-2.5 bg-white/5 rounded-full border border-white/10 hover:border-[#10B981] transition-all active:scale-95"
                >
                  <User className="w-4 h-4 md:w-5 md:h-5 text-white/40" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-zinc-900 border-white/10 text-white/60 font-bold uppercase text-[9px] tracking-widest px-4 py-2">
                {t.profile}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={handleLogout} 
                  className="p-1.5 md:p-2.5 bg-red-600/10 rounded-full border border-red-600/30 transition-colors active:scale-95"
                >
                  <LogOut className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-zinc-900 border-white/10 text-red-500 font-bold uppercase text-[9px] tracking-widest px-4 py-2">
                {t.logout}
              </TooltipContent>
            </Tooltip>
          </div>
        </header>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-4 md:py-8 space-y-8 md:space-y-12 pb-32">
          
          <div className="space-y-3">
            <GuardianStatusBar 
              status={guardianStatus} 
              heartRate={simHeartRate} 
              lang={lang} 
            />
          </div>

          <div className="space-y-2 text-center">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 px-2">
              My Rhythm
            </h2>
            <Link 
              href="/heart-status" 
              onClick={() => playHeartbeat()}
              className="block transition-all active:scale-95"
            >
              <div className="flex flex-col items-center gap-2">
                <HeartStatusAura 
                  heartRate={simHeartRate} 
                  activeSubstances={activeSubstances} 
                  mood={firestoreProfile?.vibe?.currentLabel || (lang === 'en' ? "Steady" : "Stabil")}
                  lang={lang} 
                />
                <p className="text-[11px] font-black uppercase tracking-tight text-white/60 italic">"{affirmation}"</p>
              </div>
            </Link>
          </div>

          <div className="w-full flex justify-center">
            <LoveCircle lang={lang} variant="dashboard" />
          </div>

          <div className="space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 px-2 text-center">
              {lang === 'en' ? 'Essential Tools' : 'Wichtige Tools'}
            </h2>
            <div className="grid grid-cols-2 gap-4 md:gap-8 max-w-2xl mx-auto">
              <Link 
                href="/map" 
                onClick={() => playHeartbeat()}
                className="aspect-square rounded-full bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-3 md:gap-4 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all shadow-2xl group active:scale-95 text-center p-4 md:p-6"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                  <RadiatingThirdEye size={32} className="md:w-10 md:h-10" color="#3b82f6" />
                </div>
                <div className="space-y-1">
                  <p className="text-base md:text-xl font-black uppercase tracking-tight leading-none">{lang === 'en' ? 'The Pulse' : 'The Pulse'}</p>
                  <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest leading-none">Map</p>
                </div>
              </Link>

              <button 
                onClick={() => handlePortalClick(() => setLabOpen(true))} 
                className="aspect-square rounded-full bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-3 md:gap-4 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all shadow-2xl group active:scale-95 text-center p-4 md:p-6"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <Microscope size={32} className="md:w-10 md:h-10 text-white" />
                </div>
                <div className="space-y-1">
                  <p className="text-base md:text-xl font-black uppercase tracking-tight leading-none">{lang === 'en' ? 'Pulse Lab' : 'Pulse Lab'}</p>
                  <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest leading-none">Dose</p>
                </div>
              </button>

              <button 
                onClick={() => handlePortalClick(() => setSyncOpen(true))} 
                className="aspect-square rounded-full bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-3 md:gap-4 hover:border-[#EBFB3B]/30 hover:bg-[#EBFB3B]/5 transition-all shadow-2xl group active:scale-95 text-center p-4 md:p-6"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-[#EBFB3B]/10 rounded-full flex items-center justify-center border border-[#EBFB3B]/20 group-hover:scale-110 transition-transform">
                  <Watch size={28} className="md:w-9 md:h-9 text-[#EBFB3B]" />
                </div>
                <div className="space-y-1">
                  <p className="text-base md:text-xl font-black uppercase tracking-tight leading-none">{lang === 'en' ? 'Pulse Sync' : 'Pulse Sync'}</p>
                  <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest leading-none">Vitals</p>
                </div>
              </button>

              <button 
                onClick={() => handlePortalClick(() => setShowSOS(true))}
                className="aspect-square rounded-full bg-red-600/10 border border-red-600/20 flex flex-col items-center justify-center gap-3 md:gap-4 hover:bg-red-600 transition-all shadow-2xl group active:scale-95 text-center p-4 md:p-6"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Shield size={28} className="md:w-9 md:h-9" />
                </div>
                <div className="space-y-1">
                  <p className="text-base md:text-xl font-black uppercase tracking-tight leading-none group-hover:text-white transition-colors">{lang === 'en' ? 'Immediate Help' : 'Sofort-Hilfe'}</p>
                  <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest leading-none group-hover:text-white/60 transition-colors">Support</p>
                </div>
              </button>
            </div>
          </div>

          <div className="pt-8">
            <Collapsible open={isSimulatorOpen} onOpenChange={setIsSimulatorOpen}>
              <CollapsibleTrigger asChild>
                <button 
                  onClick={() => playHeartbeat()}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-4 text-[9px] font-black uppercase transition-all duration-500",
                    guardianStatus === 'safe' && "text-[#10B981] opacity-40 hover:opacity-100",
                    guardianStatus === 'caution' && "text-[#F59E0B] opacity-80 hover:opacity-100",
                    guardianStatus === 'locked' && "text-[#DC2626] opacity-100 animate-pulse"
                  )}
                >
                  <Settings2 size={12} />
                  {lang === 'en' ? 'Lab Calibration (Dev Access)' : 'Labor-Kalibrierung (Dev-Zugriff)'}
                  <ChevronDown className={cn("transition-transform", isSimulatorOpen && "rotate-180")} size={12} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <GuardianSimulator 
                  heartRate={simHeartRate} 
                  setHeartRate={setSimHeartRate}
                  substanceCount={simSubstanceCount}
                  setSubstanceCount={(count) => {
                    setSimSubstanceCount(count);
                    const mockSubstances = Array(count).fill('Substance');
                    if (count >= 1) mockSubstances[0] = 'Alcohol';
                    if (count >= 2) mockSubstances[1] = 'MDMA';
                    if (count >= 3) mockSubstances[2] = 'Poppers';
                    setActiveSubstances(mockSubstances);
                  }}
                  lang={lang} 
                />
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </ScrollArea>

      {showSOS && <SOSAlert onClose={() => setShowSOS(false)} />}
      
      <Dialog open={labOpen} onOpenChange={setLabOpen}>
        <DialogContent className="bg-black border-white/10 max-w-2xl p-0 rounded-[3rem] overflow-hidden flex flex-col h-[90dvh] max-h-[90dvh]">
          <DialogTitle className="sr-only">Pulse Lab</DialogTitle>
          <div className="flex-1 overflow-y-auto">
            <PulseLab 
              userData={{ 
                ...firestoreProfile, 
                sessionStatus: { 
                  isLocked, 
                  lastHeartRate: simHeartRate, 
                  lockReason: safetyStatus.lockReason, 
                  unlockAt: safetyStatus.unlockAt 
                } 
              }} 
              onComplete={(logs) => {
                const names = logs.map((l: any) => l.name);
                setActiveSubstances(names);
                setSimSubstanceCount(logs.length);
                setLabOpen(false);
              }} 
              showDiary={true} 
              isLocked={isLocked} 
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={aiBotOpen} onOpenChange={setAiBotOpen}>
        <DialogContent className="bg-black border-white/10 max-w-2xl p-0 rounded-[3rem] overflow-hidden flex flex-col h-[85dvh] max-h-[85dvh]">
          <DialogTitle className="sr-only">AI Assistant Portal</DialogTitle>
          <AssistantPortal userProfile={firestoreProfile} />
        </DialogContent>
      </Dialog>

      <Dialog open={coCreationOpen} onOpenChange={setCoCreationOpen}>
        <DialogContent className="bg-black border-white/10 max-lg p-0 rounded-[3rem] overflow-hidden flex flex-col h-auto max-h-[85dvh]">
          <DialogTitle className="sr-only">Co-Creation</DialogTitle>
          <div className="flex-1 overflow-y-auto">
            <CoCreation onComplete={() => setCoCreationOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={syncOpen} onOpenChange={setSyncOpen}>
        <DialogContent className="bg-black border-white/10 max-md p-0 rounded-[3rem] overflow-hidden flex flex-col h-auto max-h-[85dvh]">
          <DialogTitle className="sr-only">Pulse Sync</DialogTitle>
          <div className="flex-1 overflow-y-auto">
            <WearablesSync onComplete={() => setSyncOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
