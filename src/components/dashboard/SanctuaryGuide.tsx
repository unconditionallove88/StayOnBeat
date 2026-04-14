
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
  Info,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { RadiatingThirdEye } from '@/components/ui/radiating-third-eye';
import { cn } from '@/lib/utils';
import { playHeartbeat } from '@/lib/resonance';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlaceHolderImages } from '@/lib/placeholder-images';

/**
 * @fileOverview Sanctuary Guide Component.
 * Fixed: Imports corrected, unrelated pictures replaced with relevant tool previews.
 * Unified language handling to lowercase for consistency.
 */

const STEPS = [
  {
    id: 'radar',
    title: { en: "The Pulse Radar", de: "Der Puls-Radar" },
    desc: { 
      en: "Your mesh-based location tracker. Shared only with those you love. Pulse Guardian monitors your proximity to help stations and friends.", 
      de: "Dein Mesh-Ortungssystem. Nur mit deinen Liebsten geteilt. Pulse Guardian überwacht deine Nähe zu Hilfsstationen und Freunden." 
    },
    connection: {
      en: "Pulse Guardian: Analyzes proximity alerts and triggers mesh triangulation during distress.",
      de: "Pulse Guardian: Analysiert Standort-Warnungen und aktiviert die Mesh-Triangulation im Notfall."
    },
    icon: RadiatingThirdEye,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    imageId: "guide-radar"
  },
  {
    id: 'lab',
    title: { en: "Pulse Lab", de: "Sitzungs-Labor" },
    desc: { 
      en: "Log your session intake responsibly. Pulse Guardian calibrates your safety thresholds in real-time based on pharmacology and volume.", 
      de: "Notiere deine Sitzungs-Aufnahme verantwortungsbewusst. Pulse Guardian kalibriert deine Sicherheitslimits in Echtzeit." 
    },
    connection: {
      en: "Pulse Guardian: Automatically recalculates biological limits for every entry logged.",
      de: "Pulse Guardian: Berechnet biologische Grenzwerte bei jedem Eintrag automatisch neu."
    },
    icon: Microscope,
    color: "text-primary",
    bg: "bg-primary/10",
    imageId: "guide-lab"
  },
  {
    id: 'sync',
    title: { en: "Pulse Sync", de: "Vital-Sync" },
    desc: { 
      en: "Connect your wearable. We monitor your heart rate to ensure your rhythm stays steady against your session baseline.", 
      de: "Verbinde dein Wearable. Wir überwachen deinen Puls, damit dein Rhythmus im Vergleich zur Basis stabil bleibt." 
    },
    connection: {
      en: "Pulse Guardian: Compares live biometric data against pharmacological logs to detect physiological stress.",
      de: "Pulse Guardian: Vergleicht Live-Vitalwerte mit Labor-Logs, um physischen Stress zu erkennen."
    },
    icon: Watch,
    color: "text-accent",
    bg: "bg-accent/10",
    imageId: "guide-sync"
  },
  {
    id: 'letters',
    title: { en: "Love Letters", de: "Liebesbriefe" },
    desc: { 
      en: "A note to your future self. Written in light, stored in the sanctuary for when you need it most during your recovery.", 
      de: "Eine Nachricht an dein zukünftiges Ich. In Licht geschrieben, sicher verwahrt für deine Erholungsphase." 
    },
    connection: {
      en: "Pulse Guardian: Surfaces your love letters automatically if post-session paranoia or low resonance is detected.",
      de: "Pulse Guardian: Zeigt deine Liebesbriefe automatisch an, falls Paranoia oder niedrige Resonanz erkannt wird."
    },
    icon: PenLine,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    imageId: "guide-letters"
  },
  {
    id: 'supporter',
    title: { en: "The Supporter", de: "Unterstützer" },
    desc: { 
      en: "Your sentient AI companion. Ask anything about safety, phases, or grounding. Available 24/7 within your private sanctuary.", 
      de: "Dein empathischer KI-Begleiter. Frage alles über Sicherheit, Phasen oder Erdung – jederzeit erreichbar." 
    },
    connection: {
      en: "Pulse Guardian: Feeds session context to the Supporter to provide tailored, pharmacological safety advice.",
      de: "Pulse Guardian: Teilt Sitzungskontext mit dem Unterstützer für maßgeschneiderte Sicherheitsratschläge."
    },
    icon: Shield,
    color: "text-primary",
    bg: "bg-primary/10",
    imageId: "guide-supporter"
  },
  {
    id: 'vision',
    title: { en: "Vision of Love", de: "Vision der Liebe" },
    desc: { 
      en: "A sensory grounding tool. Return to harmony through visual and textual resonance when things feel heavy.", 
      de: "Ein sensorisches Erdungs-Tool. Kehre zur Harmonie zurück durch visuelle Resonanz, wenn es schwer wird." 
    },
    connection: {
      en: "Pulse Guardian: Triggers the Vision of Love automatically if biological thresholds are breached.",
      de: "Pulse Guardian: Aktiviert die Vision der Liebe automatisch bei Überschreitung biologischer Grenzwerte."
    },
    icon: Eye,
    color: "text-[#10B981]",
    bg: "bg-[#10B981]/10",
    imageId: "guide-vision"
  }
];

