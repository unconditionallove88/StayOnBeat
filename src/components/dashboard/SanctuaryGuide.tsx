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
  CheckCircle2
} from 'lucide-react';
import { RadiatingThirdEye } from '@/components/ui/radiating-third-eye';
import { cn } from '@/lib/utils';
import { playHeartbeat } from '@/lib/resonance';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * @fileOverview Sanctuary Guide Component (The Handover).
 * Explains how each tool functions and its connection to the Pulse Guardian.
 * Fully responsive for iPhone/Android.
 */

const STEPS = [
  {
    id: 'radar',
    title: { en: "The Pulse Radar", de: "Der Puls-Radar heute" },
    desc: { 
      en: "Your mesh-based location tracker Shared only with those you love Pulse Guardian monitors your proximity to help stations and friends", 
      de: "Dein Mesh-Ortungssystem heute hier Nur mit deinen Liebsten geteilt Pulse Guardian überwacht deine Nähe" 
    },
    howItWorks: {
      en: "Tap to view friends and awareness hubs within the Sovereign Mesh Grid Toggle privacy to go invisible",
      de: "Tippe um Freunde zu sehen Innerhalb des Sovereign Mesh Grids Schalte Privatsphäre nach Bedarf um"
    },
    connection: {
      en: "Pulse Guardian: Analyzes proximity alerts and triggers mesh triangulation during distress",
      de: "Pulse Guardian: Analysiert Standort-Warnungen Und aktiviert die Mesh-Triangulation heute"
    },
    icon: RadiatingThirdEye,
    color: "text-blue-400",
    bg: "bg-blue-500/10"
  },
  {
    id: 'lab',
    title: { en: "Pulse Lab", de: "Sitzungs-Labor heute hier" },
    desc: { 
      en: "Log your session intake responsibly Pulse Guardian calibrates your safety thresholds in real-time based on pharmacology", 
      de: "Notiere deine Sitzungs-Aufnahme heute Pulse Guardian kalibriert deine Limits Basierend auf deiner Pharmakologie heute" 
    },
    howItWorks: {
      en: "Select substances and enter amounts The lab assesses risk interactions against your profile",
      de: "Wähle Substanzen und Mengen aus Das Labor bewertet Interaktions-Risiken Basierend auf deinem Profil heute"
    },
    connection: {
      en: "Pulse Guardian: Automatically recalculates biological limits for every entry logged",
      de: "Pulse Guardian: Berechnet biologische Grenzwerte Bei jedem Eintrag automatisch neu"
    },
    icon: Microscope,
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    id: 'sync',
    title: { en: "Pulse Sync", de: "Vital-Sync heute hier" },
    desc: { 
      en: "Connect your wearable device We monitor your heart rate to ensure your rhythm stays steady against baseline", 
      de: "Verbinde dein Wearable heute hier Wir überwachen deinen Puls heute Damit dein Rhythmus stabil bleibt" 
    },
    howItWorks: {
      en: "Sync with Apple Watch or Oura Ring Get real-time biometric feedback during your session",
      de: "Synchronisiere Apple Watch oder Oura Erhalte Echtzeit-Biometrie-Feedback Während deiner Sitzung heute hier"
    },
    connection: {
      en: "Pulse Guardian: Compares live biometric data against pharmacological logs to detect physiological stress",
      de: "Pulse Guardian: Vergleicht Live-Vitalwerte Mit Labor-Logs zur Stresserkennung heute"
    },
    icon: Watch,
    color: "text-accent",
    bg: "bg-accent/10"
  },
  {
    id: 'letters',
    title: { en: "Love Letters", de: "Liebesbriefe heute hier" },
    desc: { 
      en: "A note to your future self Written in light stored in the sanctuary for when you need it", 
      de: "Nachricht an dein zukünftiges Ich In Licht geschrieben heute hier Sicher im Sanctuary verwahrt heute" 
    },
    howItWorks: {
      en: "Type or dictate a message while you feel radiant We seal it until your recovery phase",
      de: "Schreibe oder diktiere eine Nachricht Solange du dich strahlend fühlst Wir versiegeln sie für danach"
    },
    connection: {
      en: "Pulse Guardian: Surfaces your love letters automatically if post-session paranoia or low resonance is detected",
      de: "Pulse Guardian: Zeigt Liebesbriefe automatisch Bei Paranoia oder niedriger Resonanz heute"
    },
    icon: PenLine,
    color: "text-purple-400",
    bg: "bg-purple-500/10"
  },
  {
    id: 'supporter',
    title: { en: "The Supporter", de: "Unterstützer heute hier" },
    desc: { 
      en: "Your sentient AI companion Ask anything about safety phases or grounding Available 24/7 within your sanctuary", 
      de: "Dein empathischer KI-Begleiter heute Frage alles über Sicherheit heute Jederzeit im Sanctuary erreichbar heute" 
    },
    howItWorks: {
      en: "Ask questions via voice or text Select your current phase for tailored guidance",
      de: "Stelle Fragen per Sprache/Text Wähle deine aktuelle Phase aus Für maßgeschneiderte Begleitung heute hier"
    },
    connection: {
      en: "Pulse Guardian: Feeds session context to the Supporter to provide tailored pharmacological safety advice",
      de: "Pulse Guardian: Teilt Sitzungskontext mit Supporter Für maßgeschneiderte Sicherheitsratschläge heute hier"
    },
    icon: Shield,
    color: "text-primary",
    bg: "bg-primary/10"
  }
];

