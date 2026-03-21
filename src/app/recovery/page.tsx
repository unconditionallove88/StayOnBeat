
"use client"

import { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, HeartPulse, CheckCircle2, Heart, ShieldCheck, Timer, Droplets, Zap, Coffee, Moon } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function RecoveryView() {
  const { toast } = useToast();
  const router = useRouter();
  const [detoxPlan, setDetoxPlan] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState('02:00:00');
  const [mounted, setMounted] = useState(false);
  const [sessionLogs, setSessionLogs] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    const logs = JSON.parse(localStorage.getItem('stayonbeat_logs') || '[]');
    setSessionLogs(logs);
    generateDetox(logs);

    // Protection Window Countdown
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const [h, m, s] = prev.split(':').map(Number);
        let totalSeconds = h * 3600 + m * 60 + s - 1;
        if (totalSeconds <= 0) return '00:00:00';
        const nh = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const nm = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const ns = (totalSeconds % 60).toString().padStart(2, '0');
        return `${nh}:${nm}:${ns}`;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const generateDetox = (logs: any[]) => {
    const plan: any[] = [];
    const activeIds = Array.from(new Set(logs.map(l => l.id)));

    // Universal Base Advice
    plan.push({ 
      id: 'h2o', 
      time: "Immediate", 
      text: "Isotonic Rehydration", 
      desc: "Consume 500ml water with electrolytes to restore mineral balance",
      icon: Droplets,
      color: "text-blue-500"
    });

    if (activeIds.includes('mdma') || activeIds.includes('ecstasy') || activeIds.includes('3mmc') || activeIds.includes('4mmc')) {
      plan.push({ 
        id: 'serotonin',
        time: "Next 24h", 
        text: "Serotonin Support", 
        desc: "5-HTP + Green Tea Extract. Wait at least 24h after your last dose",
        icon: Zap,
        color: "text-purple-500"
      });
      plan.push({ 
        id: 'oxidative',
        time: "Next 12h", 
        text: "Anti-Oxidative Boost", 
        desc: "1000mg Vitamin C + Alpha-Lipoic Acid to combat neurotoxicity",
        icon: ShieldCheck,
        color: "text-green-500"
      });
    }

    if (activeIds.includes('alcohol')) {
      plan.push({ 
        id: 'liver',
        time: "Morning", 
        text: "Liver Recovery", 
        desc: "Milk Thistle + B-Complex vitamins. Avoid caffeine for the first 4 hours",
        icon: Coffee,
        color: "text-amber-600"
      });
    }

    if (activeIds.includes('ketamine')) {
      plan.push({ 
        id: 'bladder',
        time: "Immediate", 
        text: "Renal Protection", 
        desc: "Green Tea (EGCG) specifically supports bladder lining after Dissociatives",
        icon: Droplets,
        color: "text-green-400"
      });
    }

    if (activeIds.includes('speed') || activeIds.includes('cocaine')) {
      plan.push({ 
        id: 'sleep',
        time: "Late Night", 
        text: "Neuro-Sedation", 
        desc: "Magnesium Bisglycinate (300mg) to relax muscles and lower heart rate",
        icon: Moon,
        color: "text-indigo-400"
      });
    }

    setDetoxPlan(plan);
  };

  const handleFinish = () => {
    const profile = JSON.parse(localStorage.getItem('stayonbeat_profile') || '{}');
    const updatedProfile = {
      ...profile,
      safetyStreak: (profile.safetyStreak || 0) + 1
    };
    localStorage.setItem('stayonbeat_profile', JSON.stringify(updatedProfile));
    localStorage.removeItem('stayonbeat_logs');
    
    toast({ 
      title: "Streak Protected 🔥", 
      description: `Session closed. Your safety streak is now ${updatedProfile.safetyStreak}` 
    });
    router.push('/dashboard');
  };

  if (!mounted) return null;

  return (
    <main className="main-viewport bg-black text-white font-headline">
      <div className="bg-black/95 backdrop-blur-xl border-b border-white/5 px-6 py-8 z-50 shrink-0">
        <div className="max-w-xl mx-auto space-y-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-white/40 uppercase font-black text-[10px] tracking-widest hover:text-[#3EB489]">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          
          <div className="flex justify-between items-end">
            <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">
              Recovery <br/> <span className="text-[#3EB489]">Protocol</span>
            </h1>
            <div className="flex flex-col items-end gap-3">
              <div className="px-3 py-1 bg-pink-500/10 border border-pink-500/30 rounded-full flex items-center gap-2">
                <Heart className="w-3 h-3 text-pink-500 fill-pink-500 animate-pulse-heart" />
                <span className="text-[8px] font-black text-pink-500 uppercase tracking-widest">Active Protection</span>
              </div>
              <span className="font-mono text-pink-500 text-xs font-black">{timeLeft}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-container px-6 py-10 custom-scrollbar">
        <div className="max-w-xl mx-auto space-y-12 pb-32">
          {/* Status Alert */}
          <div className="bg-blue-500/10 border border-blue-500/30 p-8 rounded-[2rem] flex items-start gap-6">
            <ShieldCheck className="w-8 h-8 text-blue-500 shrink-0" />
            <div className="space-y-2">
              <p className="text-base font-bold text-white/90 leading-tight">
                Personalized protocol generated based on your session logs
              </p>
              <p className="text-[10px] uppercase font-black text-white/40 tracking-widest">
                Data analyzed: {sessionLogs.length} intake events recorded
              </p>
            </div>
          </div>

          {/* Detox Protocol */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 mb-4 px-2">
               <HeartPulse className="w-6 h-6 text-[#3EB489]" />
               <h3 className="text-xl font-black uppercase tracking-tight">Your Custom Timeline</h3>
            </div>

            <div className="space-y-4">
              {detoxPlan.length > 0 ? (
                detoxPlan.map((p) => (
                  <div key={p.id} className="p-8 rounded-[2.5rem] border border-white/10 bg-white/5 flex flex-col gap-4 group hover:border-[#3EB489]/40 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn("p-3 rounded-2xl bg-white/5", p.color)}>
                          <p.icon className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{p.time}</span>
                          <span className="text-xl font-black uppercase text-white">{p.text}</span>
                        </div>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-[#3EB489]/20 group-hover:text-[#3EB489] transition-colors" />
                    </div>
                    <p className="text-sm font-bold text-white/60 leading-relaxed pl-2 border-l-2 border-white/10">
                      {p.desc}
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center gap-6 py-16 text-white/10 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/5">
                  <Timer className="w-12 h-12 opacity-20" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em]">No session logs detected</p>
                </div>
              )}
            </div>
          </section>

          {/* Secure Wipe Warning */}
          <div className="bg-red-500/5 border border-red-500/10 p-8 rounded-[2.5rem] text-center">
            <p className="text-[10px] font-black text-red-500/40 uppercase tracking-[0.3em] leading-relaxed">
              Completing this protocol will permanently wipe all session GPS and substance logs for your privacy
            </p>
          </div>
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 h-[100px] bg-black/90 backdrop-blur-xl border-t border-white/5 flex flex-col items-center justify-center px-6 z-50">
        <button 
          onClick={handleFinish} 
          className="w-full max-w-sm py-6 bg-[#3EB489] text-black rounded-full font-black uppercase text-lg tracking-[0.1em] neon-glow active:scale-95 transition-all"
        >
           Complete Session & Log Streak
        </button>
      </footer>
    </main>
  );
}
