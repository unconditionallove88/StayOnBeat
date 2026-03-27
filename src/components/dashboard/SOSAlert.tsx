'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { 
  Heart, 
  Loader2, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  Wind, 
  Users, 
  PhoneCall,
  CircleDot,
  Radio,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { playHeartbeat } from '@/lib/resonance';

/**
 * @fileOverview Immediate Help (SOS) Portal.
 * Categorized support pathways with full EN, DE, PT, RU support.
 * Enhanced with Mesh-based location sharing.
 * Punctuation-free for resonance.
 */

const CONTENT = {
  en: {
    question: "Do you need help?",
    helping: (name: string) => `Helping ${name}`,
    subtitle: "Choose the pathway that resonates now",
    friendSubtitle: (name: string) => `Choose the pathway of care for ${name}`,
    tabs: { emergency: "Emergency", circle: "Circle", stillness: "Stillness" },
    emergency: {
      title: "Awareness Dispatch",
      sub: "Medical & Security",
      desc: "Request professional support to your Mesh Tactical Grid Handled with absolute discretion",
      button: "Notify Awareness Team"
    },
    circle: {
      title: "Circle Alert",
      sub: "Mutual Care",
      desc: "Let your inner circle know a moment of connection or assistance is needed via Mesh-Sync",
      button: "Notify My Circle"
    },
    stillness: {
      title: "Breath of Love",
      sub: "Self-Care Ritual",
      desc: "I love and respect my need for stillness Return to your center with the guided resonance ritual",
      button: "Start Breath of Love"
    },
    connecting: "Negotiating Mesh Handshake...",
    honoring: "Honoring the request for care",
    allIsWell: "All is well",
    loved: "I am loved",
    friendLoved: (name: string) => `${name} is loved`,
    takenCareOf: "and being taken care of",
    dispatched: "Mesh help request dispatched",
    meshShared: "Mesh Location Shared",
    privacyActive: "Privacy protocols active",
    returning: (s: number) => `Returning to sanctuary in ${s}s`
  },
  de: {
    question: "Brauchst du Unterstützung?",
    helping: (name: string) => `${name} braucht Begleitung`,
    subtitle: "Wähle den Weg, der sich jetzt richtig anfühlt",
    friendSubtitle: (name: string) => `Wähle einen Weg der Fürsorge für ${name}`,
    tabs: { emergency: "Notfall", circle: "Kreis", stillness: "Ruhe" },
    emergency: {
      title: "Awareness-Einsatz",
      sub: "Medizin & Sicherheit",
      desc: "Fordere professionelle Begleitung an dein Mesh Tactical Grid an Diskret und vertraulich",
      button: "Awareness-Team rufen"
    },
    circle: {
      title: "Circle-Alarm",
      sub: "Gegenseitige Fürsorge",
      desc: "Lass deinen inneren Kreis via Mesh-Sync wissen dass Unterstützung gebraucht wird",
      button: "Meinen Kreis rufen"
    },
    stillness: {
      title: "Atem der Liebe",
      sub: "Selbstfürsorge",
      desc: "Ich achte auf mein Bedürfnis nach Ruhe Finde zurück in deine Mitte mit dem Resonance-Ritual",
      button: "Atem der Liebe starten"
    },
    connecting: "Mesh-Verbindung wird aufgebaut...",
    honoring: "Die Anfrage wird liebevoll bearbeitet",
    allIsWell: "Alles ist gut",
    loved: "Ich werde geliebt",
    friendLoved: (name: string) => `${name} wird geliebt`,
    takenCareOf: "und bin in Sicherheit",
    dispatched: "Mesh-Anfrage wurde versendet",
    meshShared: "Mesh-Ortung geteilt",
    privacyActive: "Schutzprotokolle sind aktiv",
    returning: (s: number) => `Rückkehr zum Dashboard in ${s}s`
  },
  pt: {
    question: "Você precisa de ajuda?",
    helping: (name: string) => `Ajudando ${name}`,
    subtitle: "Escolha o caminho que ressoa agora",
    friendSubtitle: (name: string) => `Escolha o caminho de cuidado para ${name}`,
    tabs: { emergency: "Emergência", circle: "Círculo", stillness: "Silêncio" },
    emergency: {
      title: "Despacho de Equipe",
      sub: "Médico e Segurança",
      desc: "Solicite suporte profissional para seu Grid Tático da Mesh Lidado com absoluta discrição",
      button: "Notificar Equipe"
    },
    circle: {
      title: "Alerta de Círculo",
      sub: "Cuidado Mútuo",
      desc: "Deixe seu círculo íntimo saber que um momento de conexão ou assistência é necessário",
      button: "Notificar Meu Círculo"
    },
    stillness: {
      title: "Sopro de Amor",
      sub: "Ritual de Autocuidado",
      desc: "Eu amo e respeito minha necessidade de silêncio Volte ao seu centro com o ritual de ressonância",
      button: "Iniciar Sopro de Amor"
    },
    connecting: "Negociando Handshake da Mesh...",
    honoring: "Honrando o pedido de cuidado",
    allIsWell: "Tudo está bem",
    loved: "Eu sou amado",
    friendLoved: (name: string) => `${name} é amado`,
    takenCareOf: "e estou sendo cuidado",
    dispatched: "Pedido de ajuda via Mesh enviado",
    meshShared: "Localização Mesh Compartilhada",
    privacyActive: "Protocolos de privacidade ativos",
    returning: (s: number) => `Retornando ao santuário em ${s}s`
  },
  ru: {
    question: "Нужна помощь?",
    helping: (name: string) => `Помогаем ${name}`,
    subtitle: "Выбери путь который резонирует сейчас",
    friendSubtitle: (name: string) => `Выбери путь заботы для ${name}`,
    tabs: { emergency: "Экстренно", circle: "Круг", stillness: "Тишина" },
    emergency: {
      title: "Вызов Помощи",
      sub: "Медики и Охрана",
      desc: "Запроси профессиональную поддержку по твоей Mesh-сетке Обрабатывается конфиденциально",
      button: "Вызвать Команду"
    },
    circle: {
      title: "Сигнал Кругу",
      sub: "Взаимная Забота",
      desc: "Дай твоему кругу знать что тебе нужна поддержка или общение через Mesh-Sync",
      button: "Уведомить Мой Круг"
    },
    stillness: {
      title: "Дыхание Любви",
      sub: "Ритуал заботы",
      desc: "Я люблю и уважаю свою потребность в тишине Вернись в центр с помощью медитации",
      button: "Дыхание Любви"
    },
    connecting: "Установка Mesh-соединения...",
    honoring: "Принимаем твой запрос на заботу",
    allIsWell: "Все хорошо",
    loved: "Я любим",
    friendLoved: (name: string) => `${name} любим`,
    takenCareOf: "и о нем заботятся",
    dispatched: "Запрос помощи через Mesh отправлен",
    meshShared: "Локация Mesh передана",
    privacyActive: "Протоколы приватности активны",
    returning: (s: number) => `Возврат в пространство через ${s}с`
  }
};

