
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { AiSafetyChat } from "@/components/chat/AiSafetyChat";
import { ArrowLeft, Loader2, Heart } from "lucide-react";

/**
 * @fileOverview Phase: During.
 * High-fidelity access to the Live Safety Advisor Chat.
 */
export default function DuringPhase() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [lang, setLang] = useState<'en' | 'de'>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('stayonbeat_lang');
    if (savedLang === 'DE') setLang('de');
  }, []);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userDocRef);

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <Heart size={48} fill="#10B981" stroke="#10B981" className="animate-pulse-heart" />
        <Loader2 className="animate-spin text-[#10B981]/20" />
      </div>
    );
  }

  return (
    <main className="h-screen bg-black flex flex-col overflow-hidden font-headline">
      <header className="px-6 py-8 border-b border-white/5 bg-black/80 backdrop-blur-xl flex items-center gap-4 shrink-0">
        <button 
          onClick={() => router.push("/dashboard")}
          className="p-3 bg-white/5 rounded-full border border-white/10 hover:border-[#10B981] transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-white/40" />
        </button>
        <div>
          <h1 className="text-xl font-black uppercase tracking-tighter">
            {lang === 'en' ? 'Live Safety Advisor' : 'Live Sicherheits-Berater'}
          </h1>
          <p className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.3em]">
            {lang === 'en' ? 'Phase: During' : 'Phase: Währenddessen'}
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <AiSafetyChat userProfile={profile} />
      </div>
    </main>
  );
}
