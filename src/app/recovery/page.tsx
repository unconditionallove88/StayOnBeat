
"use client"

import { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, HeartPulse, CheckCircle2, Heart, ShieldCheck, Timer, Droplets, Zap, Coffee, Moon, ExternalLink, Wind, Volume2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { playHeartbeat } from '@/lib/resonance';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * @fileOverview Recovery Protocol Page.
 * Languages: EN, DE, PT, RU.
 */

export default function RecoveryView() {
  const router = useRouter();
  const [detoxPlan, setDetoxPlan] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState('02:00:00');
  const [mounted, setMounted] = useState(false);
  const [sessionLogs, setSessionLogs] = useState<any[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [lang, setLang] = useState<'en' | 'de' | 'pt' | 'ru'>('en');
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de', 'pt', 'ru'].includes(savedLang)) setLang(savedLang);

    const logs = JSON.parse(localStorage.getItem('stayonbeat_logs') || '[]');
    setSessionLogs(logs);
    generateDetox(logs);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const parts = prev.split(':').map(Number);
        if (parts.length !== 3) return '02:00:00';
        const [h, m, s] = parts;
        let totalSeconds = h * 3600 + m * 60 + s - 1;
        if (totalSeconds <= 0) return '00:00:00';
        const nh = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const nm = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const ns = (totalSeconds % 60).toString().padStart(2, '0');
        return `${nh}:${nm}:${ns}`;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [lang]);

  const t = {
    en: {
      integrated: "Integrated", recovery: "Recovery", personalProtocol: "Personalized protocol", activeProtection: "Active Protection", secureWipe: "Session data wiped", protocolGenerated: "Personalized protocol generated", privacyFinalized: "Privacy protocols finalized", dataAnalyzed: (count: number) => `Data analyzed: ${count} entries`, timeline: "Integration Timeline", noLogs: "No logs detected", wipeWarning: "Completing this protocol will permanently wipe session logs and location history", finishBtn: "Complete Session", returnBtn: "Return to Sanctuary", improveBtn: "Help us improve", minutes: "4minutes · anonymous", ritualTitle: "Breath of Love", ritualDesc: "Perform the guided resonance ritual to recalibrate your nervous system"
    },
    de: {
      integrated: "Integriert", recovery: "Erholung", personalProtocol: "Persönlicher Protokoll", activeProtection: "Aktiver Schutz", secureWipe: "Sitzungsdaten gelöscht hier", protocolGenerated: "Persönliches Protokoll erstellt hier", privacyFinalized: "Schutzprotokolle abgeschlossen hier", dataAnalyzed: (count: number) => `Daten analysiert: ${count} Einträge`, timeline: "Integrations Zeitachse heute", noLogs: "Keine Sitzungsdaten gefunden", wipeWarning: "Der Abschluss dieses Protokolls löscht dauerhaft alle Sitzungsprotokolle und Verläufe", finishBtn: "Session jetzt abschließen", returnBtn: "Zurück zum Sanctuary", improveBtn: "Hilf uns verbessern", minutes: "4 Minuten · anonym", ritualTitle: "Atem der Liebe", ritualDesc: "Führe das Ritual durch um dein Nervensystem sanft zu kalibrieren"
    },
    pt: {
      integrated: "Integrado", recovery: "Recuperação", personalProtocol: "Protocolo personalizado", activeProtection: "Proteção Ativa", secureWipe: "Dados limpos agora", protocolGenerated: "Protocolo personalizado criado", privacyFinalized: "Protocolos finalizados aqui", dataAnalyzed: (count: number) => `Dados analisados: ${count} entradas`, timeline: "Linha do tempo", noLogs: "Sem registros aqui", wipeWarning: "Concluir este protocolo limpará permanentemente todos os registros", finishBtn: "Concluir Sessão Agora", returnBtn: "Voltar ao Santuário", improveBtn: "Ajude-nos a melhorar", minutes: "4 minutos · anônimo", ritualTitle: "Sopro de Amor", ritualDesc: "Realize o ritual de ressonância para recalibrar seu sistema nervoso"
    },
    ru: {
      integrated: "Интегрировано", recovery: "Восстановление", personalProtocol: "Персональный протокол", activeProtection: "Активная защита", secureWipe: "Данные сессии удалены", protocolGenerated: "Протокол сформирован здесь", privacyFinalized: "Протоколы завершены здесь", dataAnalyzed: (count: number) => `Анализ: ${count} записей`, timeline: "График интеграции здесь", noLogs: "Записи не найдены", wipeWarning: "Завершение протокола навсегда удалит все данные сессии", finishBtn: "Завершить сессию сейчас", returnBtn: "Вернуться в пространство", improveBtn: "Помогите нам стать лучше", minutes: "4 минуты · анонимно", ritualTitle: "Дыхание Любви", ritualDesc: "Выполните ритуал резонанса для восстановления нервной системы"
    }
  }[lang] || {
    integrated: "Integrated", recovery: "Recovery", personalProtocol: "Personalized protocol", activeProtection: "Active Protection", secureWipe: "Session data wiped", protocolGenerated: "Personalized protocol generated", privacyFinalized: "Privacy protocols finalized", dataAnalyzed: (count: number) => `Data analyzed: ${count} entries`, timeline: "Integration Timeline", noLogs: "No logs detected", wipeWarning: "Completing this protocol will permanently wipe session logs and location history", finishBtn: "Complete Session", returnBtn: "Return to Sanctuary", improveBtn: "Help us improve", minutes: "4minutes · anonymous", ritualTitle: "Breath of Love", ritualDesc: "Perform the guided resonance ritual to recalibrate your nervous system"
  };

  const affirmation = {
    en: "I am love",
    de: "Ich bin pure Liebe",
    pt: "Eu sou amor",
    ru: "Я есть любовь"
  }[lang] || "I am love";

  const generateDetox = (logs: any[]) => {
    const plan: any[] = [];
    
    plan.push({
      id: 'ritual', time: "Immediate", text: t.ritualTitle,
      desc: t.ritualDesc, icon: Wind, color: "text-primary", isAction: true
    });

    plan.push({ 
      id: 'h2o', time: "10m", text: "Isotonic Rehydration", 
      desc: "Consume 500ml water with electrolytes to restore mineral balance", icon: Droplets, color: "text-blue-500"
    });

    setDetoxPlan(plan);
  };

  const handleFinish = () => {
    playHeartbeat();
    const profile = JSON.parse(localStorage.getItem('stayonbeat_profile') || '{}');
    const updatedProfile = { ...profile, safetyStreak: (profile.safetyStreak || 0) + 1 };
    localStorage.setItem('stayonbeat_profile', JSON.stringify(updatedProfile));
    localStorage.removeItem('stayonbeat_logs');
    localStorage.removeItem('stayonbeat_witness_blocked');
    setIsFinished(true);
  };

  const handleVoice = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const text = isFinished ? affirmation : `${t.protocolGenerated}. ${t.timeline}: ${detoxPlan.map(p => `${p.text} at ${p.time}`).join('. ')}`;
      const { audioDataUri } = await textToSpeech({ text, lang: lang as any });
      const audio = new Audio(audioDataUri);
      audio.onended = () => setIsSpeaking(false);
      audio.play();
    } catch (e) {
      setIsSpeaking(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-black text-white font-headline pb-64 pt-safe">
      <div className="bg-black/95 backdrop-blur-xl border-b border-white/5 px-6 py-8 sticky top-0 z-50">
        <div className="max-w-xl mx-auto space-y-6">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-white/40 uppercase font-black text-[10px] tracking-widest hover:text-primary transition-colors"><ArrowLeft className="w-4 h-4" /> Back to sanctuary</button>
          <div className="flex justify-between items-end">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">{isFinished ? t.integrated : t.recovery}</h1>
                <button onClick={handleVoice} disabled={isSpeaking} className="p-2 bg-white/5 rounded-full border border-white/10 hover:border-primary transition-all disabled:opacity-30">
                  {isSpeaking ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Volume2 className="w-4 h-4 text-primary" />}
                </button>
              </div>
              <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mt-2">"{isFinished ? affirmation : t.personalProtocol}"</p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-full flex items-center gap-2"><Heart className="w-3 h-3 text-primary fill-primary animate-pulse-heart" /><span className="text-[8px] font-black text-primary uppercase tracking-widest">{t.activeProtection}</span></div>
              {!isFinished && <span className="font-mono text-primary text-xs font-black">{timeLeft}</span>}
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="h-full">
        <div className="px-6 py-10 max-w-xl mx-auto space-y-12 pb-40">
          {isFinished && (
            <div className="text-center py-10 space-y-6 animate-in fade-in zoom-in duration-1000">
              <p className="text-2xl font-black uppercase tracking-tighter text-primary leading-tight max-w-[300px] mx-auto">"{affirmation}"</p>
            </div>
          )}

          <div className="bg-blue-500/10 border border-blue-500/20 p-8 rounded-[2.5rem] flex items-start gap-6">
            <ShieldCheck className="w-8 h-8 text-blue-400 shrink-0" />
            <div className="space-y-2">
              <p className="text-base font-bold text-white/90 leading-tight">{isFinished ? t.secureWipe : t.protocolGenerated}</p>
              <p className="text-[10px] uppercase font-black text-white/40 tracking-widest">{isFinished ? t.privacyFinalized : t.dataAnalyzed(sessionLogs.length)}</p>
            </div>
          </div>

          <section className="space-y-6">
            <div className="flex items-center gap-4 mb-4 px-2"><HeartPulse className="w-6 h-6 text-primary" /><h3 className="text-xl font-black uppercase tracking-tight">{t.timeline}</h3></div>
            <div className="grid gap-4">
              {detoxPlan.length > 0 ? (
                detoxPlan.map((p) => (
                  <div 
                    key={p.id} 
                    onClick={() => p.isAction && router.push('/self-care')}
                    className={cn(
                      "p-8 rounded-[2.5rem] border border-white/10 bg-white/5 flex flex-col gap-4 group transition-all",
                      p.isAction ? "border-primary/40 bg-primary/5 cursor-pointer hover:bg-primary/10" : "hover:bg-primary/40"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn("p-3 rounded-2xl bg-white/5", p.color)}><p.icon className="w-6 h-6" /></div>
                        <div className="flex flex-col"><span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{p.time}</span><span className="text-xl font-black uppercase text-white">{p.text}</span></div>
                      </div>
                      {p.isAction ? <Sparkles className="w-5 h-5 text-primary animate-pulse" /> : <CheckCircle2 className="w-5 h-5 text-primary/20 group-hover:text-primary transition-colors" />}
                    </div>
                    <p className="text-sm font-bold text-white/60 leading-relaxed pl-2 border-l-2 border-white/10">{p.desc}</p>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center gap-6 py-16 text-white/10 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/5"><Timer className="w-12 h-12 opacity-20" /><p className="text-[10px] font-black uppercase tracking-[0.4em]">{t.noLogs}</p></div>
              )}
            </div>
          </section>

          {!isFinished && (
            <div className="bg-red-600/5 border border-red-600/20 p-8 rounded-[2.5rem] text-center">
              <div className="flex justify-center mb-4"><Trash2 size={24} className="text-red-500/40" /></div>
              <p className="text-[10px] font-black text-red-500/40 uppercase tracking-[0.3em] leading-relaxed max-w-[280px] mx-auto">{t.wipeWarning}</p>
            </div>
          )}
        </div>
      </ScrollArea>

      <footer className="fixed bottom-0 left-0 right-0 h-auto min-h-[120px] py-8 bg-black/95 backdrop-blur-xl border-t border-white/5 flex flex-col items-center justify-center px-6 z-50 gap-4 pb-safe">
        {!isFinished ? (
          <button onClick={handleFinish} className="w-full max-w-sm py-6 bg-[#1b4d3e] text-white rounded-full font-black uppercase text-lg tracking-[0.1em] active:scale-95 transition-all shadow-lg shadow-primary/20">{t.finishBtn}</button>
        ) : (
          <div className="w-full max-w-sm flex flex-col gap-4 animate-in slide-in-from-bottom-4 duration-500">
            <button onClick={() => router.push('/dashboard')} className="w-full py-6 bg-white text-black rounded-full font-black uppercase text-lg tracking-[0.1em] active:scale-95 transition-all shadow-lg">{t.returnBtn}</button>
            <button onClick={() => window.open("https://ev32k2sgx09.typeform.com/to/a33evEfp", "_blank")} className="w-full p-6 bg-primary/10 border border-primary/30 rounded-[2rem] flex items-center justify-between group hover:bg-primary/20 transition-all"><div className="text-left"><p className="text-sm font-black uppercase text-white tracking-tight">{t.improveBtn}</p><p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">{t.minutes}</p></div><ExternalLink size={20} className="text-primary opacity-40 group-hover:opacity-100 transition-opacity" /></button>
          </div>
        )}
      </footer>
    </main>
  );
}
