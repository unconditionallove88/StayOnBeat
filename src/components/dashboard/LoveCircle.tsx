
"use client";

import React from "react";
import { Users } from "lucide-react";

/**
 * @fileOverview Love Circle Component.
 * High-fidelity representation of the user's inner support network.
 */

export default function LoveCircle({ lang = "en" }: { lang?: "en" | "de" }) {
  const isEn = lang === "en";
  
  const circle = [
    { name: "Sarah", status: "online", color: "#90EE90" }, 
    { name: "Marc", status: "online", color: "#90EE90" },
    { name: "Care Team", status: "active", color: "#10B981" }
  ];

  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl transition-all hover:border-[#10B981]/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#90EE90]/10 rounded-lg">
            <Users size={20} className="text-[#90EE90]" />
          </div>
          <h3 className="text-white text-sm font-black uppercase tracking-[0.2em]">
            {isEn ? "Your Love Circle" : "Dein Love Circle"}
          </h3>
        </div>
        <span className="text-[10px] text-[#10B981] font-black uppercase tracking-widest bg-[#10B981]/10 px-3 py-1 rounded-full border border-[#10B981]/20">
          3 ACTIVE
        </span>
      </div>

      <div className="flex -space-x-4 mb-6">
        {circle.map((person, i) => (
          <div 
            key={i}
            className="w-14 h-14 rounded-full border-4 border-black flex items-center justify-center text-xs font-black text-black shadow-lg transition-transform hover:scale-110 hover:z-10"
            style={{ backgroundColor: person.color }}
          >
            {person.name[0]}
          </div>
        ))}
        <button 
          onClick={(e) => e.stopPropagation()}
          className="w-14 h-14 rounded-full border-4 border-black bg-white/5 flex items-center justify-center text-white/20 hover:text-[#10B981] hover:bg-[#10B981]/10 transition-all font-black text-xl"
        >
          +
        </button>
      </div>

      <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
        <p className="text-white/60 text-[11px] leading-relaxed font-bold uppercase tracking-wide">
          {isEn 
            ? "Sarah and Marc are notified if your rhythm changes. You are cared for. 💚"
            : "Sarah und Marc werden benachrichtigt, wenn sich dein Rhythmus ändert. Du bist umsorgt. 💚"}
        </p>
      </div>
    </div>
  );
}
