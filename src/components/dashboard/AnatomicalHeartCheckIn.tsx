"use client";

import React, { useState, useEffect } from "react";
import { useUser, useFirestore, updateDocumentNonBlocking, useDoc, useMemoFirebase } from "@/firebase";
import { doc, serverTimestamp, arrayUnion } from "firebase/firestore";
import { HarmonyYinYangIcon } from "@/components/ui/harmony-yin-yang-icon";

/**
 * @fileOverview AnatomicalHeartCheckIn Component.
 * Features updated symbols for "In Harmony" and "OK".
 */

export function AnatomicalHeartCheckIn() {
  const { user } = useUser();
  const firestore = useFirestore();
  
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: profile } = useDoc(userDocRef);
  const [status, setStatus] = useState("OK");

  useEffect(() => {
    if (profile?.vibe?.currentLabel) {
      setStatus(profile.vibe.currentLabel);
    }
  }, [profile?.vibe?.currentLabel]);

  const statuses = [
    { id: "steady", label: "OK", color: "#10B981", emoji: "🤲" },
    { id: "elevated", label: "Elevated", color: "#F59E0B", emoji: "⚡" },
    { id: "heavy", label: "Heavy", color: "#3B82F6", emoji: "🌊" },
    { id: "fluttering", label: "Fluttering", color: "#EC4899", emoji: "🦋" },
    { id: "harmony", label: "In Harmony", color: "#8B5CF6", emoji: "☯️", customIcon: <HarmonyYinYangIcon size={16} /> },
  ];

  const handleSelect = (s: typeof statuses[0]) => {
    setStatus(s.label);
    if (!userDocRef) return;

    const checkInRecord = {
      state: s.label,
      timestamp: new Date().toISOString(),
      context: "Dashboard Anatomical Heart",
      color: s.color,
      emoji: s.emoji
    };

    updateDocumentNonBlocking(userDocRef, {
      vibe: {
        current: s.id,
        currentLabel: s.label,
        currentEmoji: s.emoji,
        lastUpdated: serverTimestamp(),
        history: arrayUnion(checkInRecord)
      }
    });
  };

  return (
    <div className="flex flex-col items-center p-8 bg-[#0a0a0a] rounded-[3rem] border border-white/10 shadow-2xl font-headline w-full max-w-lg mx-auto">
      <h3 className="text-white font-black text-2xl mb-2 uppercase tracking-tighter leading-none text-center">Heart Check-in</h3>
      <p className="text-white/40 text-[10px] mb-8 uppercase tracking-[0.4em] font-bold text-center">How is your heart today?</p>

      <div className="relative w-64 h-80 flex items-center justify-center">
        <svg viewBox="0 0 200 250" className="absolute w-full h-full drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <path
            d="M100 230C100 230 20 180 20 100C20 60 60 20 100 60C140 20 180 60 180 100C180 180 100 230 100 230Z"
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
            strokeDasharray="5 5"
            className="animate-[spin_20s_linear_infinite]"
          />
          <path d="M80 40V20M100 35V15M120 40V20" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
          <path d="M60 80Q100 120 140 80" stroke="#10B981" strokeWidth="1" opacity="0.3" />
        </svg>

        <div className="relative z-10 flex flex-col gap-3 items-center">
          {statuses.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSelect(s)}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 border-2 flex items-center gap-2 ${
                status === s.label 
                ? "bg-[#10B981] text-black border-[#10B981] scale-110 shadow-[0_0_20px_rgba(16,185,129,0.4)]" 
                : "bg-black/40 text-white/40 border-white/5 hover:border-white/20"
              }`}
            >
              {s.customIcon ? s.customIcon : <span>{s.emoji}</span>}
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-[10px] text-white/20 uppercase tracking-[0.5em] font-black mb-1">Current State</p>
        <p className="text-[#10B981] font-black text-2xl animate-pulse uppercase tracking-tighter">{status}</p>
      </div>
    </div>
  );
}
