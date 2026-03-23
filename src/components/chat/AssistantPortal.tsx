
'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Battery, Droplets, Moon, Zap, ArrowRight, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * @fileOverview AssistantPortal Component.
 * Full localization for EN, DE, PT, and RU.
 * Optimized for mobile touch-pan-y.
 */

interface AssistantPortalProps {
  userProfile: any;
}

const i18n = {
  en: {
    title: "StayOnBeat",
    personalAssistant: "Personal Assistant",
    question: "How is your inner state?",
    subtitle: "Select your current phase for high-fidelity, tailored support. 🌿",
    phases: [
      { title: "Before", desc: "Prepare your body & mind" },
      { title: "During", desc: "Stay safe & connected" },
      { title: "After", desc: "Recover & restore" }
    ],
    activeSession: "Active Session",
    liveAdvisor: "Live Safety Advisor"
  },
  de: {
    title: "StayOnBeat",
    personalAssistant: "Persönlicher Assistent",
    question: "Wie ist dein innerer Zustand?",
    subtitle: "Wähle deine aktuelle Phase für maßgeschneiderte Unterstützung. 🌿",
    phases: [
      { title: "Vorher", desc: "Körper & Geist vorbereiten" },
      { title: "Währenddessen", desc: "Sicher & verbunden bleiben" },
      { title: "Danach", desc: "Erholen & regenerieren" }
    ],
    activeSession: "Aktive Sitzung",
    liveAdvisor: "Live Sicherheits-Berater"
  },
  pt: {
    title: "StayOnBeat",
    personalAssistant: "Assistente Pessoal",
    question: "Como está seu estado interior?",
    subtitle: "Selecione sua fase atual para suporte personalizado de alta fidelidade. 🌿",
    phases: [
      { title: "Antes", desc: "Prepare seu corpo e mente" },
      { title: "Durante", desc: "Fique seguro e conectado" },
      { title: "Depois", desc: "Recupere e restaure" }
    ],
    activeSession: "Sessão Ativa",
    liveAdvisor: "Assessor de Segurança"
  },
  ru: {
    title: "StayOnBeat",
    personalAssistant: "Персональный Помощник",
    question: "Как твое внутреннее состояние?",
    subtitle: "Выбери текущую фазу для персональной поддержки. 🌿",
    phases: [
      { title: "До", desc: "Подготовь тело и разум" },
      { title: "Во время", desc: "Будь в безопасности и связи" },
      { title: "После", desc: "Восстановись и отдохни" }
    ],
    activeSession: "Активная Сессия",
    liveAdvisor: "Советник по Безопасности"
  }
};

export function AssistantPortal({ userProfile }: AssistantPortalProps) {
  const router = useRouter();
  const [lang, setLang] = useState<'en' | 'de' | 'pt' | 'ru'>('en');

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de', 'pt', 'ru'].includes(savedLang)) setLang(savedLang);
  }, []);

  const t = i18n[lang] || i18n.en;

  const phases = [
    { 
      title: t.phases[0].title, 
      icon: <Battery className="text-emerald-400" size={24} />, 
      desc: t.phases[0].desc, 
      color: "bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40",
      action: () => router.push('/before')
    },
    { 
      title: t.phases[1].title, 
      icon: <Zap className="text-amber-400" size={24} />, 
      desc: t.phases[1].desc, 
      color: "bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40",
      action: () => router.push('/during')
    },
    { 
      title: t.phases[2].title, 
      icon: <Moon className="text-indigo-400" size={24} />, 
      desc: t.phases[2].desc, 
      color: "bg-indigo-500/5 hover:bg-indigo-500/10 border-indigo-500/20 hover:border-indigo-500/40",
      action: () => router.push('/recovery')
    }
  ];

  return (
    <div className="h-full bg-black text-white flex flex-col font-headline relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      <header className="flex items-center justify-between p-8 pb-4 relative z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
            <Heart className="text-emerald-500 fill-emerald-500" size={20} />
          </div>
          <h1 className="text-xl font-black uppercase tracking-tighter">{t.title}</h1>
        </div>
      </header>

      <ScrollArea className="flex-1 px-8 relative z-10 touch-pan-y">
        <section className="mb-8 pt-4">
          <div className="flex items-center gap-3 mb-2">
            <Bot className="text-emerald-500" size={20} />
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">{t.personalAssistant}</p>
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter leading-none mb-4">
            {t.question.split(' ').slice(0, -1).join(' ')} <br /> <span className="text-emerald-500">{t.question.split(' ').pop()}</span>
          </h2>
          <p className="text-[#10B981] text-sm font-bold leading-relaxed max-w-[280px] uppercase tracking-widest">
            {t.subtitle}
          </p>
        </section>

        <div className="grid gap-4 pb-32">
          {phases.map((phase) => (
            <button 
              key={phase.title}
              onClick={phase.action}
              className={cn(
                "flex items-center p-6 rounded-[2rem] border-2 transition-all active:scale-[0.98] group text-left",
                phase.color
              )}
            >
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 group-hover:scale-110 transition-transform mr-5">
                {phase.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black uppercase tracking-tight">{phase.title}</h3>
                <p className="text-[10px] font-black text-[#10B981] uppercase tracking-widest mt-1">{phase.desc}</p>
              </div>
              <ArrowRight size={18} className="text-white/10 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </ScrollArea>

      <footer className="absolute bottom-8 left-8 right-8 z-20 pointer-events-none pb-safe">
        <div className="bg-zinc-900/80 backdrop-blur-md border border-white/10 p-4 rounded-full flex justify-around items-center shadow-2xl pointer-events-auto">
          <button onClick={() => router.push('/before')} className="p-3 text-zinc-500 hover:text-blue-400 transition-colors active:scale-90"><Droplets size={24} /></button>
          <button onClick={() => router.push('/heart-status')} className="relative active:scale-90 transition-transform">
            <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
            <div className="relative w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg"><Heart className="text-black" fill="black" size={24} /></div>
          </button>
          <button onClick={() => router.push('/before')} className="p-3 text-zinc-500 hover:text-emerald-400 transition-colors active:scale-90"><Battery size={24} /></button>
        </div>
      </footer>
    </div>
  );
}