export function SanctuaryGuide({ lang = 'en', forceOpen = false, onDismiss }: { lang?: 'en' | 'de', forceOpen?: boolean, onDismiss?: () => void }) {
  const [isOpen, setIsOpen] = useState(forceOpen);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasDismissed, setHasDismissed] = useState(false);

  // Normalize lang to lowercase for safety
  const currentLang = lang.toLowerCase() as 'en' | 'de';

  useEffect(() => {
    const dismissed = localStorage.getItem('stayonbeat_guide_dismissed');
    if (dismissed && !forceOpen) setHasDismissed(true);
  }, [forceOpen]);

  const handleDismiss = () => {
    localStorage.setItem('stayonbeat_guide_dismissed', 'true');
    setHasDismissed(true);
    setIsOpen(false);
    if (onDismiss) onDismiss();
  };

  if (hasDismissed && !isOpen) return null;

  const step = STEPS[currentStep];
  const Icon = step.icon;
  const imageData = PlaceHolderImages.find(img => img.id === step.imageId);

  return (
    <div className={cn("w-full", !isOpen && "mb-8")}>
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
                {currentLang === 'en' ? "Sanctuary Guide" : "Sanctuary Begleiter"}
              </span>
              <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
                {currentLang === 'en' ? "Presentation of tools" : "Vorstellung der Tools"}
              </p>
            </div>
          </div>
          <ChevronRight size={16} className="text-primary/40 group-hover:translate-x-1 transition-transform" />
        </button>
      ) : (
        <div className="fixed inset-0 z-[1000] bg-black flex flex-col animate-in fade-in duration-500 font-headline pt-safe pb-safe overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
          
          <header className="px-8 pt-10 pb-6 flex items-center justify-between shrink-0 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Sparkles size={24} className="text-primary animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tighter text-white">
                  {currentLang === 'en' ? "Sanctuary Guide" : "Sanctuary Begleiter"}
                </h2>
                <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">
                  {currentLang === 'en' ? `Tool ${currentStep + 1} of ${STEPS.length}` : `Tool ${currentStep + 1} von ${STEPS.length}`}
                </p>
              </div>
            </div>
            {!forceOpen && (
              <button onClick={() => setIsOpen(false)} className="p-3 bg-white/5 rounded-full border border-white/10 text-white/40">
                <X size={20} />
              </button>
            )}
          </header>

          <ScrollArea className="flex-1 relative z-10 px-8">
            <div className="max-w-2xl mx-auto space-y-10 pb-40">
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
                <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border-2 border-white/10 shadow-2xl group">
                  <img 
                    src={imageData?.imageUrl || `https://picsum.photos/seed/${step.id}/800/600`} 
                    alt={step.title[currentLang]} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                    data-ai-hint={imageData?.imageHint || "app interface"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute bottom-8 left-8 flex items-center gap-4">
                    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center border border-white/20 shadow-xl backdrop-blur-md", step.bg)}>
                      <Icon size={32} className={step.color} />
                    </div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter text-white drop-shadow-lg">
                      {step.title[currentLang]}
                    </h3>
                  </div>
                </div>

                <div className="space-y-6 px-2">
                  <p className="text-lg font-bold text-white leading-relaxed uppercase tracking-tight">
                    {step.desc[currentLang]}
                  </p>

                  <div className="p-6 bg-primary/5 border border-primary/20 rounded-[2rem] space-y-3">
                    <div className="flex items-center gap-3">
                      <Shield size={16} className="text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                        Pulse Guardian Connection
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white/60 leading-relaxed uppercase tracking-widest">
                      {step.connection[currentLang]}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          <footer className="shrink-0 p-8 pt-4 bg-black/80 backdrop-blur-xl border-t border-white/5 relative z-10">
            <div className="max-w-2xl mx-auto flex flex-col gap-6">
              <div className="flex items-center justify-between">
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
                      onClick={() => { playHeartbeat(); setCurrentStep(prev => prev - 1); }}
                      className="p-5 bg-white/5 rounded-2xl border border-white/10 text-white/40 active:scale-95"
                    >
                      <ChevronLeft size={24} />
                    </button>
                  )}
                  
                  {currentStep < STEPS.length - 1 ? (
                    <button 
                      onClick={() => { playHeartbeat(); setCurrentStep(prev => prev + 1); }}
                      className="px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-3 shadow-lg shadow-primary/20 active:scale-95 transition-all"
                    >
                      Next <ChevronRight size={18} />
                    </button>
                  ) : (
                    <button 
                      onClick={handleDismiss}
                      className="px-10 py-5 bg-[#1b4d3e] text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-3 shadow-lg active:scale-95 transition-all"
                    >
                      Enter Sanctuary <CheckCircle2 size={18} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-center text-[8px] font-black uppercase tracking-[0.5em] text-white/20">
                End-to-End Encrypted Presentation • Created in harmony
              </p>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
