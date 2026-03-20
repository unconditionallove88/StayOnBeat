
'use client';

import { useState, useEffect } from 'react';
import { 
  Loader2, 
  Search, 
  Sparkles, 
  ArrowRight, 
  Trash2,
  Calendar,
  ArrowLeft,
  Microscope,
  Wine, 
  Leaf, 
  Sparkle, 
  FlaskConical, 
  Heart, 
  Droplets, 
  Zap, 
  Eye, 
  Orbit, 
  Pill, 
  Diamond,
  Wind,
  CheckCircle2,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { AiSafetyChat } from '@/components/chat/AiSafetyChat';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import CareShield from '@/components/dashboard/CareShield';
import GuardianStatusBar from '@/components/dashboard/GuardianStatusBar';
import PulseGuardianBanner from '@/components/dashboard/PulseGuardianBanner';
import { SOSAlert } from '@/components/dashboard/SOSAlert';
import PoppersCard from '@/components/lab/cards/PoppersCard';

/**
 * @fileOverview Pulse Lab component.
 * Calibrated for high-fidelity scrolling and real-time safety monitoring.
 * Features persistent Safety Advisor access connected to intake context.
 * Enhanced for mobile Safari scrolling with aesthetic icons and Viagra support.
 */

const MushroomIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 21v-6" />
    <path d="M5 15c0-4 3-7 7-7s7 3 7 7" />
    <path d="M12 8c-2.5 0-4.5 2-4.5 4.5" />
  </svg>
);

const SUBSTANCES = [
  { id: 'alcohol', icon: Wine, name: 'Alcohol', color: 'text-amber-500', bg: 'bg-amber-500/10', unit: 'Items', subTypes: ['Beer', 'Wine', 'Shot', 'Mixer'], inputType: 'cart' },
  { id: 'cannabis', icon: Leaf, name: 'Cannabis', color: 'text-emerald-500', bg: 'bg-emerald-500/10', unit: 'g', inputType: 'manual' },
  { id: 'mdma', icon: Sparkle, name: 'MDMA', color: 'text-purple-400', bg: 'bg-purple-500/10', unit: 'g', inputType: 'manual' },
  { id: 'cocaine', icon: Diamond, name: 'Cocaine', color: 'text-slate-200', bg: 'bg-slate-200/10', unit: 'g', inputType: 'manual' },
  { id: 'ketamine', icon: FlaskConical, name: 'Ketamine', color: 'text-indigo-400', bg: 'bg-indigo-400/10', unit: 'g', inputType: 'manual' },
  { id: 'ecstasy', icon: Heart, name: 'Ecstasy', color: 'text-pink-500', bg: 'bg-pink-500/10', unit: 'pills', inputType: 'manual' },
  { id: 'ghb', icon: Droplets, name: 'GHB/GBL', color: 'text-blue-400', bg: 'bg-blue-400/10', unit: 'ml', inputType: 'manual' },
  { id: 'speed', icon: Zap, name: 'Speed', color: 'text-yellow-400', bg: 'bg-yellow-400/10', unit: 'g', inputType: 'manual' },
  { id: 'lsd', icon: Eye, name: 'LSD', color: 'text-cyan-400', bg: 'bg-cyan-400/10', unit: 'ug', inputType: 'manual' },
  { id: '2cb', icon: Orbit, name: '2C-B', color: 'text-orange-400', bg: 'bg-orange-400/10', unit: 'mg', inputType: 'manual' },
  { id: 'psilocybin', icon: MushroomIcon, name: 'Psilocybin', color: 'text-emerald-400', bg: 'bg-emerald-400/10', unit: 'g', inputType: 'manual' },
  { id: 'poppers', icon: Wind, name: 'Poppers', color: 'text-amber-400', bg: 'bg-amber-400/10', unit: 'hits', inputType: 'manual' },
  { id: 'viagra', icon: Pill, name: 'Viagra', color: 'text-blue-500', bg: 'bg-blue-500/10', unit: 'pills', inputType: 'manual' },
  { id: '2mmc', icon: Diamond, name: '2-MMC', color: 'text-sky-300', bg: 'bg-sky-300/10', unit: 'g', inputType: 'manual' },
  { id: '3mmc', icon: Diamond, name: '3-MMC', color: 'text-sky-400', bg: 'bg-sky-400/10', unit: 'g', inputType: 'manual' },
  { id: '4mmc', icon: Diamond, name: '4-MMC', color: 'text-sky-500', bg: 'bg-sky-500/10', unit: 'g', inputType: 'manual' },
];

