'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Heart, 
  User, 
  Loader2, 
  Microscope, 
  Watch, 
  Shield, 
  Sun, 
  Moon, 
  Settings2,
  ChevronDown,
  Radio,
  Users2,
  Globe,
  ArrowRight,
  MessageCircleHeart
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
import { WearablesSync } from '@/components/dashboard/WearablesSync';
import { AssistantPortal as SupporterPortal } from '@/components/chat/AssistantPortal';
import { VisionOfLove } from '@/components/dashboard/VisionOfLove';
import { SanctuaryGuide } from '@/components/dashboard/SanctuaryGuide';
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
        setIcon(<div className="relative group flex-shrink-0"><Sun className="w-5 h-5 md:w-7 md:h-7 text-yellow-400 fill-yellow-400" /><div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full opacity-30" /></div>);
      } else {
        setIcon(<div className="relative flex items-center justify-center flex-shrink-0"><div className="relative"><Moon className="w-4 h-4 md:w-6 md:h-6 text-slate-100 fill-slate-100/10 rotate-[-15deg]" /></div></div>);
      }
    }
  }, [icon]);
  return icon;
}

const AFFIRMATIONS = {
  EN: ["I respect myself", "I love myself", "I accept myself", "Worthy of love", "I am love", "I love everyone", "I forgive myself", "Life is love"],
  DE: ["Ich respektiere mich selbst", "Ich liebe mich selbst heute hier", "Ich akzeptiere mich selbst heute hier", "Ich verdiene Liebe heute hier", "Ich bin pure Liebe heute hier", "Ich liebe alle Menschen heute hier", "Ich vergebe mir selbst heute hier", "Leben ist Liebe heute hier"]
};

