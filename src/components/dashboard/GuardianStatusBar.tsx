"use client";

import React from "react";
import { HeartHandshake, AlertTriangle, ShieldAlert, Sparkles, Wind } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview GuardianStatusBar Component.
 * Linguistic purification: Removed "safety" and "protection".
 * Soulful calibration: Refined status messages for organic feel across all languages.
 * Vibe-aware nuance: Includes emotional alignment in the status message.
 */

type Status = "safe" | "caution" | "locked";

interface Props {
  status: Status;
  heartRate?: number;
  lang?: "en" | "de" | "pt" | "ru";
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
      color: "#10B981",
      icon: <HeartHandshake size={16} />,
      vibeIcon: <Sparkles size={14} />,
      text: {
        en: "Pulse Guardian: You are in a steady rhythm",
        de: "Pulse Guardian: Dein Rhythmus ist sanft und stabil",
        pt: "Pulse Guardian: Seu ritmo está estável e tranquilo",
        ru: "Pulse Guardian: Твой ритм стабилен и гармоничен"
      }
    },
    caution: {
      color: "#F59E0B",
      icon: <AlertTriangle size={16} />,
      vibeIcon: <Wind size={14} />,
      text: {
        en: "Pulse Guardian: Your heart is elevated",
        de: "Pulse Guardian: Dein Herzschlag ist erhöht",
        pt: "Pulse Guardian: Seu coração está acelerado",
        ru: "Pulse Guardian: Твой пульс немного завышен"
      }
    },
    locked: {
      color: "#DC2626",
      icon: <ShieldAlert size={16} />,
      vibeIcon: <ShieldAlert size={14} />,
      text: {
        en: "Pulse Guardian: Session paused for resonance",
        de: "Pulse Guardian: Sitzung zur Ruhe pausiert",
        pt: "Pulse Guardian: Sessão pausada para seu descanso",
        ru: "Pulse Guardian: Сессия приостановлена для отдыха"
      }
    },
  };

  const current = config[status] || config.safe;
  const displayText = (current.text as any)[lang] || (current.text as any).en;

  const vibeTextMap: Record<string, Record<string, string>> = {
    hazy: { en: "Honoring my drifting state", de: "Meinen schwebenden Zustand achtend", pt: "Honrando meu estado à deriva", ru: "Уважаю свое туманное состояние" },
    overwhelmed: { en: "Acting with extra care", de: "Mit besonderer Achtsamkeit handelnd", pt: "Agindo com cuidado redobrado", ru: "Действую с особой бережностью" },
    radiant: { en: "Radiating inner light", de: "Inneres Licht strahlend", pt: "Irradiando luz interior", ru: "Сияю внутренним светом" },
    harmony: { en: "Aligned in balance", de: "Im Gleichgewicht ausgerichtet", pt: "Alinhado em equilíbrio", ru: "В балансе и гармонии" },
    calm: { en: "Steady and clear", de: "Ruhig und klar", pt: "Estável e claro", ru: "Спокоен и ясен" }
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
        <p className={cn(
          "text-[11px] font-black uppercase tracking-wider leading-none",
          lang === 'ru' && "italic font-serif"
        )}>
          {displayText}
          {heartRate !== undefined && ` • ${heartRate} BPM`}
        </p>
      </div>
      
      {vibeNote && status !== 'locked' && (
        <div className="px-4 flex items-center gap-2 text-white/30">
          {current.vibeIcon}
          <span className={cn("text-[9px] font-bold uppercase tracking-widest", lang === 'ru' && "italic font-serif")}>
            {vibeNote}
          </span>
        </div>
      )}
    </div>
  );
}
