
'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Heart, 
  User, 
  Loader2, 
  Sprout, 
  Watch, 
  Shield, 
  Sun, 
  Moon, 
  Microscope,
  Settings2,
  ChevronDown,
  Radio,
  PenLine,
  Wind,
  Eye
} from 'lucide-react';
import { SupporterIcon } from '@/components/ui/supporter-icon';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Step6SubstanceLab as PulseLab } from '@/components/onboarding/Step6SubstanceLab';
import { SOSAlert } from '@/components/dashboard/SOSAlert';
import { RadiatingThirdEye } from '@/components/ui/radiating-third-eye';
import PulseGuardianBanner from '@/components/dashboard/PulseGuardianBanner';
import GuardianStatusBar from '@/components/dashboard/GuardianStatusBar';
import GuardianSimulator from '@/components/dashboard/GuardianSimulator';
import HeartStatusAura from '@/components/dashboard/HeartStatusAura';
import { CoCreation } from '@/components/dashboard/CoCreation';
import { WearablesSync } from '@/components/dashboard/WearablesSync';
import { LoveLetter } from '@/components/dashboard/LoveLetter';
import { AssistantPortal as SupporterPortal } from '@/components/chat/AssistantPortal';
import { LosingControl } from '@/components/dashboard/LosingControl';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser, useFirestore, useDoc, useMemoFirebase, useAuth } from '@/firebase';
import { doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { checkSafetyStatus } from '@/lib/guardian';
import { playHeartbeat } from '@/lib/resonance';
import { cn } from '@/lib/utils';
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

    if (icon === null) {
      if (isDay) {
        setIcon(
          <div className="relative group flex-shrink-0">
            <Sun className="w-5 h-5 md:w-7 md:h-7 text-yellow-400 fill-yellow-400" />
            <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full opacity-30" />
          </div>
        );
      } else {
        setIcon(
          <div className="relative flex items-center justify-center flex-shrink-0">
            <div className="relative">
              <Moon className="w-4 h-4 md:w-6 md:h-6 text-slate-100 fill-slate-100/10 rotate-[-15deg]" />
            </div>
          </div>
        );
      }
    }
  }, [icon]);

  return icon;
}

const AFFIRMATIONS = {
  EN: ["I am loved", "Truth is love", "Life is radiant", "Equality is nature", "Unconditional love always"],
  DE: ["Ich werde geliebt heute", "Wahrheit ist Liebe pur", "Das Leben strahlt hell", "Gleichheit ist unsere Natur", "Bedingungslose Liebe immerzu hier"]
};