export function Step6SubstanceLab({ 
  userData, 
  onComplete,
  onBack,
  showDiary = false,
  isLocked = false 
}: { 
  userData: any, 
  onComplete: (subs: any[]) => void,
  onBack?: () => void,
  showDiary?: boolean,
  isLocked?: boolean
}) {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [sessionLogs, setSessionLogs] = useState<any[]>([]);
  const [activeSubstance, setActiveSubstance] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [manualValue, setManualValue] = useState('');
  const [alcoholCart, setAlcoholCart] = useState<{type: string, count: number}[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [showSOS, setShowSOS] = useState(false);
  const [lang, setLang] = useState<'en' | 'de'>('en');

  useEffect(() => {
    setMounted(true);
    const savedLogs = JSON.parse(localStorage.getItem('stayonbeat_logs') || '[]');
    setSessionLogs(savedLogs);
    const savedLang = localStorage.getItem('stayonbeat_lang');
    if (savedLang === 'DE') setLang('de');
  }, []);

  const handleSelectSubstance = (substance: any) => {
    const currentHR = userData?.sessionStatus?.lastHeartRate || 75;
    
    if (substance.id === "poppers" && currentHR > 100) {
      toast({
        variant: "destructive",
        title: "Pulse Guardian: Caution 🧪",
        description: `Your heart rate is ${currentHR} BPM. Poppers will drop your blood pressure sharply. Please sit down and breathe before use.`,
      });
    }
    
    setActiveSubstance(substance);
    if (substance.id === 'alcohol') setAlcoholCart(substance.subTypes!.map((t: string) => ({ type: t, count: 0 })));
  };

  const saveLog = () => {
    if (isLocked) return;

    let entry: any;
    if (activeSubstance.id === 'alcohol') {
      const activeItems = alcoholCart.filter(c => c.count > 0);
      if (activeItems.length === 0) return;
      entry = {
        id: 'alcohol',
        name: 'Alcohol',
        items: activeItems,
        timestamp: new Date().toISOString(),
      };
    } else {
      if (!manualValue || parseFloat(manualValue) === 0) return;
      entry = {
        id: activeSubstance.id,
        name: activeSubstance.name,
        value: manualValue,
        unit: activeSubstance.unit,
        timestamp: new Date().toISOString(),
      };
    }

    const updated = [...sessionLogs, entry];
    setSessionLogs(updated);
    localStorage.setItem('stayonbeat_logs', JSON.stringify(updated));
    setActiveSubstance(null);
    setManualValue('');
    setAlcoholCart([]);
    toast({ title: "Dose logged", description: `${activeSubstance.name} added to your session diary.` });
  };

  const removeLog = (index: number) => {
    const updated = sessionLogs.filter((_, i) => i !== index);
    setSessionLogs(updated);
    localStorage.setItem('stayonbeat_logs', JSON.stringify(updated));
  };

  const filtered = SUBSTANCES.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const isSubstanceActive = (id: string) => sessionLogs.some(log => log.id === id);
  const intakeContext = sessionLogs.map(l => l.name).join(', ');

  if (!mounted) return null;

  const lastHR = userData?.sessionStatus?.lastHeartRate || 0;
  const guardianStatus: 'safe' | 'caution' | 'locked' = isLocked ? 'locked' : (lastHR > 110 ? 'caution' : 'safe');

  const showPoppersCard = 
    searchTerm.toLowerCase().includes('poppers') || 
    activeSubstance?.id === 'poppers' || 
    isSubstanceActive('poppers');

  if (isLocked) {
    return (
      <div className="flex flex-col h-full bg-black font-body max-w-2xl mx-auto p-6 relative overflow-hidden overflow-y-auto">
        <GuardianStatusBar status="locked" heartRate={lastHR > 0 ? lastHR : 128} lang={lang} />
        <CareShield 
          reason={userData?.sessionStatus?.lockReason || 'manual'}
          unlockAt={userData?.sessionStatus?.unlockAt ? new Date(userData.sessionStatus.unlockAt).getTime() : Date.now() + 4 * 60 * 60 * 1000}
          lang={lang}
          onNeedSupport={() => setShowSOS(true)}
        />
        {showSOS && <SOSAlert onClose={() => setShowSOS(false)} />}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black font-headline max-w-2xl mx-auto relative overflow-hidden">
      {/* Fixed Header */}
      <header className="px-6 pt-12 pb-4 space-y-4 flex flex-col shrink-0 bg-black/95 backdrop-blur-md z-[60] border-b border-white/5 shadow-2xl">
        {onBack && (
          <button onClick={onBack} className="absolute top-4 left-4 text-white/40 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-50">
            <ArrowLeft className="w-4 h-4" /> BACK
          </button>
        )}
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 flex items-center justify-center border border-[#10B981]/20">
              <Microscope size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">Pulse Lab</h1>
          </div>
          
          <div className="space-y-3">
            <PulseGuardianBanner lang={lang} />
            <GuardianStatusBar status={guardianStatus} heartRate={lastHR > 0 ? lastHR : 98} lang={lang} />
            
            <button 
              onClick={() => setChatOpen(true)}
              className="w-full bg-blue-600/10 border border-blue-500/30 rounded-2xl py-3 px-4 flex items-center justify-between group hover:bg-blue-600/20 transition-all text-left shadow-lg"
            >
              <div className="flex items-center gap-3">
                <Sparkles size={16} className="text-blue-400 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">Open Safety Advisor</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-bold text-blue-500/60 uppercase tracking-widest">Contextual check</span>
                <ArrowRight size={12} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>

        <div className="relative w-full pt-2">
          <Search className="absolute left-6 top-[calc(50%+4px)] -translate-y-1/2 w-4 h-4 text-white/20" />
          <input 
            placeholder="Search substances..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 h-16 pl-14 rounded-3xl focus:border-[#3EB489] text-base outline-none transition-all shadow-inner"
          />
        </div>
      </header>

      {/* Main Content Viewport - momentum scrolling */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pt-6 pb-40 space-y-8 touch-pan-y relative z-10">
        
        {/* Session Diary - High visibility at top of scroll */}
        {showDiary && sessionLogs.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.3em] flex items-center gap-3">
                <Calendar className="w-3 h-3" /> Session Diary
              </h3>
              <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">{sessionLogs.length} Records</span>
            </div>
            <div className="grid gap-3">
              {sessionLogs.slice().reverse().map((log, i) => {
                const substance = SUBSTANCES.find(s => s.id === log.id);
                const Icon = substance?.icon || FlaskConical;
                return (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between shadow-lg group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                        <Icon size={20} className="text-[#3EB489]" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-black uppercase text-white">{log.name}</span>
                        <span className="text-[10px] font-bold text-[#3EB489]">
                          {log.id === 'alcohol' ? log.items.map((it: any) => `${it.count}x ${it.type}`).join(', ') : `${log.value}${log.unit}`}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeLog(sessionLogs.length - 1 - i)} 
                      className="p-2 text-white/10 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {showPoppersCard && (
          <div className="animate-in fade-in duration-500">
            <PoppersCard lang={lang} />
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 w-full">
          {filtered.map(s => {
            const active = isSubstanceActive(s.id);
            return (
              <button 
                key={s.id}
                onClick={() => handleSelectSubstance(s)}
                className={cn(
                  "aspect-square border rounded-[2.5rem] flex flex-col items-center justify-center gap-3 transition-all hover:bg-white/10 active:scale-95 group relative overflow-hidden shadow-xl",
                  active ? "bg-[#3EB489]/10 border-[#3EB489] shadow-[0_0_20px_#3EB48933]" : "bg-white/5 border-white/10"
                )}
              >
                <div className={cn("p-4 rounded-2xl bg-black/20 group-hover:scale-110 transition-transform", s.color)}>
                  <s.icon size={28} />
                </div>
                <span className={cn("text-[10px] font-black uppercase tracking-widest", active ? "text-[#3EB489]" : "text-white/60")}>{s.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Persistent Footer */}
      <footer className="shrink-0 h-[100px] bg-black/95 backdrop-blur-xl border-t border-white/5 flex flex-col items-center justify-center px-6 z-[70]">
        <button 
          onClick={() => onComplete(sessionLogs)} 
          className="w-full max-sm py-6 bg-[#3EB489] text-black rounded-full font-black uppercase text-lg tracking-[0.1em] neon-glow active:scale-95 transition-all shadow-lg shadow-[#3EB489]/20 flex items-center justify-center gap-3"
        >
           <CheckCircle2 size={24} /> Sync Session
        </button>
      </footer>

      {/* Integrated Intake Portal Overlay */}
      {activeSubstance && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-[100] animate-in fade-in duration-300 flex flex-col p-8 font-headline">
          <button 
            onClick={() => setActiveSubstance(null)}
            className="absolute top-8 right-8 p-3 bg-white/5 rounded-full border border-white/10 text-white/40 hover:text-white"
          >
            <X size={20} />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center space-y-10 max-w-md mx-auto w-full">
            <div className="text-center space-y-4">
              <div className={cn("w-24 h-24 mx-auto rounded-3xl bg-white/5 flex items-center justify-center border border-white/10 shadow-2xl", activeSubstance.color)}>
                <activeSubstance.icon size={48} />
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tighter text-white">{activeSubstance.name}</h2>
              <p className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.4em]">Log Intake Entry</p>
            </div>

            <div className="w-full space-y-8">
              {activeSubstance.id === 'alcohol' ? (
                <div className="space-y-3">
                  {alcoholCart.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white/5 p-5 rounded-2xl border border-white/10">
                      <span className="text-sm font-black uppercase tracking-widest text-white/80">{item.type}</span>
                      <div className="flex items-center gap-6">
                        <button 
                          onClick={() => {
                            const next = [...alcoholCart];
                            next[idx].count = Math.max(0, next[idx].count - 1);
                            setAlcoholCart(next);
                          }}
                          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 active:bg-white/10"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-black text-xl">{item.count}</span>
                        <button 
                          onClick={() => {
                            const next = [...alcoholCart];
                            next[idx].count += 1;
                            setAlcoholCart(next);
                          }}
                          className="w-10 h-10 rounded-full bg-[#3EB489] text-black flex items-center justify-center active:scale-90 transition-transform shadow-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block ml-2">Amount ({activeSubstance.unit})</label>
                  <input 
                    type="number"
                    value={manualValue}
                    onChange={(e) => setManualValue(e.target.value)}
                    autoFocus
                    className="w-full h-24 bg-white/5 border-2 border-white/10 rounded-3xl px-8 text-5xl font-black outline-none focus:border-[#3EB489] transition-all text-white text-center shadow-inner"
                    placeholder="0.00"
                  />
                </div>
              )}
            </div>

            <div className="w-full space-y-4 pt-6">
              <button 
                onClick={saveLog}
                className="w-full h-20 bg-[#3EB489] text-black rounded-[1.5rem] font-black uppercase tracking-widest neon-glow active:scale-[0.98] shadow-2xl flex items-center justify-center gap-3 text-lg"
              >
                <CheckCircle2 size={24} /> Confirm & Log Intake
              </button>
              <button 
                onClick={() => setActiveSubstance(null)}
                className="w-full h-14 text-white/20 font-black uppercase text-[10px] tracking-[0.4em] hover:text-white transition-colors"
              >
                Cancel Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Safety Advisor Modal */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="bg-black border-white/10 max-w-2xl p-0 rounded-[3rem] overflow-hidden flex flex-col h-[85dvh] mx-4">
          <DialogTitle className="sr-only">AI Safety Advisor Chat</DialogTitle>
          <AiSafetyChat userProfile={userData} currentIntake={intakeContext} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
