
'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Heart, 
  User, 
  Loader2, 
  Bot, 
  Sprout, 
  Watch, 
  Shield, 
  Sun, 
  Moon, 
  Microscope,
  Settings2,
  ChevronDown,
  ArrowLeft,
  Radio,
  PenLine,
  Wind,
  AlertCircle
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
import { LoveLetter } from '@/components/dashboard/LoveLetter';
import { AssistantPortal } from '@/components/chat/AssistantPortal';
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
  }, []);

  return icon;
}

const AFFIRMATIONS = {
  EN: ["I am loved", "Truth is love", "Life is a radiant gift", "I cherish this breath", "Equality is my nature", "I love unconditionally. I accept without expectations. I am free and I give freedom."],
  DE: ["Ich bin geliebt", "Wahrheit ist liebe", "Das Leben ist ein strahlendes Geschenk", "Ich schätze diesen Atemzug", "Gleichheit ist meine Natur", "Ich liebe bedingungslos. Ich akzeptiere ohne Erwartungen. Ich bin frei und schenke Freiheit."],
  PT: ["Eu sou amado", "A verdade é amor", "A vida é um presente radiante", "Eu valorizo este sopro", "A igualdade é a minha natureza", "Eu amo incondicionalmente. Eu aceito sem expectativas. Eu sou livre e dou liberdade."],
  RU: ["Я любим", "Истина есть любовь", "Жизнь — это сияющий дар", "Я дорожу этим вдохом", "Равенство — моя природа", "Я люблю безусловно. Я принимаю без ожиданий. Я свободен и даю свободу."]
};

