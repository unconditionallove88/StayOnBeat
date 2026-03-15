'use client';

import { useState } from 'react';
import { Watch, Bluetooth, Smartphone, CheckCircle2, Loader2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser, updateDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { checkSafetyStatus } from '@/lib/guardian';

const DEVICES = [
  { id: 'apple', name: 'Apple Watch', icon: Smartphone, color: 'text-white' },
  { id: 'oura', name: 'Oura Ring', icon: Watch, color: 'text-blue-400' },
  { id: 'whoop', name: 'Whoop Strap', icon: Bluetooth, color: 'text-red-500' },
];

export function WearablesSync({ onComplete }: { onComplete: () => void }) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [connectedId, setConnectedId] = useState<string | null>(null);
  const [isCalibrating, setIsCalibrating] = useState(false);

  const handleConnect = (id: string) => {
    setConnectingId(id);
    // Simulate connection delay
    setTimeout(() => {
      setConnectingId(null);
      setConnectedId(id);
      setIsCalibrating(true);

      // Simulate Vitals Calibration
      setTimeout(() => {
        setIsCalibrating(false);
        
        const simulatedHR = id === 'whoop' ? 135 : 82;
        const restingBPM = id === 'apple' ? 62 : 68; // Mock baseline
        const intakeLogs = JSON.parse(localStorage.getItem('stayonbeat_logs') || '[]');
        
        if (user && firestore) {
          const userRef = doc(firestore, 'users', user.uid);
          
          // 1. SET PULSE BASELINE
          updateDocumentNonBlocking(userRef, {
            pulseBaseline: {
              restingBPM: restingBPM,
              source: id === 'apple' ? 'apple_watch' : id === 'oura' ? 'oura_ring' : 'whoop_strap',
              recordedAt: serverTimestamp(),
              status: 'baseline_set'
            }
          });

          // 2. CHECK SAFETY
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
              title: "Safety Threshold Exceeded",
              description: `Vitals (HR: ${simulatedHR}) require immediate rest. Protection active.`,
            });
          } else {
            toast({
              title: "Pulse Calibrated",
              description: `Resting BPM set to ${restingBPM}. Your health data is now synced.`,
            });
          }
        }
      }, 2000);
    }, 2000);
  };

  return (
    <div className="p-10 font-body">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Pulse Sync</h2>
        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Connect wearables for live vitals</p>
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
                  ? "bg-[#3EB489]/10 border-[#3EB489] text-[#3EB489]" 
                  : "bg-white/5 border-white/10 hover:border-white/30"
              )}
            >
              <div className="flex items-center gap-5">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center border",
                  isConnected ? "bg-[#3EB489]/20 border-[#3EB489]/30" : "bg-white/5 border-white/10"
                )}>
                  <device.icon className={cn("w-6 h-6", device.color)} />
                </div>
                <div className="text-left">
                  <span className="block font-black uppercase text-sm tracking-tight text-white">{device.name}</span>
                  <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">
                    {isConnecting ? "Negotiating Handshake..." : isConnected ? "Live Tracking Active" : "Click to connect"}
                  </span>
                </div>
              </div>

              {isConnecting ? (
                <Loader2 className="w-5 h-5 animate-spin text-white/40" />
              ) : isConnected ? (
                <CheckCircle2 className="w-6 h-6 text-[#3EB489]" />
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
        <div className="mb-8 p-6 bg-blue-600/10 border-2 border-blue-500/30 rounded-2xl flex flex-col items-center gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
            <span className="text-xs font-black uppercase tracking-widest text-blue-400">Calibrating Safety Baseline...</span>
          </div>
          <p className="text-[9px] text-white/40 text-center uppercase tracking-widest">Analyzing physiological rhythm against session context</p>
        </div>
      )}

      <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-2xl flex items-start gap-4 mb-8">
        <Info className="w-5 h-5 text-blue-500 shrink-0" />
        <p className="text-[10px] font-bold text-white/60 leading-relaxed uppercase tracking-widest">
          Pulse Guardian uses your resting BPM as a baseline for safety thresholds.
        </p>
      </div>

      <button
        onClick={onComplete}
        className="w-full h-16 bg-[#3EB489] text-black font-black uppercase text-sm tracking-widest rounded-full neon-glow active:scale-95 transition-all"
      >
        Done
      </button>
    </div>
  );
}