export function SanctuaryGuide({ lang = 'en', forceOpen = false, onDismiss }: { lang?: 'en' | 'de', forceOpen?: boolean, onDismiss?: () => void }) {
  const [isOpen, setIsOpen] = useState(forceOpen);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasDismissed, setHasDismissed] = useState(false);

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
                {lang === 'en' ? "Sanctuary Guide Active" : "Sanctuary Begleiter heute hier"}
              </span>
              <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
                {lang === 'en' ? "How to use your tools" : "Wie du deine Tools nutzt heute"}
              </p>
            </div>
          </div>
          <ChevronRight size={16} className="text-primary/40 group-hover:translate-x-1 transition-transform" />
        </button>
      ) : (
        <div className="fixed inset-0 z-[5000] bg-black flex flex-col animate-in fade-in duration-500 font-headline pt-safe pb-safe overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
          
          <header className="px-8 pt-10 pb-6 flex items-center justify-between shrink-0 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Sparkles size={24} className="text-primary animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tighter text-white">
                  {lang === 'en' ? "Sanctuary Handover" : "Sanctuary Handover heute"}
                </h2>
                <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">
                  {lang === 'en' ? `Tool ${currentStep + 1} of ${STEPS.length}` : `Tool ${currentStep + 1} von ${STEPS.length}`}
                </p>
              </div>
            </div>
            {!forceOpen && (
              <button onClick={() => setIsOpen(false)} className="p-3 bg-white/5 rounded-full border border-white/10 text-white/40 hover:text-white transition-all">
                <X size={20} />
              </button>
            )}
          </header>

          <ScrollArea className="flex-1 relative z-10 px-8">
            <div className="max-w-2xl mx-auto space-y-10 pb-40">
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
                <div className={cn("w-28 h-28 rounded-[2.5rem] flex items-center justify-center border-2 border-white/10 shadow-2xl transition-all duration-700 mx-auto", step.bg)}>
                  <Icon size={56} className={step.color} />
                </div>

                <div className="text-center space-y-2">
                  <h3 className="text-3xl font-black uppercase tracking-tighter text-white">
                    {lang === 'en' ? step.title.en : step.title.de}
                  </h3>
                  <p className="text-sm font-bold text-white/60 leading-relaxed uppercase tracking-widest max-w-[280px] mx-auto">
                    {lang === 'en' ? step.desc.en : step.desc.de}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase text-blue-400 tracking-[0.3em] block text-center">
                      How it functions
                    </span>
                    <p className="text-xs font-bold text-white/80 leading-relaxed uppercase tracking-widest text-center px-4">
                      {lang === 'en' ? step.howItWorks.en : step.howItWorks.de}
                    </p>
                  </div>

                  <div className="p-8 bg-primary/5 border-2 border-primary/20 rounded-[2.5rem] space-y-4">
                    <div className="flex items-center gap-3">
                      <Shield size={18} className="text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                        Pulse Guardian Intelligence
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white/80 leading-relaxed uppercase tracking-widest italic">
                      {lang === 'en' ? step.connection.en : step.connection.de}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          <footer className="shrink-0 p-8 pt-4 bg-black/90 backdrop-blur-xl border-t border-white/5 relative z-10 pb-safe">
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
                      className="p-5 bg-white/5 rounded-2xl border border-white/10 text-white/40 active:scale-95 transition-all"
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
                End-to-End Encrypted Handover
              </p>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
