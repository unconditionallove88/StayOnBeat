
'use client';

import React, { useState, useEffect } from 'react';
import { Sprout, Send, CheckCircle2, Loader2, Globe, ClipboardList, CircleDot, ExternalLink, Volume2 } from 'lucide-react';
import { useFirestore, useUser, useDoc, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp, doc } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { textToSpeech } from '@/ai/flows/text-to-speech';

/**
 * @fileOverview Co-Creation Component.
 * Full localization for EN, DE.
 * Affirmations: 3 words (EN) / 4 words (DE)
 */

const i18n = {
  en: {
    title: "Co-Creation",
    subtitle: "Your voice shapes this sanctuary",
    types: [
      { key: "resonance", label: "What resonates?", placeholder: "What feels right warm or true to you in this app" },
      { key: "dissonance", label: "Where is the dissonance?", placeholder: "What feels off missing or could be more human" },
      { key: "evolution", label: "What would you add?", placeholder: "A feature a word a feeling you wish was here" },
      { key: "safety", label: "Do you feel cared for?", placeholder: "Tell us honestly Feeling cared for is our foundation" },
      { key: "survey", label: "App Survey 📋", placeholder: "Help us test the sanctuary Your feedback helps us grow" },
    ],
    send: "Send from the Heart",
    openSurvey: "Open Sanctuary Survey",
    sending: "Sending...",
    successTitle: "Heard",
    successMsg: "Your words have been received with love They will help this space grow",
    shareMore: "Share more",
    receivedWithLove: "Received with Love"
  },
  de: {
    title: "Ko-Kreation",
    subtitle: "Deine Stimme gestaltet diesen Raum",
    types: [
      { key: "resonance", label: "Was resoniert?", placeholder: "Was fühlt sich richtig warm oder wahr an in dieser App" },
      { key: "dissonance", label: "Wo ist die Dissonanz?", placeholder: "Was fühlt sich falsch an fehlt oder könnte menschlicher sein" },
      { key: "evolution", label: "Was würdest du hinzufügen?", placeholder: "Eine Funktion ein Wort ein Gefühl das du dir hier wünschst" },
      { key: "safety", label: "Fühlst du dich umsorgt?", placeholder: "Sag es uns ehrlich Das Gefühl umsorgt zu werden ist unser Fundament" },
      { key: "survey", label: "App Umfrage 📋", placeholder: "Hilf uns das Sanctuary zu testen Dein Feedback hilft uns zu wachsen" },
    ],
    send: "Von Herzen senden",
    openSurvey: "Sanctuary Umfrage öffnen",
    sending: "Wird gesendet...",
    successTitle: "Gehört",
    successMsg: "Deine Worte wurden mit Liebe empfangen Sie helfen diesem Raum zu wachsen",
    shareMore: "Mehr teilen",
    receivedWithLove: "Mit Liebe empfangen heute"
  }
};

const SURVEY_LINK = "https://ev32k2sgx09.typeform.com/to/a33evEfp";

export function CoCreation({ onComplete }: { onComplete?: () => void }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const [lang, setLang] = useState<"en" | "de">("en");
  const [activeType, setActiveType] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);
  }, []);

  const t = i18n[lang] || i18n.en;
  const isSurvey = t.types[activeType].key === 'survey';

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSurvey) {
      window.open(SURVEY_LINK, '_blank');
      return;
    }
    
    if (!message.trim() || !firestore) return;
    setLoading(true);
    try {
      addDocumentNonBlocking(collection(firestore, "feedback"), {
        userId: user?.uid || "anonymous",
        language: lang,
        type: t.types[activeType].key,
        message: message.trim(),
        status: "heard",
        createdAt: serverTimestamp(),
      });
      setSent(true);
      setMessage("");
    } catch (error) { console.error("Feedback error:", error); }
    finally { setLoading(false); }
  };

  const handleVoice = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const { audioDataUri } = await textToSpeech({ text: t.successMsg, lang: lang as any });
      const audio = new Audio(audioDataUri);
      audio.onended = () => setIsSpeaking(false);
      audio.play();
    } catch (e) {
      setIsSpeaking(false);
    }
  };

  return (
    <div className="w-full bg-black p-8 font-headline pb-safe">
      {sent ? (
        <div className="w-full min-h-[400px] flex flex-col items-center justify-center p-10 text-center animate-in fade-in zoom-in-95 duration-500 font-headline bg-black rounded-[3rem]">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-8 border-2 border-primary/20 shadow-[0_0_40px_rgba(27,77,62,0.1)]">
            <CheckCircle2 size={48} className="text-primary" />
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <h3 className="text-white font-black text-3xl uppercase tracking-tighter">{t.successTitle}</h3>
            <button onClick={handleVoice} disabled={isSpeaking} className="p-2 bg-white/5 rounded-full border border-white/10 hover:border-primary transition-all disabled:opacity-30">
              {isSpeaking ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Volume2 className="w-4 h-4 text-primary" />}
            </button>
          </div>
          <p className="text-white/60 text-base font-bold leading-relaxed max-xs mx-auto mb-10">{t.successMsg}</p>
          <button onClick={onComplete} className="text-[10px] font-black uppercase text-white/20 tracking-[0.4em] hover:text-white transition-colors">
            {lang === 'en' ? "Close Sanctuary" : "Schließen"}
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-primary/10 border border-primary/20"><Sprout size={28} className="text-primary" /></div>
              <div>
                <h3 className="text-white font-black text-2xl uppercase tracking-tighter leading-none">{t.title}</h3>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1.5">{t.subtitle}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {t.types.map((type, i) => (
              <button key={type.key} onClick={() => setActiveType(i)} className={cn("p-4 rounded-2xl border-2 text-left transition-all duration-300 h-20 flex flex-col justify-center", activeType === i ? "bg-primary/10 border-primary" : "bg-white/5 border-white/5 hover:border-white/20", type.key === 'survey' && "col-span-2 border-dashed border-primary/40")}>
                <div className="flex items-center gap-2">
                  {type.key === 'survey' && <ClipboardList size={14} className={activeType === i ? "text-primary" : "text-white/40"} />}
                  <span className={cn("text-[10px] font-black uppercase tracking-widest leading-tight block", activeType === i ? "text-primary" : "text-white/40")}>{type.label}</span>
                </div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSend} className="space-y-6">
            {!isSurvey ? (
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t.types[activeType].placeholder} className="w-full h-48 px-6 py-5 rounded-[2rem] border-2 border-white/10 bg-white/5 text-white text-base font-bold outline-none resize-none focus:border-primary transition-all" required />
            ) : (
              <div className="w-full h-48 px-8 py-10 rounded-[2rem] border-2 border-dashed border-primary/20 bg-primary/5 flex flex-col items-center justify-center text-center gap-4">
                <ClipboardList className="text-primary opacity-40" size={40} />
                <p className="text-white/60 text-sm font-bold uppercase tracking-widest leading-relaxed">
                  {t.types[activeType].placeholder}
                </p>
              </div>
            )}
            
            <div className="space-y-4">
              <button type="submit" disabled={!isSurvey && (loading || !message.trim())} className="w-full h-20 bg-primary text-white rounded-[1.5rem] font-black text-xl uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-30">
                {isSurvey ? (
                  <><ExternalLink size={20} /> {t.openSurvey}</>
                ) : (
                  loading ? <><Loader2 size={24} className="animate-spin" /> {t.sending}</> : <><CircleDot size={20} /> {t.send}</>
                )}
              </button>
              <p className="text-center text-[10px] text-primary font-black uppercase tracking-[0.5em]">{t.receivedWithLove}</p>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
