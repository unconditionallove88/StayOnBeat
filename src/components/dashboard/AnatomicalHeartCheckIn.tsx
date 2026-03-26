
"use client";

import React, { useState, useEffect } from "react";
import { useUser, useFirestore, updateDocumentNonBlocking, useDoc, useMemoFirebase } from "@/firebase";
import { doc, serverTimestamp, arrayUnion } from "firebase/firestore";
import { RadiantIcon, HarmonyIcon, CalmIcon, HazyIcon, HeldIcon } from "@/components/ui/vibe-icons";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview MoodCheckIn Component.
 * Updated: Prismatic color palette and F&B CC6 tones.
 */

const CONTENT = {
  en: { title: "Mood Check-in", sub: "How is your mood today?", state: "Current State", calm: "Calm" },
  de: { title: "Stimmungs Check-in", sub: "Wie ist deine Stimmung heute?", state: "Aktueller Zustand", calm: "Beruhigt" },
  pt: { title: "Sincronia de Humor", sub: "Como está seu humor hoje?", state: "Estado Atual", calm: "Calmo" },
  ru: { title: "Настроение", sub: "Как твое настроение сегодня?", state: "Текущее состояние", calm: "Спокойное" }
};

export function AnatomicalHeartCheckIn() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [lang, setLang] = useState<'en' | 'de' | 'pt' | 'ru'>('en');
  
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: profile } = useDoc(userDocRef);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de', 'pt', 'ru'].includes(savedLang)) setLang(savedLang);
  }, []);

  const statuses = [
    { id: "radiant", label: { en: "Radiant", de: "Strahlend", pt: "Radiante", ru: "Сияющее" }, color: "url(#rainbowGradient)", icon: RadiantIcon, isRainbow: true },
    { id: "harmony", label: { en: "Harmony", de: "In Harmonie", pt: "Em Harmonia", ru: "Гармоничное" }, color: "#10B981", icon: HarmonyIcon },
    { id: "calm", label: { en: "Calm", de: "Beruhigt", pt: "Calmo", ru: "Спокойное" }, color: "#3B82F6", icon: CalmIcon },
    { id: "hazy", label: { en: "Hazy", de: "Verschwommen", pt: "Nebuloso", ru: "Туманное" }, color: "#93C5FD", icon: HazyIcon },
    { id: "overwhelmed", label: { en: "Held", de: "Überwältigt", pt: "Sobrecarregado", ru: "Бережное" }, color: "#cbd5e1", icon: HeldIcon },
  ];

  useEffect(() => {
    if (profile?.vibe?.current) {
      const current = statuses.find(s => s.id === profile.vibe.current);
      if (current) {
        setStatus(current.label[lang]);
      }
    } else {
      setStatus(CONTENT[lang].calm);
    }
  }, [profile?.vibe?.current, lang]);

  const t = CONTENT[lang];

  const handleSelect = (s: typeof statuses[0]) => {
    const localizedLabel = s.label[lang];
    setStatus(localizedLabel);
    if (!userDocRef) return;

    const checkInRecord = {
      state: localizedLabel,
      timestamp: new Date().toISOString(),
      context: "Dashboard Mood Check-in",
      color: s.isRainbow ? "#ffffff" : s.color
    };

    updateDocumentNonBlocking(userDocRef, {
      vibe: {
        current: s.id,
        currentLabel: localizedLabel,
        lastUpdated: serverTimestamp(),
        history: arrayUnion(checkInRecord)
      }
    });
  };

  const currentStatus = statuses.find(s => s.label[lang] === status) || statuses[2];

  return (
    <div className="flex flex-col items-center p-8 bg-[#0a0a0a] rounded-[3rem] border border-white/10 shadow-2xl font-headline w-full max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <Heart size={24} className="text-[#10B981] fill-[#10B981]/20" />
        <h3 className={cn("text-white font-black text-2xl uppercase tracking-tighter leading-none", lang === 'ru' && "italic font-serif")}>{t.title}</h3>
      </div>
      <p className={cn(
        "text-[#10B981] text-[10px] mb-8 uppercase tracking-[0.4em] font-black text-center",
        lang === 'ru' && "italic font-serif"
      )}>{t.sub}</p>

      <div className="relative w-64 h-80 flex items-center justify-center">
        <svg viewBox="0 0 200 250" className="absolute w-full h-full drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <defs>
            <linearGradient id="rainbowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="20%" stopColor="#eab308" />
              <stop offset="40%" stopColor="#22c55e" />
              <stop offset="60%" stopColor="#3b82f6" />
              <stop offset="80%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <path
            d="M100 230C100 230 20 180 20 100C20 60 60 20 100 60C140 20 180 60 180 100C180 180 100 230 100 230Z"
            fill="none"
            stroke={currentStatus.color}
            strokeWidth="2"
            strokeDasharray="5 5"
            className="animate-[spin_20s_linear_infinite] transition-colors duration-1000"
            style={{ opacity: 0.4 }}
          />
        </svg>

        <div className="relative z-10 flex flex-col gap-3 items-center">
          {statuses.map((s) => {
            const VibeIcon = s.icon;
            const localizedLabel = s.label[lang];
            const isActive = status === localizedLabel;
            return (
              <button
                key={s.id}
                onClick={() => handleSelect(s)}
                className={cn(
                  "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 border-2 flex items-center gap-3 relative overflow-hidden",
                  isActive 
                    ? "bg-white/10 border-white/40 scale-110 shadow-xl" 
                    : "bg-black/40 text-white/20 border-white/5 hover:border-white/20",
                  lang === 'ru' && "italic font-serif"
                )}
                style={isActive && !s.isRainbow ? { borderColor: s.color, color: s.color } : {}}
              >
                {s.isRainbow && isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-yellow-500/10 via-green-500/10 via-blue-500/10 to-purple-500/10 animate-pulse" />
                )}
                <VibeIcon size={16} color="currentColor" className={isActive && s.isRainbow ? "text-white" : "currentColor"} />
                <span className="relative z-10">{localizedLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className={cn("text-[10px] text-white/20 uppercase tracking-[0.5em] font-black mb-1", lang === 'ru' && "italic font-serif")}>{t.state}</p>
        <p 
          className={cn(
            "font-black text-2xl animate-pulse uppercase tracking-tighter transition-colors duration-1000",
            lang === 'ru' && "italic font-serif"
          )}
          style={currentStatus.isRainbow ? { color: "white", textShadow: "0 0 10px rgba(255,255,255,0.5)" } : { color: currentStatus.color }}
        >
          {status}
        </p>
      </div>
    </div>
  );
}
