
"use client";

import React from "react";
import { Users, AlertTriangle, Navigation, Heart, Sparkles, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

/**
 * @fileOverview Love Circle Component (The Sanctuary Orb).
 * Redesigned as a high-fidelity circular console for organic navigation.
 * Variant="map" is extremely minimalist to reduce visual chaos.
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
  const isMap = variant === "map";
  
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
  
  // Calculate collective state for the entire Orb's resonance
  const worstStatus = circle.reduce((acc, curr) => {
    if (curr.status === 'intense') return 'intense';
    if (curr.status === 'elevated' && acc !== 'intense') return 'elevated';
    return acc;
  }, 'steady' as 'steady' | 'elevated' | 'intense');

  const circlePulseColor = worstStatus === 'intense' ? "#DC2626" : worstStatus === 'elevated' ? "#F59E0B" : "#10B981";

  return (
    <div 
      className={cn(
        "relative aspect-square rounded-full flex flex-col items-center justify-center transition-all duration-1000 font-headline overflow-hidden border-2 shadow-2xl",
        isMap 
          ? "w-[200px] md:w-[240px] bg-black/40 backdrop-blur-2xl" 
          : "w-full max-w-[380px] mx-auto bg-white/5"
      )}
      style={{ 
        borderColor: `${circlePulseColor}${isMap ? '20' : '40'}`,
        boxShadow: `0 0 40px ${circlePulseColor}${worstStatus === 'steady' ? '05' : '20'}`
      }}
    >
      {/* Background Radiant Glow */}
      <div 
        className="absolute inset-0 opacity-20 animate-pulse pointer-events-none" 
        style={{ 
          background: `radial-gradient(circle at center, ${circlePulseColor}33 0%, transparent 70%)`,
          animationDuration: worstStatus === 'intense' ? '1s' : worstStatus === 'elevated' ? '2s' : '4s'
        }} 
      />
      
      {/* Header - Hidden on Map view for Concentration */}
      {!isMap && (
        <div className="text-center z-10 shrink-0 pt-8 mb-4">
          <div className="flex flex-col items-center gap-1">
            <div className={cn(
              "rounded-full border p-2 mb-1 flex items-center justify-center transition-colors",
              worstStatus === 'steady' ? "bg-[#10B981]/10 border-[#10B981]/20" : 
              worstStatus === 'elevated' ? "bg-[#F59E0B]/10 border-[#F59E0B]/20" : "bg-[#DC2626]/10 border-[#DC2626]/20"
            )}>
              <Users size={16} style={{ color: circlePulseColor }} />
            </div>
            <h3 className="text-white text-[9px] font-black uppercase tracking-[0.4em]">
              {isEn ? "Love Circle" : "Love Circle"}
            </h3>
            <p className="text-[7px] font-bold text-[#10B981] uppercase tracking-widest leading-none">
              {circle.length} Active Souls
            </p>
          </div>
        </div>
      )}

      {/* Main Avatars Area */}
      <div className={cn("flex-1 w-full flex items-center justify-center px-4 z-10 overflow-hidden", isMap ? "pt-2" : "")}>
        <div className={cn("flex flex-wrap justify-center", isMap ? "gap-2 md:gap-3" : "gap-4 md:gap-6")}>
          {circle.map((person, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <button 
                onClick={() => handleFriendClick(person)}
                className={cn(
                  "relative rounded-full border-[2px] border-black flex items-center justify-center font-black text-black shadow-lg transition-all hover:scale-110 active:scale-95 group/avatar",
                  isMap ? "w-10 h-10 md:w-12 md:h-12 text-[10px]" : "w-14 h-14 md:w-16 md:h-16 text-xs",
                  person.status === 'intense' && "animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.6)]",
                  person.status === 'elevated' && "shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                )}
                style={{ backgroundColor: person.status === 'intense' ? '#DC2626' : person.status === 'elevated' ? '#F59E0B' : '#10B981' }}
              >
                {/* RADIANT STATUS RINGS */}
                {person.status !== 'steady' && (
                  <div className={cn(
                    "absolute inset-[-4px] rounded-full border-[1.5px] opacity-40 animate-[ping_2s_infinite]",
                    person.status === 'intense' ? "border-red-600" : "border-amber-500"
                  )} />
                )}

                <span className="group-hover/avatar:scale-110 transition-transform relative z-10 uppercase">{person.avatar}</span>
                
                {person.status !== 'steady' && (
                  <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-black rounded-full border border-white/20 flex items-center justify-center shadow-lg z-20">
                    <AlertTriangle size={8} className="text-white" />
                  </div>
                )}
              </button>
              {!isMap && (
                <span className={cn(
                  "text-[7px] font-black uppercase tracking-widest",
                  person.status === 'intense' ? "text-red-500" : person.status === 'elevated' ? "text-amber-500" : "text-white/40"
                )}>
                  {person.name}
                </span>
              )}
            </div>
          ))}
          
          <button 
            className={cn(
              "rounded-full border-2 border-dashed border-white/10 bg-white/5 flex items-center justify-center text-white/20 hover:text-[#10B981] hover:border-[#10B981]/30 hover:bg-[#10B981]/5 transition-all",
              isMap ? "w-10 h-10 md:w-12 md:h-12" : "w-14 h-14 md:w-16 md:h-16"
            )}
          >
            <Plus size={isMap ? 16 : 20} />
          </button>
        </div>
      </div>

      {/* Bottom Action - Integrated for Map Concentration */}
      <div className={cn("z-10 shrink-0 w-full", isMap ? "pb-4 px-4" : "pb-8 px-8")}>
        {hasDistress ? (
          <button 
            onClick={() => router.push('/map?focus=max&status=intense')}
            className={cn(
              "w-full rounded-full flex flex-col items-center justify-center transition-all active:scale-95 group/sos animate-in slide-in-from-bottom-2",
              isMap ? "bg-red-600/10 py-1.5" : "bg-red-600/20 border border-red-600/40 py-2"
            )}
          >
            <div className="flex items-center gap-1.5">
              <Navigation size={8} className="text-red-500 animate-pulse" />
              <span className="text-[7px] font-black uppercase tracking-widest text-red-500">{isMap ? "SOS" : "Distress Detected"}</span>
            </div>
          </button>
        ) : (
          <div className="text-center opacity-20">
            {!isMap && <p className="text-[6px] font-black text-white/40 uppercase tracking-[0.5em] mt-1">Collective Care Sync</p>}
          </div>
        )}
      </div>
    </div>
  );
}
