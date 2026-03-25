
"use client";

import React from "react";
import { HeartHandshake, AlertTriangle, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview GuardianStatusBar Component.
 * Soulful calibration: Refined status messages for organic feel across all languages.
 */

type Status = "safe" | "caution" | "locked";

interface Props {
  status: Status;
  heartRate?: number;
  lang?: "en" | "de" | "pt" | "ru";
}

export default function GuardianStatusBar({
  status,
  heartRate,
  lang = "en",
}: Props) {
  const config = {
    safe: {
      color: "#10B981",
      icon: <HeartHandshake size={16} />,
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
      text: {
        en: "Pulse Guardian: Session paused for safety",
        de: "Pulse Guardian: Sitzung zur Ruhe pausiert",
        pt: "Pulse Guardian: Sessão pausada para seu descanso",
        ru: "Pulse Guardian: Сессия приостановлена для отдыха"
      }
    },
  };

  const current = config[status] || config.safe;
  const displayText = (current.text as any)[lang] || (current.text as any).en;

  return (
    <div
      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl mb-2 border transition-all duration-500 animate-in fade-in slide-in-from-top-2 shadow-sm"
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
  );
}
