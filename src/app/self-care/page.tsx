
"use client"

import { useState, useEffect } from 'react';
import { Heart, Coffee, Moon, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SelfCare() {
  const router = useRouter();
  const [isProfileComplete, setIsProfileComplete] = useState<boolean>(false);

  useEffect(() => {
    const checkProfile = () => {
      const profileData = localStorage.getItem('stayonbeat_profile');
      if (profileData) {
        const data = JSON.parse(profileData);
        if (data.name && data.weight && data.height) {
          setIsProfileComplete(true);
        }
      }
    };
    checkProfile();
  }, []);

  const handleBackToHub = () => {
    if (isProfileComplete) {
      router.push('/dashboard');
    } else {
      router.push('/onboarding');
    }
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-4 flex flex-col items-center justify-center font-headline text-center overflow-hidden h-screen max-h-screen">
      <button 
        onClick={() => router.back()}
        className="absolute top-8 left-8 text-white/40 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-50"
      >
        <ArrowLeft className="w-4 h-4" /> BACK
      </button>

      <div className="max-w-xl space-y-4 md:space-y-6 flex flex-col items-center w-full">
        <div className="relative inline-block scale-50 md:scale-60">
          <Heart className="w-24 h-24 text-white fill-white animate-pulse-heart drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]" />
        </div>

        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter leading-none">
          THE BRAVEST CHOICE IS <br/> <span className="text-[#3EB489]">SELF-CARE.</span>
        </h1>

        <p className="text-xs md:text-base font-bold text-white/60 leading-tight max-w-[280px] mx-auto">
          Rest is not a reset; it’s a necessity. Your safety streak grows as you prioritize your well-being.
        </p>

        <div className="grid grid-cols-2 gap-3 w-full max-w-[320px]">
          <div className="bg-[#0a0a0a] border border-white/10 p-3 rounded-2xl flex flex-col items-center gap-2">
            <Coffee className="w-5 h-5 text-[#3EB489]" />
            <h3 className="font-black uppercase tracking-widest text-[7px]">Hydrate</h3>
            <p className="text-[6px] font-bold text-white/30 uppercase">Water works.</p>
          </div>
          <div className="bg-[#0a0a0a] border border-white/10 p-3 rounded-2xl flex flex-col items-center gap-2">
            <Moon className="w-5 h-5 text-[#3EB489]" />
            <h3 className="font-black uppercase tracking-widest text-[7px]">Sleep</h3>
            <p className="text-[6px] font-bold text-white/30 uppercase">Recovery key.</p>
          </div>
        </div>

        <button 
          onClick={handleBackToHub}
          className="pill-button w-full max-w-[320px] bg-[#3EB489] text-black text-base md:text-lg py-5 font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all neon-glow mt-2 h-14"
        >
          BACK TO SAFETY HUB
        </button>
      </div>
    </main>
  );
}
