'use client';

import { useState, useEffect } from 'react';
import { Bell, Droplets, Moon, Settings2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface SmartAlertsProps {
  userGoals: string[];
}

export function SmartAlerts({ userGoals }: SmartAlertsProps) {
  const { toast } = useToast();
  const [enabled, setEnabled] = useState(false);
  const [nextWater, setNextWater] = useState(45); // minutes
  const [nextRest, setNextRest] = useState(90); // minutes

  // Permission Request
  const requestPermission = async () => {
    if (!('Notification' in window)) return;
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setEnabled(true);
      toast({
        title: "Protocols Active",
        description: "StayOnBeat will now notify you for water and rest.",
      });
    }
  };

  useEffect(() => {
    if (!enabled) return;

    // Simulation: In a real app, these would be background workers or persistent timers
    const timer = setInterval(() => {
      setNextWater(prev => (prev > 0 ? prev - 1 : 45));
      setNextRest(prev => (prev > 0 ? prev - 1 : 90));
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [enabled]);

  // Trigger Notifications
  useEffect(() => {
    if (!enabled) return;

    if (nextWater === 0) {
      const msg = "Hydration Check: Time for 250ml of water. Stay balanced.";
      if (Notification.permission === 'granted') new Notification("StayOnBeat", { body: msg, icon: '/favicon.ico' });
      toast({ title: "💧 Hydration Reminder", description: msg });
    }

    if (nextRest === 0 && userGoals.includes('dance')) {
      const msg = "Rest Protocol: You've been dancing for 90m. Take a 10m chill break.";
      if (Notification.permission === 'granted') new Notification("StayOnBeat", { body: msg, icon: '/favicon.ico' });
      toast({ title: "🌙 Rest Alert", description: msg });
    }
  }, [nextWater, nextRest, enabled, userGoals, toast]);

  return (
    <div className="p-8 font-body">
      <div className="flex flex-col items-center text-center gap-4 mb-10">
        <div className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-500",
          enabled ? "bg-[#3EB489]/10 border-[#3EB489] neon-glow" : "bg-white/5 border-white/10"
        )}>
          <Bell className={cn("w-8 h-8", enabled ? "text-[#3EB489]" : "text-white/20")} />
        </div>
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter">Smart Protocols</h2>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Hydration & Rest Guard</p>
        </div>
      </div>

      <div className="space-y-4 mb-10">
        <div className={cn(
          "p-6 rounded-3xl border-2 flex items-center justify-between transition-all",
          enabled ? "bg-white/5 border-white/10" : "bg-[#0a0a0a] border-white/5 opacity-40"
        )}>
          <div className="flex items-center gap-4">
            <Droplets className="w-5 h-5 text-blue-400" />
            <div className="text-left">
              <span className="block font-black uppercase text-[10px] tracking-widest text-white/40">Next Water</span>
              <span className="text-xl font-black text-white">{enabled ? `${nextWater}m` : '--'}</span>
            </div>
          </div>
          {enabled && <CheckCircle2 className="w-5 h-5 text-[#3EB489]" />}
        </div>

        <div className={cn(
          "p-6 rounded-3xl border-2 flex items-center justify-between transition-all",
          enabled ? "bg-white/5 border-white/10" : "bg-[#0a0a0a] border-white/5 opacity-40"
        )}>
          <div className="flex items-center gap-4">
            <Moon className="w-5 h-5 text-indigo-400" />
            <div className="text-left">
              <span className="block font-black uppercase text-[10px] tracking-widest text-white/40">Next Break</span>
              <span className="text-xl font-black text-white">{enabled ? `${nextRest}m` : '--'}</span>
            </div>
          </div>
          {enabled && <CheckCircle2 className="w-5 h-5 text-[#3EB489]" />}
        </div>
      </div>

      <div className="bg-orange-500/5 border border-orange-500/20 p-6 rounded-2xl flex items-start gap-4 mb-10">
        <AlertCircle className="w-5 h-5 text-orange-500 shrink-0" />
        <p className="text-[9px] font-bold text-white/60 leading-relaxed uppercase tracking-widest">
          Protocols are calibrated to your focus: {userGoals.join(' • ').replace(/-/g, ' ') || 'General Safety'}
        </p>
      </div>

      <button
        onClick={enabled ? () => setEnabled(false) : requestPermission}
        className={cn(
          "w-full h-16 rounded-full font-black uppercase text-sm tracking-widest transition-all active:scale-95",
          enabled 
            ? "bg-red-600/10 border-2 border-red-600/30 text-red-500" 
            : "bg-[#3EB489] text-black neon-glow"
        )}
      >
        {enabled ? "Disable Protocols" : "Enable Smart Alerts"}
      </button>
    </div>
  );
}