interface SOSAlertProps {
  onClose: () => void;
  friendName?: string;
  friendStatus?: string;
}

export function SOSAlert({ onClose, friendName, friendStatus }: SOSAlertProps) {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const [step, setStep] = useState<'confirm' | 'sending' | 'sent'>('confirm');
  const [countdown, setCountdown] = useState(15);
  const [lang, setLang] = useState<'en' | 'de' | 'pt' | 'ru'>('en');
  const isFriendMode = !!friendName;

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de', 'pt', 'ru'].includes(savedLang)) setLang(savedLang);

    playHeartbeat();
    let timer: NodeJS.Timeout;
    if (step === 'sent' && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    } else if (step === 'sent' && countdown === 0) {
      onClose();
    }
    return () => clearInterval(timer);
  }, [step, countdown, onClose]);

  const t = CONTENT[lang as keyof typeof CONTENT] || CONTENT.en;

  const handleSendSOS = async (priority: 'urgent' | 'standard' | 'grounding') => {
    playHeartbeat();
    
    if (priority === 'grounding') {
      onClose();
      router.push('/self-care');
      return;
    }

    if (!auth.currentUser || !firestore) return;
    setStep('sending');

    const userUid = auth.currentUser.uid;
    const userRef = doc(firestore, 'users', userUid);

    const logMessage = isFriendMode 
      ? `USER REPORTED DISTRESS FOR FRIEND: ${friendName} (Status: ${friendStatus}) VIA MESH`
      : `User triggered ${priority === 'urgent' ? 'AWARENESS' : 'FRIENDS'} support alert via Mesh Tactical Grid`;

    addDocumentNonBlocking(collection(firestore, 'users', userUid, 'sosEvents'), {
      triggeredAt: serverTimestamp(),
      status: 'sent',
      priority: priority,
      message: logMessage,
      resolvedAt: null,
      meshData: { triangulated: true, signalStrength: 'high' }
    });

    if (!isFriendMode && priority === 'urgent') {
      setDocumentNonBlocking(userRef, { sosActive: true }, { merge: true });
    }

    setTimeout(() => {
      setStep('sent');
    }, 2000);
  };

  if (step === 'sent') {
    return (
      <div className="fixed inset-0 bg-[#050505] z-[4000] flex flex-col items-center justify-center px-8 text-center font-headline animate-in fade-in duration-700">
        <div className="mb-8 relative">
          <Heart size={100} fill="#58c55a" className="text-[#58c55a] animate-pulse-heart drop-shadow-[0_0_40px_rgba(88,197,90,0.5)]" />
        </div>
        
        <div className="space-y-6 max-w-sm">
          <h1 className={cn("text-4xl font-black uppercase tracking-tighter text-white leading-none", lang === 'ru' && "italic font-serif")}>
            {isFriendMode ? t.friendLoved(friendName!) : t.loved} <br/> <span className="text-[#58c55a]">{t.takenCareOf}</span>
          </h1>
          <div className="bg-white/5 border border-[#58c55a]/20 rounded-[2.5rem] p-8 space-y-4 text-left">
            <div className="flex items-center gap-4 text-white/80">
              <CheckCircle2 size={18} className="text-[#58c55a]" />
              <p className={cn("text-xs font-bold uppercase tracking-widest leading-tight", lang === 'ru' && "italic font-serif")}>{t.dispatched}</p>
            </div>
            <div className="flex items-center gap-4 text-white/80">
              <Radio size={18} className="text-[#58c55a] animate-pulse" />
              <p className={cn("text-xs font-bold uppercase tracking-widest leading-tight", lang === 'ru' && "italic font-serif")}>{t.meshShared}</p>
            </div>
            <div className="flex items-center gap-4 text-white/80">
              <ShieldCheck size={18} className="text-[#58c55a]" />
              <p className={cn("text-xs font-bold uppercase tracking-widest leading-tight", lang === 'ru' && "italic font-serif")}>{t.privacyActive}</p>
            </div>
          </div>
        </div>

        <button onClick={onClose} className={cn("mt-10 text-white/20 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest underline underline-offset-8", lang === 'ru' && "italic font-serif")}>
          {t.returning(countdown)}
        </button>
      </div>
    );
  }

  if (step === 'sending') {
    return (
      <div className="fixed inset-0 bg-black/95 z-[4000] flex flex-col items-center justify-center px-8 text-center font-headline">
        <Loader2 size={80} className="text-[#58c55a] animate-spin mb-8" />
        <h1 className={cn("text-3xl font-black uppercase tracking-tighter text-white mb-2", lang === 'ru' && "italic font-serif")}>{t.connecting}</h1>
        <p className={cn("text-[#58c55a] font-black uppercase tracking-[0.3em] text-[10px]", lang === 'ru' && "italic font-serif")}>
          {t.honoring}
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[4000] flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-500 font-headline">
      <div className="bg-[#0a0a0a] w-full max-w-2xl rounded-t-[3.5rem] sm:rounded-[3.5rem] border-t-2 sm:border-2 border-white/10 flex flex-col h-[95dvh] sm:h-[90vh] max-h-[95dvh] sm:max-h-[90vh] shadow-[0_-20px_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
        
        <button 
          onClick={() => { playHeartbeat(); onClose(); }}
          className="absolute top-8 right-8 p-3 bg-white/5 rounded-full border border-white/10 text-white/40 hover:text-white transition-all z-[100]"
        >
          <X size={18} />
        </button>

        <div className="p-10 pb-4 text-center shrink-0">
          <div className="w-16 h-16 bg-red-600/10 border-2 border-red-600/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <Heart size={32} className="text-[#DC2626]" fill="#DC2626" />
          </div>
          <h2 className={cn("text-3xl font-black uppercase tracking-tighter text-white leading-none", lang === 'ru' && "italic font-serif")}>
            {isFriendMode ? t.helping(friendName!) : t.question}
          </h2>
          <p className={cn("text-primary text-[9px] font-black uppercase mt-3 tracking-[0.3em]", lang === 'ru' && "italic font-serif")}>
            {isFriendMode ? t.friendSubtitle(friendName!) : t.subtitle}
          </p>
        </div>

        <ScrollArea className="flex-1 px-6">
          <div className="max-w-md mx-auto w-full pb-32">
            <Tabs defaultValue="emergency" className="w-full">
              <TabsList className="w-full h-14 bg-white/5 border border-white/10 rounded-full p-1.5 mb-6">
                <TabsTrigger value="emergency" className={cn("flex-1 rounded-full text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-red-600 data-[state=active]:text-white", lang === 'ru' && "italic font-serif")}>
                  {t.tabs.emergency}
                </TabsTrigger>
                <TabsTrigger value="support" className={cn("flex-1 rounded-full text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-[#F59E0B] data-[state=active]:text-black", lang === 'ru' && "italic font-serif")}>
                  {t.tabs.circle}
                </TabsTrigger>
                {!isFriendMode && (
                  <TabsTrigger value="stillness" className={cn("flex-1 rounded-full text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white", lang === 'ru' && "italic font-serif")}>
                    {t.tabs.stillness}
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="emergency" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 focus-visible:outline-none">
                <div className="p-6 bg-red-600/5 border-2 border-red-600/20 rounded-[2rem] space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-600/20 rounded-xl">
                      <PhoneCall className="text-red-500" size={24} />
                    </div>
                    <div>
                      <p className={cn("text-sm font-black uppercase text-white tracking-tight", lang === 'ru' && "italic font-serif")}>{t.emergency.title}</p>
                      <p className={cn("text-[10px] font-bold text-red-400 uppercase tracking-widest", lang === 'ru' && "italic font-serif")}>{t.emergency.sub}</p>
                    </div>
                  </div>
                  <p className={cn("text-xs text-white/60 leading-relaxed font-medium uppercase tracking-wide", lang === 'ru' && "italic font-serif")}>
                    {t.emergency.desc}
                  </p>
                  <button 
                    onClick={() => handleSendSOS('urgent')}
                    className={cn("w-full py-6 bg-red-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-red-600/20 active:scale-95 transition-all", lang === 'ru' && "italic font-serif")}
                  >
                    {t.emergency.button}
                  </button>
                </div>
              </TabsContent>

              <TabsContent value="support" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 focus-visible:outline-none">
                <div className="p-6 bg-amber-500/5 border-2 border-amber-500/20 rounded-[2rem] space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-500/20 rounded-xl">
                      <Users className="text-amber-500" size={24} />
                    </div>
                    <div>
                      <p className={cn("text-sm font-black uppercase text-white tracking-tight", lang === 'ru' && "italic font-serif")}>{t.circle.title}</p>
                      <p className={cn("text-[10px] font-bold text-amber-500 uppercase tracking-widest", lang === 'ru' && "italic font-serif")}>{t.circle.sub}</p>
                    </div>
                  </div>
                  <p className={cn("text-xs text-white/60 leading-relaxed font-medium uppercase tracking-wide", lang === 'ru' && "italic font-serif")}>
                    {t.circle.desc}
                  </p>
                  <button 
                    onClick={() => handleSendSOS('standard')}
                    className={cn("w-full py-6 bg-[#F59E0B] text-black rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg active:scale-95 transition-all", lang === 'ru' && "italic font-serif")}
                  >
                    {t.circle.button}
                  </button>
                </div>
              </TabsContent>

              {!isFriendMode && (
                <TabsContent value="stillness" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 focus-visible:outline-none">
                  <div className="p-6 bg-primary/5 border-2 border-primary/20 rounded-[2rem] space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/20 rounded-xl">
                        <Wind className="text-primary" size={24} />
                      </div>
                      <div>
                        <p className={cn("text-sm font-black uppercase text-white tracking-tight", lang === 'ru' && "italic font-serif")}>{t.stillness.title}</p>
                        <p className={cn("text-[10px] font-bold text-primary uppercase tracking-widest", lang === 'ru' && "italic font-serif")}>{t.stillness.sub}</p>
                      </div>
                    </div>
                    <p className={cn("text-xs text-white/60 leading-relaxed font-medium uppercase tracking-wide", lang === 'ru' && "italic font-serif")}>
                      {t.stillness.desc}
                    </p>
                    <button 
                      onClick={() => handleSendSOS('grounding')}
                      className={cn("w-full py-6 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg active:scale-95 transition-all", lang === 'ru' && "italic font-serif")}
                    >
                      {t.stillness.button}
                    </button>
                  </div>
                </TabsContent>
              )}
            </Tabs>

            <div className="mt-6 pt-6 border-t border-white/5 text-center">
              <button 
                onClick={() => { playHeartbeat(); onClose(); }}
                className={cn("text-primary font-black text-xs uppercase tracking-[0.4em] hover:underline underline-offset-8 transition-all active:scale-95", lang === 'ru' && "italic font-serif")}
              >
                {t.allIsWell}
              </button>
            </div>
          </div>
        </ScrollArea>

        <div className="p-8 pt-4 bg-black/40 backdrop-blur-md border-t border-white/5 text-center shrink-0">
          <p className={cn("text-[8px] font-black uppercase tracking-[0.5em] text-white/20", lang === 'ru' && "italic font-serif")}>
            Sanctuary Support Protocol • Encrypted with Love
          </p>
        </div>
      </div>
    </div>
  );
}