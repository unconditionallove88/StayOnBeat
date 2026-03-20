"use client";

import React from "react";
import { Activity, Shield, AlertTriangle } from "lucide-react";
import { playHeartbeat } from "@/lib/resonance";

/**
 * @fileOverview Guardian Simulator.
 * A compact dev tool to test safety state transitions.
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

  const handleHrChange = (val: number) => {
    if (Math.abs(val - heartRate) > 10) playHeartbeat();
    setHeartRate(val);
  };

  const handleSubChange = (count: number) => {
    playHeartbeat();
    setSubstanceCount(count);
  };

  return (
    <div className="w-full space-y-4 animate-in fade-in duration-500 max-w-md mx-auto">
      <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-6 shadow-xl">
        {/* Heart Rate Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <label className="text-white/40 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
              <Activity size={14} className="text-[#10B981]" />
              {isEn ? "Simulator Pulse" : "Sim. Puls"}
            </label>
            <span
              className="text-xl font-black tabular-nums"
              style={{ color: heartRate > 130 ? "#DC2626" : heartRate > 100 ? "#F59E0B" : "#10B981" }}
            >
              {heartRate} <span className="text-[9px] text-white/20">BPM</span>
            </span>
          </div>
          <input
            type="range"
            min={50}
            max={160}
            value={heartRate}
            onChange={(e) => handleHrChange(Number(e.target.value))}
            className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[#10B981]"
          />
        </div>

        {/* Substance Count */}
        <div className="space-y-3">
          <label className="text-white/40 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
            <Shield size={14} className="text-[#10B981]" />
            {isEn ? "Sim. Session Intake" : "Sim. Aufnahme"}
          </label>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => handleSubChange(n)}
                className="flex-1 py-3 rounded-lg text-[10px] font-black border transition-all active:scale-95"
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
      </div>
    </div>
  );
}
