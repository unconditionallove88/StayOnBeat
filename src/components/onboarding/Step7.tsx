"use client"

import Link from 'next/link';
import { Rocket, Shield, Users, Activity } from 'lucide-react';
import type { OnboardingData } from '@/app/onboarding/page';

export function Step7Summary({ data }: { data: OnboardingData }) {
  return (
    <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-1000">
      <div className="text-8xl mb-8 animate-bounce">🚀</div>
      <h2 className="font-headline text-4xl font-bold uppercase mb-12 text-center">
        You're all set, <span className="text-[#39FF14]">{data.name || 'User'}</span>!
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
        {[
          { label: 'Health Alerts', icon: Activity, count: data.medications.length },
          { label: 'Friends', icon: Users, count: 0 },
          { label: 'Dose Check', icon: Shield, count: data.substances.length },
        ].map((item) => (
          <div key={item.label} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-4 group hover:border-[#39FF14] transition-all">
            <item.icon className="w-8 h-8 text-[#39FF14] group-hover:scale-110 transition-transform" />
            <div className="text-center">
              <span className="block font-headline font-bold uppercase tracking-widest text-xs text-white/40 mb-1">{item.label}</span>
              <span className="text-2xl font-headline font-bold">{item.count}</span>
            </div>
          </div>
        ))}
      </div>

      <Link href="/dashboard" className="w-full max-w-sm">
        <button className="pill-button w-full bg-[#39FF14] text-black text-lg neon-glow font-headline uppercase tracking-wide">
          ENTER DASHBOARD
        </button>
      </Link>
    </div>
  );
}
