"use client";

import { useState } from "react";
import { Bell, Heart, X } from "lucide-react";
import { askForNotificationPermission } from "@/lib/notifications";
import { cn } from "@/lib/utils";

interface NotificationPromptProps {
  onClose: () => void;
}

export default function NotificationPrompt({ onClose }: NotificationPromptProps) {
  const [preferredHour, setPreferredHour] = useState(10);
  const [isEnabled, setIsEnabled] = useState(false);

  const TIME_OPTIONS = [
    { label: "Morning 🌅 (8am)", value: 8 },
    { label: "Mid-Morning ☀️ (10am)", value: 10 },
    { label: "Afternoon 🌿 (2pm)", value: 14 },
    { label: "Evening 🌙 (7pm)", value: 19 },
  ];

  const handleEnable = async () => {
    await askForNotificationPermission(preferredHour);
    setIsEnabled(true);
    setTimeout(onClose, 2000);
  };

  if (isEnabled) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[5000] flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-500 font-headline">
        <div className="bg-[#0a0a0a] w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] border-t-2 sm:border-2 border-[#3EB489]/30 p-12 text-center shadow-[0_-20px_100px_rgba(0,0,0,0.5)]">
          <div className="w-24 h-24 bg-[#3EB489]/10 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-[#3EB489]/20 shadow-[0_0_40px_rgba(62,180,137,0.1)]">
            <Heart size={48} fill="#3EB489" className="text-[#3EB489] animate-pulse-heart" />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-[#3EB489] mb-4">
            Reminders active 💚
          </h2>
          <p className="text-white/60 text-lg font-bold leading-tight">
            We will check in on your heart every day with kindness.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[5000] flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-500 font-headline">
      <div className="bg-[#0a0a0a] w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] border-t-2 sm:border-2 border-white/10 p-8 pb-12 shadow-[0_-20px_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#3EB489]/5 blur-3xl -z-10" />
        
        <div className="w-16 h-1 bg-white/10 rounded-full mx-auto mb-10 sm:hidden" />

        <button
          onClick={onClose}
          className="absolute top-8 right-8 p-3 bg-white/5 rounded-full border border-white/10 text-white/40 hover:text-white transition-all z-10"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-[#3EB489]/10 border-2 border-[#3EB489]/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(62,180,137,0.1)]">
            <Bell size={32} className="text-[#3EB489]" />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white leading-none">
            Daily Heart <br/> Check-in
          </h2>
          <p className="text-white/40 text-sm font-bold mt-4 leading-tight">
            Choose when you would like us to check in. 💚
          </p>
        </div>

        {/* Time Picker */}
        <div className="grid grid-cols-2 gap-3 mb-10">
          {TIME_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setPreferredHour(option.value)}
              className={cn(
                "py-5 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2",
                preferredHour === option.value
                  ? "bg-[#3EB489]/10 border-[#3EB489] text-[#3EB489] neon-glow shadow-lg shadow-[#3EB489]/10"
                  : "bg-white/5 border-white/5 text-white/40 hover:border-white/20"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <button
            onClick={handleEnable}
            className="w-full h-20 bg-[#3EB489] text-black rounded-[1.5rem] font-black text-xl uppercase tracking-widest transition-all active:scale-95 neon-glow shadow-lg"
          >
            Enable Reminders 💚
          </button>
          <button
            onClick={onClose}
            className="w-full h-14 text-white/20 text-[10px] font-black uppercase tracking-[0.4em] hover:text-white transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
