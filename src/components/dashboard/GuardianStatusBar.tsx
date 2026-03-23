"use client";

import React from "react";
import { HeartHandshake, AlertTriangle, ShieldAlert } from "lucide-react";

/**
 * @fileOverview GuardianStatusBar Component.
 * Supports EN, DE, PT, RU.
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
        en: "Pulse Guardian: You are in a steady rhythm.",
        de: "Pulse Guardian: Du bist in einem stabilen Rhythmus.",
        pt: "Pulse Guardian: Você está em um ritmo estável.",
        ru: "Pulse Guardian: Твой ритм стабилен."
      }
    },
    caution: {
      color: "#F59E0B",
      icon: <AlertTriangle size={16} />,
      text: {
        en: "Pulse Guardian: Your heart is elevated.",
        de: "Pulse Guardian: Dein Herz ist erhöht.",
        pt: "Pulse Guardian: Seu coração está acelerado.",
        ru: "Pulse Guardian: Пульс повышен."
      }
    },
    locked: {
      color: "#DC2626",
      icon: <ShieldAlert size={16} />,
      text: {
        en: "Pulse Guardian: Session Paused for Safety.",
        de: "Pulse Guardian: Sitzung zur Sicherheit pausiert.",
        pt: "Pulse Guardian: Sessão pausada por segurança.",
        ru: "Pulse Guardian: Сессия приостановлена."
      }
    },
  };

  const current = config[status] || config.safe;
  const displayText = (current.text as any)[lang] || (current.text as any).en;

  return (
    <div
      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl mb-2 border transition-all duration-500 animate-in fade-in slide-in-from-top-2"
      style={{
        backgroundColor: `${current.color}15`,
        borderColor: `${current.color}40`,
        color: current.color,
      }}
    >
      <div className="flex-shrink-0">{current.icon}</div>
      <p className="text-[11px] font-black uppercase tracking-wider">
        {displayText}
        {heartRate !== undefined && ` • ${heartRate} BPM`}
      </p>
    </div>
  );
}
