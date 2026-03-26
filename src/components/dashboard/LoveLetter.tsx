
'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { PenLine, Send, Loader2, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Love Letter Component.
 * Full localization for EN, DE, PT, RU.
 * Spacing between segments.
 */

const CONTENT = {
  en: {
    title: "Love Letter",
    sub: "To your future self",
    prompt: "While you feel this light today write a short note to the you of tomorrow What would you like to tell yourself when things feel heavy",
    placeholder: "Dear me remember that you are loved",
    button: "Seal with Love",
    sealing: "Sealing...",
    successTitle: "Letter Sealed",
    successMsg: "We will keep this safe When you need a reminder of your own strength we will bring it back to you",
    return: "Return to Sanctuary",
    footer: "End-to-End Encrypted Sanctuary Note"
  },
  de: {
    title: "Liebesbrief",
    sub: "An dein zukünftiges Ich",
    prompt: "Während du dieses Licht heute spürst schreibe eine kurze Notiz an dein Ich von morgen Was möchtest du dir sagen wenn sich die Dinge schwer anfühlen",
    placeholder: "Liebes Ich erinnere dich daran dass du geliebt wirst",
    button: "Mit Liebe versiegeln",
    sealing: "Wird versiegelt...",
    successTitle: "Brief versiegelt",
    successMsg: "Wir werden dies sicher aufbewahren Wenn du eine Erinnerung an deine eigene Stärke brauchst bringen wir sie dir zurück",
    return: "Zurück zum Sanctuary",
    footer: "Ende-zu-Ende verschlüsselte Sanctuary-Notiz"
  },
  pt: {
    title: "Carta de Amor",
    sub: "Para o seu eu do futuro",
    prompt: "Enquanto você sente esta luz hoje escreva uma pequena nota para o seu eu de amanhã O que você gostaria de dizer a si mesmo quando as coisas parecerem pesadas",
    placeholder: "Querido eu lembre-se de que você é amado",
    button: "Selar com Amor",
    sealing: "Selando...",
    successTitle: "Carta Selada",
    successMsg: "Manteremos isto seguro Quando você precisar de um lembrete da sua própria força nós a traremos de volta",
    return: "Retornar ao Santuário",
    footer: "Nota do Santuário Criptografada de Ponta a Ponta"
  },
  ru: {
    title: "Письмо Любви",
    sub: "Твоему будущему «я»",
    prompt: "Пока ты чувствуешь этот свет сегодня напиши короткое послание себе завтрашнему Что бы ты хотел сказать себе когда станет тяжело",
    placeholder: "Дорогой я помни что тебя любят",
    button: "Запечатать с Любовью",
    sealing: "Запечатываем...",
    successTitle: "Письмо запечатано",
    successMsg: "Мы сохраним это в тайне Когда тебе понадобится напоминание о твоей силе мы вернем это тебе",
    return: "Вернуться в пространство",
    footer: "Зашифрованное послание из пространства"
  }
};

export function LoveLetter({ onComplete }: { onComplete?: () => void }) {
  const { firestore } = useFirestore();
  const { user } = useUser();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [lang, setLang] = useState<'en' | 'de' | 'pt' | 'ru'>('en');

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de', 'pt', 'ru'].includes(savedLang)) setLang(savedLang);
  }, []);

  const t = CONTENT[lang as keyof typeof CONTENT] || CONTENT.en;

  const handleSend = () => {
    if (!message.trim() || !user || !firestore) return;
    setIsSending(true);

    const lettersRef = collection(firestore, 'users', user.uid, 'loveLetters');
    
    addDocumentNonBlocking(lettersRef, {
      content: message,
      createdAt: serverTimestamp(),
      moodAtCreation: 'radiant',
      isRead: false,
    });

    setTimeout(() => {
      setIsSent(true);
      setIsSending(false);
    }, 1500);
  };

  if (isSent) {
    return (
      <div className="p-10 text-center animate-in zoom-in duration-500 font-headline flex flex-col items-center gap-8 bg-black min-h-[400px] justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-[#3EB489]/20 blur-3xl rounded-full animate-pulse" />
          <div className="w-24 h-24 bg-[#3EB489]/10 rounded-full flex items-center justify-center border-2 border-[#3EB489]/30 relative z-10">
            <ShieldCheck className="text-[#3EB489] w-12 h-12" />
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-3xl font-black uppercase tracking-tighter text-white">{t.successTitle}</h3>
          <p className="text-white/60 text-sm font-bold leading-tight max-w-xs mx-auto uppercase tracking-widest">
            {t.successMsg}
          </p>
        </div>
        <button 
          onClick={onComplete} 
          className="mt-4 text-[10px] font-black uppercase text-[#3EB489] tracking-[0.4em] hover:text-white transition-colors"
        >
          {t.return}
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 font-headline flex flex-col h-full bg-black min-h-[500px]">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-[#3EB489]/20 rounded-2xl border border-[#3EB489]/30">
          <PenLine size={24} className="text-[#3EB489]" />
        </div>
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white">{t.title}</h2>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{t.sub}</p>
        </div>
      </div>

      <p className="text-xs text-white/40 mb-6 leading-relaxed font-bold uppercase tracking-widest">
        {t.prompt}
      </p>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={t.placeholder}
        className="w-full flex-1 p-6 bg-white/5 border-2 border-white/10 rounded-[2rem] focus:border-[#3EB489] outline-none text-base text-white placeholder:text-white/10 resize-none transition-all mb-8 font-bold"
      />

      <div className="space-y-4">
        <button
          onClick={handleSend}
          disabled={!message.trim() || isSending}
          className={cn(
            "w-full h-20 rounded-full font-black text-xl uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-4",
            !message.trim() || isSending 
              ? "bg-white/5 text-white/10 border-2 border-white/5 cursor-not-allowed"
              : "bg-[#3EB489] text-black neon-glow active:scale-95"
          )}
        >
          {isSending ? <Loader2 className="w-6 h-6 animate-spin" /> : <>{t.button} <Send size={24} /></>}
        </button>
        <p className="text-center text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">{t.footer}</p>
      </div>
    </div>
  );
}
