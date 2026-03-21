
"use client";

import React, { useState, useEffect } from "react";
import { useUser, useFirestore, updateDocumentNonBlocking, useDoc, useMemoFirebase } from "@/firebase";
import { doc, serverTimestamp, arrayUnion } from "firebase/firestore";
import { RadiantIcon, HarmonyIcon, CalmIcon, HazyIcon, HeldIcon } from "@/components/ui/vibe-icons";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview MoodCheckIn Component.
 * Bespoke Resonance Icons integrated for a grounded self-care experience.
 */

export function AnatomicalHeartCheckIn() {
  const { user } = useUser();
  const firestore = useFirestore();
  
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: profile } = useDoc(userDocRef);
  const [status, setStatus] = useState("Calm");

  useEffect(() => {
    if (profile?.vibe?.currentLabel) {
      setStatus(profile.vibe.currentLabel);
    }
  }, [profile?.vibe?.currentLabel]);

  const statuses = [
    { id: "radiant", label: "Radiant", color: "#A855F7", icon: RadiantIcon },
    { id: "harmony", label: "Harmony", color: "#EBFB3B", icon: HarmonyIcon },
    { id: "calm", label: "Calm", color: "#10B981", icon: CalmIcon },
    { id: "hazy", label: "Hazy", color: "#94A3B8", icon: HazyIcon },
    { id: "overwhelmed", label: "Held", color: "#3B82F6", icon: HeldIcon },
  ];

  const handleSelect = (s: typeof statuses[0]) => {
    setStatus(s.label);
    if (!userDocRef) return;

    const checkInRecord = {
      state: s.label,
      timestamp: new Date().toISOString(),
      context: "Dashboard Mood Check-in",
      color: s.color
    };

    updateDocumentNonBlocking(userDocRef, {
      vibe: {
        current: s.id,
        currentLabel: s.label,
        lastUpdated: serverTimestamp(),
        history: arrayUnion(checkInRecord)
      }
    });
  };

  return (
    <div className="flex flex-col items-center p-8 bg-[#0a0a0a] rounded-[3rem] border border-white/10 shadow-2xl font-headline w-full max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <Heart size={24} className="text-[#10B981] fill-[#10B981]/20" />
        <h3 className="text-white font-black text-2xl uppercase tracking-tighter leading-none">Mood Check-in</h3>
      </div>
      <p className="text-[#10B981] text-[10px] mb-8 uppercase tracking-[0.4em] font-black text-center">How is your mood today?</p>

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
        </svg>

        <div className="relative z-10 flex flex-col gap-3 items-center">
          {statuses.map((s) => {
            const VibeIcon = s.icon;
            const isActive = status === s.label;
            return (
              <button
                key={s.id}
                onClick={() => handleSelect(s)}
                className={cn(
                  "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 border-2 flex items-center gap-3",
                  isActive 
                    ? "bg-white/10 border-white/40 scale-110 shadow-xl" 
                    : "bg-black/40 text-white/40 border-white/5 hover:border-white/20"
                )}
                style={isActive ? { borderColor: s.color, color: s.color } : {}}
              >
                <VibeIcon size={16} color="currentColor" />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-[10px] text-white/20 uppercase tracking-[0.5em] font-black mb-1">Current State</p>
        <p className={cn("font-black text-2xl animate-pulse uppercase tracking-tighter text-[#10B981]")}>{status}</p>
      </div>
    </div>
  );
}
