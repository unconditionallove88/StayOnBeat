
"use client"

import { useState, useEffect } from 'react';
import { ArrowLeft, AlertTriangle, Check, Ban, Clock, Moon, GlassWater, ZapOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * @fileOverview "Something to Remember" (Safety Protocol Step).
 * Features: Mixing Wisdom Table, Intake Limits, and Sanctuary Alarms.
 * Languages: EN, DE.
 */

const MIXING_WISDOM = [
  { s1: 'Alcohol', s2: 'GHB/GBL', risk: 'Critical', color: 'text-red-500' },
  { s1: 'MDMA', s2: 'SSRIs', risk: 'High', color: 'text-red-400' },
  { s1: 'Alcohol', s2: 'Ketamine', risk: 'High', color: 'text-red-400' },
  { s1: 'Cocaine', s2: 'Alcohol', risk: 'Moderate', color: 'text-amber-500' },
  { s1: 'Stimulants', s2: 'Stimulants', risk: 'Moderate', color: 'text-amber-500' },
];

const UI = {
  EN: {
    header: "Something to remember",
    sub: "Wisdom for your journey",
    wisdom: "Mixing Wisdom",
    acknowledge: "I acknowledge this",
    limits: "Commit to limits",
    alarms: "Sanctuary Alarms",
    limitIntake: "Limit total intake",
    leaveEarly: "Set leave time",
    danceBreaks: "Rest break alarms",
    hydration: "Hydration reminders",
    confirm: "Set sanctuary boundaries"
  },
  DE: {
    header: "Etwas zum Erinnern heute",
    sub: "Weisheit für deine Reise",
    wisdom: "Misch-Weisheiten",
    acknowledge: "Ich bestätige das heute",
    limits: "Limits festlegen heute",
    alarms: "Sanctuary Alarme heute",
    limitIntake: "Gesamtmenge begrenzen heute",
    leaveEarly: "Aufbruchszeit festlegen heute",
    danceBreaks: "Pausen Alarme heute",
    hydration: "Wasser Erinnerungen heute",
    confirm: "Grenzen jetzt setzen"
  }
};

export function StepSomethingToRemember({ onComplete, onBack }: { onComplete: (data: any) => void, onBack?: () => void }) {
  const [lang, setLang] = useState<'EN' | 'DE'>('EN');
  const [acknowledged, setAcknowledge] = useState(false);
  const [settings, setSettings] = useState({
    limitIntake: true,
    leaveEarly: false,
    danceBreaks: true,
    hydration: true,
  });

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toUpperCase() as any;
    if (['EN', 'DE'].includes(savedLang)) setLang(savedLang);
  }, []);

  const t = UI[lang] || UI.EN;

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-center font-headline max-xl mx-auto px-4 text-center relative pt-safe pb-safe">
      {onBack && (
        <button onClick={onBack} className="absolute top-0 left-4 text-white/40 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-50">
          <ArrowLeft className="w-4 h-4" /> BACK
        </button>
      )}

      <div className="mt-12 mb-8 text-center">
        <h2 className="text-[22px] font-black uppercase mb-2 text-white leading-tight tracking-tighter">{t.header}</h2>
        <p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px] max-w-[280px] mx-auto">{t.sub}</p>
      </div>

      <ScrollArea className="flex-1 w-full max-h-[55vh] mb-8 pr-2">
        <div className="space-y-8 pb-10">
          {/* Wisdom Table */}
          <section className="space-y-4 text-left">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary px-2">{t.wisdom}</h3>
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[1.5rem] overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="p-4 text-[8px] font-black uppercase tracking-widest text-white/30">Mix</th>
                    <th className="p-4 text-[8px] font-black uppercase tracking-widest text-white/30 text-right">Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {MIXING_WISDOM.map((row, i) => (
                    <tr key={i}>
                      <td className="p-4">
                        <span className="text-[10px] font-bold text-white/80 uppercase">{row.s1} + {row.s2}</span>
                      </td>
                      <td className="p-4 text-right">
                        <span className={cn("text-[9px] font-black uppercase", row.color)}>{row.risk}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <button 
              onClick={() => setAcknowledge(!acknowledged)}
              className={cn(
                "w-full p-5 rounded-2xl border-2 flex items-center gap-4 transition-all active:scale-[0.98]",
                acknowledged ? "bg-primary/10 border-primary" : "bg-white/5 border-white/10"
              )}
            >
              <div className={cn(
                "w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all",
                acknowledged ? "bg-primary border-primary" : "border-white/20"
              )}>
                {acknowledged && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
              <span className={cn("text-[10px] font-black uppercase tracking-widest", acknowledged ? "text-primary" : "text-white/40")}>
                {t.acknowledge}
              </span>
            </button>
          </section>

          {/* Alarms & Reminders */}
          <section className="space-y-4 text-left">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 px-2">{t.alarms}</h3>
            
            <div className="space-y-3">
              {[
                { id: 'limitIntake', label: t.limitIntake, icon: ZapOff },
                { id: 'leaveEarly', label: t.leaveEarly, icon: Clock },
                { id: 'danceBreaks', label: t.danceBreaks, icon: Moon },
                { id: 'hydration', label: t.hydration, icon: GlassWater },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-5 bg-[#0a0a0a] border border-white/10 rounded-2xl group hover:border-white/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/5 rounded-lg group-hover:scale-110 transition-transform">
                      <item.icon className="w-4 h-4 text-white/40" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-tight text-white/80">{item.label}</span>
                  </div>
                  <Switch 
                    checked={settings[item.id as keyof typeof settings]}
                    onCheckedChange={(val) => setSettings(prev => ({...prev, [item.id]: val}))}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </ScrollArea>

      <button 
        onClick={() => onComplete({ acknowledged, settings })} 
        disabled={!acknowledged}
        className={cn(
          "pill-button w-full max-w-sm uppercase tracking-[0.2em] font-black text-xl h-[64px] transition-all",
          acknowledged ? 'bg-[#1b4d3e] text-white neon-glow active:scale-95' : 'bg-white/10 text-white/10 cursor-not-allowed border-2 border-white/5 opacity-50'
        )}
      >
        {t.confirm}
      </button>
    </div>
  );
}
