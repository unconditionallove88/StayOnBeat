
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
  CircleDot
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { playHeartbeat } from '@/lib/resonance';

/**
 * @fileOverview Immediate Help (SOS) Portal.
 * Categorized support pathways: Emergency, Circle, Stillness.
 */

const CONTENT = {
  en: {
    question: "Do you need help?",
    helping: (name: string) => `Helping ${name}`,
    subtitle: "Choose the pathway that resonates now",
    friendSubtitle: (name: string) => `Choose the pathway of care for ${name}`,
    tabs: {
      emergency: "Emergency",
      circle: "Circle",
      stillness: "Stillness"
    },
    emergency: {
      title: "Awareness Dispatch",
      sub: "Medical & Security",
      desc: "Request professional support to your current tactical grid Handled with absolute discretion",
      button: "Notify Awareness Team"
    },
    circle: {
      title: "Circle Alert",
      sub: "Mutual Care",
      desc: "Let your inner circle know a moment of connection or assistance is needed",
      button: "Notify My Circle"
    },
    stillness: {
      title: "Grounding Path",
      sub: "Self-Care Mode",
      desc: "I love and respect my need for stillness Access breathing tools and calming guidance",
      button: "Open Stillness Tools"
    },
    connecting: "Connecting...",
    honoring: "Honoring the request for care",
    allIsWell: "All is well",
    loved: "I am loved",
    friendLoved: (name: string) => `${name} is loved`,
    takenCareOf: "and being taken care of",
    dispatched: "Help request dispatched",
    privacyActive: "Privacy protocols active",
    returning: (s: number) => `Returning to sanctuary in ${s}s`
  },
  de: {
    question: "Brauchst du Unterstützung?",
    helping: (name: string) => `${name} braucht Begleitung`,
    subtitle: "Wähle den Weg, der sich jetzt richtig anfühlt",
    friendSubtitle: (name: string) => `Wähle einen Weg der Fürsorge für ${name}`,
    tabs: {
      emergency: "Notfall",
      circle: "Kreis",
      stillness: "Ruhe"
    },
    emergency: {
      title: "Awareness-Einsatz",
      sub: "Medizin & Sicherheit",
      desc: "Fordere professionelle Begleitung an deine aktuelle Position an Diskret und vertraulich",
      button: "Awareness-Team rufen"
    },
    circle: {
      title: "Circle-Alarm",
      sub: "Gegenseitige Fürsorge",
      desc: "Lass deinen inneren Kreis wissen, dass gerade Unterstützung oder Verbindung gebraucht wird",
      button: "Meinen Kreis rufen"
    },
    stillness: {
      title: "Erdungspfad",
      sub: "Selbstfürsorge",
      desc: "Ich achte auf mein Bedürfnis nach Ruhe Nutze Atem-Tools und sanfte Führung",
      button: "Ruhe-Tools öffnen"
    },
    connecting: "Verbindung wird aufgebaut...",
    honoring: "Die Anfrage wird liebevoll bearbeitet",
    allIsWell: "Alles ist gut",
    loved: "Ich werde geliebt",
    friendLoved: (name: string) => `${name} wird geliebt`,
    takenCareOf: "und bin in Sicherheit",
    dispatched: "Unterstützung wurde angefordert",
    privacyActive: "Schutzprotokolle sind aktiv",
    returning: (s: number) => `Rückkehr zum Dashboard in ${s}s`
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
  const [lang, setLang] = useState<'en' | 'de'>('en');
  const isFriendMode = !!friendName;

  useEffect(() => {
    const savedLang = localStorage.getItem('stayonbeat_lang');
    if (savedLang === 'DE') setLang('de');

    playHeartbeat();
    let timer: NodeJS.Timeout;
    if (step === 'sent' && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    } else if (step === 'sent' && countdown === 0) {
      onClose();
    }
    return () => clearInterval(timer);
  }, [step, countdown, onClose]);

  const t = CONTENT[lang];

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
      ? `USER REPORTED DISTRESS FOR FRIEND: ${friendName} (Status: ${friendStatus})`
      : `User triggered ${priority === 'urgent' ? 'AWARENESS' : 'FRIENDS'} support alert`;

    addDocumentNonBlocking(collection(firestore, 'users', userUid, 'sosEvents'), {
      triggeredAt: serverTimestamp(),
      status: 'sent',
      priority: priority,
      message: logMessage,
      resolvedAt: null,
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
          <Heart size={100} fill="#10B981" className="text-[#10B981] animate-pulse-heart drop-shadow-[0_0_40px_rgba(16,185,129,0.5)]" />
          <CircleDot className="absolute -top-4 -right-4 text-[#10B981] w-6 h-6 animate-pulse" />
        </div>
        
        <div className="space-y-6 max-w-sm">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white leading-none">
            {isFriendMode ? t.friendLoved(friendName!) : t.loved} <br/> <span className="text-[#10B981]">{t.takenCareOf}</span>
          </h1>
          <div className="bg-white/5 border border-[#10B981]/20 rounded-[2.5rem] p-8 space-y-4 text-left">
            <div className="flex items-center gap-4 text-white/80">
              <CheckCircle2 size={18} className="text-[#10B981]" />
              <p className="text-xs font-bold uppercase tracking-widest leading-tight">{t.dispatched}</p>
            </div>
            <div className="flex items-center gap-4 text-white/80">
              <ShieldCheck size={18} className="text-[#10B981]" />
              <p className="text-xs font-bold uppercase tracking-widest leading-tight">{t.privacyActive}</p>
            </div>
          </div>
        </div>

        <button onClick={onClose} className="mt-10 text-white/20 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest underline underline-offset-8">
          {t.returning(countdown)}
        </button>
      </div>
    );
  }

  if (step === 'sending') {
    return (
      <div className="fixed inset-0 bg-black/95 z-[4000] flex flex-col items-center justify-center px-8 text-center font-headline">
        <Loader2 size={80} className="text-[#10B981] animate-spin mb-8" />
        <h1 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">{t.connecting}</h1>
        <p className="text-[#10B981] font-black uppercase tracking-[0.3em] text-[10px]">
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
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white leading-none">
            {isFriendMode ? t.helping(friendName!) : t.question}
          </h2>
          <p className="text-[#10B981] text-[9px] font-black uppercase mt-3 tracking-[0.3em]">
            {isFriendMode ? t.friendSubtitle(friendName!) : t.subtitle}
          </p>
        </div>

        <ScrollArea className="flex-1 px-6">
          <div className="max-w-md mx-auto w-full pb-32">
            <Tabs defaultValue="emergency" className="w-full">
              <TabsList className="w-full h-14 bg-white/5 border border-white/10 rounded-full p-1.5 mb-6">
                <TabsTrigger value="emergency" className="flex-1 rounded-full text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  {t.tabs.emergency}
                </TabsTrigger>
                <TabsTrigger value="support" className="flex-1 rounded-full text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-[#F59E0B] data-[state=active]:text-black">
                  {t.tabs.circle}
                </TabsTrigger>
                {!isFriendMode && (
                  <TabsTrigger value="stillness" className="flex-1 rounded-full text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-[#10B981] data-[state=active]:text-black">
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
                      <p className="text-sm font-black uppercase text-white tracking-tight">{t.emergency.title}</p>
                      <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">{t.emergency.sub}</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed font-medium uppercase tracking-wide">
                    {t.emergency.desc}
                  </p>
                  <button 
                    onClick={() => handleSendSOS('urgent')}
                    className="w-full py-6 bg-red-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-red-600/20 active:scale-95 transition-all"
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
                      <p className="text-sm font-black uppercase text-white tracking-tight">{t.circle.title}</p>
                      <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">{t.circle.sub}</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed font-medium uppercase tracking-wide">
                    {t.circle.desc}
                  </p>
                  <button 
                    onClick={() => handleSendSOS('standard')}
                    className="w-full py-6 bg-[#F59E0B] text-black rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg active:scale-95 transition-all"
                  >
                    {t.circle.button}
                  </button>
                </div>
              </TabsContent>

              {!isFriendMode && (
                <TabsContent value="stillness" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 focus-visible:outline-none">
                  <div className="p-6 bg-emerald-500/5 border-2 border-emerald-500/20 rounded-[2rem] space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-500/20 rounded-xl">
                        <Wind className="text-emerald-500" size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase text-white tracking-tight">{t.stillness.title}</p>
                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{t.stillness.sub}</p>
                      </div>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed font-medium uppercase tracking-wide">
                      {t.stillness.desc}
                    </p>
                    <button 
                      onClick={() => handleSendSOS('grounding')}
                      className="w-full py-6 bg-[#10B981] text-black rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg active:scale-95 transition-all"
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
                className="text-[#10B981] font-black text-xs uppercase tracking-[0.4em] hover:underline underline-offset-8 transition-all active:scale-95"
              >
                {t.allIsWell}
              </button>
            </div>
          </div>
        </ScrollArea>

        <div className="p-8 pt-4 bg-black/40 backdrop-blur-md border-t border-white/5 text-center shrink-0">
          <p className="text-[8px] font-black uppercase tracking-[0.5em] text-white/20">
            Sanctuary Support Protocol • Encrypted with Love
          </p>
        </div>
      </div>
    </div>
  );
}
