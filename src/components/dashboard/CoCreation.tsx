'use client';

import React, { useState, useEffect } from 'react';
import { Sprout, Send, CheckCircle2, Loader2, Globe, ClipboardList, CircleDot } from 'lucide-react';
import { useFirestore, useUser, useDoc, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp, doc } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

/**
 * @fileOverview Co-Creation Component.
 * Added a temporary Survey tab for prototype testing.
 * Punctuation-free for resonance.
 */

const i18n = {
  en: {
    title: "Co-Creation",
    subtitle: "Your voice shapes this sanctuary",
    types: [
      { key: "resonance", label: "What resonates?", placeholder: "What feels right, warm, or true to you in this app" },
      { key: "dissonance", label: "Where is the dissonance?", placeholder: "What feels off, missing, or could be more human" },
      { key: "evolution", label: "What would you add?", placeholder: "A feature, a word, a feeling you wish was here" },
      { key: "safety", label: "Do you feel cared for?", placeholder: "Tell us honestly Feeling cared for is our foundation" },
      { key: "survey", label: "App Survey 📋", placeholder: "Help us test the sanctuary The external survey link will be connected here soon For now, you can leave your thoughts about the prototype below" },
    ],
    send: "Send from the Heart",
    sending: "Sending...",
    successTitle: "Heard",
    successMsg: "Your words have been received with love They will help this space grow",
    shareMore: "Share more 🌱",
    receivedWithLove: "Received with Unconditional Love"
  },
  de: {
    title: "Ko-Kreation",
    subtitle: "Deine Stimme gestaltet diesen Raum",
    types: [
      { key: "resonance", label: "Was resoniert?", placeholder: "Was fühlt sich richtig, warm oder wahr an in dieser App" },
      { key: "dissonance", label: "Wo ist die Dissonanz?", placeholder: "Was fühlt sich falsch an, fehlt oder könnte menschlicher sein" },
      { key: "evolution", label: "Was würdest du hinzufügen?", placeholder: "Eine Funktion, ein Wort, ein Gefühl, das du dir hier wünschst" },
      { key: "safety", label: "Fühlst du dich umsorgt?", placeholder: "Sag es uns ehrlich Das Gefühl, umsorgt zu werden, ist unser Fundament" },
      { key: "survey", label: "App Umfrage 📋", placeholder: "Hilf uns, das Sanctuary zu testen Der externe Umfrage-Link wird hier bald aktiviert Bis dahin kannst du uns deine Gedanken zum Prototyp unten hinterlassen" },
    ],
    send: "Von Herzen senden",
    sending: "Wird gesendet...",
    successTitle: "Gehört",
    successMsg: "Deine Worte wurden mit Liebe empfangen Sie helfen diesem Raum zu wachsen",
    shareMore: "Mehr teilen 🌱",
    receivedWithLove: "Mit bedingungsloser Liebe empfangen"
  },
};

export function CoCreation({ onComplete }: { onComplete?: () => void }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const [lang, setLang] = useState<"en" | "de">("en");
  const [activeType, setActiveType] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);
  
  const { data: profile } = useDoc(userDocRef);

  useEffect(() => {
    const savedLang = localStorage.getItem('stayonbeat_lang');
    if (savedLang === 'DE') setLang('de');
  }, []);

  const t = i18n[lang];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !firestore) return;
    setLoading(true);
    try {
      addDocumentNonBlocking(collection(firestore, "feedback"), {
        userId: user?.uid || "anonymous",
        language: lang,
        type: t.types[activeType].key,
        message: message.trim(),
        vibeAtMoment: profile?.vibe?.currentLabel || "Unknown",
        status: "heard",
        createdAt: serverTimestamp(),
      });
      setSent(true);
      setMessage("");
    } catch (error) { console.error("Feedback error:", error); }
    finally { setLoading(false); }
  };

  if (sent) {
    return (
      <div className="w-full min-h-[400px] flex flex-col items-center justify-center p-10 text-center animate-in fade-in zoom-in-95 duration-500 font-headline bg-black rounded-[3rem]">
        <div className="w-20 h-20 bg-[#90EE90]/10 rounded-full flex items-center justify-center mb-8 border-2 border-[#90EE90]/20 shadow-[0_0_40px_rgba(144,238,144,0.1)]">
          <CheckCircle2 size={48} className="text-[#90EE90]" />
        </div>
        <h3 className="text-white font-black text-3xl mb-4 uppercase tracking-tighter">{t.successTitle}</h3>
        <p className="text-white/60 text-base font-bold leading-relaxed max-xs mx-auto mb-10">{t.successMsg}</p>
        <button onClick={onComplete} className="text-[10px] font-black uppercase text-white/20 tracking-[0.4em] hover:text-white transition-colors">Close Sanctuary</button>
      </div>
    );
  }

  return (
    <div className="w-full bg-black p-8 font-headline">
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#90EE90]/10 border border-[#90EE90]/20"><Sprout size={28} className="text-[#90EE90]" /></div>
          <div>
            <h3 className="text-white font-black text-2xl uppercase tracking-tighter leading-none">{t.title}</h3>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1.5">{t.subtitle}</p>
          </div>
        </div>
        <button onClick={() => setLang(lang === "en" ? "de" : "en")} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border border-white/10 text-white/40 hover:text-[#90EE90] transition-all"><Globe size={12} /> {lang === "en" ? "DE" : "EN"}</button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {t.types.map((type, i) => (
          <button key={type.key} onClick={() => setActiveType(i)} className={cn("p-4 rounded-2xl border-2 text-left transition-all duration-300 h-20 flex flex-col justify-center", activeType === i ? "bg-[#90EE90]/10 border-[#90EE90]" : "bg-white/5 border-white/5 hover:border-white/20", type.key === 'survey' && "col-span-2 border-dashed border-[#90EE90]/40")}>
            <div className="flex items-center gap-2">
              {type.key === 'survey' && <ClipboardList size={14} className={activeType === i ? "text-[#90EE90]" : "text-white/40"} />}
              <span className={cn("text-[10px] font-black uppercase tracking-widest leading-tight block", activeType === i ? "text-[#90EE90]" : "text-white/40")}>{type.label}</span>
            </div>
          </button>
        ))}
      </div>

      <form onSubmit={handleSend} className="space-y-6">
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t.types[activeType].placeholder} className="w-full h-48 px-6 py-5 rounded-[2rem] border-2 border-white/10 bg-white/5 text-white text-base font-bold outline-none resize-none focus:border-[#90EE90] transition-all" required />
        <div className="space-y-4">
          <button type="submit" disabled={loading || !message.trim()} className="w-full h-20 bg-[#90EE90] text-black rounded-[1.5rem] font-black text-xl uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-30">
            {loading ? <><Loader2 size={24} className="animate-spin" /> {t.sending}</> : <><CircleDot size={20} /> {t.send}</>}
          </button>
          <p className="text-center text-[10px] text-[#10B981] font-black uppercase tracking-[0.5em]">{t.receivedWithLove}</p>
        </div>
      </form>
    </div>
  );
}
