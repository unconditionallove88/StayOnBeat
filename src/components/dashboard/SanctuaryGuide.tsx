
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
  Users2,
  Wind,
  Sprout,
  Radio
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { playHeartbeat } from '@/lib/resonance';

/**
 * @fileOverview Sanctuary Guide Component (The Handover).
 * Redesigned for "Zero-Scroll" presence. All info fits on one screen (PC/Mobile).
 * Explains tool functions and their connection to the Pulse Guardian.
 */

const STEPS = [
  {
    id: 'radar',
    title: { en: "Pulse Mesh Radar", de: "Der Puls-Radar heute" },
    desc: { 
      en: "Your location tracker shared only with those you love using the Sovereign Mesh triangulation protocol", 
      de: "Dein Mesh-Ortungssystem heute hier Nur mit deinen Liebsten geteilt Pulse Guardian überwacht deine Nähe" 
    },
    howItWorks: {
      en: "View friends and awareness hubs on a tactical grid Toggle privacy to go invisible or broadcast distress via Mesh",
      de: "Tippe um Freunde zu sehen Innerhalb des Sovereign Mesh Grids Schalte Privatsphäre nach Bedarf um"
    },
    connection: {
      en: "Pulse Guardian: Analyzes Mesh triangulation to direct awareness staff to your precise tactical grid location",
      de: "Pulse Guardian: Analysiert Standort-Warnungen Und aktiviert die Mesh-Triangulation heute"
    },
    icon: Radio,
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
      en: "Select substances and enter amounts The lab assesses risk interactions against your pharmacological profile",
      de: "Wähle Substanzen und Mengen aus Das Labor bewertet Interaktions-Risiken Basierend auf deinem Profil heute"
    },
    connection: {
      en: "Pulse Guardian: Automatically recalculates biological limits for every entry logged in the lab",
      de: "Pulse Guardian: Berechnet biologische Grenzwerte Bei jedem Eintrag automatisch neu"
    },
    icon: Microscope,
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    id: 'chat',
    title: { en: "Love Chat", de: "Love Chat heute" },
    desc: { 
      en: "A dual-pathway portal for community resonance and professional awareness support during your journey", 
      de: "Ein Portal mit zwei Wegen für Gemeinschaft und professionelle Begleitung während deiner Reise" 
    },
    howItWorks: {
      en: "The Holders is for private circle support while The Spectators is a moderated public space for collective care",
      de: "Die Holders sind für private Kreise Die Spectators sind ein moderierter öffentlicher Raum für Fürsorge"
    },
    connection: {
      en: "Pulse Guardian: Monitors communication patterns and provides a fast-track SOS button to awareness staff",
      de: "Pulse Guardian: Überwacht Kommunikationsmuster Und bietet einen schnellen SOS-Button zum Awareness-Team"
    },
    icon: Users2,
    color: "text-[#10B981]",
    bg: "bg-emerald-500/10"
  },
  {
    id: 'breath',
    title: { en: "Breath of Love", de: "Atem der Liebe" },
    desc: { 
      en: "A physiological resonance ritual designed to recalibrate your nervous system and stimulate oxytocin", 
      de: "Ein Ritual zur Neukalibrierung deines Nervensystems Stimuliert Oxytocin und fördert innere Ruhe heute" 
    },
    howItWorks: {
      en: "Follow the rhythmic light to synchronize your breathing and return to a steady physiological state",
      de: "Folge dem rhythmischen Licht Um deinen Atem zu synchronisieren Und in einen stabilen Zustand zu finden"
    },
    connection: {
      en: "Pulse Guardian: Recommends the Breath of Love automatically if elevated heart rate or stress is detected",
      de: "Pulse Guardian: Empfiehlt den Atem der Liebe Falls ein erhöhter Puls oder Stress erkannt wird heute"
    },
    icon: Wind,
    color: "text-emerald-400",
    bg: "bg-emerald-500/5"
  },
  {
    id: 'vision',
    title: { en: "Vision of Love", de: "Vision der Liebe" },
    desc: { 
      en: "A high-fidelity grounding tool using prismatic affirmations to stabilize sensory intensity", 
      de: "Ein Erdungs-Tool das prismatische Affirmationen nutzt Um sensorische Intensität sanft zu stabilisieren heute" 
    },
    howItWorks: {
      en: "Immerse yourself in visual affirmations designed to reduce paranoia and restore emotional harmony",
      de: "Tauche ein in visuelle Affirmationen Um Paranoia zu reduzieren Und emotionale Harmonie zu finden heute"
    },
    connection: {
      en: "Pulse Guardian: Triggers the grounding sequence during the recovery phase or upon manual request",
      de: "Pulse Guardian: Aktiviert die Erdungs-Sequenz Während der Erholungsphase oder bei manuellem Bedarf"
    },
    icon: Eye,
    color: "text-blue-300",
    bg: "bg-blue-300/10"
  },
  {
    id: 'cocreation',
    title: { en: "Co-Creation", de: "Ko-Kreation heute hier" },
    desc: { 
      en: "Your voice shapes this sanctuary Share resonance and feedback to help us grow with love", 
      de: "Deine Stimme gestaltet diesen Raum Teile Resonanz und Feedback Um uns beim Wachsen zu helfen heute" 
    },
    howItWorks: {
      en: "Send heart-based messages or participate in app surveys to improve the collective sanctuary experience",
      de: "Sende herzbasierte Nachrichten Oder nimm an Umfragen teil Um das gemeinsame Erlebnis zu verbessern"
    },
    connection: {
      en: "Pulse Guardian: Aggregates anonymous feedback to evolve intelligence protocols and safety features",
      de: "Pulse Guardian: Sammelt anonymes Feedback Um Intelligenz-Protokolle und Sicherheit zu entwickeln heute"
    },
    icon: Sprout,
    color: "text-primary",
    bg: "bg-primary/5"
  },
  {
    id: 'supporter',
    title: { en: "The Supporter", de: "Unterstützer heute hier" },
    desc: { 
      en: "Your sentient AI companion Ask anything about pharmacological safety or emotional grounding", 
      de: "Dein empathischer KI-Begleiter heute Frage alles über Sicherheit heute Jederzeit im Sanctuary erreichbar heute" 
    },
    howItWorks: {
      en: "Use voice or text to get tailored advice based on your current session phase and intake profile",
      de: "Nutze Sprache oder Text Für maßgeschneiderte Begleitung Basierend auf deinem aktuellen Profil heute hier"
    },
    connection: {
      en: "Pulse Guardian: Feeds real-time session context to the Supporter to ensure advice is medically accurate",
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

  useEffect(() => {
    if (forceOpen) setIsOpen(true);
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
    <div className={cn("w-full transition-all duration-1000", !isOpen && "mb-6")}>
      {!isOpen ? (
        <button 
          onClick={() => { playHeartbeat(); setIsOpen(true); }}
          className="w-full flex items-center justify-between p-4 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/[0.05] transition-all group opacity-60 hover:opacity-100"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="text-white/20" size={16} />
            <div className="text-left">
              <span className="block text-[9px] font-black uppercase text-white/40 tracking-[0.2em]">
                {lang === 'en' ? "Sanctuary Guide" : "Sanctuary Begleiter"}
              </span>
            </div>
          </div>
          <ChevronRight size={14} className="text-white/10 group-hover:text-primary transition-colors" />
        </button>
      ) : (
        <div className="fixed inset-0 z-[5000] bg-black flex flex-col animate-in fade-in duration-500 font-headline pt-safe pb-safe overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
          
          <header className="px-6 sm:px-8 pt-6 sm:pt-10 pb-4 flex items-center justify-between shrink-0 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Sparkles size={20} className="text-primary animate-pulse" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black uppercase tracking-tighter text-white">
                  {lang === 'en' ? "Handover" : "Handover heute"}
                </h2>
                <p className="text-[8px] sm:text-[9px] font-black text-primary uppercase tracking-[0.3em]">
                  {lang === 'en' ? `Tool ${currentStep + 1} of ${STEPS.length}` : `Tool ${currentStep + 1} von ${STEPS.length}`}
                </p>
              </div>
            </div>
            {!forceOpen && (
              <button onClick={() => setIsOpen(false)} className="p-2 sm:p-3 bg-white/5 rounded-full border border-white/10 text-white/40 hover:text-white transition-all">
                <X size={18} />
              </button>
            )}
          </header>

          <main className="flex-1 relative z-10 px-6 sm:px-8 flex flex-col justify-center items-center overflow-hidden">
            <div className="max-w-xl w-full flex flex-col items-center gap-4 sm:gap-8 animate-in slide-in-from-bottom-4 duration-700 py-4">
              
              {/* Central Resonant Icon */}
              <div className={cn(
                "w-20 h-20 sm:w-24 sm:h-24 rounded-[2rem] flex items-center justify-center border-2 border-white/10 shadow-2xl transition-all duration-700", 
                step.bg
              )}>
                <Icon size={40} className={cn("sm:w-12 sm:h-12", step.color)} />
              </div>

              {/* Title & Core Purpose */}
              <div className="text-center space-y-1 sm:space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-white">
                  {lang === 'en' ? step.title.en : step.title.de}
                </h3>
                <p className="text-[11px] sm:text-sm font-bold text-white/60 leading-relaxed uppercase tracking-widest max-w-[280px] sm:max-w-[320px] mx-auto">
                  {lang === 'en' ? step.desc.en : step.desc.de}
                </p>
              </div>

              {/* Functionality & Intelligence Grid */}
              <div className="w-full space-y-3 sm:space-y-4 max-w-sm">
                <div className="text-center space-y-1 sm:space-y-2">
                  <span className="text-[8px] sm:text-[9px] font-black uppercase text-blue-400 tracking-[0.3em]">
                    How it functions
                  </span>
                  <p className="text-[10px] sm:text-xs font-bold text-white/80 leading-relaxed uppercase tracking-widest px-2">
                    {lang === 'en' ? step.howItWorks.en : step.howItWorks.de}
                  </p>
                </div>

                <div className="p-5 sm:p-6 bg-primary/5 border-2 border-primary/20 rounded-[2rem] space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Shield size={14} className="text-primary" />
                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] text-primary">
                      Guardian Intelligence
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs font-bold text-white/80 leading-relaxed uppercase tracking-widest italic text-center">
                    {lang === 'en' ? step.connection.en : step.connection.de}
                  </p>
                </div>
              </div>

            </div>
          </main>

          <footer className="shrink-0 p-6 sm:p-8 bg-black/90 backdrop-blur-xl border-t border-white/5 relative z-10 pb-safe">
            <div className="max-w-xl mx-auto flex flex-col gap-4 sm:gap-6">
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  {STEPS.map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "h-1 rounded-full transition-all duration-500", 
                        i === currentStep ? "w-6 sm:w-8 bg-primary" : "w-1 bg-white/10"
                      )} 
                    />
                  ))}
                </div>
                
                <div className="flex gap-3">
                  {currentStep > 0 && (
                    <button 
                      onClick={() => { playHeartbeat(); setCurrentStep(prev => prev - 1); }}
                      className="p-3 sm:p-4 bg-white/5 rounded-xl sm:rounded-2xl border border-white/10 text-white/40 active:scale-95 transition-all"
                    >
                      <ChevronLeft size={20} />
                    </button>
                  )}
                  
                  {currentStep < STEPS.length - 1 ? (
                    <button 
                      onClick={() => { playHeartbeat(); setCurrentStep(prev => prev + 1); }}
                      className="px-6 sm:px-8 py-4 sm:py-5 bg-primary text-white rounded-xl sm:rounded-2xl font-black uppercase text-[10px] sm:text-xs tracking-widest flex items-center gap-3 shadow-lg shadow-primary/20 active:scale-95 transition-all"
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button 
                      onClick={handleDismiss}
                      className="px-6 sm:px-8 py-4 sm:py-5 bg-[#1b4d3e] text-white rounded-xl sm:rounded-2xl font-black uppercase text-[10px] sm:text-xs tracking-widest flex items-center gap-3 shadow-lg active:scale-95 transition-all"
                    >
                      Enter <CheckCircle2 size={16} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-center text-[7px] sm:text-[8px] font-black uppercase tracking-[0.5em] text-white/20">
                End-to-End Encrypted Handover
              </p>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
