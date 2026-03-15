
"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

export function Step2WhoAreYou({ 
  initialData, 
  onComplete, 
  onSkip,
  onBack
}: { 
  initialData?: any, 
  onComplete: (profile: any) => void, 
  onSkip?: () => void,
  onBack?: () => void
}) {
  const [form, setForm] = useState({
    name: initialData?.name || '',
    dob: initialData?.dob || '', 
    weight: initialData?.weight?.toString() || '',
    height: initialData?.height?.toString() || '',
  });

  const calculateAge = (dobString: string) => {
    const parts = dobString.split(' / ');
    if (parts.length !== 3 || parts[2].length !== 4) return 0;
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; 
    const year = parseInt(parts[2]);
    const birthDate = new Date(year, month, day);
    const referenceDate = new Date();
    let age = referenceDate.getFullYear() - birthDate.getFullYear();
    const m = referenceDate.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && referenceDate.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleDobInput = (val: string) => {
    const digits = val.replace(/\D/g, '').substring(0, 8);
    let formatted = '';
    if (digits.length > 0) {
      formatted += digits.substring(0, 2);
      if (digits.length > 2) {
        formatted += ' / ' + digits.substring(2, 4);
        if (digits.length > 4) {
          formatted += ' / ' + digits.substring(4, 8);
        }
      }
    }
    setForm(prev => ({ ...prev, dob: formatted }));
  };

  const weightVal = parseInt(form.weight) || 0;
  const heightVal = parseInt(form.height) || 0;
  const age = calculateAge(form.dob);
  
  const isDobComplete = form.dob.length === 14; 
  const isUnderage = isDobComplete && age < 18;
  const isWeightValid = weightVal >= 30 && weightVal <= 300;
  const isHeightValid = heightVal >= 50 && heightVal <= 250;
  const isFormValid = form.name && isDobComplete && isWeightValid && isHeightValid && !isUnderage;

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-center max-w-xl font-headline mx-auto px-4 relative">
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-0 left-4 text-white/40 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-50"
        >
          <ArrowLeft className="w-4 h-4" /> BACK
        </button>
      )}

      <div className="text-center mb-8 mt-12">
        <h2 className="text-[22px] font-black uppercase mb-1 text-white tracking-tighter leading-none">
          Let's get to know each other
        </h2>
        <p className="text-white/40 font-black uppercase tracking-[0.3em] text-[10px] mb-4">
          Biometric calibration
        </p>
        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest max-w-[280px] mx-auto leading-relaxed">
          Your data helps us calibrate safety metrics and is stored locally.
        </p>
      </div>

      <div className="w-full space-y-4 mb-10">
        <div className="space-y-2">
          <Label className="uppercase font-black tracking-[0.3em] text-[10px] text-white/40 block">Username</Label>
          <Input 
            value={form.name}
            onChange={(e) => setForm(prev => ({...prev, name: e.target.value.toUpperCase()}))}
            className="bg-[#0a0a0a] border-2 border-white/20 h-16 px-6 rounded-[1rem] focus:border-[#3EB489] text-2xl transition-all font-black uppercase text-white"
            placeholder="ENTER NAME"
          />
        </div>

        <div className="space-y-2">
          <Label className="uppercase font-black tracking-[0.3em] text-[10px] text-white/40 block">Date of birth</Label>
          <Input 
            type="text"
            placeholder="DD / MM / YYYY"
            value={form.dob}
            onChange={(e) => handleDobInput(e.target.value)}
            className={`bg-[#0a0a0a] border-2 h-16 px-6 rounded-[1rem] focus:border-[#3EB489] text-2xl transition-all font-black text-white ${isUnderage ? 'border-red-600 focus:border-red-600' : 'border-white/20'}`}
          />
          {isUnderage && (
            <p className="text-red-600 font-black uppercase tracking-widest text-[10px] mt-2 animate-pulse">
              Error: You must be 18+ to access.
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="uppercase font-black tracking-[0.3em] text-[10px] text-white/40 block">Weight (KG)</Label>
            <Input 
              value={form.weight}
              onChange={(e) => setForm(prev => ({...prev, weight: e.target.value.replace(/\D/g, '')}))}
              className={`bg-[#0a0a0a] border-2 h-16 px-6 rounded-[1rem] focus:border-[#3EB489] text-2xl transition-all font-black text-white ${form.weight && !isWeightValid ? 'border-red-600' : 'border-white/20'}`}
              placeholder="70"
            />
          </div>
          <div className="space-y-2">
            <Label className="uppercase font-black tracking-[0.3em] text-[10px] text-white/40 block">Height (CM)</Label>
            <Input 
              value={form.height}
              onChange={(e) => setForm(prev => ({...prev, height: e.target.value.replace(/\D/g, '')}))}
              className={`bg-[#0a0a0a] border-2 h-16 px-6 rounded-[1rem] focus:border-[#3EB489] text-2xl transition-all font-black text-white ${form.height && !isHeightValid ? 'border-red-600' : 'border-white/20'}`}
              placeholder="175"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full gap-4 items-center">
        <button
          onClick={() => onComplete({...form, weight: weightVal, height: heightVal, age})}
          disabled={!isFormValid}
          className={`pill-button w-full max-w-sm text-xl font-black uppercase tracking-[0.2em] transition-all h-[64px] ${
            isFormValid 
              ? 'bg-[#3EB489] text-black neon-glow active:scale-95' 
              : 'bg-white/10 text-white/10 cursor-not-allowed border-2 border-white/5 opacity-50'
          }`}
        >
          Confirm & continue
        </button>
        {onSkip && (
          <button onClick={onSkip} className="text-[10px] font-black uppercase text-white/20 tracking-[0.5em] hover:text-white transition-colors">
            Skip - no changes
          </button>
        )}
      </div>
    </div>
  );
}
