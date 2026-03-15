
"use client";

import React from "react";
import { Activity, Shield, AlertTriangle } from "lucide-react";

/**
 * @fileOverview Guardian Simulator.
 * A high-fidelity demo tool to test safety state transitions.
 * Receives state from Dashboard to drive the entire UI.
 * Removed internal Status Bar to maintain "Single Instance" pattern.
 */

interface Props {
  heartRate: number;
  setHeartRate: (val: number) => void;
  substanceCount: number;
  setSubstanceCount: (val: number) => void;
  lang?: "en" | "de";
}

export default function GuardianSimulator({ 
  heartRate, 
  setHeartRate, 
  substanceCount, 
  setSubstanceCount, 
  lang = "en" 
}: Props) {
  const isEn = lang === "en";

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-widest text-[#10B981] font-black">
            {isEn ? "🧪 Lab Simulation" : "🧪 Lab-Simulation"}
          </p>
          <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Dev Access</span>
        </div>

        {/* Heart Rate Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <label className="text-white/60 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
              <Activity size={16} className="text-[#10B981]" />
              {isEn ? "Live Pulse" : "Herzfrequenz"}
            </label>
            <span
              className="text-2xl font-black tabular-nums"
              style={{ color: heartRate > 130 ? "#DC2626" : heartRate > 100 ? "#F59E0B" : "#10B981" }}
            >
              {heartRate} <span className="text-[10px] text-white/20">BPM</span>
            </span>
          </div>
          <input
            type="range"
            min={50}
            max={160}
            value={heartRate}
            onChange={(e) => setHeartRate(Number(e.target.value))}
            className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#10B981]"
          />
          <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-white/20">
            <span>{isEn ? "Steady" : "Ruhend"}</span>
            <span>{isEn ? "Elevated" : "Erhöht"}</span>
            <span className="text-red-500/60">{isEn ? "Critical" : "Gefahr"}</span>
          </div>
        </div>

        {/* Substance Count */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <label className="text-white/60 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
              <Shield size={16} className="text-[#10B981]" />
              {isEn ? "Session Intake" : "Protokolliert"}
            </label>
            <span
              className="text-xl font-black tabular-nums"
              style={{ color: substanceCount >= 5 ? "#DC2626" : substanceCount >= 3 ? "#F59E0B" : "#10B981" }}
            >
              {substanceCount} <span className="text-[10px] text-white/20">/ 5</span>
            </span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setSubstanceCount(n)}
                className="flex-1 py-4 rounded-xl text-xs font-black border-2 transition-all active:scale-95"
                style={{
                  backgroundColor: substanceCount >= n ? (n >= 5 ? "rgba(220,38,38,0.2)" : n >= 3 ? "rgba(245,158,11,0.2)" : "rgba(16,185,129,0.2)") : "transparent",
                  borderColor: substanceCount >= n ? (n >= 5 ? "#DC2626" : n >= 3 ? "#F59E0B" : "#10B981") : "rgba(255,255,255,0.05)",
                  color: substanceCount >= n ? "white" : "rgba(255,255,255,0.2)",
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Live Feedback */}
        {heartRate > 100 && heartRate <= 130 && (
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 animate-in slide-in-from-bottom-2">
            <AlertTriangle size={18} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-amber-200/60 text-xs font-medium leading-relaxed">
              {isEn
                ? "Pulse Guardian: Your body is showing elevated signals. Consider pausing, hydrating, and resting."
                : "Pulse Guardian: Dein Körper zeigt erhöhte Signale. Erwäge eine Pause, Hydration und Ruhe."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
