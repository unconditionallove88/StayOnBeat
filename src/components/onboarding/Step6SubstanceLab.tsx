'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { 
  Loader2, 
  Search, 
  Sparkles, 
  ArrowRight, 
  Trash2,
  Calendar,
  ArrowLeft,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { AiSafetyChat } from '@/components/chat/AiSafetyChat';
import { ShieldPulseIcon } from '@/components/ui/shield-pulse-icon';
import CareShield from '@/components/dashboard/CareShield';
import GuardianStatusBar from '@/components/dashboard/GuardianStatusBar';
import PulseGuardianBanner from '@/components/dashboard/PulseGuardianBanner';
import { SOSAlert } from '@/components/dashboard/SOSAlert';
import PoppersCard from '@/components/lab/cards/PoppersCard';

/**
 * @fileOverview Pulse Lab component.
 * Calibrated for high-fidelity scrolling and real-time safety monitoring.
 */

const SUBSTANCES = [
  { id: 'alcohol', emoji: '🍺', name: 'Alcohol', unit: 'Items', subTypes: ['Beer', 'Wine', 'Shot', 'Mixer'], inputType: 'cart' },
  { id: 'cannabis', emoji: '🌿', name: 'Cannabis', unit: 'g', inputType: 'manual' },
  { id: 'mdma', emoji: '💊', name: 'MDMA', unit: 'g', inputType: 'manual' },
  { id: 'cocaine', emoji: '❄️', name: 'Cocaine', unit: 'g', inputType: 'manual' },
  { id: 'ketamine', emoji: '🐴', name: 'Ketamine', unit: 'g', inputType: 'manual' },
  { id: 'ecstasy', emoji: '💖', name: 'Ecstasy', unit: 'pills', inputType: 'manual' },
  { id: 'ghb', emoji: '💧', name: 'GHB/GBL', unit: 'ml', inputType: 'manual' },
  { id: 'speed', emoji: '⚡', name: 'Speed', unit: 'g', inputType: 'manual' },
  { id: 'lsd', emoji: '🌈', name: 'LSD', unit: 'ug', inputType: 'manual' },
  { id: '2cb', emoji: '🎡', name: '2C-B', unit: 'mg', inputType: 'manual' },
  { id: 'psilocybin', emoji: '🍄', name: 'Psilocybin', unit: 'g', inputType: 'manual' },
  { id: 'poppers', emoji: '🟡', name: 'Poppers', unit: 'hits', inputType: 'manual' },
  { id: 'viagra', emoji: '💊', name: 'Sildenafil', unit: 'pills', inputType: 'manual' },
  { id: '2mmc', emoji: '💎', name: '2-MMC', unit: 'g', inputType: 'manual' },
  { id: '3mmc', emoji: '💎', name: '3-MMC', unit: 'g', inputType: 'manual' },
  { id: '4mmc', emoji: '💎', name: '4-MMC', unit: 'g', inputType: 'manual' },
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
    
    // Guardian Warning Logic for Poppers
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
        emoji: '🍺',
        items: activeItems,
        timestamp: new Date().toISOString(),
      };
    } else {
      if (!manualValue || parseFloat(manualValue) === 0) return;
      entry = {
        id: activeSubstance.id,
        name: activeSubstance.name,
        emoji: activeSubstance.emoji,
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

  if (!mounted) return null;

  const lastHR = userData?.sessionStatus?.lastHeartRate || 0;
  const guardianStatus: 'safe' | 'caution' | 'locked' = isLocked ? 'locked' : (lastHR > 110 ? 'caution' : 'safe');

  // Poppers Card logic
  const showPoppersCard = 
    searchTerm.toLowerCase().includes('poppers') || 
    activeSubstance?.id === 'poppers' || 
    isSubstanceActive('poppers');

  if (isLocked) {
    return (
      <div className="flex flex-col h-full bg-black font-body max-w-2xl mx-auto p-6 relative overflow-hidden">
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
      <div className="px-6 pt-12 pb-4 space-y-4 flex flex-col shrink-0 bg-black z-20 border-b border-white/5 shadow-2xl">
        {onBack && (
          <button onClick={onBack} className="absolute top-4 left-4 text-white/40 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-50">
            <ArrowLeft className="w-4 h-4" /> BACK
          </button>
        )}
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 flex items-center justify-center border border-[#10B981]/20">
              <ShieldPulseIcon size={32} color="#10B981" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">Pulse Lab</h1>
          </div>
          <PulseGuardianBanner lang={lang} />
          <GuardianStatusBar status={guardianStatus} heartRate={lastHR > 0 ? lastHR : 98} lang={lang} />
        </div>

        <div className="relative w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input 
            placeholder="Search substances..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 h-16 pl-14 rounded-3xl focus:border-[#3EB489] text-base outline-none transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Viewport */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-40 space-y-8 pt-6">
        
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
                <span className="text-4xl group-hover:scale-110 transition-transform">{s.emoji}</span>
                <span className={cn("text-[10px] font-black uppercase tracking-widest", active ? "text-[#3EB489]" : "text-white/60")}>{s.name}</span>
              </button>
            );
          })}
        </div>

        <button 
          onClick={() => setChatOpen(true)}
          className="w-full bg-blue-600/10 border-2 border-blue-500/30 rounded-[2rem] p-8 flex items-center justify-between group hover:bg-blue-600/20 transition-all text-left shadow-2xl"
        >
          <div className="flex items-center gap-6">
            <div className="p-4 bg-blue-600 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight text-white">Safety Advisor</h3>
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">Contextual interaction check</p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-blue-500 group-hover:translate-x-2 transition-transform" />
        </button>

        {showDiary && sessionLogs.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-[12px] font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-3 px-2">
              <Calendar className="w-4 h-4" /> Session diary
            </h3>
            <div className="grid gap-3">
              {sessionLogs.slice().reverse().map((log, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center font-bold text-lg">{log.emoji}</div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-black uppercase text-white">{log.name}</span>
                      <span className="text-[10px] font-bold text-[#3EB489]">
                        {log.id === 'alcohol' ? log.items.map((it: any) => `${it.count}x ${it.type}`).join(', ') : `${log.value}${log.unit}`}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => removeLog(sessionLogs.length - 1 - i)} className="p-2 text-white/20 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="shrink-0 h-[100px] bg-black/95 backdrop-blur-xl border-t border-white/5 flex flex-col items-center justify-center px-6 z-50">
        <button 
          onClick={() => onComplete(sessionLogs)} 
          className="w-full max-w-sm py-6 bg-[#3EB489] text-black rounded-full font-black uppercase text-lg tracking-[0.1em] neon-glow active:scale-95 transition-all shadow-lg shadow-[#3EB489]/20"
        >
           Sync session diary
        </button>
      </footer>

      <Dialog open={!!activeSubstance} onOpenChange={() => setActiveSubstance(null)}>
        <DialogContent className="bg-black border-white/10 max-w-md p-8 rounded-[3rem]">
          <DialogTitle className="text-center text-2xl font-black uppercase tracking-tighter mb-6">{activeSubstance?.name}</DialogTitle>
          <div className="space-y-6">
            {activeSubstance?.id === 'alcohol' ? (
              <div className="space-y-4">
                {alcoholCart.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
                    <span className="text-xs font-black uppercase tracking-widest">{item.type}</span>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => {
                          const next = [...alcoholCart];
                          next[idx].count = Math.max(0, next[idx].count - 1);
                          setAlcoholCart(next);
                        }}
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-4 text-center font-black">{item.count}</span>
                      <button 
                        onClick={() => {
                          const next = [...alcoholCart];
                          next[idx].count += 1;
                          setAlcoholCart(next);
                        }}
                        className="w-8 h-8 rounded-full bg-[#3EB489] text-black flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block ml-2">Enter amount ({activeSubstance?.unit})</label>
                <input 
                  type="number"
                  value={manualValue}
                  onChange={(e) => setManualValue(e.target.value)}
                  className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-2xl font-black outline-none focus:border-[#3EB489] transition-all"
                  placeholder="0.00"
                />
              </div>
            )}
            <button 
              onClick={saveLog}
              className="w-full h-16 bg-[#3EB489] text-black rounded-2xl font-black uppercase tracking-widest neon-glow active:scale-95"
            >
              Log intake
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="bg-black border-white/10 max-w-2xl p-0 rounded-[3rem] overflow-hidden flex flex-col h-[85vh] mx-4">
          <DialogTitle className="sr-only">AI Safety Advisor Chat</DialogTitle>
          <AiSafetyChat userProfile={userData} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
