
'use client';

import { useState, useEffect } from 'react';
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
  ArrowLeft,
  Users2,
  Users
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Step6SubstanceLab as PulseLab } from '@/components/onboarding/Step6SubstanceLab';
import { VibeMirror } from '@/components/dashboard/VibeMirror';
import { SOSAlert } from '@/components/dashboard/SOSAlert';
import { RadiatingThirdEye } from '@/components/ui/radiating-third-eye';
import { ShieldPulseIcon } from '@/components/ui/shield-pulse-icon';
import { GuardianLogo } from '@/components/ui/guardian-logo';
import GuardianStatusBar from '@/components/dashboard/GuardianStatusBar';
import PulseGuardianBanner from '@/components/dashboard/PulseGuardianBanner';
import GuardianSimulator from '@/components/dashboard/GuardianSimulator';
import HeartStatusAura from '@/components/dashboard/HeartStatusAura';
import LoveCircleList from '@/components/dashboard/LoveCircle';
import { CoCreation } from '@/components/dashboard/CoCreation';
import { WearablesSync } from '@/components/dashboard/WearablesSync';
import { AssistantPortal } from '@/components/chat/AssistantPortal';
import { LoveCircleChat } from '@/components/chat/LoveCircleChat';
import { PartyCircleChat } from '@/components/chat/PartyCircleChat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useDoc, useMemoFirebase, useAuth } from '@/firebase';
import { doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { checkSafetyStatus } from '@/lib/guardian';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function SkyIcon() {
  const [icon, setIcon] = useState<React.ReactNode>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour < 18;

    if (isDay) {
      setIcon(
        <div className="relative group">
          <Sun className="w-7 h-7 text-yellow-400 fill-yellow-400 animate-pulse shadow-[0_0_30px_rgba(250,204,21,0.4)]" />
          <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full animate-ping opacity-30" />
        </div>
      );
    } else {
      setIcon(
        <div className="relative flex items-center justify-center">
          <div className="relative">
            <Moon className="w-6 h-6 text-slate-100 fill-slate-100/10 shadow-[0_0_20px_rgba(255,255,255,0.3)] rotate-[-15deg]" />
            <Sparkles className="absolute -top-3 -right-3 w-3 h-3 text-white animate-pulse" />
            <Sparkles className="absolute -bottom-2 -left-2 w-2 h-2 text-white/60 animate-pulse delay-700" />
            <div className="absolute top-1 -left-4 w-1 h-1 bg-white rounded-full animate-ping opacity-40" />
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
    cocreation: "Co-Creation: Shape the Sanctuary",
    assistant: "Personal AI Assistant & Advisor",
    profile: "My Sanctuary Profile",
    logout: "Step away for a moment"
  },
  de: {
    vibe: "Stimmungs Check-in",
    cocreation: "Ko-Kreation: Den Raum gestalten",
    assistant: "Persönlicher KI-Assistent & Berater",
    profile: "Mein Refugium-Profil",
    logout: "Einen Moment wegtreten"
  }
};

export default function Dashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const [mounted, setMounted] = useState(false);
  const [affirmation, setAffirmation] = useState("");
  const [lang, setLang] = useState<'en' | 'de'>('en');
  
  const [simHeartRate, setSimHeartRate] = useState(75);
  const [simSubstanceCount, setSimSubstanceCount] = useState(0);
  const [activeSubstances, setActiveSubstances] = useState<string[]>([]);

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
  const [holdersOpen, setHoldersOpen] = useState(false);
  const [witnessesOpen, setWitnessesOpen] = useState(false);

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
    await auth.signOut();
    localStorage.clear();
    router.push('/');
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
      <div className="px-6 py-10 bg-black/40 backdrop-blur-xl border-b border-white/5 z-50 shrink-0">
        <header className="flex justify-between items-start max-w-4xl mx-auto w-full">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.4em]">
              Sanctuary Hub
            </p>
            <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4">
              {lang === 'en' ? `SHINE, ${displayName}` : `STRAHLE, ${displayName}`}
              <SkyIcon />
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-pointer">
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
                  onClick={() => setCoCreationOpen(true)} 
                  className="p-2.5 bg-[#90EE90]/10 rounded-full border border-[#90EE90]/30 hover:border-[#90EE90] transition-colors active:scale-95"
                >
                  <Sprout className="w-5 h-5 text-[#90EE90]" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-zinc-900 border-white/10 text-[#90EE90] font-bold uppercase text-[9px] tracking-widest px-4 py-2">
                {t.cocreation}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => setAiBotOpen(true)} 
                  className="p-2.5 bg-blue-600/10 rounded-full border border-blue-500/30 transition-colors active:scale-95"
                >
                  <Bot className="w-5 h-5 text-blue-400" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-zinc-900 border-white/10 text-blue-400 font-bold uppercase text-[9px] tracking-widest px-4 py-2">
                {t.assistant}
              </TooltipContent>
            </Tooltip>
            
            <PulseGuardianBanner lang={lang} variant="icon" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/profile" className="p-2.5 bg-white/5 rounded-full border border-white/10 hover:border-[#10B981] transition-all active:scale-95">
                  <User className="w-5 h-5 text-white/40" />
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
                  className="p-2.5 bg-red-600/10 rounded-full border border-red-500/30 transition-colors active:scale-95"
                >
                  <LogOut className="w-5 h-5 text-red-500" />
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
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-12 pb-32">
          
          <div className="space-y-3">
            <GuardianStatusBar 
              status={guardianStatus} 
              heartRate={simHeartRate} 
              lang={lang} 
            />
          </div>

          <div className="space-y-4 text-center">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 px-2">
              {lang === 'en' ? 'Love Circle' : 'Love Circle'}
            </h2>
            <div className="block transition-all">
              <div className="flex flex-col items-center gap-4">
                <HeartStatusAura 
                  heartRate={simHeartRate} 
                  activeSubstances={activeSubstances} 
                  mood={firestoreProfile?.vibe?.currentLabel || (lang === 'en' ? "Steady" : "Stabil")}
                  lang={lang} 
                  onHoldersClick={() => setHoldersOpen(true)}
                  onWitnessesClick={() => setWitnessesOpen(true)}
                />
                <span className="text-[9px] uppercase tracking-widest text-slate-600 font-bold">
                  Demo Mode · Simulated Data
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#10B981]/5 border border-[#10B981]/20 rounded-[2rem] p-6 text-center relative overflow-hidden group">
            <p className="text-base font-black uppercase tracking-tight text-white/80 italic">"{affirmation}"</p>
          </div>

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

          <div className="w-full">
            <LoveCircleList lang={lang} />
          </div>

          <div className="space-y-8">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 px-2 text-center">
              {lang === 'en' ? 'Essential Tools' : 'Wichtige Tools'}
            </h2>
            <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
              {/* THE PULSE CIRCLE */}
              <Link href="/map" className="aspect-square rounded-full bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-4 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all shadow-2xl group active:scale-95 text-center p-6">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                  <RadiatingThirdEye size={40} color="#3b82f6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-black uppercase tracking-tight leading-none">{lang === 'en' ? 'The Pulse' : 'The Pulse'}</p>
                  <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest leading-none">Map</p>
                </div>
              </Link>

              {/* PULSE LAB CIRCLE */}
              <button 
                onClick={() => setLabOpen(true)} 
                className="aspect-square rounded-full bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-4 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all shadow-2xl group active:scale-95 text-center p-6"
              >
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <Microscope size={40} className="text-white" />
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-black uppercase tracking-tight leading-none">{lang === 'en' ? 'Pulse Lab' : 'Pulse Lab'}</p>
                  <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest leading-none">Dose</p>
                </div>
              </button>

              {/* PULSE SYNC CIRCLE */}
              <button 
                onClick={() => setSyncOpen(true)} 
                className="aspect-square rounded-full bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-4 hover:border-[#EBFB3B]/30 hover:bg-[#EBFB3B]/5 transition-all shadow-2xl group active:scale-95 text-center p-6"
              >
                <div className="w-16 h-16 bg-[#EBFB3B]/10 rounded-full flex items-center justify-center border border-[#EBFB3B]/20 group-hover:scale-110 transition-transform">
                  <Watch size={36} className="text-[#EBFB3B]" />
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-black uppercase tracking-tight leading-none">{lang === 'en' ? 'Pulse Sync' : 'Pulse Sync'}</p>
                  <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest leading-none">Vitals</p>
                </div>
              </button>

              {/* IMMEDIATE HELP CIRCLE */}
              <button 
                onClick={() => setShowSOS(true)}
                className="aspect-square rounded-full bg-red-600/10 border border-red-600/20 flex flex-col items-center justify-center gap-4 hover:bg-red-600 transition-all shadow-2xl group active:scale-95 text-center p-6"
              >
                <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Shield size={36} />
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-black uppercase tracking-tight leading-none group-hover:text-white transition-colors">{lang === 'en' ? 'Immediate Help' : 'Sofort-Hilfe'}</p>
                  <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest leading-none group-hover:text-white/60 transition-colors">Support</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </ScrollArea>

      {showSOS && <SOSAlert onClose={() => setShowSOS(false)} />}
      
      <Dialog open={labOpen} onOpenChange={setLabOpen}>
        <DialogContent className="bg-black border-white/10 max-w-2xl p-0 rounded-[3rem] overflow-hidden flex flex-col h-[90vh]">
          <DialogTitle className="sr-only">Pulse Lab</DialogTitle>
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
        </DialogContent>
      </Dialog>

      <Dialog open={aiBotOpen} onOpenChange={setAiBotOpen}>
        <DialogContent className="bg-black border-white/10 max-w-2xl p-0 rounded-[3rem] overflow-hidden flex flex-col h-[85vh]">
          <DialogTitle className="sr-only">AI Assistant Portal</DialogTitle>
          <AssistantPortal userProfile={firestoreProfile} />
        </DialogContent>
      </Dialog>

      <Dialog open={coCreationOpen} onOpenChange={setCoCreationOpen}>
        <DialogContent className="bg-black border-white/10 max-lg p-0 rounded-[3rem] overflow-hidden">
          <DialogTitle className="sr-only">Co-Creation</DialogTitle>
          <CoCreation onComplete={() => setCoCreationOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={syncOpen} onOpenChange={setSyncOpen}>
        <DialogContent className="bg-black border-white/10 max-md p-0 rounded-[3rem] overflow-hidden">
          <DialogTitle className="sr-only">Pulse Sync</DialogTitle>
          <WearablesSync onComplete={() => setSyncOpen(false)} />
        </DialogContent>
      </Dialog>

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
    </main>
  );
}
