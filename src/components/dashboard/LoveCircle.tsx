
"use client";

import React from "react";
import { Users, AlertTriangle, Navigation, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

/**
 * @fileOverview Love Circle Component.
 * High-fidelity representation of your inner support network.
 * Optimized for mobile layout with responsive padding and icon scaling.
 */

interface Friend {
  name: string;
  status: 'steady' | 'elevated' | 'intense';
  color: string;
  avatar: string;
}

interface LoveCircleProps {
  lang?: "en" | "de";
}

export default function LoveCircle({ 
  lang = "en"
}: LoveCircleProps) {
  const isEn = lang === "en";
  const router = useRouter();
  
  // Mock circle data for the prototype
  const circle: Friend[] = [
    { name: "Sarah", status: "steady", color: "#90EE90", avatar: "S" }, 
    { name: "Max", status: "intense", color: "#DC2626", avatar: "M" },
    { name: "Marc", status: "elevated", color: "#F59E0B", avatar: "M" }
  ];

  const handleFriendClick = (friend: Friend) => {
    if (friend.status !== 'steady') {
      router.push(`/map?focus=${friend.name.toLowerCase()}&status=${friend.status}`);
    }
  };

  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 shadow-2xl transition-all hover:border-[#10B981]/20 group font-headline">
      <div className="flex items-center justify-between mb-4 md:mb-8">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="p-1.5 md:p-2 bg-[#90EE90]/10 rounded-lg">
            <Users size={16} className="text-[#90EE90] md:w-5 md:h-5" />
          </div>
          <h3 className="text-white text-[10px] md:text-sm font-black uppercase tracking-[0.2em]">
            {isEn ? "Love Circle" : "Dein Love Circle"}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[8px] md:text-[10px] text-[#10B981] font-black uppercase tracking-widest bg-[#10B981]/10 px-2 md:px-3 py-1 rounded-full border border-[#10B981]/20">
            3 ACTIVE
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 md:gap-6 mb-4 md:mb-8">
        {circle.map((person, i) => (
          <div key={i} className="flex flex-col items-center gap-2 md:gap-3">
            <button 
              onClick={() => handleFriendClick(person)}
              className={cn(
                "relative w-12 h-12 md:w-16 md:h-16 rounded-full border-4 border-black flex items-center justify-center text-[10px] md:text-xs font-black text-black shadow-lg transition-all hover:scale-110 active:scale-95",
                person.status === 'intense' && "animate-pulse ring-2 md:ring-4 ring-red-600/40 ring-offset-2 md:ring-offset-4 ring-offset-black",
                person.status === 'elevated' && "ring-2 md:ring-4 ring-amber-500/30 ring-offset-2 md:ring-offset-4 ring-offset-black"
              )}
              style={{ backgroundColor: person.status === 'intense' ? '#DC2626' : person.status === 'elevated' ? '#F59E0B' : '#90EE90' }}
            >
              {person.avatar}
              {person.status !== 'steady' && (
                <div className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-black rounded-full border border-white/20 flex items-center justify-center shadow-lg">
                  <AlertTriangle size={10} className="text-white md:w-3 md:h-3" />
                </div>
              )}
            </button>
            <span className={cn(
              "text-[7px] md:text-[9px] font-black uppercase tracking-widest",
              person.status === 'intense' ? "text-red-500" : person.status === 'elevated' ? "text-amber-500" : "text-white/40"
            )}>
              {person.name}
            </span>
          </div>
        ))}
        <button 
          className="w-12 h-12 md:w-16 md:h-16 rounded-full border-4 border-black bg-white/5 flex items-center justify-center text-white/20 hover:text-[#10B981] hover:bg-[#10B981]/10 transition-all font-black text-lg md:text-xl"
        >
          +
        </button>
      </div>

      {/* Distress Insight - More compact for mobile */}
      {circle.some(p => p.status !== 'steady') && (
        <div className="bg-red-600/10 rounded-xl md:rounded-2xl p-4 md:p-5 border border-red-600/20 animate-in slide-in-from-bottom-2">
          <div className="flex items-start gap-3 md:gap-4">
            <Heart className="w-4 h-4 md:w-5 md:h-5 text-red-500 mt-0.5 shrink-0" />
            <div className="space-y-1.5 md:space-y-2">
              <p className="text-white text-[9px] md:text-[11px] font-black uppercase tracking-tight leading-none">Distress Detected</p>
              <p className="text-white/60 text-[8px] md:text-[10px] leading-relaxed font-bold uppercase tracking-wide">
                {isEn 
                  ? "Max's heart is intense. Tap his circle to find him and notify Awareness."
                  : "Max's Herzrhythmus ist intensiv. Tippe auf seinen Kreis, um ihn zu finden."}
              </p>
              <button 
                onClick={() => router.push('/map?focus=max&status=intense')}
                className="flex items-center gap-1.5 text-[8px] md:text-[9px] font-black text-[#10B981] uppercase tracking-[0.2em] pt-1"
              >
                <Navigation size={10} className="md:w-3 md:h-3" /> {isEn ? "Navigate to Soul" : "Zum Seelenort navigieren"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
