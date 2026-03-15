
'use client';

import React, { useState } from 'react';
import { Heart, Battery, Droplets, Moon, Zap, ArrowRight, X, Sparkles, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AiSafetyChat } from './AiSafetyChat';
import { useRouter } from 'next/navigation';

/**
 * @fileOverview AssistantPortal Component.
 * A high-fidelity, phase-based entry screen for the AI Safety Advisor.
 * Features preparation, live safety, and recovery paths.
 */

interface AssistantPortalProps {
  userProfile: any;
  onClose?: () => void;
}

export function AssistantPortal({ userProfile, onClose }: AssistantPortalProps) {
  const router = useRouter();
  const [view, setView] = useState<'home' | 'chat'>('home');

  const phases = [
    { 
      title: "Before", 
      icon: <Battery className="text-emerald-400" size={24} />, 
      desc: "Prepare your body & mind", 
      color: "bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40",
      action: () => router.push('/session-check-in')
    },
    { 
      title: "During", 
      icon: <Zap className="text-amber-400" size={24} />, 
      desc: "Stay safe & connected", 
      color: "bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40",
      action: () => setView('chat')
    },
    { 
      title: "After", 
      icon: <Moon className="text-indigo-400" size={24} />, 
      desc: "Recover & restore", 
      color: "bg-indigo-500/5 hover:bg-indigo-500/10 border-indigo-500/20 hover:border-indigo-500/40",
      action: () => router.push('/recovery')
    }
  ];

  if (view === 'chat') {
    return (
      <div className="flex flex-col h-full bg-black">
        <div className="p-4 flex items-center gap-4 bg-black border-b border-white/5">
          <button onClick={() => setView('home')} className="p-2 text-white/40 hover:text-white transition-colors">
            <ArrowRight className="rotate-180" size={20} />
          </button>
          <div>
            <p className="text-[10px] font-black uppercase text-[#10B981] tracking-widest">Active Session</p>
            <h2 className="text-sm font-black uppercase">Live Safety Advisor</h2>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <AiSafetyChat userProfile={userProfile} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-black text-white p-8 flex flex-col font-headline relative overflow-hidden">
      {/* Background atmospheric glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[100px] rounded-full" />

      <header className="flex items-center justify-between mb-12 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
            <Heart className="text-emerald-500 fill-emerald-500" size={20} />
          </div>
          <h1 className="text-xl font-black uppercase tracking-tighter">StayOnBeat</h1>
        </div>
        <button onClick={onClose} className="p-3 bg-white/5 rounded-full border border-white/10 text-white/40 hover:text-white transition-all">
          <X size={20} />
        </button>
      </header>

      <section className="mb-12 relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <Bot className="text-emerald-500" size={20} />
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Personal Assistant</p>
        </div>
        <h2 className="text-4xl font-black uppercase tracking-tighter leading-none mb-4">
          How is your <br /> <span className="text-emerald-500">heart?</span>
        </h2>
        <p className="text-white/40 text-sm font-bold leading-relaxed max-w-[280px]">
          Select your current phase for high-fidelity, tailored support. 🌿
        </p>
      </section>

      <div className="grid gap-4 flex-1 relative z-10 overflow-y-auto custom-scrollbar pr-2 mb-20">
        {phases.map((phase) => (
          <button 
            key={phase.title}
            onClick={phase.action}
            className={cn(
              "flex items-center p-6 rounded-[2.5rem] border-2 transition-all active:scale-[0.98] group text-left",
              phase.color
            )}
          >
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 group-hover:scale-110 transition-transform mr-6">
              {phase.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black uppercase tracking-tight">{phase.title}</h3>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">{phase.desc}</p>
            </div>
            <ArrowRight size={20} className="text-white/10 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </div>

      <footer className="absolute bottom-10 left-8 right-8 z-20">
        <div className="bg-zinc-900/80 backdrop-blur-md border border-white/10 p-5 rounded-full flex justify-around items-center shadow-2xl">
          <button className="p-3 text-zinc-500 hover:text-[#10B981] transition-colors"><Droplets size={24} /></button>
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
            <div className="relative w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 transition-transform active:scale-90">
              <Heart className="text-black" fill="black" size={28} />
            </div>
          </div>
          <button className="p-3 text-zinc-500 hover:text-emerald-400 transition-colors"><Battery size={24} /></button>
        </div>
      </footer>
    </div>
  );
}
