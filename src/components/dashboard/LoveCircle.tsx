
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
 * Integrated Collective Resonance: The whole orb pulses based on the worst status in the circle.
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
        "relative aspect-square rounded-full flex flex-col items-center justify-center transition-all duration-1000 font-headline group overflow-hidden border-2 shadow-2xl",
        variant === "map" 
          ? "w-[220px] md:w-[280px] bg-black/40 backdrop-blur-2xl" 
          : "w-full max-w-[380px] mx-auto bg-white/5 shadow-[0_0_60px_rgba(16,185,129,0.1)]"
      )}
      style={{ 
        borderColor: `${circlePulseColor}40`,
        boxShadow: `0 0 40px ${circlePulseColor}${worstStatus === 'steady' ? '10' : '30'}`
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
      
      {/* Header - Compact for Map view */}
      <div className={cn("text-center z-10 shrink-0", variant === 'map' ? "pt-4 mb-2" : "pt-8 mb-4")}>
        <div className="flex flex-col items-center gap-1">
          <div className={cn(
            "rounded-full border mb-1 flex items-center justify-center transition-colors",
            variant === 'map' ? "p-1.5" : "p-2",
            worstStatus === 'steady' ? "bg-[#10B981]/10 border-[#10B981]/20" : 
            worstStatus === 'elevated' ? "bg-[#F59E0B]/10 border-[#F59E0B]/20" : "bg-[#DC2626]/10 border-[#DC2626]/20"
          )}>
            <Users size={variant === 'map' ? 12 : 16} style={{ color: circlePulseColor }} />
          </div>
          <h3 className="text-white text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em]">
            {isEn ? "Love Circle" : "Love Circle"}
          </h3>
          {variant !== 'map' && (
            <p className="text-[7px] font-bold text-[#10B981] uppercase tracking-widest leading-none">
              {circle.length} Active Souls
            </p>
          )}
        </div>
      </div>

      {/* Main Avatars Area */}
      <div className="flex-1 w-full flex items-center justify-center px-4 z-10 overflow-hidden">
        <div className={cn("flex flex-wrap justify-center", variant === 'map' ? "gap-2 md:gap-4" : "gap-4 md:gap-6")}>
          {circle.map((person, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <button 
                onClick={() => handleFriendClick(person)}
                className={cn(
                  "relative rounded-full border-[2px] border-black flex items-center justify-center font-black text-black shadow-lg transition-all hover:scale-110 active:scale-95 group/avatar",
                  variant === 'map' ? "w-10 h-10 md:w-12 md:h-12 text-[10px]" : "w-14 h-14 md:w-16 md:h-16 text-xs",
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
              <span className={cn(
                "text-[7px] font-black uppercase tracking-widest",
                person.status === 'intense' ? "text-red-500" : person.status === 'elevated' ? "text-amber-500" : "text-white/40"
              )}>
                {person.name}
              </span>
            </div>
          ))}
          
          <button 
            className={cn(
              "rounded-full border-2 border-dashed border-white/10 bg-white/5 flex items-center justify-center text-white/20 hover:text-[#10B981] hover:border-[#10B981]/30 hover:bg-[#10B981]/5 transition-all",
              variant === 'map' ? "w-10 h-10 md:w-12 md:h-12" : "w-14 h-14 md:w-16 md:h-16"
            )}
          >
            <Plus size={variant === 'map' ? 16 : 20} />
          </button>
        </div>
      </div>

      {/* Bottom Action */}
      <div className={cn("z-10 shrink-0 w-full", variant === 'map' ? "pb-4 px-4" : "pb-8 px-8")}>
        {hasDistress ? (
          <button 
            onClick={() => router.push('/map?focus=max&status=intense')}
            className="w-full bg-red-600/20 hover:bg-red-600/30 border border-red-600/40 py-2 rounded-full flex flex-col items-center justify-center transition-all active:scale-95 group/sos animate-in slide-in-from-bottom-2"
          >
            <div className="flex items-center gap-1.5">
              <Navigation size={8} className="text-red-500 animate-pulse" />
              <span className="text-[7px] font-black uppercase tracking-widest text-red-500">Distress Detected</span>
            </div>
          </button>
        ) : (
          <div className="text-center">
            <Sparkles size={10} className="text-white/10 mx-auto animate-pulse" />
            <p className="text-[6px] font-black text-white/10 uppercase tracking-[0.5em] mt-1">Collective Care Sync</p>
          </div>
        )}
      </div>
    </div>
  );
}
