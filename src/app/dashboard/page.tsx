'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  User, 
  LogOut,
  Beaker,
  Loader2,
  ShieldAlert,
  Bot,
  Sprout,
  ArrowRight,
  Watch,
  Shield
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Step6SubstanceLab as PulseLab } from '@/components/onboarding/Step6SubstanceLab';
import { VibeMirror } from '@/components/dashboard/VibeMirror';
import { SOSAlert } from '@/components/dashboard/SOSAlert';
import { RadiatingThirdEye } from '@/components/ui/radiating-third-eye';
import GuardianStatusBar from '@/components/dashboard/GuardianStatusBar';
import PulseGuardianBanner from '@/components/dashboard/PulseGuardianBanner';
import GuardianSimulator from '@/components/dashboard/GuardianSimulator';
import HeartStatusAura from '@/components/dashboard/HeartStatusAura';
import LoveCircle from '@/components/dashboard/LoveCircle';
import { CoCreation } from '@/components/dashboard/CoCreation';
import { WearablesSync } from '@/components/dashboard/WearablesSync';
import { AssistantPortal } from '@/components/chat/AssistantPortal';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useDoc, useMemoFirebase, useAuth } from '@/firebase';
import { doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { checkSafetyStatus } from '@/lib/guardian';

/**
 * @fileOverview High-Fidelity Dashboard Sanctuary Hub.
 * Pulse Guardian aggregates data from all tools (Sync, Lab, Profile).
 */

const AFFIRMATIONS = {
  EN: [
    "I love, accept and respect myself unconditionally. 💚",
    "I am exactly where I need to be. I am safe. 🌿",
    "My presence is a gift to this circle. ✨",
    "I honor my boundaries and my heart's needs. 🌊",
    "I am worthy of care, rest, and joyful connection. 🌈"
  ],
  DE: [
    "Ich liebe, akzeptiere und respektiere mich bedingungslos. 💚",
    "Ich bin genau dort, wo ich sein muss. Ich bin sicher. 🌿",
    "Meine Anwesenheit ist ein Geschenk für diesen Kreis. ✨",
    "Ich achte meine Grenzen und die Bedürfnisse meines Herzens. 🌊",
    "Ich bin es wert, umsorgt zu werden, mich auszuruhen und Freude zu teilen. 🌈"
  ]
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
  
  // GLOBAL SIMULATION STATE
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

  // GUARDIAN LOGIC SYNC: Aggregating Vitals, Intake, and Profile
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
  const guardianStatus: 'safe' | 'caution' | 'locked' = isLocked ? 'locked' : isCaution ? 'caution' : 'safe';

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

  return (
    <main className="min-h-screen bg-black text-white flex flex-col h-screen overflow-hidden font-headline">
      {/* Header Sanctuary */}
      <div className="px-6 py-10 bg-black/40 backdrop-blur-xl border-b border-white/5 z-50 shrink-0">
        <header className="flex justify-between items-start max-w-4xl mx-auto w-full">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.4em]">
              Sanctuary Hub
            </p>
            <h1 className="text-3xl font-black uppercase tracking-tighter">
              {lang === 'en' ? `Hello, ${displayName} 🌿` : `Hallo, ${displayName} 🌿`}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <VibeMirror vibe={firestoreProfile?.vibe} />
            <button onClick={() => setCoCreationOpen(true)} className="p-2.5 bg-[#90EE90]/10 rounded-full border border-[#90EE90]/30 hover:border-[#90EE90] transition-colors">
              <Sprout className="w-5 h-5 text-[#90EE90]" />
            </button>
            <button onClick={() => setAiBotOpen(true)} className="p-2.5 bg-blue-600/10 rounded-full border border-blue-500/30 transition-colors">
              <Bot className="w-5 h-5 text-blue-400" />
            </button>
            
            {/* Pulse Guardian relocated to header action group */}
            <PulseGuardianBanner lang={lang} variant="icon" />

            <Link href="/profile" className="p-2.5 bg-white/5 rounded-full border border-white/10 hover:border-[#10B981] transition-all">
              <User className="w-5 h-5 text-white/40" />
            </Link>
            <button onClick={handleLogout} className="p-2.5 bg-red-600/10 rounded-full border border-red-500/30 transition-colors">
              <LogOut className="w-5 h-5 text-red-500" />
            </button>
          </div>
        </header>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-8 pb-32">
          
          <div className="space-y-3">
            <GuardianStatusBar 
              status={guardianStatus} 
              heartRate={simHeartRate} 
              lang={lang} 
            />
          </div>

          <div className="space-y-4 text-center">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 px-2">
              {lang === 'en' ? 'My Heart' : 'Mein Herz'}
            </h2>
            <Link href="/heart-status" className="block active:scale-[0.98] transition-all">
              <div className="flex flex-col items-center gap-4">
                <HeartStatusAura 
                  heartRate={simHeartRate} 
                  activeSubstances={activeSubstances} 
                  mood={firestoreProfile?.vibe?.currentLabel || (lang === 'en' ? "Steady" : "Stabil")}
                  lang={lang} 
                />
                <span className="text-[9px] uppercase tracking-widest text-slate-600 font-bold">
                  Demo Mode · Simulated Data
                </span>
              </div>
            </Link>
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

          <LoveCircle lang={lang} />

          <div className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 px-2">
              {lang === 'en' ? 'Essential Tools' : 'Wichtige Tools'}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/map" className="group bg-white/5 rounded-[2.5rem] border border-white/10 p-6 flex flex-col items-start gap-4 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all shadow-xl">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                  <RadiatingThirdEye size={32} color="#3b82f6" />
                </div>
                <div>
                  <p className="text-xl font-black uppercase tracking-tight">{lang === 'en' ? 'The Pulse' : 'The Pulse'}</p>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">{lang === 'en' ? 'Live Map' : 'Live Karte'}</p>
                </div>
              </Link>

              <button 
                onClick={() => setLabOpen(true)} 
                className="group bg-white/5 rounded-[2.5rem] border border-white/10 p-6 flex flex-col items-start gap-4 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all text-left shadow-xl"
              >
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                  <Beaker size={28} className="text-[#10B981]" />
                </div>
                <div>
                  <p className="text-xl font-black uppercase tracking-tight">{lang === 'en' ? 'Pulse Lab' : 'Pulse Lab'}</p>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">{lang === 'en' ? 'Dose Analysis' : 'Dosis-Check'}</p>
                </div>
              </button>

              <button 
                onClick={() => setSyncOpen(true)} 
                className="group bg-white/5 rounded-[2.5rem] border border-white/10 p-6 flex flex-col items-start gap-4 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all text-left shadow-xl"
              >
                <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20">
                  <Watch size={28} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-xl font-black uppercase tracking-tight">{lang === 'en' ? 'Pulse Sync' : 'Pulse Sync'}</p>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">{lang === 'en' ? 'Calibration' : 'Kalibrierung'}</p>
                </div>
              </button>

              <button 
                onClick={() => setShowSOS(true)}
                className="group bg-red-600/10 rounded-[2.5rem] border border-red-600/20 p-6 flex flex-col items-start gap-4 hover:bg-red-600 transition-all text-left shadow-xl active:scale-[0.98]"
              >
                <div className="w-14 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Shield size={28} />
                </div>
                <div>
                  <p className="text-xl font-black uppercase tracking-tight group-hover:text-white transition-colors">{lang === 'en' ? 'Immediate Help' : 'Sofort-Hilfe'}</p>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1 group-hover:text-white/60 transition-colors">{lang === 'en' ? 'Instant SOS' : 'Sofort SOS'}</p>
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
          <AssistantPortal userProfile={firestoreProfile} onClose={() => setAiBotOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={coCreationOpen} onOpenChange={setCoCreationOpen}>
        <DialogContent className="bg-black border-white/10 max-w-lg p-0 rounded-[3rem] overflow-hidden">
          <DialogTitle className="sr-only">Co-Creation</DialogTitle>
          <CoCreation onComplete={() => setCoCreationOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={syncOpen} onOpenChange={setSyncOpen}>
        <DialogContent className="bg-black border-white/10 max-w-md p-0 rounded-[3rem] overflow-hidden">
          <DialogTitle className="sr-only">Pulse Sync</DialogTitle>
          <WearablesSync onComplete={() => setSyncOpen(false)} />
        </DialogContent>
      </Dialog>
    </main>
  );
}
