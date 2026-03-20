
"use client";

import React from "react";
import { Users, AlertTriangle, Navigation, Heart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

/**
 * @fileOverview Love Circle Component.
 * High-fidelity representation of your inner support network.
 * Features radiant status rings and tactical distress alerts.
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
    { name: "Sarah", status: "steady", color: "#10B981", avatar: "S" }, 
    { name: "Max", status: "intense", color: "#DC2626", avatar: "M" },
    { name: "Marc", status: "elevated", color: "#F59E0B", avatar: "M" }
  ];

  const handleFriendClick = (friend: Friend) => {
    if (friend.status !== 'steady') {
      router.push(`/map?focus=${friend.name.toLowerCase()}&status=${friend.status}`);
    }
  };

  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-6 md:p-8 shadow-2xl transition-all hover:border-[#10B981]/20 group font-headline relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/5 blur-3xl -z-10" />
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#10B981]/10 rounded-xl border border-[#10B981]/20">
            <Users size={20} className="text-[#10B981]" />
          </div>
          <div>
            <h3 className="text-white text-[10px] font-black uppercase tracking-[0.3em]">
              {isEn ? "Love Circle" : "Dein Love Circle"}
            </h3>
            <p className="text-[8px] font-bold text-[#10B981] uppercase tracking-widest mt-0.5">3 Hearts Active</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles size={12} className="text-[#10B981] animate-pulse" />
        </div>
      </div>

      <div className="flex flex-wrap gap-6 mb-8">
        {circle.map((person, i) => (
          <div key={i} className="flex flex-col items-center gap-3">
            <button 
              onClick={() => handleFriendClick(person)}
              className={cn(
                "relative w-16 h-16 rounded-full border-4 border-black flex items-center justify-center text-xs font-black text-black shadow-lg transition-all hover:scale-110 active:scale-95 group/avatar",
                person.status === 'intense' && "animate-pulse ring-4 ring-red-600/40 ring-offset-4 ring-offset-black",
                person.status === 'elevated' && "ring-4 ring-amber-500/30 ring-offset-4 ring-offset-black"
              )}
              style={{ backgroundColor: person.status === 'intense' ? '#DC2626' : person.status === 'elevated' ? '#F59E0B' : '#10B981' }}
            >
              <span className="group-hover/avatar:scale-110 transition-transform">{person.avatar}</span>
              {person.status !== 'steady' && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-black rounded-full border border-white/20 flex items-center justify-center shadow-lg">
                  <AlertTriangle size={12} className="text-white" />
                </div>
              )}
            </button>
            <span className={cn(
              "text-[9px] font-black uppercase tracking-widest",
              person.status === 'intense' ? "text-red-500" : person.status === 'elevated' ? "text-amber-500" : "text-white/40"
            )}>
              {person.name}
            </span>
          </div>
        ))}
        <button 
          className="w-16 h-16 rounded-full border-4 border-black bg-white/5 flex items-center justify-center text-white/20 hover:text-[#10B981] hover:bg-[#10B981]/10 transition-all font-black text-xl"
        >
          +
        </button>
      </div>

      {/* Distress Insight - High Fidelity Action */}
      {circle.some(p => p.status !== 'steady') && (
        <div className="bg-red-600/10 rounded-[2rem] p-6 border border-red-600/20 animate-in slide-in-from-bottom-2">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-red-600/20 rounded-xl flex items-center justify-center border border-red-600/30 shrink-0">
              <Heart className="w-5 h-5 text-red-500 animate-pulse" />
            </div>
            <div className="space-y-2 flex-1">
              <p className="text-white text-[11px] font-black uppercase tracking-tight leading-none">Distress Detected</p>
              <p className="text-white/60 text-[10px] leading-relaxed font-bold uppercase tracking-wide">
                {isEn 
                  ? "Max's rhythm is intense. You can find him on the Pulse and notify the Team."
                  : "Max's Herzrhythmus ist intensiv. Du findest ihn auf dem Pulse."}
              </p>
              <button 
                onClick={() => router.push('/map?focus=max&status=intense')}
                className="flex items-center gap-2 bg-[#10B981] text-black px-4 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mt-2 active:scale-95 transition-all shadow-lg shadow-[#10B981]/20"
              >
                <Navigation size={12} /> {isEn ? "Navigate to Soul" : "Zum Seelenort"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
