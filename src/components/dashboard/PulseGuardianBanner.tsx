"use client";

import React, { useState } from "react";
import { Shield, X, Activity, Bluetooth, Brain } from "lucide-react";

export default function PulseGuardianBanner({ lang = "en" }: { lang?: "en" | "de" }) {
  const [open, setOpen] = useState(false);
  const isEn = lang === "en";

  return (
    <>
      {/* THE CLICKABLE BANNER */}
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
              ? "Your AI safety companion. Tap to learn more."
              : "Dein KI-Sicherheitsbegleiter. Tippe für mehr."}
          </p>
        </div>
        <span className="text-slate-600 text-[10px]">›</span>
      </button>

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
                ? "Pulse Guardian is your personal AI safety companion inside StayOnBeat. It watches over your session in real time — combining your substance intake, your vitals from Pulse Sync, and your personal health profile to keep you safe."
                : "Pulse Guardian ist dein persönlicher KI-Sicherheitsbegleiter in StayOnBeat. Er überwacht deine Sitzung in Echtzeit — kombiniert deine Substanzaufnahme, deine Vitalwerte aus Pulse Sync und dein persönliches Gesundheitsprofil, um dich zu schützen."}
            </p>

            {/* 3 Pillars */}
            <div className="space-y-3">
              {[
                {
                  icon: <Brain size={16} />,
                  title: isEn ? "Medical Knowledge" : "Medizinisches Wissen",
                  desc: isEn
                    ? "Clinically reviewed harm reduction guidance."
                    : "Klinisch geprüfte Schadensminimierungshinweise.",
                },
                {
                  icon: <Bluetooth size={16} />,
                  title: isEn ? "Pulse Sync" : "Pulse Sync",
                  desc: isEn
                    ? "Real-time vitals from your Apple Watch, Oura Ring or Whoop."
                    : "Echtzeit-Vitalwerte von deiner Apple Watch, Oura Ring oder Whoop.",
                },
                {
                  icon: <Activity size={16} />,
                  title: isEn ? "Session Lock" : "Sitzungssperre",
                  desc: isEn
                    ? "If your body signals danger, the Pulse Lab pauses automatically."
                    : "Wenn dein Körper Gefahr signalisiert, pausiert das Pulse Lab automatisch.",
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
                ? "Not medical advice. Harm reduction guidance only."
                : "Keine medizinische Beratung. Nur Schadensminimierungshinweise."}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
