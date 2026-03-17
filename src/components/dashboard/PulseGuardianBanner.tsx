
"use client";

import React from "react";
import { X, Activity, Bluetooth, Database } from "lucide-react";
import { GuardianLogo } from "@/components/ui/guardian-logo";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * @fileOverview PulseGuardianBanner Component.
 * Supports two variants: 
 * - 'banner': A wide, informative banner for lists or labs.
 * - 'icon': A high-fidelity circular header button.
 * Uses a Top Sheet for a true "drop down" intelligence feed.
 */

interface PulseGuardianBannerProps {
  lang?: "en" | "de";
  variant?: "banner" | "icon";
}

export default function PulseGuardianBanner({ 
  lang = "en", 
  variant = "banner" 
}: PulseGuardianBannerProps) {
  const isEn = lang === "en";

  const InfoContent = () => (
    <div className="w-full max-w-2xl mx-auto pb-12 font-headline relative">
      {/* Description */}
      <p className="text-white/60 text-sm font-bold leading-relaxed mb-10 uppercase tracking-wide px-2">
        {isEn
          ? "Pulse Guardian is your sanctuary's central intelligence. I continuously aggregate data from all tools to ensure your journey stays safe and resonant."
          : "Pulse Guardian ist die zentrale Intelligenz deines Refugiums. Ich sammle kontinuierlich Daten aus allen Tools, um sicherzustellen, dass deine Reise sicher und resonant bleibt."}
      </p>

      {/* Integration Pillars */}
      <div className="space-y-4 px-2">
        {[
          {
            icon: <Bluetooth size={18} />,
            color: "text-[#EBFB3B]",
            bg: "bg-[#EBFB3B]/10",
            title: isEn ? "Pulse Sync Integration" : "Pulse Sync Integration",
            desc: isEn
              ? "Reads live vitals from your wearable to monitor physiological stress."
              : "Liest Live-Vitalwerte von deinem Wearable, um physiologischen Stress zu überwachen.",
          },
          {
            icon: <Activity size={18} />,
            color: "text-[#10B981]",
            bg: "bg-[#10B981]/10",
            title: isEn ? "Pulse Lab Awareness" : "Pulse Lab Bewusstsein",
            desc: isEn
              ? "Automatically recalibrates safety limits based on your substance intake logs."
              : "Kalibriert Sicherheitslimits automatisch basierend auf deinen Substanz-Protokollen.",
          },
          {
            icon: <Database size={18} />,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
            title: isEn ? "Profile Calibration" : "Profil-Kalibrierung",
            desc: isEn
              ? "Adjusts thresholds based on your health conditions and medications."
              : "Passt Schwellenwerte basierend auf deinen Gesundheitszuständen und Medikamenten an.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-5 p-6 rounded-[2rem] bg-white/5 border border-white/5 transition-all hover:bg-white/10"
          >
            <div className={cn(item.color, "mt-0.5 shrink-0 p-2.5 rounded-xl", item.bg)}>{item.icon}</div>
            <div className="space-y-1">
              <p className="text-white text-xs font-black uppercase tracking-tight">{item.title}</p>
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-white/5 text-center">
        <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.5em]">
          {isEn
            ? "Processed locally with love 💚"
            : "Lokal verarbeitet mit Liebe 💚"}
        </p>
      </div>
    </div>
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        {variant === "banner" ? (
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl mb-6 border border-[#A855F7]/20 bg-[#A855F7]/5 text-left transition hover:border-[#A855F7]/40 active:scale-[0.99]">
            <GuardianLogo size={24} className="shrink-0" />
            <div className="flex-1">
              <p className="text-[#A855F7] text-[10px] font-black uppercase tracking-widest leading-none">
                Pulse Guardian
              </p>
              <p className="text-white/40 text-[9px] mt-1 font-bold uppercase tracking-widest">
                {isEn
                  ? "Integrated Safety Engine. Tap to see how I protect you."
                  : "Integrierte Sicherheits-Engine. Tippe um zu sehen, wie ich dich schütze."}
              </p>
            </div>
            <span className="text-white/20 text-[10px]">›</span>
          </button>
        ) : (
          <button 
            className="p-2 bg-[#A855F7]/10 rounded-full border border-[#A855F7]/30 hover:border-[#A855F7] transition-all active:scale-95 flex items-center justify-center group"
            title="Pulse Guardian"
          >
            <GuardianLogo size={28} className="group-hover:scale-110 transition-transform" />
          </button>
        )}
      </SheetTrigger>

      <SheetContent 
        side="top" 
        className="bg-black border-white/10 p-0 rounded-b-[3.5rem] h-auto max-h-[90vh] overflow-hidden flex flex-col shadow-[0_30px_100px_rgba(0,0,0,0.8)]"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#A855F7]/5 blur-[100px] -z-10 pointer-events-none" />
        
        <SheetHeader className="p-8 pb-4 shrink-0">
          <div className="flex items-center justify-between max-w-2xl mx-auto w-full">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#A855F7]/10 border border-[#A855F7]/20 flex items-center justify-center shadow-lg">
                <GuardianLogo size={32} />
              </div>
              <div>
                <SheetTitle className="text-white font-black text-2xl uppercase tracking-tighter leading-none text-left">Pulse Guardian</SheetTitle>
                <p className="text-[9px] text-[#A855F7] font-black uppercase tracking-[0.3em] mt-1.5 text-left">Central Intelligence</p>
              </div>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 px-8">
          <InfoContent />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
