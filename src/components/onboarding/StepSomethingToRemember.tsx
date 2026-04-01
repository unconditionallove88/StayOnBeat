
"use client"

import { useState, useEffect } from 'react';
import { ArrowLeft, Check, Ban, Clock, Moon, GlassWater, ZapOff, Info, AlertTriangle, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * @fileOverview "Something to Remember" (Safety Protocol Step).
 * Features: Expanded Mixing Wisdom Table, Intake Limits, and Sanctuary Alarms.
 * Optimized for iPhone: Full vertical scrollability.
 * Languages: EN, DE.
 */

const MIXING_WISDOM = [
  { s1: 'Alcohol', s2: 'GHB/GBL', risk: 'Critical', color: 'text-red-500', note: 'Extreme respiratory failure risk' },
  { s1: 'MDMA', s2: 'SSRIs', risk: 'High', color: 'text-red-400', note: 'Serotonin syndrome risk' },
  { s1: 'Alcohol', s2: 'Ketamine', risk: 'High', color: 'text-red-400', note: 'Severe nausea and choking risk' },
  { s1: 'Cocaine', s2: 'Alcohol', risk: 'Moderate', color: 'text-amber-500', note: 'Increased cardiotoxicity' },
  { s1: 'Speed', s2: 'MDMA', risk: 'Moderate', color: 'text-amber-500', note: 'Extreme heart strain' },
  { s1: 'LSD', s2: 'Cannabis', risk: 'Moderate', color: 'text-amber-500', note: 'Intense thought loops' },
  { s1: 'Benzos', s2: 'Alcohol', risk: 'Critical', color: 'text-red-500', note: 'Fatal blackouts and overdose' },
  { s1: 'Poppers', s2: 'Viagra', risk: 'Critical', color: 'text-red-500', note: 'Fatal blood pressure drop' },
];

const UI = {
  EN: {
    header: "Something to remember",
    sub: "Wisdom for your journey",
    wisdom: "Mixing Wisdom Table",
    acknowledge: "I acknowledge this",
    limits: "Commit to limits",
    alarms: "Sanctuary Alarms",
    limitIntake: "Limit total intake",
    leaveEarly: "Set leave time",
    danceBreaks: "Rest break alarms",
    hydration: "Hydration reminders",
    confirm: "Set sanctuary boundaries",
    created: "Created in harmony"
  },
  DE: {
    header: "Etwas zum Erinnern heute",
    sub: "Weisheit für deine Reise",
    wisdom: "Misch-Weisheiten Tabelle",
    acknowledge: "Ich bestätige das heute",
    limits: "Limits festlegen heute",
    alarms: "Sanctuary Alarme heute",
    limitIntake: "Gesamtmenge begrenzen heute",
    leaveEarly: "Aufbruchszeit festlegen heute",
    danceBreaks: "Pausen Alarme heute",
    hydration: "Wasser Erinnerungen heute",
    confirm: "Grenzen jetzt setzen",
    created: "In Harmonie erschaffen hier"
  }
};

export function StepSomethingToRemember({ onComplete, onBack, isStandAlone = false }: { onComplete: (data: any) => void, onBack?: () => void, isStandAlone?: boolean }) {
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
    <div className="w-full h-full flex flex-col font-headline bg-black relative">
      {!isStandAlone && onBack && (
        <button onClick={onBack} className="absolute top-0 left-4 text-white/40 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-[100] pt-4">
          <ArrowLeft className="w-4 h-4" /> BACK
        </button>
      )}

      <div className={cn("px-6 shrink-0", isStandAlone ? "pt-4" : "pt-16")}>
        <h2 className="text-[22px] font-black uppercase mb-1 text-white leading-tight tracking-tighter">{t.header}</h2>
        <p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px] mb-6">{t.sub}</p>
      </div>

      <ScrollArea className="flex-1 px-6">
        <div className="space-y-8 pb-32">
          {/* Wisdom Table */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{t.wisdom}</h3>
              <Info size={12} className="text-primary/40" />
            </div>
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[300px]">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="p-4 text-[8px] font-black uppercase tracking-widest text-white/30">Combination</th>
                      <th className="p-4 text-[8px] font-black uppercase tracking-widest text-white/30 text-right">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {MIXING_WISDOM.map((row, i) => (
                      <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-white/90 uppercase tracking-tight">{row.s1} + {row.s2}</span>
                            <span className="text-[8px] font-bold text-white/30 uppercase leading-none">{row.note}</span>
                          </div>
                        </td>
                        <td className="p-4 text-right align-top">
                          <span className={cn("text-[9px] font-black uppercase px-2 py-1 rounded-md bg-white/5", row.color)}>
                            {row.risk}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <button 
              onClick={() => setAcknowledge(!acknowledged)}
              className={cn(
                "w-full p-6 rounded-2xl border-2 flex items-center gap-4 transition-all active:scale-[0.98] shadow-lg",
                acknowledged ? "bg-primary/10 border-primary" : "bg-white/5 border-white/10"
              )}
            >
              <div className={cn(
                "w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all",
                acknowledged ? "bg-primary border-primary shadow-[0_0_10px_rgba(27,77,62,0.5)]" : "border-white/20"
              )}>
                {acknowledged && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
              <span className={cn("text-[10px] font-black uppercase tracking-widest", acknowledged ? "text-primary" : "text-white/40")}>
                {t.acknowledge}
              </span>
            </button>
          </section>

          {/* Alarms & Reminders */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 px-1">{t.alarms}</h3>
            
            <div className="grid gap-3">
              {[
                { id: 'limitIntake', label: t.limitIntake, icon: ZapOff, color: "text-amber-500" },
                { id: 'leaveEarly', label: t.leaveEarly, icon: Clock, color: "text-blue-400" },
                { id: 'danceBreaks', label: t.danceBreaks, icon: Moon, color: "text-purple-400" },
                { id: 'hydration', label: t.hydration, icon: GlassWater, color: "text-cyan-400" },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-5 bg-[#0a0a0a] border border-white/10 rounded-2xl group hover:border-white/20 transition-all shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">
                      <item.icon className={cn("w-4 h-4", item.color)} />
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

          <div className="pt-4 text-center opacity-20">
            <p className="text-[8px] font-black uppercase tracking-[0.5em]">{t.created}</p>
          </div>
        </div>
      </ScrollArea>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black to-transparent pt-12 pointer-events-none">
        <button 
          onClick={() => onComplete({ acknowledged, settings })} 
          disabled={!acknowledged}
          className={cn(
            "pointer-events-auto w-full max-w-sm mx-auto h-20 rounded-full uppercase tracking-[0.2em] font-black text-lg transition-all shadow-2xl flex items-center justify-center gap-3",
            acknowledged ? 'bg-[#1b4d3e] text-white neon-glow active:scale-95' : 'bg-white/5 text-white/10 border-2 border-white/5 cursor-not-allowed opacity-50'
          )}
        >
          {t.confirm}
        </button>
      </div>
    </div>
  );
}
