
"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export function Step9EmergencyContact({ 
  onComplete,
  onBack
}: { 
  onComplete: (contact: { name: string; phone: string }) => void,
  onBack?: () => void
}) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
  });

  const handlePhoneInput = (val: string) => {
    const clean = val.replace(/[^0-9+]/g, '');
    setForm(prev => ({ ...prev, phone: clean }));
  };

  const isPhoneValid = form.phone.length >= 8; 
  const isValid = form.name.trim().length > 0 && isPhoneValid;

  return (
    <div className="w-full flex flex-col items-center font-headline relative">
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-0 left-4 text-white/40 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-50"
        >
          <ArrowLeft className="w-4 h-4" /> BACK
        </button>
      )}

      <div className="text-center mb-16 mt-12">
        <h2 className="text-5xl font-black uppercase mb-4 text-white tracking-tighter">Emergency contact</h2>
        <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-sm">Who should we call in an emergency?</p>
      </div>

      <div className="w-full max-w-xl space-y-12 mb-16">
        <div className="space-y-4">
          <Label className="uppercase font-black tracking-[0.3em] text-sm text-white/40 block">Contact name</Label>
          <Input 
            value={form.name}
            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
            className="bg-[#0a0a0a] border-2 border-white/20 h-20 px-8 rounded-[1.5rem] focus:border-[#3EB489] text-2xl transition-all font-black uppercase text-white placeholder:text-white/10"
            placeholder="E.G. ALEX SMITH"
          />
        </div>

        <div className="space-y-4">
          <Label className="uppercase font-black tracking-[0.3em] text-sm text-white/40 block">Phone number</Label>
          <Input 
            type="text"
            value={form.phone}
            onChange={(e) => handlePhoneInput(e.target.value)}
            className="bg-[#0a0a0a] border-2 border-white/20 h-20 px-8 rounded-[1.5rem] focus:border-[#3EB489] text-2xl transition-all font-black text-white placeholder:text-white/10"
            placeholder="+49 123 456789"
          />
        </div>

        <div className="flex items-start gap-4 p-6 bg-white/5 rounded-2xl border border-white/10">
          <ShieldCheck className="w-6 h-6 text-[#3EB489] shrink-0" />
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
            This information is only used if you trigger an SOS alert or are unresponsive. Data is protected by end-to-end encryption.
          </p>
        </div>
      </div>

      <button
        onClick={() => onComplete(form)}
        disabled={!isValid}
        className={`pill-button w-full max-w-sm py-8 text-2xl font-black uppercase tracking-[0.2em] transition-all ${
          isValid 
            ? 'bg-[#3EB489] text-black neon-glow active:scale-95' 
            : 'bg-white/10 text-white/10 cursor-not-allowed border-2 border-white/5'
        }`}
      >
        Start session
      </button>
    </div>
  );
}