const TOOLTIPS = {
  en: { 
    cocreation: "Co-Creation", supporter: "Supporter", profile: "My Profile", logout: "Step away", mesh: "Offline Mode: Mesh Active"
  },
  de: { 
    cocreation: "Ko-Kreation", supporter: "Unterstützer", profile: "Mein Profil", logout: "Abmelden", mesh: "Offline-Modus: Mesh aktiv"
  }
};

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const [mounted, setMounted] = useState(false);
  const [affirmation, setAffirmation] = useState("");
  const [lang, setLang] = useState<'en' | 'de'>('en');
  
  const [simHeartRate, setSimHeartRate] = useState(75);
  const [activeSubstances, setActiveSubstances] = useState<string[]>([]);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  const [labOpen, setLabOpen] = useState(false);
  const [supporterOpen, setSupporterOpen] = useState(false);
  const [coCreationOpen, setCoCreationOpen] = useState(false);
  const [syncOpen, setSyncOpen] = useState(false);
  const [loveLetterOpen, setLoveLetterOpen] = useState(false);
  const [losingControlOpen, setLosingControlOpen] = useState(false);
  const [showSOS, setShowSOS] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    const currentLang = ['en', 'de'].includes(savedLang) ? savedLang : 'en';
    setLang(currentLang);

    const pool = AFFIRMATIONS[currentLang.toUpperCase() as keyof typeof AFFIRMATIONS];
    setAffirmation(pool[Math.floor(Math.random() * pool.length)]);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.replace("/auth");
    });

    if (searchParams.get('sync') === 'true') {
      setSyncOpen(true);
    }

    return () => unsubscribe();
  }, [auth, router, searchParams]);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);
  
  const { data: firestoreProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

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
  const isCaution = !isLocked && (simHeartRate > cautionThreshold || (typeof activeSubstances === 'object' && activeSubstances.length >= 3));
  const guardianStatus: 'safe' | 'caution' | 'locked' = isLocked ? 'locked' : (isCaution ? 'caution' : 'safe');

  const handlePortalClick = (action: () => void) => {
    playHeartbeat();
    action();
  };

  if (!mounted || isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-8">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full" />
          <Heart 
            size={64} 
            fill="#1b4d3e" 
            className="relative z-10 animate-pulse-heart text-[#1b4d3e]" 
            style={{ filter: 'blur(12px) drop-shadow(0 0 10px #1b4d3e)' }} 
          />
        </div>
        <Loader2 className="animate-spin text-primary/20" />
      </div>
    );
  }

  const displayName = firestoreProfile?.name || "VALUED SOUL";
  const t = TOOLTIPS[lang] || TOOLTIPS.en;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col h-screen overflow-hidden font-headline">
      <div className="px-6 py-6 bg-black/40 backdrop-blur-xl border-b border-white/5 z-50 shrink-0 pt-safe">
        <header className="flex justify-between items-center max-w-4xl mx-auto w-full gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3 truncate">
              <span className="truncate">{lang === 'de' ? `STRAHLE, ${displayName}` : `SHINE, ${displayName}`}</span>
              <SkyIcon />
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center gap-1.5 animate-in fade-in duration-1000">
                <Radio size={8} className="text-blue-400 animate-pulse" />
                <span className="text-[7px] font-black uppercase tracking-widest text-blue-400/80">{t.mesh}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link 
              href="/profile" 
              onClick={() => playHeartbeat()}
              className="p-3 bg-white/5 rounded-full border border-white/10 hover:border-primary transition-all active:scale-95"
            >
              <User size={20} className="text-white/40" />
            </Link>
          </div>
        </header>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-12 pb-40 touch-pan-y">
          
          <div className="space-y-3">
            <GuardianStatusBar status={guardianStatus} heartRate={simHeartRate} lang={lang} />
            <PulseGuardianBanner lang={lang} variant="banner" />
          </div>

          <div className="space-y-4 text-center">
            <Link 
              href="/heart-status" 
              onClick={() => playHeartbeat()}
              className="block transition-all active:scale-95"
            >
              <div className="flex flex-col items-center gap-4">
                <HeartStatusAura 
                  heartRate={simHeartRate} 
                  activeSubstances={activeSubstances} 
                  lang={lang} 
                />
                <p className="text-xs font-bold uppercase tracking-widest text-primary px-10 italic">"{affirmation}"</p>
              </div>
            </Link>
          </div>

          <div className="space-y-8">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 text-center">
              Sanctuary Tools
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-2xl mx-auto px-4">
              <Link 
                href="/map" 
                onClick={() => playHeartbeat()}
                className="aspect-square rounded-full bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-4 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all shadow-2xl active:scale-95 group text-center p-6"
              >
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                  <RadiatingThirdEye size={32} color="#3b82f6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black uppercase tracking-tight leading-none">{lang === 'de' ? 'Der Puls' : 'The Pulse'}</p>
                  <p className="text-[7px] font-bold text-white/30 uppercase tracking-widest leading-none">Mesh Radar</p>
                </div>
              </Link>

              <button 
                onClick={() => handlePortalClick(() => setLabOpen(true))} 
                className="aspect-square rounded-full bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-4 hover:border-primary/30 hover:bg-primary/5 transition-all shadow-2xl active:scale-95 group text-center p-6"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                  <Microscope size={32} className="text-white" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black uppercase tracking-tight leading-none">{lang === 'de' ? 'Sitzungs-Labor' : 'Pulse Lab'}</p>
                  <p className="text-[7px] font-bold text-white/30 uppercase tracking-widest leading-none">Intake</p>
                </div>
              </button>

              <button 
                onClick={() => handlePortalClick(() => setSyncOpen(true))} 
                className="aspect-square rounded-full bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-4 hover:border-accent/30 hover:bg-accent/5 transition-all shadow-2xl active:scale-95 group text-center p-6"
              >
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center border border-accent/20 group-hover:scale-110 transition-transform">
                  <Watch size={28} className="text-accent" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black uppercase tracking-tight leading-none">{lang === 'de' ? 'Vital-Sync' : 'Pulse Sync'}</p>
                  <p className="text-[7px] font-bold text-white/30 uppercase tracking-widest leading-none">Mesh Sync</p>
                </div>
              </button>

              <button 
                onClick={() => handlePortalClick(() => setLoveLetterOpen(true))} 
                className="aspect-square rounded-full bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-4 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all shadow-2xl active:scale-95 group text-center p-6"
              >
                <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
                  <PenLine size={28} className="text-purple-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black uppercase tracking-tight text-white leading-none">{lang === 'de' ? 'Liebesbriefe' : 'Love Letters'}</p>
                  <p className="text-[7px] font-bold text-white/30 uppercase tracking-widest leading-none">Future Self</p>
                </div>
              </button>

              <button 
                onClick={() => handlePortalClick(() => setSupporterOpen(true))}
                className="aspect-square rounded-full bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-4 hover:border-primary/30 hover:bg-primary/5 transition-all shadow-2xl active:scale-95 group text-center p-6"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                  <SupporterIcon size={28} className="text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black uppercase tracking-tight text-white leading-none">{lang === 'de' ? 'Unterstützer' : 'Supporter'}</p>
                  <p className="text-[7px] font-bold text-white/30 uppercase tracking-widest leading-none">AI Portal</p>
                </div>
              </button>

              <button 
                onClick={() => handlePortalClick(() => setLosingControlOpen(true))}
                className="aspect-square rounded-full bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-4 hover:border-primary/30 hover:bg-primary/5 transition-all shadow-2xl active:scale-95 group text-center p-6"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                  <Eye size={32} className="text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black uppercase tracking-tight text-white leading-none">{lang === 'de' ? 'Kontrolle verlieren' : 'Losing Control'}</p>
                  <p className="text-[7px] font-bold text-white/30 uppercase tracking-widest leading-none">Presence</p>
                </div>
              </button>

              <button 
                onClick={() => handlePortalClick(() => setShowSOS(true))}
                className="aspect-square rounded-full bg-red-600/10 border border-red-600/20 flex flex-col items-center justify-center gap-4 hover:bg-red-600 transition-all shadow-2xl active:scale-95 group text-center p-6 col-span-2 md:col-span-1 md:mx-auto"
              >
                <div className="w-14 h-14 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Shield size={28} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black uppercase tracking-tight text-white leading-none group-hover:text-white transition-colors">{lang === 'de' ? 'Sofort-Hilfe' : 'Immediate Help'}</p>
                  <p className="text-[7px] font-bold text-white/30 uppercase tracking-widest leading-none group-hover:text-white/60 transition-colors">Mesh SOS</p>
                </div>
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Link 
              href="/self-care"
              onClick={() => playHeartbeat()}
              className="flex items-center gap-3 px-6 py-4 bg-blue-600/10 rounded-full border border-blue-500/20 hover:border-blue-500 transition-all active:scale-95"
            >
              <Wind size={18} className="text-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'de' ? 'Atem der Liebe' : 'Breath of Love'}</span>
            </Link>
            <button 
              onClick={() => handlePortalClick(() => setCoCreationOpen(true))} 
              className="flex items-center gap-3 px-6 py-4 bg-primary/10 rounded-full border border-primary/20 hover:border-primary transition-all active:scale-95"
            >
              <Sprout size={18} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest">Co-Creation</span>
            </button>
          </div>

          <div className="pt-12">
            <Collapsible open={isSimulatorOpen} onOpenChange={setIsSimulatorOpen}>
              <CollapsibleTrigger asChild>
                <button 
                  onClick={() => playHeartbeat()}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-4 text-[9px] font-black uppercase transition-all duration-500",
                    guardianStatus === 'safe' && "text-primary opacity-40 hover:opacity-100",
                    guardianStatus === 'caution' && "text-[#F59E0B] opacity-80 hover:opacity-100",
                    guardianStatus === 'locked' && "text-[#DC2626] opacity-100 animate-pulse"
                  )}
                >
                  <Settings2 size={12} />
                  {lang === 'de' ? 'Labor-Kalibrierung' : 'Lab Calibration'}
                  <ChevronDown className={cn("transition-transform", isSimulatorOpen && "rotate-180")} size={12} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <GuardianSimulator 
                  heartRate={simHeartRate} 
                  setHeartRate={setSimHeartRate}
                  substanceCount={activeSubstances.length}
                  setSubstanceCount={(count) => {
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

      {showSOS && <SOSAlert onClose={() => setShowSOS(false)} onLosingControl={() => { setShowSOS(false); setLosingControlOpen(true); }} />}
      
      <Dialog open={labOpen} onOpenChange={setLabOpen}>
        <DialogContent className="bg-black border-white/10 max-w-2xl p-0 rounded-[2rem] overflow-hidden flex flex-col h-[95dvh] max-h-[95dvh] sm:h-[90dvh] top-[50%] -translate-y-[50%]">
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
              setLabOpen(false);
            }} 
            showDiary={true} 
            isLocked={isLocked} 
          />
        </DialogContent>
      </Dialog>

      <Dialog open={supporterOpen} onOpenChange={setSupporterOpen}>
        <DialogContent className="bg-black border-white/10 max-w-2xl p-0 rounded-[3rem] overflow-hidden flex flex-col h-[85dvh] max-h-[85dvh] top-[50%] -translate-y-[50%] shadow-[0_0_100px_rgba(0,0,0,0.9)]">
          <DialogTitle className="sr-only">AI Supporter Portal</DialogTitle>
          <SupporterPortal userProfile={firestoreProfile} />
        </DialogContent>
      </Dialog>

      <Dialog open={coCreationOpen} onOpenChange={setCoCreationOpen}>
        <DialogContent className="bg-black border-white/10 max-lg p-0 rounded-[2rem] overflow-hidden flex flex-col h-auto max-h-[85dvh] top-[50%] -translate-y-[50%]">
          <DialogTitle className="sr-only">Co-Creation</DialogTitle>
          <div className="flex-1 overflow-y-auto">
            <CoCreation onComplete={() => coCreationOpen && setCoCreationOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={syncOpen} onOpenChange={setSyncOpen}>
        <DialogContent className="bg-black border-white/10 max-md p-0 rounded-[3rem] overflow-hidden flex flex-col h-auto max-h-[85dvh] top-[50%] -translate-y-[50%]">
          <DialogTitle className="sr-only">Pulse Sync</DialogTitle>
          <div className="flex-1 overflow-y-auto">
            <WearablesSync onComplete={() => syncOpen && setSyncOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={loveLetterOpen} onOpenChange={setLoveLetterOpen}>
        <DialogContent className="bg-black border-white/10 max-w-2xl p-0 rounded-[2rem] overflow-hidden flex flex-col h-auto max-h-[85dvh] top-[50%] -translate-y-[50%]">
          <DialogTitle className="sr-only">Love Letter</DialogTitle>
          <div className="flex-1 overflow-y-auto">
            <LoveLetter onComplete={() => loveLetterOpen && setLoveLetterOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>

      {losingControlOpen && <LosingControl onClose={() => setLosingControlOpen(false)} />}
    </main>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-8">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full" />
          <Heart 
            size={64} 
            fill="#1b4d3e" 
            className="relative z-10 animate-pulse-heart text-[#1b4d3e]" 
            style={{ filter: 'blur(12px) drop-shadow(0 0 10px #1b4d3e)' }} 
          />
        </div>
        <Loader2 className="animate-spin text-primary/20" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
