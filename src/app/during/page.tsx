
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { AiSafetyChat } from "@/components/chat/AiSafetyChat";
import { ArrowLeft, Loader2, Heart } from "lucide-react";

/**
 * @fileOverview Phase: During.
 * Support for EN, DE, PT, RU.
 * Featured core affirmation in a radiant pillar.
 * Layout refined to ensure affirmation doesn't obscure the chat intro.
 */
export default function DuringPhase() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [lang, setLang] = useState<'en' | 'de' | 'pt' | 'ru'>('en');
  const [activeIntake, setActiveIntake] = useState<string>("");

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de', 'pt', 'ru'].includes(savedLang)) setLang(savedLang);

    const logs = JSON.parse(localStorage.getItem('stayonbeat_logs') || '[]');
    if (logs.length > 0) {
      const substanceNames = logs.map((l: any) => l.name).join(', ');
      setActiveIntake(substanceNames);
    }
  }, []);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userDocRef);

  const affirmation = {
    en: "I love unconditionally. I accept without expectations. I am free and I give freedom.",
    de: "Ich liebe bedingungslos. Ich akzeptiere ohne Erwartungen. Ich bin frei und schenke Freiheit.",
    pt: "Eu amo incondicionalmente. Eu aceito sem expectativas. Eu sou livre e dou liberdade.",
    ru: "Я люблю безусловно. Я принимаю без ожиданий. Я свободен и даю свободу."
  }[lang] || "I love unconditionally. I accept without expectations. I am free and I give freedom.";

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-8">
        <div className="relative flex items-center justify-center"><Heart size={64} fill="#10B981" stroke="#10B981" className="relative z-10 animate-pulse-heart" /></div>
        <Loader2 className="animate-spin text-[#10B981]/20" />
      </div>
    );
  }

  return (
    <main className="h-screen bg-black flex flex-col overflow-hidden font-headline">
      <header className="px-6 py-8 border-b border-white/5 bg-black/80 backdrop-blur-xl flex items-center gap-4 shrink-0">
        <button onClick={() => router.push("/dashboard")} className="p-3 bg-white/5 rounded-full border border-white/10 hover:border-[#10B981] transition-all"><ArrowLeft className="w-5 h-5 text-white/40" /></button>
        <div>
          <h1 className="text-xl font-black uppercase tracking-tighter">
            {lang === 'ru' ? 'Советник' : lang === 'pt' ? 'Assessor de Segurança' : lang === 'de' ? 'Sicherheits-Berater' : 'Safety Advisor'}
          </h1>
          <p className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.3em]">
            {lang === 'ru' ? 'Фаза: Во время' : lang === 'pt' ? 'Fase: Durante' : lang === 'de' ? 'Phase: Währenddessen' : 'Phase: During'}
          </p>
        </div>
      </header>

      {/* Radiant Affirmation Pillar - Optimized layout height */}
      <div className="bg-[#10B981]/10 border-b border-[#10B981]/20 py-5 px-10 text-center animate-in fade-in duration-1000 shrink-0">
        <p className="text-[13px] font-black uppercase tracking-[0.05em] text-[#10B981] leading-tight max-w-[340px] mx-auto italic">
          "{affirmation}"
        </p>
      </div>

      <div className="flex-1 overflow-hidden">
        <AiSafetyChat userProfile={profile} currentIntake={activeIntake} />
      </div>
    </main>
  );
}
