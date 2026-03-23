
'use client';

import { useState } from 'react';
import { Watch, Bluetooth, Smartphone, CheckCircle2, Loader2, Info, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser, updateDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { checkSafetyStatus } from '@/lib/guardian';

/**
 * @fileOverview Wearables Sync Component.
 * Deeply integrated with Sovereign Mesh protocols.
 * Punctuation-free for resonance.
 */

const DEVICES = [
  { id: 'apple', name: 'Apple Watch', icon: Smartphone, color: 'text-white' },
  { id: 'oura', name: 'Oura Ring', icon: Watch, color: 'text-[#EBFB3B]' },
  { id: 'whoop', name: 'Whoop Strap', icon: Bluetooth, color: 'text-[#EBFB3B]' },
];

const CONTENT = {
  en: {
    title: "Pulse Sync",
    sub: "Connect wearables for live vitals",
    negotiating: "Negotiating Mesh Handshake...",
    active: "Live Mesh Tracking Active",
    clickConnect: "Click to connect",
    calibrating: "Calibrating Mesh Baseline...",
    analyzing: "Analyzing physiological rhythm against session context",
    guardianInfo: "Pulse Guardian uses your resting BPM as a baseline for safety thresholds Shared via Sovereign Mesh",
    done: "Done",
    thresholdExceeded: "Safety Threshold Exceeded",
    restNotice: (hr: number) => `Vitals (HR: ${hr}) require immediate rest Protection active`,
    calibrated: "Pulse Calibrated",
    restingSet: (bpm: number) => `Resting BPM set to ${bpm} Your health data is now synced via Mesh`
  },
  de: {
    title: "Vital-Sync",
    sub: "Wearables für Vitalwerte verbinden",
    negotiating: "Mesh-Verbindung wird aufgebaut...",
    active: "Live Mesh-Ortung aktiv",
    clickConnect: "Zum Verbinden tippen",
    calibrating: "Mesh-Basis wird kalibriert...",
    analyzing: "Rhythmus wird auf Sitzungskontext abgestimmt",
    guardianInfo: "Pulse Guardian nutzt deinen Ruheplus als Basis für deine Sicherheit Übertragung per Sovereign Mesh",
    done: "Fertig",
    thresholdExceeded: "Sicherheitslimit überschritten",
    restNotice: (hr: number) => `Deine Vitalwerte (Puls: ${hr}) benötigen Ruhe Schutz aktiv`,
    calibrated: "Puls kalibriert",
    restingSet: (bpm: number) => `Ruhepuls auf ${bpm} gesetzt Deine Daten sind via Mesh synchronisiert`
  }
};

export function WearablesSync({ onComplete }: { onComplete: () => void }) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [connectedId, setConnectedId] = useState<string | null>(null);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [lang, setLang] = useState<'en' | 'de'>('en');

  useState(() => {
    const savedLang = localStorage.getItem('stayonbeat_lang');
    if (savedLang === 'DE') setLang('de');
  });

  const t = CONTENT[lang];

  const handleConnect = (id: string) => {
    setConnectingId(id);
    setTimeout(() => {
      setConnectingId(null);
      setConnectedId(id);
      setIsCalibrating(true);

      setTimeout(() => {
        setIsCalibrating(false);
        
        const simulatedHR = id === 'whoop' ? 135 : 82;
        const restingBPM = id === 'apple' ? 62 : 68;
        const intakeLogs = JSON.parse(localStorage.getItem('stayonbeat_logs') || '[]');
        
        if (user && firestore) {
          const userRef = doc(firestore, 'users', user.uid);
          
          updateDocumentNonBlocking(userRef, {
            pulseBaseline: {
              restingBPM: restingBPM,
              source: id === 'apple' ? 'apple_watch' : id === 'oura' ? 'oura_ring' : 'whoop_strap',
              recordedAt: serverTimestamp(),
              status: 'baseline_set',
              syncProtocol: 'mesh_v1'
            }
          });

          const safetyCheck = checkSafetyStatus({ heartRate: simulatedHR }, intakeLogs.length, restingBPM);

          if (safetyCheck.isLocked) {
            updateDocumentNonBlocking(userRef, {
              sessionStatus: {
                ...safetyCheck,
                activeSubstances: Array.from(new Set(intakeLogs.map((l: any) => l.name)))
              }
            });
            toast({
              variant: "destructive",
              title: t.thresholdExceeded,
              description: t.restNotice(simulatedHR),
            });
          } else {
            toast({
              title: t.calibrated,
              description: t.restingSet(restingBPM),
            });
          }
        }
      }, 2000);
    }, 2000);
  };

  return (
    <div className="p-10 font-headline bg-black rounded-[3rem]">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">{t.title}</h2>
        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{t.sub}</p>
      </div>

      <div className="space-y-4 mb-10">
        {DEVICES.map((device) => {
          const isConnecting = connectingId === device.id;
          const isConnected = connectedId === device.id;

          return (
            <button
              key={device.id}
              onClick={() => !isConnected && handleConnect(device.id)}
              disabled={!!connectingId || isConnected}
              className={cn(
                "w-full p-6 rounded-3xl border-2 flex items-center justify-between transition-all group",
                isConnected 
                  ? "bg-[#EBFB3B]/10 border-[#EBFB3B] text-[#EBFB3B]" 
                  : "bg-white/5 border-white/10 hover:border-white/30"
              )}
            >
              <div className="flex items-center gap-5">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center border",
                  isConnected ? "bg-[#EBFB3B]/20 border-[#EBFB3B]/30" : "bg-white/5 border-white/10"
                )}>
                  <device.icon className={cn("w-6 h-6", device.color)} />
                </div>
                <div className="text-left">
                  <span className="block font-black uppercase text-sm tracking-tight text-white">{device.name}</span>
                  <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">
                    {isConnecting ? t.negotiating : isConnected ? t.active : t.clickConnect}
                  </span>
                </div>
              </div>

              {isConnecting ? (
                <Loader2 className="w-5 h-5 animate-spin text-white/40" />
              ) : isConnected ? (
                <Radio className="w-6 h-6 text-[#EBFB3B] animate-pulse" />
              ) : (
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
                  <Bluetooth className="w-4 h-4 text-white/20" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {isCalibrating && (
        <div className="mb-8 p-6 bg-[#EBFB3B]/10 border-2 border-[#EBFB3B]/30 rounded-2xl flex flex-col items-center gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-[#EBFB3B]" />
            <span className="text-xs font-black uppercase tracking-widest text-[#EBFB3B]">{t.calibrating}</span>
          </div>
          <p className="text-[9px] text-white/40 text-center uppercase tracking-widest">{t.analyzing}</p>
        </div>
      )}

      <div className="bg-[#EBFB3B]/5 border border-[#EBFB3B]/20 p-6 rounded-2xl flex items-start gap-4 mb-8">
        <Info className="w-5 h-5 text-[#EBFB3B] shrink-0" />
        <p className="text-[10px] font-bold text-white/60 leading-relaxed uppercase tracking-widest">
          {t.guardianInfo}
        </p>
      </div>

      <button
        onClick={onComplete}
        className="w-full h-16 bg-[#EBFB3B] text-black font-black uppercase text-sm tracking-widest rounded-full shadow-[0_0_20px_rgba(235,251,59,0.2)] active:scale-95 transition-all"
      >
        {t.done}
      </button>
    </div>
  );
}
