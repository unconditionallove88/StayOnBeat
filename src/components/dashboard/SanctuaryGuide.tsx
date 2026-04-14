
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Microscope, 
  Watch, 
  PenLine, 
  Shield, 
  Eye,
  Info
} from 'lucide-react';
import { RadiatingThirdEye } from '@/components/ui/radiating-third-eye';
import { cn } from '@/lib/utils';
import { playHeartbeat } from '@/lib/resonance';

/**
 * @fileOverview Sanctuary Guide Component.
 * Step-by-step interactive onboarding for the circular sanctuary.
 */

const STEPS = [
  {
    title: { en: "The Pulse Radar", de: "Der Puls-Radar" },
    desc: { 
      en: "Your mesh-based location tracker. Shared only with those you love. Stay connected, never lost.", 
      de: "Dein Mesh-Ortungssystem. Nur mit deinen Liebsten geteilt. Bleib verbunden, niemals verloren." 
    },
    icon: RadiatingThirdEye,
    color: "text-blue-400",
    bg: "bg-blue-500/10"
  },
  {
    title: { en: "Pulse Lab", de: "Sitzungs-Labor" },
    desc: { 
      en: "Log your session intake responsibly. Pulse Guardian calibrates your safety thresholds in real-time.", 
      de: "Notiere deine Sitzungs-Aufnahme verantwortungsbewusst. Pulse Guardian kalibriert deine Sicherheit." 
    },
    icon: Microscope,
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    title: { en: "Pulse Sync", de: "Vital-Sync" },
    desc: { 
      en: "Connect your wearable. We monitor your heart rate to ensure your rhythm stays steady.", 
      de: "Verbinde dein Wearable. Wir überwachen deinen Puls, damit dein Rhythmus stabil bleibt." 
    },
    icon: Watch,
    color: "text-accent",
    bg: "bg-accent/10"
  },
  {
    title: { en: "Love Letters", de: "Liebesbriefe" },
    desc: { 
      en: "A note to your future self. Written in light, stored in the sanctuary for when you need it most.", 
      de: "Eine Nachricht an dein zukünftiges Ich. In Licht geschrieben, sicher im Sanctuary verwahrt." 
    },
    icon: PenLine,
    color: "text-purple-400",
    bg: "bg-purple-500/10"
  },
  {
    title: { en: "The Supporter", de: "Unterstützer" },
    desc: { 
      en: "Your sentient AI companion. Ask anything about safety, phases, or grounding. We hear you.", 
      de: "Dein empathischer KI-Begleiter. Frage alles über Sicherheit, Phasen oder Erdung." 
    },
    icon: Shield,
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    title: { en: "Vision of Love", de: "Vision der Liebe" },
    desc: { 
      en: "A sensory grounding tool. Return to harmony through visual and textual resonance.", 
      de: "Ein sensorisches Erdungs-Tool. Kehre zur Harmonie zurück durch visuelle Resonanz." 
    },
    icon: Eye,
    color: "text-[#10B981]",
    bg: "bg-[#10B981]/10"
  }
];

export function SanctuaryGuide({ lang = 'en' }: { lang: 'en' | 'de' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasDismissed, setHasDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('stayonbeat_guide_dismissed');
    if (dismissed) setHasDismissed(true);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('stayonbeat_guide_dismissed', 'true');
    setHasDismissed(true);
    setIsOpen(false);
  };

  if (hasDismissed && !isOpen) return null;

  const step = STEPS[currentStep];
  const Icon = step.icon;

  return (
    <div className="w-full mb-8">
      {!isOpen ? (
        <button 
          onClick={() => { playHeartbeat(); setIsOpen(true); }}
          className="w-full flex items-center justify-between p-5 bg-primary/10 border border-primary/20 rounded-[2rem] hover:bg-primary/20 transition-all group animate-in slide-in-from-top duration-700"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <Sparkles className="text-primary animate-pulse" size={20} />
            </div>
            <div className="text-left">
              <span className="block text-[10px] font-black uppercase text-primary tracking-[0.2em]">
                {lang === 'en' ? "Sanctuary Guide" : "Sanctuary Begleiter"}
              </span>
              <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
                {lang === 'en' ? "How to use your tools" : "Wie du deine Tools nutzt"}
              </p>
            </div>
          </div>
          <ChevronRight size={16} className="text-primary/40 group-hover:translate-x-1 transition-transform" />
        </button>
      ) : (
        <div className="bg-[#0a0a0a] border-2 border-primary/30 rounded-[2.5rem] p-8 space-y-8 animate-in zoom-in-95 duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10" />
          
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10", step.bg)}>
                <Icon size={32} className={step.color} />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-white leading-none">
                  {step.title[lang]}
                </h3>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-1.5">
                  {lang === 'en' ? `Step ${currentStep + 1} of ${STEPS.length}` : `Schritt ${currentStep + 1} von ${STEPS.length}`}
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 text-white/20 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <p className="text-sm font-bold text-white/60 leading-relaxed uppercase tracking-widest min-h-[60px]">
            {step.desc[lang]}
          </p>

          <div className="flex items-center justify-between pt-4">
            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500", 
                    i === currentStep ? "w-8 bg-primary" : "w-1.5 bg-white/10"
                  )} 
                />
              ))}
            </div>
            
            <div className="flex gap-3">
              {currentStep > 0 && (
                <button 
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="p-4 bg-white/5 rounded-2xl border border-white/10 text-white/40 hover:text-white"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
              
              {currentStep < STEPS.length - 1 ? (
                <button 
                  onClick={() => { playHeartbeat(); setCurrentStep(prev => prev + 1); }}
                  className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                  {lang === 'en' ? "Next Tool" : "Nächstes Tool"} <ChevronRight size={14} />
                </button>
              ) : (
                <button 
                  onClick={handleDismiss}
                  className="px-8 py-4 bg-[#1b4d3e] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg"
                >
                  {lang === 'en' ? "Got it" : "Verstanden"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
