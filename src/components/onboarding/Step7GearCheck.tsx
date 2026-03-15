"use client"

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Flame, Check, ArrowLeft } from 'lucide-react';

const ITEMS = [
  'Enough sleep or rest',
  'Drink enough water',
  'Take electrolytes',
  'Healthy snacks',
  'Sunglasses',
  'Gum',
  'Fidget toys',
  'Earplugs',
  'Vitamins',
  'Comfy shoes',
  'Tissues',
  'Power bank and cable',
  'ID and cash or card',
  'Hand sanitizer',
];

export function Step7GearCheck({ 
  onComplete,
  onBack
}: { 
  onComplete: () => void,
  onBack?: () => void
}) {
  const [checked, setChecked] = useState<string[]>([]);

  const toggle = (item: string) => {
    setChecked(prev => 
      prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
    );
  };

  const streakBoost = checked.length >= 5;

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-center font-headline max-w-xl mx-auto px-4 text-center relative">
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-0 left-4 text-white/40 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-50"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      )}

      <div className="mt-12 mb-8 relative w-full">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-[22px] font-black text-white leading-tight tracking-tighter">
            Gear check
          </h2>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">
            Prepare your kit for the party
          </p>
        </div>
        
        <div className={`absolute -top-4 -right-2 flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-500 ${
          streakBoost 
            ? 'bg-[#3EB489]/10 border-[#3EB489] text-[#3EB489] neon-glow' 
            : 'bg-white/5 border-white/10 text-white/40'
        }`}>
          <Flame className={`w-3.5 h-3.5 ${streakBoost ? 'text-orange-500 fill-orange-500' : 'text-white/20'}`} />
          <span className="font-headline font-black uppercase text-[8px] tracking-[0.1em]">Safety streak</span>
        </div>
      </div>

      <div className="mb-6">
        <p className={`text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-500 ${
          streakBoost ? 'text-[#3EB489] animate-pulse' : 'text-white/30'
        }`}>
          Check 5+ items to boost your safety streak! 🔥
        </p>
      </div>

      <div className="flex-1 w-full overflow-y-auto max-h-[45vh] custom-scrollbar pr-2 mb-8 space-y-3">
        {ITEMS.map((item) => {
          const isChecked = checked.includes(item);
          return (
            <div 
              key={item} 
              className={`flex items-center gap-4 p-4 rounded-[1.25rem] border transition-all duration-200 cursor-pointer h-[64px] ${
                isChecked 
                  ? 'bg-[#1A1A1A] border-[#3EB489]/50 shadow-sm' 
                  : 'bg-[#0a0a0a] border-white/10 hover:border-white/20'
              }`}
              onClick={() => toggle(item)}
            >
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0 ${
                isChecked 
                  ? 'bg-[#3EB489] border-[#3EB489]' 
                  : 'bg-transparent border-white/20'
              }`}>
                {isChecked && <Check className="w-3.5 h-3.5 text-black" />}
              </div>
              <Label className="font-headline font-black tracking-tight text-sm cursor-pointer flex-1 text-left text-white/90">
                {item}
              </Label>
            </div>
          );
        })}
      </div>

      <div className="w-full shrink-0 flex justify-center mt-4">
        <button
          onClick={onComplete}
          className="pill-button w-full max-w-sm bg-[#3EB489] text-black text-xl font-black neon-glow active:scale-95 transition-all h-[64px]"
        >
          I'm ready
        </button>
      </div>
    </div>
  );
}
