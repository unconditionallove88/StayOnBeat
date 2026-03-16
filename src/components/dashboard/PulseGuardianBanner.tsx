
"use client";

import React, { useState } from "react";
import { Shield, X, Activity, Bluetooth, Database } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview PulseGuardianBanner Component.
 * Supports two variants: 
 * - 'banner': A wide, informative banner for lists or labs.
 * - 'icon': A high-fidelity circular header button.
 */

interface PulseGuardianBannerProps {
  lang?: "en" | "de";
  variant?: "banner" | "icon";
}

export default function PulseGuardianBanner({ 
  lang = "en", 
  variant = "banner" 
}: PulseGuardianBannerProps) {
  const [open, setOpen] = useState(false);
  const isEn = lang === "en";

  return (
    <>
      {/* THE TRIGGER */}
      {variant === "banner" ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl mb-6 border border-[#10B981]/20 bg-[#10B981]/5 text-left transition hover:border-[#10B981]/40 active:scale-[0.99]"
        >
          <Shield size={18} className="text-[#10B981] shrink-0" />
          <div className="flex-1">
            <p className="text-[#10B981] text-[10px] font-black uppercase tracking-widest leading-none">
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
          onClick={() => setOpen(true)} 
          className="p-2.5 bg-[#10B981]/10 rounded-full border border-[#10B981]/30 hover:border-[#10B981] transition-all active:scale-95"
          title="Pulse Guardian"
        >
          <Shield className="w-5 h-5 text-[#10B981]" />
        </button>
      )}

      {/* THE INFO OVERLAY (Drop Down Modal) */}
      {open && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-8 pb-12 shadow-2xl animate-in slide-in-from-top-10 duration-500 relative overflow-hidden font-headline">
            
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/5 blur-3xl -z-10" />

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center shadow-lg">
                  <Shield size={28} className="text-[#10B981]" />
                </div>
                <div>
                  <h3 className="text-white font-black text-2xl uppercase tracking-tighter leading-none">Pulse Guardian</h3>
                  <p className="text-[9px] text-[#10B981] font-black uppercase tracking-[0.3em] mt-1.5">Central Intelligence</p>
                </div>
              </div>
              <button 
                onClick={() => setOpen(false)} 
                className="p-3 bg-white/5 rounded-full border border-white/10 text-white/40 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Description */}
            <p className="text-white/60 text-sm font-bold leading-relaxed mb-10 uppercase tracking-wide">
              {isEn
                ? "Pulse Guardian is your sanctuary's central intelligence. I continuously aggregate data from all tools to ensure your journey stays safe and resonant."
                : "Pulse Guardian ist die zentrale Intelligenz deines Refugiums. Ich sammle kontinuierlich Daten aus allen Tools, um sicherzustellen, dass deine Reise sicher und resonant bleibt."}
            </p>

            {/* Integration Pillars */}
            <div className="space-y-4">
              {[
                {
                  icon: <Bluetooth size={18} />,
                  title: isEn ? "Pulse Sync Integration" : "Pulse Sync Integration",
                  desc: isEn
                    ? "Reads live vitals from your wearable to monitor physiological stress."
                    : "Liest Live-Vitalwerte von deinem Wearable, um physiologischen Stress zu überwachen.",
                },
                {
                  icon: <Activity size={18} />,
                  title: isEn ? "Pulse Lab Awareness" : "Pulse Lab Bewusstsein",
                  desc: isEn
                    ? "Automatically recalibrates safety limits based on your substance intake logs."
                    : "Kalibriert Sicherheitslimits automatisch basierend auf deinen Substanz-Protokollen.",
                },
                {
                  icon: <Database size={18} />,
                  title: isEn ? "Profile Calibration" : "Profil-Kalibrierung",
                  desc: isEn
                    ? "Adjusts thresholds based on your health conditions and medications."
                    : "Passt Schwellenwerte basierend auf deinen Gesundheitszuständen und Medikamenten an.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-5 p-5 rounded-[1.5rem] bg-white/5 border border-white/5 transition-all hover:bg-white/10"
                >
                  <div className="text-[#10B981] mt-0.5 shrink-0 p-2 bg-[#10B981]/10 rounded-lg">{item.icon}</div>
                  <div className="space-y-1">
                    <p className="text-white text-[11px] font-black uppercase tracking-tight">{item.title}</p>
                    <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-white/5 text-center">
              <p className="text-[8px] text-white/20 font-black uppercase tracking-[0.5em]">
                {isEn
                  ? "Processed locally with love 💚"
                  : "Lokal verarbeitet mit Liebe 💚"}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
