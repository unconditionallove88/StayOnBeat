
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { AiSafetyChat } from "@/components/chat/AiSafetyChat";
import { ArrowLeft, Loader2, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Phase: During.
 * Support for EN, DE, PT, RU.
 * Unified ethereal blurry heart for loading.
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
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full" />
          <Heart size={64} fill="currentColor" className="relative z-10 animate-pulse-heart text-primary" style={{ filter: 'blur(12px)' }} />
        </div>
        <Loader2 className="animate-spin text-primary/20" />
      </div>
    );
  }

  return (
    <main className="h-screen bg-black flex flex-col overflow-hidden font-headline">
      <header className="px-6 py-8 border-b border-white/5 bg-black/80 backdrop-blur-xl flex items-center gap-4 shrink-0">
        <button onClick={() => router.push("/dashboard")} className="p-3 bg-white/5 rounded-full border border-white/10 hover:border-primary transition-all"><ArrowLeft className="w-5 h-5 text-white/40" /></button>
        <div>
          <h1 className={cn("text-xl font-black uppercase tracking-tighter", lang === 'ru' && "italic font-serif")}>
            {lang === 'ru' ? 'Забота' : lang === 'pt' ? 'Assessor de Segurança' : lang === 'de' ? 'Sicherheits-Berater' : 'Safety Advisor'}
          </h1>
          <p className={cn("text-[10px] font-black text-primary uppercase tracking-[0.3em]", lang === 'ru' && "italic font-serif")}>
            {lang === 'ru' ? 'Фаза: Во время' : lang === 'pt' ? 'Fase: Durante' : lang === 'de' ? 'Phase: Währenddessen' : 'Phase: During'}
          </p>
        </div>
      </header>

      {/* Radiant Affirmation Pillar - Soulful written style for RU */}
      <div className="bg-primary/10 border-b border-primary/20 py-5 px-10 text-center animate-in fade-in duration-1000 shrink-0">
        <p className={cn(
          "text-[13px] font-black uppercase tracking-[0.05em] text-primary leading-tight max-w-[340px] mx-auto",
          lang === 'ru' ? "italic font-serif" : "italic"
        )}>
          "{affirmation}"
        </p>
      </div>

      <div className="flex-1 overflow-hidden">
        <AiSafetyChat userProfile={profile} currentIntake={activeIntake} />
      </div>
    </main>
  );
}
