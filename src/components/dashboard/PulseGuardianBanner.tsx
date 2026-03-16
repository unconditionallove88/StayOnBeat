"use client";

import React, { useState } from "react";
import { Shield, X, Activity, Bluetooth, Database } from "lucide-react";

/**
 * @fileOverview PulseGuardianBanner Component.
 * Supports two variants: 
 * - 'banner' (default): A wide, informative banner for lists or labs.
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
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl mb-6 border border-emerald-900/40 bg-emerald-950/30 text-left transition hover:border-emerald-700/60 active:scale-[0.99]"
        >
          <Shield size={18} className="text-emerald-500 shrink-0" />
          <div className="flex-1">
            <p className="text-emerald-400 text-xs font-black uppercase tracking-widest">
              Pulse Guardian
            </p>
            <p className="text-slate-500 text-[10px] mt-0.5">
              {isEn
                ? "Integrated Safety Engine. Tap to see how I protect you."
                : "Integrierte Sicherheits-Engine. Tippe um zu sehen, wie ich dich schütze."}
            </p>
          </div>
          <span className="text-slate-600 text-[10px]">›</span>
        </button>
      ) : (
        <button 
          onClick={() => setOpen(true)} 
          className="p-2.5 bg-emerald-600/10 rounded-full border border-emerald-500/30 hover:border-emerald-500 transition-colors"
          title="Pulse Guardian"
        >
          <Shield className="w-5 h-5 text-emerald-500" />
        </button>
      )}

      {/* THE INFO SHEET (Bottom Drawer) */}
      {open && (
        <div className="fixed inset-0 z-[6000] flex items-end justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-t-[2.5rem] p-8 pb-12 shadow-2xl animate-in slide-in-from-bottom-full duration-500">

            {/* Close */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 flex items-center justify-center">
                  <Shield size={20} className="text-emerald-500" />
                </div>
                <h3 className="text-white font-black text-xl">Pulse Guardian</h3>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            {/* Description */}
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              {isEn
                ? "Pulse Guardian is your sanctuary's central intelligence. I continuously aggregate data from all tools to ensure your journey stays safe and resonant."
                : "Pulse Guardian ist die zentrale Intelligenz deines Refugiums. Ich sammle kontinuierlich Daten aus allen Tools, um sicherzustellen, dass deine Reise sicher und resonant bleibt."}
            </p>

            {/* Integration Pillars */}
            <div className="space-y-3">
              {[
                {
                  icon: <Bluetooth size={16} />,
                  title: isEn ? "Pulse Sync Integration" : "Pulse Sync Integration",
                  desc: isEn
                    ? "Reads live vitals from your wearable to monitor physiological stress."
                    : "Liest Live-Vitalwerte von deinem Wearable, um physiologischen Stress zu überwachen.",
                },
                {
                  icon: <Activity size={16} />,
                  title: isEn ? "Pulse Lab Awareness" : "Pulse Lab Bewusstsein",
                  desc: isEn
                    ? "Automatically recalibrates safety limits based on your substance intake logs."
                    : "Kalibriert Sicherheitslimits automatisch basierend auf deinen Substanz-Protokollen.",
                },
                {
                  icon: <Database size={16} />,
                  title: isEn ? "Profile Calibration" : "Profil-Kalibrierung",
                  desc: isEn
                    ? "Adjusts thresholds based on your health conditions and medications."
                    : "Passt Schwellenwerte basierend auf deinen Gesundheitszuständen und Medikamenten an.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800"
                >
                  <div className="text-emerald-500 mt-0.5 shrink-0">{item.icon}</div>
                  <div>
                    <p className="text-white text-xs font-bold">{item.title}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-[10px] text-slate-600 mt-6 uppercase tracking-widest">
              {isEn
                ? "Data is processed locally and with love."
                : "Daten werden lokal und mit Liebe verarbeitet."}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