const CONTENT = {
  en: { 
    mesh: "Mesh Active",
    loveChat: "Love Chat",
    holders: "The Holders",
    holdersSub: "Private Bonds",
    spectators: "The Spectators",
    spectatorsSub: "Public Care",
    intervention: "Presence",
    supporterMain: "AI Supporter Portal",
    supporterSub: "Your Sentient Companion"
  },
  de: { 
    mesh: "Mesh aktiv heute hier",
    loveChat: "Love Chat heute hier",
    holders: "Die Holder heute hier",
    holdersSub: "Privater Kreis heute hier",
    spectators: "Die Spectator heute hier",
    spectatorsSub: "Gemeinsame Fürsorge heute hier",
    intervention: "Präsenz heute hier",
    supporterMain: "Unterstützer heute hier",
    supporterSub: "Dein empathischer Begleiter heute"
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
  const [guideOpen, setGuideOpen] = useState(false);
  
  const [simHeartRate, setSimHeartRate] = useState(75);
  const [activeSubstances, setActiveSubstances] = useState<string[]>([]);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  const [labOpen, setLabOpen] = useState(false);
  const [supporterOpen, setSupporterOpen] = useState(false);
  const [syncOpen, setSyncOpen] = useState(false);
  const [visionOfLoveOpen, setVisionOfLoveOpen] = useState(false);
  const [showSOS, setShowSOS] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    const currentLang = ['en', 'de'].includes(savedLang) ? savedLang : 'en';
    setLang(currentLang);
    const pool = AFFIRMATIONS[currentLang.toUpperCase() as keyof typeof AFFIRMATIONS];
    setAffirmation(pool[Math.floor(Math.random() * pool.length)]);
    const unsubscribe = onAuthStateChanged(auth, (user) => { if (!user) router.replace("/auth"); });
    return () => unsubscribe();
  }, [auth, router]);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);
  
  const { data: firestoreProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

  const safetyStatus = checkSafetyStatus({ heartRate: simHeartRate }, activeSubstances, firestoreProfile?.pulseBaseline?.restingBPM);
  const isLocked = safetyStatus.isLocked;
  const guardianStatus: 'safe' | 'caution' | 'locked' = isLocked ? 'locked' : (simHeartRate > 110 ? 'caution' : 'safe');

  if (!mounted || isUserLoading || isProfileLoading) {
    return (<div className="min-h-screen bg-black flex flex-col items-center justify-center gap-8"><Loader2 className="animate-spin text-primary/20" /></div>);
  }

  const t = CONTENT[lang] || CONTENT.en;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col h-screen overflow-hidden font-headline">
      <div className="px-6 py-6 bg-black/40 backdrop-blur-xl border-b border-white/5 z-50 shrink-0 pt-safe">
        <header className="flex justify-between items-center max-w-4xl mx-auto w-full gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3 truncate">
              <span className="truncate">{lang === 'de' ? `STRAHLE, ${firestoreProfile?.name || "SEELE"}` : `SHINE, ${firestoreProfile?.name || "SOUL"}`}</span>
              <SkyIcon />
            </h1>
          </div>
          <Link href="/profile" className="p-3 bg-white/5 rounded-full border border-white/10"><User size={20} className="text-white/40" /></Link>
        </header>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-12 pb-40 touch-pan-y">
          
          <SanctuaryGuide lang={lang} forceOpen={guideOpen} onDismiss={() => setGuideOpen(false)} />

          <div className="space-y-3">
            <GuardianStatusBar status={guardianStatus} heartRate={simHeartRate} lang={lang} />
            <PulseGuardianBanner lang={lang} variant="banner" onOpenGuide={() => setGuideOpen(true)} />
          </div>

          <div className="space-y-4 text-center relative flex flex-col items-center">
            <Link href="/heart-status">
              <HeartStatusAura heartRate={simHeartRate} activeSubstances={activeSubstances} lang={lang} />
            </Link>
            <p className="text-xs font-bold uppercase tracking-widest text-primary px-10 italic">"{affirmation}"</p>
          </div>

          {/* Main Second Tool: Supporter Portal */}
          <button 
            onClick={() => { playHeartbeat(); setSupporterOpen(true); }}
            className="w-full p-8 rounded-[2.5rem] bg-emerald-500/5 border-2 border-emerald-500/20 flex items-center justify-between group hover:bg-emerald-500/10 transition-all shadow-2xl"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-lg group-hover:scale-110 transition-transform">
                <SupporterIcon size={36} className="text-emerald-500" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white leading-none">{t.supporterMain}</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/60 mt-2">{t.supporterSub}</p>
              </div>
            </div>
            <ArrowRight size={24} className="text-emerald-500/40 group-hover:translate-x-2 transition-transform" />
          </button>

          {/* Love Chat Grouping */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 text-center">{t.loveChat}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={() => router.push('/heart-status?chat=holders')} className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center gap-5 hover:bg-white/5 hover:border-primary/30 transition-all group">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20"><Users2 size={28} className="text-primary" /></div>
                <div className="text-left"><p className="text-lg font-black uppercase tracking-tight text-white leading-none">{t.holders}</p><p className="text-[8px] font-bold text-primary uppercase tracking-widest mt-1">{t.holdersSub}</p></div>
              </button>
              <button onClick={() => router.push('/heart-status?chat=spectators')} className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center gap-5 hover:bg-white/5 hover:border-accent/30 transition-all group">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center border border-accent/20"><Globe size={28} className="text-accent" /></div>
                <div className="text-left"><p className="text-lg font-black uppercase tracking-tight text-white leading-none">{t.spectators}</p><p className="text-[8px] font-bold text-accent uppercase tracking-widest mt-1">{t.spectatorsSub}</p></div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Link href="/map" className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-2 hover:border-blue-500/30 transition-all">
              <RadiatingThirdEye size={24} color="#3b82f6" />
              <span className="text-[9px] font-black uppercase tracking-widest">Radar</span>
            </Link>
            <button onClick={() => setLabOpen(true)} className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-2 hover:border-primary/30 transition-all">
              <Microscope size={24} className="text-primary" />
              <span className="text-[9px] font-black uppercase tracking-widest">Lab</span>
            </button>
            <button onClick={() => setSyncOpen(true)} className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-2 hover:border-accent/30 transition-all">
              <Watch size={24} className="text-accent" />
              <span className="text-[9px] font-black uppercase tracking-widest">Sync</span>
            </button>
          </div>

          <div className="pt-12">
            <Collapsible open={isSimulatorOpen} onOpenChange={setIsSimulatorOpen}>
              <CollapsibleTrigger asChild>
                <button onClick={() => playHeartbeat()} className="w-full flex items-center justify-center gap-2 py-4 text-[9px] font-black uppercase text-white/20 hover:text-white transition-all">
                  <Settings2 size={12} /> LAB CALIBRATION <ChevronDown className={cn("transition-transform", isSimulatorOpen && "rotate-180")} size={12} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4"><GuardianSimulator heartRate={simHeartRate} setHeartRate={setSimHeartRate} substanceCount={activeSubstances.length} setSubstanceCount={(count) => setActiveSubstances(Array(count).fill('Substance'))} lang={lang} /></CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </ScrollArea>

      <Dialog open={labOpen} onOpenChange={setLabOpen}>
        <DialogContent className="bg-black border-white/10 max-w-2xl p-0 rounded-[2rem] overflow-hidden flex flex-col h-[95dvh] max-h-[95dvh] sm:h-[90dvh] top-[50%] -translate-y-[50%]">
          <DialogTitle className="sr-only">Pulse Lab</DialogTitle>
          <PulseLab userData={{ ...firestoreProfile, sessionStatus: { isLocked, lastHeartRate: simHeartRate } }} onComplete={(logs) => { setActiveSubstances(logs.map(l => l.name)); setLabOpen(false); }} showDiary={true} isLocked={isLocked} />
        </DialogContent>
      </Dialog>

      <Dialog open={supporterOpen} onOpenChange={setSupporterOpen}>
        <DialogContent className="bg-black border-white/10 max-w-2xl p-0 rounded-[3rem] overflow-hidden flex flex-col h-[85dvh] max-h-[85dvh] top-[50%] -translate-y-[50%]">
          <DialogTitle className="sr-only">Supporter Portal</DialogTitle>
          <SupporterPortal userProfile={firestoreProfile} />
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default function Dashboard() {
  return (<Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-primary/20" /></div>}><DashboardContent /></Suspense>);
}
