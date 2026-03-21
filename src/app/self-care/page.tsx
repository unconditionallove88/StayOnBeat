
"use client"

import { useState, useEffect } from 'react';
import { Heart, Coffee, Moon, ArrowLeft, Wind, CircleDot } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { playHeartbeat } from '@/lib/resonance';

/**
 * @fileOverview Self-Care & Stillness Sanctuary.
 * A high-fidelity grounding experience featuring box-breathing guidance.
 */

export default function SelfCare() {
  const router = useRouter();
  const [breathState, setBreathState] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [timer, setCountdown] = useState(4);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          setBreathState((current) => {
            if (current === 'inhale') return 'hold1';
            if (current === 'hold1') return 'exhale';
            if (current === 'exhale') return 'hold2';
            return 'inhale';
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const breathText = {
    inhale: "Inhale Peace",
    hold1: "Hold Presence",
    exhale: "Exhale Tension",
    hold2: "Hold Stillness"
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8 flex flex-col items-center font-headline relative overflow-hidden h-screen max-h-screen">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-500/5 blur-[120px] rounded-full -z-10" />

      <button 
        onClick={() => { playHeartbeat(); router.back(); }}
        className="absolute top-8 left-8 text-white/40 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-50 p-3 bg-white/5 rounded-full border border-white/10"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-xl space-y-12">
        
        <div className="relative flex flex-col items-center justify-center">
          <div className={cn(
            "absolute rounded-full bg-emerald-500/10 blur-3xl transition-all duration-[4000ms] ease-in-out",
            breathState === 'inhale' ? "w-80 h-80 opacity-40 scale-125" : "w-64 h-64 opacity-20 scale-100"
          )} />
          
          <div className={cn(
            "relative w-48 h-48 rounded-full border-4 flex items-center justify-center transition-all duration-[4000ms] ease-in-out shadow-2xl shadow-emerald-500/20",
            breathState === 'inhale' ? "scale-110 border-emerald-400 bg-emerald-500/10" : "scale-90 border-white/10 bg-white/5"
          )}>
            <div className="text-center space-y-1">
              <span className="text-4xl font-black tabular-nums text-white">{timer}</span>
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-500">Seconds</p>
            </div>
          </div>

          <div className="mt-10 text-center space-y-2">
            <h2 className="text-3xl font-black uppercase tracking-tighter animate-pulse">
              {breathText[breathState]}
            </h2>
            <p className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.4em]">Box Breathing Protocol</p>
          </div>
        </div>

        <div className="space-y-6 w-full text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">
              I love and respect <br/> <span className="text-[#3EB489]">my need for stillness</span>
            </h1>
            <p className="text-xs font-bold text-white/40 leading-tight max-w-[280px] mx-auto uppercase tracking-widest">
              Gently anchor yourself to the present moment. Your presence is your strength
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full">
            {[
              { icon: Coffee, label: "Hydrate", sub: "Small sips" },
              { icon: Wind, label: "Anchor", sub: "Feel feet" },
              { icon: Moon, label: "Rest", sub: "Close eyes" }
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-[2rem] flex flex-col items-center gap-2 group hover:border-emerald-500/40 transition-all">
                <item.icon className="w-5 h-5 text-[#3EB489]" />
                <div className="text-center">
                  <h3 className="font-black uppercase tracking-widest text-[8px]">{item.label}</h3>
                  <p className="text-[7px] font-bold text-white/30 uppercase tracking-tighter">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="w-full max-w-sm pb-10">
        <button 
          onClick={() => { playHeartbeat(); router.push('/dashboard'); }}
          className="w-full bg-[#3EB489] text-black h-20 rounded-full font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(62,180,137,0.3)] flex items-center justify-center gap-3"
        >
          <CircleDot size={20} />
          Return to Sanctuary
        </button>
      </footer>
    </main>
  );
}
