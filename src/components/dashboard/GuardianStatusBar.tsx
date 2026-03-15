"use client";

import React from "react";
import { HeartHandshake, AlertTriangle, ShieldAlert } from "lucide-react";

/**
 * @fileOverview GuardianStatusBar Component.
 * Provides high-fidelity visual feedback on the user's current safety rhythm.
 */

type Status = "safe" | "caution" | "locked";

interface Props {
  status: Status;
  heartRate?: number;
  lang?: "en" | "de";
}

export default function GuardianStatusBar({
  status,
  heartRate,
  lang = "en",
}: Props) {
  const isEn = lang === "en";

  const config = {
    safe: {
      color: "#10B981", // Emerald
      icon: <HeartHandshake size={16} />,
      text: isEn
        ? "Pulse Guardian: You are in a steady rhythm."
        : "Pulse Guardian: Du bist in einem stabilen Rhythmus.",
    },
    caution: {
      color: "#F59E0B", // Amber
      icon: <AlertTriangle size={16} />,
      text: isEn
        ? "Pulse Guardian: Your heart is elevated."
        : "Pulse Guardian: Dein Herz ist erhöht.",
    },
    locked: {
      color: "#DC2626", // Red
      icon: <ShieldAlert size={16} />,
      text: isEn
        ? "Pulse Guardian: Session Paused for Safety."
        : "Pulse Guardian: Sitzung zur Sicherheit pausiert.",
    },
  };

  const current = config[status] || config.safe;

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
        {current.text}
        {heartRate !== undefined && ` • ${heartRate} BPM`}
      </p>
    </div>
  );
}