const TOOLTIPS = {
  en: { 
    vibe: "Mood Check-in", cocreation: "Co-Creation", assistant: "Assistant", profile: "My Profile", logout: "Step away", mesh: "Offline Mode: Mesh Active",
    meshCalibration: "Mesh Calibration Required", meshCalibrationSub: "Tap to set visibility"
  },
  de: { 
    vibe: "Stimmungs Check-in", cocreation: "Ko-Kreation", assistant: "KI-Begleiter", profile: "Mein Profil", logout: "Abmelden", mesh: "Offline-Modus: Mesh aktiv",
    meshCalibration: "Mesh-Kalibrierung nötig", meshCalibrationSub: "Sichtbarkeit festlegen"
  },
  pt: { 
    vibe: "Sincronia de Humor", cocreation: "Co-Criação", assistant: "Assistente IA", profile: "Meu Perfil", logout: "Sair", mesh: "Modo Offline: Mesh Ativo",
    meshCalibration: "Calibração de Mesh Necessária", meshCalibrationSub: "Definir visibilidade"
  },
  ru: { 
    vibe: "Настроение", cocreation: "Со-творение", assistant: "Забота", profile: "Мой Профиль", logout: "Выйти", mesh: "Оффлайн: Mesh Активен",
    meshCalibration: "Нужна калибровка Mesh", meshCalibrationSub: "Настроить видимость"
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
  const [lang, setLang] = useState<'en' | 'de' | 'pt' | 'ru'>('en');
  
  const [simHeartRate, setSimHeartRate] = useState(75);
  const [activeSubstances, setActiveSubstances] = useState<string[]>([]);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  const [labOpen, setLabOpen] = useState(false);
  const [aiBotOpen, setAiBotOpen] = useState(false);
  const [coCreationOpen, setCoCreationOpen] = useState(false);
  const [syncOpen, setSyncOpen] = useState(false);
  const [loveLetterOpen, setLoveLetterOpen] = useState(false);
  const [showSOS, setShowSOS] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    const currentLang = ['en', 'de', 'pt', 'ru'].includes(savedLang) ? savedLang : 'en';
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
  const isCaution = !isLocked && (simHeartRate > cautionThreshold || activeSubstances.length >= 3);
  const guardianStatus: 'safe' | 'caution' | 'locked' = isLocked ? 'locked' : (isCaution ? 'caution' : 'safe');

  const handlePortalClick = (action: () => void) => {
    playHeartbeat();
    action();
  };

  if (!mounted || isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-8">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 w-32 h-32 bg-white/10 blur-[60px] rounded-full" />
          <Heart size={64} fill="#10B981" stroke="#10B981" className="relative z-10 animate-pulse-heart" />
        </div>
        <Loader2 className="animate-spin text-[#10B981]/20" />
      </div>
    );
  }

  const displayName = firestoreProfile?.name || "VALUED SOUL";
  const t = TOOLTIPS[lang];
  const isMeshCalibrated = firestoreProfile?.guardActive !== undefined;

  const getLocalizedVibeLabel = (vibe: any) => {
    if (!vibe) return { en: "Steady", de: "Stabil", pt: "Estável", ru: "Спокойное" }[lang] || "Steady";
    const vibeMap: Record<string, Record<string, string>> = {
      radiant: { en: "Radiant", de: "Strahlend", pt: "Radiante", ru: "Сияющее" },
      harmony: { en: "Harmony", de: "In Harmonie", pt: "Em Harmonia", ru: "Гармоничное" },
      calm: { en: "Calm", de: "Beruhigt", pt: "Calmo", ru: "Спокойное" },
      hazy: { en: "Hazy", de: "Verschwommen", pt: "Nebuloso", ru: "Туманное" },
      overwhelmed: { en: "Held", de: "Überwältigt", pt: "Sobrecarregado", ru: "Бережное" }
    };
    return vibeMap[vibe.current]?.[lang] || vibe.currentLabel;
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col h-screen overflow-hidden font-headline">
      <div className="px-6 py-6 bg-black/40 backdrop-blur-xl border-b border-white/5 z-50 shrink-0">
        <header className="flex justify-between items-center max-w-4xl mx-auto w-full gap-4">
          <div className="flex-1 min-w-0">
            <h1 className={cn("text-2xl font-black uppercase tracking-tighter flex items-center gap-3 truncate", lang === 'ru' && "italic font-serif")}>
              <span className="truncate">{lang === 'ru' ? `СИЯЙ, ${displayName}` : lang === 'pt' ? `BRILHE, ${displayName}` : lang === 'de' ? `STRAHLE, ${displayName}` : `SHINE, ${displayName}`}</span>
              <SkyIcon />
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center gap-1.5 animate-in fade-in duration-1000">
                <Radio size={8} className="text-blue-400 animate-pulse" />
                <span className={cn("text-[7px] font-black uppercase tracking-widest text-blue-400/80", lang === 'ru' && "italic font-serif")}>{t.mesh}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <VibeMirror vibe={firestoreProfile?.vibe} />
            <Link 
              href="/profile" 
              onClick={() => playHeartbeat()}
              className="p-3 bg-white/5 rounded-full border border-white/10 hover:border-[#10B981] transition-all active:scale-95"
            >
              <User size={20} className="text-white/40" />
            </Link>
          </div>
        </header>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-12 pb-40 touch-pan-y">
          
          <div className="space-y-3">
            {!isMeshCalibrated && (
              <button 
                onClick={() => router.push('/map')}
                className="w-full bg-blue-600/10 border-2 border-dashed border-blue-500/30 rounded-2xl p-4 flex items-center gap-4 group hover:bg-blue-600/20 transition-all animate-pulse"
              >
                <AlertCircle className="text-blue-400 shrink-0" size={24} />
                <div className="text-left">
                  <p className={cn("text-[10px] font-black uppercase tracking-widest text-blue-400", lang === 'ru' && "italic font-serif")}>{t.meshCalibration}</p>
                  <p className={cn("text-[8px] font-bold text-white/40 uppercase tracking-widest", lang === 'ru' && "italic font-serif")}>{t.meshCalibrationSub}</p>
                </div>
              </button>
            )}
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
                  mood={getLocalizedVibeLabel(firestoreProfile?.vibe)}
                  lang={lang} 
                />
                <p className={cn(
                  "text-xs font-bold uppercase tracking-widest text-[#10B981] px-10",
                  lang === 'ru' ? "italic font-serif" : "italic"
                )}>"{affirmation}"</p>
              </div>
            </Link>
          </div>

          <div className="w-full flex flex-col items-center gap-6">
            <h2 className={cn("text-[10px] font-black uppercase tracking-[0.4em] text-white/20", lang === 'ru' && "italic font-serif")}>
              {lang === 'ru' ? 'Коллективный Резонанс' : lang === 'pt' ? 'Ressonância Coletiva' : lang === 'de' ? 'Gemeinsame Resonanz' : 'Collective Resonance'}
            </h2>
            <LoveCircle lang={lang} variant="dashboard" />
          </div>

          <div className="space-y-8">
            <h2 className={cn("text-[10px] font-black uppercase tracking-[0.4em] text-white/20 text-center", lang === 'ru' && "italic font-serif")}>
              Sanctuary Tools
            </h2>
            <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Link 
                href="/map" 
                onClick={() => playHeartbeat()}
                className="aspect-square rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-4 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all shadow-2xl active:scale-95 group text-center p-6"
              >
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                  <RadiatingThirdEye size={36} color="#3b82f6" />
                </div>
                <div className="space-y-1">
                  <p className={cn("text-lg font-black uppercase tracking-tight leading-none", lang === 'ru' && "italic font-serif")}>{lang === 'ru' ? 'Пульс' : lang === 'pt' ? 'O Pulso' : lang === 'de' ? 'Der Puls' : 'The Pulse'}</p>
                  <p className={cn("text-[8px] font-bold text-white/30 uppercase tracking-widest leading-none", lang === 'ru' && "italic font-serif")}>Mesh Radar</p>
                </div>
              </Link>

              <button 
                onClick={() => handlePortalClick(() => setLabOpen(true))} 
                className="aspect-square rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-4 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all shadow-2xl active:scale-95 group text-center p-6"
              >
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <Microscope size={36} className="text-white" />
                </div>
                <div className="space-y-1">
                  <p className={cn("text-lg font-black uppercase tracking-tight leading-none", lang === 'ru' && "italic font-serif")}>{lang === 'ru' ? 'Лаборатория' : lang === 'pt' ? 'Pulse Lab' : lang === 'de' ? 'Sitzungs-Labor' : 'Pulse Lab'}</p>
                  <p className={cn("text-[8px] font-bold text-white/30 uppercase tracking-widest leading-none", lang === 'ru' && "italic font-serif")}>Intake</p>
                </div>
              </button>

              <button 
                onClick={() => handlePortalClick(() => setSyncOpen(true))} 
                className="aspect-square rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-4 hover:border-[#EBFB3B]/30 hover:bg-[#EBFB3B]/5 transition-all shadow-2xl active:scale-95 group text-center p-6"
              >
                <div className="w-16 h-16 bg-[#EBFB3B]/10 rounded-2xl flex items-center justify-center border border-[#EBFB3B]/20 group-hover:scale-110 transition-transform">
                  <Watch size={32} className="text-[#EBFB3B]" />
                </div>
                <div className="space-y-1">
                  <p className={cn("text-lg font-black uppercase tracking-tight leading-none", lang === 'ru' && "italic font-serif")}>{lang === 'ru' ? 'Синхронизация' : lang === 'pt' ? 'Pulse Sync' : lang === 'de' ? 'Vital-Sync' : 'Pulse Sync'}</p>
                  <p className={cn("text-[8px] font-bold text-white/30 uppercase tracking-widest leading-none", lang === 'ru' && "italic font-serif")}>Mesh Sync</p>
                </div>
              </button>

              <button 
                onClick={() => handlePortalClick(() => setLoveLetterOpen(true))} 
                className="aspect-square rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-4 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all shadow-2xl active:scale-95 group text-center p-6"
              >
                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
                  <PenLine size={32} className="text-purple-400" />
                </div>
                <div className="space-y-1">
                  <p className={cn("text-lg font-black uppercase tracking-tight leading-none", lang === 'ru' && "italic font-serif")}>{lang === 'ru' ? 'Письма Любви' : lang === 'pt' ? 'Cartas de Amor' : lang === 'de' ? 'Liebesbriefe' : 'Love Letters'}</p>
                  <p className={cn("text-[8px] font-bold text-white/30 uppercase tracking-widest leading-none", lang === 'ru' && "italic font-serif")}>Future Self</p>
                </div>
              </button>

              <button 
                onClick={() => handlePortalClick(() => setAiBotOpen(true))}
                className="aspect-square rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-4 hover:border-[#10B981]/30 hover:bg-[#10B981]/5 transition-all shadow-2xl active:scale-95 group text-center p-6"
              >
                <div className="w-16 h-16 bg-[#10B981]/10 rounded-2xl flex items-center justify-center border border-[#10B981]/20 group-hover:scale-110 transition-transform">
                  <Bot size={32} className="text-[#10B981]" />
                </div>
                <div className="space-y-1">
                  <p className={cn("text-lg font-black uppercase tracking-tight leading-none", lang === 'ru' && "italic font-serif")}>{lang === 'ru' ? 'Забота' : lang === 'pt' ? 'Assistente' : lang === 'de' ? 'KI-Begleiter' : 'Assistant'}</p>
                  <p className={cn("text-[8px] font-bold text-white/30 uppercase tracking-widest leading-none", lang === 'ru' && "italic font-serif")}>AI Portal</p>
                </div>
              </button>

              <button 
                onClick={() => handlePortalClick(() => setShowSOS(true))}
                className="aspect-square rounded-[2.5rem] bg-red-600/10 border border-red-600/20 flex flex-col items-center justify-center gap-4 hover:bg-red-600 transition-all shadow-2xl active:scale-95 group text-center p-6"
              >
                <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Shield size={32} />
                </div>
                <div className="space-y-1">
                  <p className={cn("text-lg font-black uppercase tracking-tight leading-none group-hover:text-white transition-colors", lang === 'ru' && "italic font-serif")}>{lang === 'ru' ? 'Помощь' : lang === 'pt' ? 'Ajuda Imediata' : lang === 'de' ? 'Sofort-Hilfe' : 'Immediate Help'}</p>
                  <p className={cn("text-[8px] font-bold text-white/30 uppercase tracking-widest leading-none group-hover:text-white/60 transition-colors", lang === 'ru' && "italic font-serif")}>Mesh SOS</p>
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
              <span className={cn("text-[10px] font-black uppercase tracking-widest", lang === 'ru' && "italic font-serif")}>{lang === 'ru' ? 'Резонанс' : lang === 'pt' ? 'Ressonância' : lang === 'de' ? 'Resonanz' : 'Resonance'}</span>
            </Link>
            <button 
              onClick={() => handlePortalClick(() => setCoCreationOpen(true))} 
              className="flex items-center gap-3 px-6 py-4 bg-[#90EE90]/10 rounded-full border border-[#90EE90]/20 hover:border-[#90EE90] transition-all active:scale-95"
            >
              <Sprout size={18} className="text-[#90EE90]" />
              <span className={cn("text-[10px] font-black uppercase tracking-widest", lang === 'ru' && "italic font-serif")}>{t.cocreation}</span>
            </button>
          </div>

          <div className="pt-12">
            <Collapsible open={isSimulatorOpen} onOpenChange={setIsSimulatorOpen}>
              <CollapsibleTrigger asChild>
                <button 
                  onClick={() => playHeartbeat()}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-4 text-[9px] font-black uppercase transition-all duration-500",
                    guardianStatus === 'safe' && "text-[#10B981] opacity-40 hover:opacity-100",
                    guardianStatus === 'caution' && "text-[#F59E0B] opacity-80 hover:opacity-100",
                    guardianStatus === 'locked' && "text-[#DC2626] opacity-100 animate-pulse",
                    lang === 'ru' && "italic font-serif"
                  )}
                >
                  <Settings2 size={12} />
                  {lang === 'ru' ? 'Калибровка (Dev)' : lang === 'pt' ? 'Calibração (Dev)' : lang === 'de' ? 'Labor-Kalibrierung' : 'Lab Calibration'}
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

      {showSOS && <SOSAlert onClose={() => setShowSOS(false)} />}
      
      <Dialog open={labOpen} onOpenChange={setLabOpen}>
        <DialogContent className="bg-black border-white/10 max-w-2xl p-0 rounded-[3rem] overflow-hidden flex flex-col h-[95dvh] max-h-[95dvh] sm:h-[90dvh] top-[50%] -translate-y-[50%]">
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

      <Dialog open={aiBotOpen} onOpenChange={setAiBotOpen}>
        <DialogContent className="bg-black border-white/10 max-w-2xl p-0 rounded-[3rem] overflow-hidden flex flex-col h-[85dvh] max-h-[85dvh] top-[50%] -translate-y-[50%]">
          <DialogTitle className="sr-only">AI Care Portal</DialogTitle>
          <AssistantPortal userProfile={firestoreProfile} />
        </DialogContent>
      </Dialog>

      <Dialog open={coCreationOpen} onOpenChange={setCoCreationOpen}>
        <DialogContent className="bg-black border-white/10 max-lg p-0 rounded-[3rem] overflow-hidden flex flex-col h-auto max-h-[85dvh] top-[50%] -translate-y-[50%]">
          <DialogTitle className="sr-only">Co-Creation</DialogTitle>
          <div className="flex-1 overflow-y-auto">
            <CoCreation onComplete={() => setCoCreationOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={syncOpen} onOpenChange={setSyncOpen}>
        <DialogContent className="bg-black border-white/10 max-md p-0 rounded-[3rem] overflow-hidden flex flex-col h-auto max-h-[85dvh] top-[50%] -translate-y-[50%]">
          <DialogTitle className="sr-only">Pulse Sync</DialogTitle>
          <div className="flex-1 overflow-y-auto">
            <WearablesSync onComplete={() => setSyncOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={loveLetterOpen} onOpenChange={setLoveLetterOpen}>
        <DialogContent className="bg-black border-white/10 max-w-2xl p-0 rounded-[3rem] overflow-hidden flex flex-col h-auto max-h-[85dvh] top-[50%] -translate-y-[50%]">
          <DialogTitle className="sr-only">Love Letter</DialogTitle>
          <div className="flex-1 overflow-y-auto">
            <LoveLetter onComplete={() => setLoveLetterOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-8">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 w-32 h-32 bg-white/10 blur-[60px] rounded-full" />
          <Heart size={64} fill="#10B981" stroke="#10B981" className="relative z-10 animate-pulse-heart" />
        </div>
        <Loader2 className="animate-spin text-[#10B981]/20" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
