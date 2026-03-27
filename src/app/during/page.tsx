
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { AiSafetyChat } from "@/components/chat/AiSafetyChat";
import { ArrowLeft, Loader2, Heart, Sparkles, Wind } from "lucide-react";
import { cn } from "@/lib/utils";
import { playHeartbeat } from "@/lib/resonance";

/**
 * @fileOverview Phase: During.
 * Support for EN, DE, PT, RU.
 * Integrated Breath of Love shortcut for grounding.
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

  const t = {
    en: {
      title: "Safety Advisor",
      phase: "Phase: During",
      affirmation: "I love unconditionally. I accept without expectations. I am free and I give freedom.",
      ritualTitle: "Breath of Love",
      ritualSub: "I love and respect my need for grounding",
      ritualBtn: "Open Ritual"
    },
    de: {
      title: "Sicherheits-Berater",
      phase: "Phase: Währenddessen",
      affirmation: "Ich liebe bedingungslos. Ich akzeptiere ohne Erwartungen. Ich bin frei und schenke Freiheit.",
      ritualTitle: "Atem der Liebe",
      ritualSub: "Ich achte mein Bedürfnis nach Erdung",
      ritualBtn: "Ritual öffnen"
    },
    pt: {
      title: "Assessor de Segurança",
      phase: "Fase: Durante",
      affirmation: "Eu amo incondicionalmente. Eu aceito sem expectativas. Eu sou livre e dou liberdade.",
      ritualTitle: "Sopro de Amor",
      ritualSub: "Eu amo e respeito minha necessidade de aterramento",
      ritualBtn: "Abrir Ritual"
    },
    ru: {
      title: "Забота",
      phase: "Фаза: Во время",
      affirmation: "Я люблю безусловно. Я принимаю без ожиданий. Я свободен и даю свободу.",
      ritualTitle: "Дыхание Любви",
      ritualSub: "Я люблю и уважаю свою потребность в заземлении",
      ritualBtn: "Начать"
    }
  }[lang] || {
    title: "Safety Advisor",
    phase: "Phase: During",
    affirmation: "I love unconditionally. I accept without expectations. I am free and I give freedom.",
    ritualTitle: "Breath of Love",
    ritualSub: "I love and respect my need for grounding",
    ritualBtn: "Open Ritual"
  };

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
            {t.title}
          </h1>
          <p className={cn("text-[10px] font-black text-primary uppercase tracking-[0.3em]", lang === 'ru' && "italic font-serif")}>
            {t.phase}
          </p>
        </div>
      </header>

      {/* Radiant Affirmation Pillar */}
      <div className="bg-primary/10 border-b border-primary/20 py-5 px-10 text-center animate-in fade-in duration-1000 shrink-0">
        <p className={cn(
          "text-[13px] font-black uppercase tracking-[0.05em] text-primary leading-tight max-w-[340px] mx-auto",
          lang === 'ru' ? "italic font-serif" : "italic"
        )}>
          "{t.affirmation}"
        </p>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6 max-w-2xl mx-auto">
            {/* Breath of Love Advice Banner */}
            <div className="bg-primary/5 border-2 border-primary/20 rounded-[2rem] p-6 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                  <Wind className="text-primary" size={24} />
                </div>
                <div className="text-left">
                  <h3 className={cn("text-lg font-black uppercase tracking-tight", lang === 'ru' && "italic font-serif")}>{t.ritualTitle}</h3>
                  <p className={cn("text-[9px] font-black uppercase tracking-widest text-primary/60", lang === 'ru' && "italic font-serif")}>{t.ritualSub}</p>
                </div>
              </div>
              <button 
                onClick={() => { playHeartbeat(); router.push('/self-care'); }}
                className={cn("w-full py-4 bg-primary text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all", lang === 'ru' && "italic font-serif")}
              >
                {t.ritualBtn}
              </button>
            </div>

            {/* Chat section */}
            <div className="h-[500px] border border-white/5 rounded-[2rem] overflow-hidden bg-black/40">
              <AiSafetyChat userProfile={profile} currentIntake={activeIntake} />
            </div>
          </div>
        </ScrollArea>
      </div>
    </main>
  );
}
