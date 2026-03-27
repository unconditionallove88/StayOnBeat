"use client";

import React from "react";
import { HeartHandshake, AlertTriangle, ShieldAlert, Sparkles, Wind } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview GuardianStatusBar Component.
 * Status color sync: #1b4d3e (Abundant Green)
 */

type Status = "safe" | "caution" | "locked";

interface Props {
  status: Status;
  heartRate?: number;
  lang?: "en" | "de";
  vibeKey?: string;
}

export default function GuardianStatusBar({
  status,
  heartRate,
  lang = "en",
  vibeKey
}: Props) {
  const config = {
    safe: {
      color: "#1b4d3e", // Wise and abundant green
      icon: <HeartHandshake size={16} />,
      vibeIcon: <Sparkles size={14} />,
      text: {
        en: "Pulse Guardian: You are in a steady rhythm",
        de: "Pulse Guardian: Dein Rhythmus ist sanft und stabil"
      }
    },
    caution: {
      color: "#F59E0B",
      icon: <AlertTriangle size={16} />,
      vibeIcon: <Wind size={14} />,
      text: {
        en: "Pulse Guardian: Your heart is elevated",
        de: "Pulse Guardian: Dein Herzschlag ist erhöht"
      }
    },
    locked: {
      color: "#DC2626",
      icon: <ShieldAlert size={16} />,
      vibeIcon: <ShieldAlert size={14} />,
      text: {
        en: "Pulse Guardian: Session paused for resonance",
        de: "Pulse Guardian: Sitzung zur Ruhe pausiert"
      }
    },
  };

  const current = config[status] || config.safe;
  const displayText = (current.text as any)[lang] || (current.text as any).en;

  const vibeTextMap: Record<string, Record<string, string>> = {
    hazy: { en: "Honoring my drifting state", de: "Meinen schwebenden Zustand achtend" },
    overwhelmed: { en: "Acting with extra care", de: "Mit besonderer Achtsamkeit handelnd" },
    radiant: { en: "Radiating inner light", de: "Inneres Licht strahlend" },
    harmony: { en: "Aligned in balance", de: "Im Gleichgewicht ausgerichtet" },
    calm: { en: "Steady and clear", de: "Ruhig und klar" }
  };

  const vibeNote = vibeKey ? vibeTextMap[vibeKey]?.[lang || 'en'] : null;

  return (
    <div className="w-full flex flex-col gap-1 mb-2 animate-in fade-in slide-in-from-top-2">
      <div
        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-500 shadow-sm"
        style={{
          backgroundColor: `${current.color}15`,
          borderColor: `${current.color}40`,
          color: current.color,
        }}
      >
        <div className="flex-shrink-0">{current.icon}</div>
        <p className="text-[11px] font-black uppercase tracking-wider leading-none">
          {displayText}
          {heartRate !== undefined && ` • ${heartRate} BPM`}
        </p>
      </div>
      
      {vibeNote && status !== 'locked' && (
        <div className="px-4 flex items-center gap-2 text-white/30">
          {current.vibeIcon}
          <span className="text-[9px] font-bold uppercase tracking-widest">
            {vibeNote}
          </span>
        </div>
      )}
    </div>
  );
}