
"use client";

import React from "react";
import { Users, AlertTriangle, Navigation, Heart, Sparkles, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * @fileOverview Love Circle Component (The Sanctuary Orb).
 * Redesigned as a high-fidelity circular console for organic navigation.
 * Features radiant status rings and tactical distress alerts within a circular manifest.
 */

interface Friend {
  name: string;
  status: 'steady' | 'elevated' | 'intense';
  color: string;
  avatar: string;
}

interface LoveCircleProps {
  lang?: "en" | "de";
  variant?: "dashboard" | "map";
}

export default function LoveCircle({ 
  lang = "en",
  variant = "dashboard"
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

  const hasDistress = circle.some(p => p.status !== 'steady');

  return (
    <div className={cn(
      "relative aspect-square rounded-full flex flex-col items-center justify-center transition-all duration-700 font-headline group overflow-hidden",
      variant === "map" 
        ? "w-[280px] md:w-[320px] bg-black/60 border-2 border-white/10 backdrop-blur-2xl shadow-2xl" 
        : "w-full max-w-[380px] mx-auto bg-white/5 border-2 border-[#10B981]/20 shadow-[0_0_60px_rgba(16,185,129,0.1)]"
    )}>
      {/* Background Radiant Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/5 to-transparent opacity-40 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/5 blur-3xl -z-10" />
      
      {/* Header - Circular Arced positioning */}
      <div className="pt-8 mb-4 text-center z-10 shrink-0">
        <div className="flex flex-col items-center gap-1">
          <div className="p-2 bg-[#10B981]/10 rounded-full border border-[#10B981]/20 mb-1">
            <Users size={16} className="text-[#10B981]" />
          </div>
          <h3 className="text-white text-[9px] font-black uppercase tracking-[0.4em]">
            {isEn ? "Love Circle" : "Love Circle"}
          </h3>
          <p className="text-[7px] font-bold text-[#10B981] uppercase tracking-widest leading-none">
            {circle.length} Active Souls
          </p>
        </div>
      </div>

      {/* Main Avatars Area - Scrollable but circular */}
      <div className="flex-1 w-full flex items-center justify-center px-8 z-10 overflow-hidden">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {circle.map((person, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <button 
                onClick={() => handleFriendClick(person)}
                className={cn(
                  "relative w-14 h-14 md:w-16 md:h-16 rounded-full border-[3px] border-black flex items-center justify-center text-xs font-black text-black shadow-lg transition-all hover:scale-110 active:scale-95 group/avatar",
                  person.status === 'intense' && "animate-pulse shadow-[0_0_30px_rgba(220,38,38,0.6)]",
                  person.status === 'elevated' && "shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                )}
                style={{ backgroundColor: person.status === 'intense' ? '#DC2626' : person.status === 'elevated' ? '#F59E0B' : '#10B981' }}
              >
                {/* RADIANT STATUS RINGS */}
                {person.status !== 'steady' && (
                  <div className={cn(
                    "absolute inset-[-6px] rounded-full border-2 opacity-40 animate-[ping_2s_infinite]",
                    person.status === 'intense' ? "border-red-600" : "border-amber-500"
                  )} />
                )}
                {person.status === 'intense' && (
                  <div className="absolute inset-[-10px] rounded-full border-2 border-red-600/20 animate-[ping_3s_infinite]" />
                )}

                <span className="group-hover/avatar:scale-110 transition-transform relative z-10 uppercase">{person.avatar}</span>
                
                {person.status !== 'steady' && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-black rounded-full border border-white/20 flex items-center justify-center shadow-lg z-20">
                    <AlertTriangle size={10} className="text-white" />
                  </div>
                )}
              </button>
              <span className={cn(
                "text-[8px] font-black uppercase tracking-widest",
                person.status === 'intense' ? "text-red-500" : person.status === 'elevated' ? "text-amber-500" : "text-white/40"
              )}>
                {person.name}
              </span>
            </div>
          ))}
          
          <button 
            className="w-14 h-14 md:w-16 md:h-16 rounded-full border-4 border-dashed border-white/10 bg-white/5 flex items-center justify-center text-white/20 hover:text-[#10B981] hover:border-[#10B981]/30 hover:bg-[#10B981]/5 transition-all"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Bottom Action - Appears within the circle if distress detected */}
      <div className="pb-8 px-8 w-full z-10 shrink-0">
        {hasDistress ? (
          <button 
            onClick={() => router.push('/map?focus=max&status=intense')}
            className="w-full bg-red-600/20 hover:bg-red-600/30 border border-red-600/40 py-3 rounded-full flex flex-col items-center justify-center gap-1 transition-all active:scale-95 group/sos animate-in slide-in-from-bottom-2"
          >
            <div className="flex items-center gap-2">
              <Navigation size={10} className="text-red-500 animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-widest text-red-500">Distress Detected</span>
            </div>
            <span className="text-[7px] font-bold text-white/40 uppercase tracking-widest">Navigate to Soul</span>
          </button>
        ) : (
          <div className="text-center">
            <Sparkles size={12} className="text-white/10 mx-auto animate-pulse" />
            <p className="text-[7px] font-black text-white/10 uppercase tracking-[0.5em] mt-2">Collective Care Sync</p>
          </div>
        )}
      </div>
    </div>
  );
}
