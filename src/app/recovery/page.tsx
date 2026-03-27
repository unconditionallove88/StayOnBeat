"use client"

import { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, HeartPulse, CheckCircle2, Heart, ShieldCheck, Timer, Droplets, Zap, Coffee, Moon, ExternalLink, Wind } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { playHeartbeat } from '@/lib/resonance';

/**
 * @fileOverview Recovery Protocol Page.
 * Languages: EN, DE, PT.
 */

export default function RecoveryView() {
  const router = useRouter();
  const [detoxPlan, setDetoxPlan] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState('02:00:00');
  const [mounted, setMounted] = useState(false);
  const [sessionLogs, setSessionLogs] = useState<any[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [lang, setLang] = useState<'en' | 'de' | 'pt'>('en');

  useEffect(() => {
    setMounted(true);
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de', 'pt'].includes(savedLang)) setLang(savedLang);

    const logs = JSON.parse(localStorage.getItem('stayonbeat_logs') || '[]');
    setSessionLogs(logs);
    generateDetox(logs);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const [h, m, s] = prev.split(':').map(Number);
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
      integrated: "Integrated",
      recovery: "Recovery",
      personalProtocol: "Personalized protocol",
      activeProtection: "Active Protection",
      secureWipe: "Your session data has been securely wiped",
      protocolGenerated: "Personalized protocol generated based on your session logs",
      privacyFinalized: "Privacy protocols finalized",
      dataAnalyzed: (count: number) => `Data analyzed: ${count} intake events recorded`,
      timeline: "Your Integration Timeline",
      noLogs: "No session logs detected",
      wipeWarning: "Completing this protocol will permanently wipe session logs and location history for your privacy",
      finishBtn: "Complete Session & Log Streak",
      returnBtn: "Return to Sanctuary",
      improveBtn: "Help us improve StayOnBeat",
      minutes: "4minutes · anonymous",
      ritualTitle: "Breath of Love",
      ritualDesc: "Perform the guided resonance ritual to recalibrate your nervous system and integration"
    },
    de: {
      integrated: "Integriert",
      recovery: "Erholung",
      personalProtocol: "Persönlicher Protokoll",
      activeProtection: "Aktiver Schutz",
      secureWipe: "Deine Sitzungsdaten wurden sicher gelöscht",
      protocolGenerated: "Persönliches Protokoll basierend auf deinen Einträgen erstellt",
      privacyFinalized: "Schutzprotokolle abgeschlossen",
      dataAnalyzed: (count: number) => `Daten analysiert: ${count} Einträge erfasst`,
      timeline: "Deine Integrations-Zeitachse",
      noLogs: "Keine Sitzungsdaten gefunden",
      wipeWarning: "Der Abschluss dieses Protokolls löscht dauerhaft Sitzungsprotokolle und Standortverlauf für deine Privatsphäre",
      finishBtn: "Session abschließen & Streak sichern",
      returnBtn: "Zurück zum Sanctuary",
      improveBtn: "Hilf uns StayOnBeat zu verbessern",
      minutes: "4 Minuten · anonym",
      ritualTitle: "Atem der Liebe",
      ritualDesc: "Führe das Resonance-Ritual durch, um dein Nervensystem zu kalibrieren und die Integration zu fördern"
    },
    pt: {
      integrated: "Integrado",
      recovery: "Recuperação",
      personalProtocol: "Protocolo personalizado",
      activeProtection: "Proteção Ativa",
      secureWipe: "Seus dados de sessão foram apagados com segurança",
      protocolGenerated: "Protocolo personalizado gerado com base nos seus registros",
      privacyFinalized: "Protocolos de privacidade finalizados",
      dataAnalyzed: (count: number) => `Dados analisados: ${count} registros de consumo`,
      timeline: "Sua linha do tempo de integração",
      noLogs: "Nenhum registro de sessão detectado",
      wipeWarning: "Concluir este protocolo apagará permanentemente os registros da sessão e o histórico de localização",
      finishBtn: "Concluir Sessão e Logar Streak",
      returnBtn: "Retornar ao Santuário",
      improveBtn: "Ajude-nos a melhorar o StayOnBeat",
      minutes: "4 minutos · anônimo",
      ritualTitle: "Sopro de Amor",
      ritualDesc: "Realize o ritual de ressonância guiada para recalibrar seu sistema nervoso"
    }
  }[lang] || {
    integrated: "Integrated",
    recovery: "Recovery",
    personalProtocol: "Personalized protocol",
    activeProtection: "Active Protection",
    secureWipe: "Your session data has been securely wiped",
    protocolGenerated: "Personalized protocol generated based on your session logs",
    privacyFinalized: "Privacy protocols finalized",
    dataAnalyzed: (count: number) => `Data analyzed: ${count} intake events recorded`,
    timeline: "Your Integration Timeline",
    noLogs: "No session logs detected",
    wipeWarning: "Completing this protocol will permanently wipe session logs and location history for your privacy",
    finishBtn: "Complete Session & Log Streak",
    returnBtn: "Return to Sanctuary",
    improveBtn: "Help us improve StayOnBeat",
    minutes: "4minutes · anonymous",
    ritualTitle: "Breath of Love",
    ritualDesc: "Perform the guided resonance ritual to recalibrate your nervous system and integration"
  };

  const affirmation = {
    en: "Unconditional love always",
    de: "Bedingungslose Liebe immerzu hier",
    pt: "Amor incondicional sempre aqui"
  }[lang] || "Unconditional love always";

  const generateDetox = (logs: any[]) => {
    const plan: any[] = [];
    
    // Always recommend Breath of Love first
    plan.push({
      id: 'ritual', time: "Immediate", text: t.ritualTitle,
      desc: t.ritualDesc, icon: Wind, color: "text-primary", isAction: true
    });

    plan.push({ 
      id: 'h2o', time: "10m", text: "Isotonic Rehydration", 
      desc: "Consume 500ml water with electrolytes to restore mineral balance", icon: Droplets, color: "text-blue-500"
    });

    const activeIds = Array.from(new Set(logs.map(l => l.id)));
    if (activeIds.some(id => ['mdma', 'ecstasy', '3mmc', '4mmc'].includes(id))) {
      plan.push({ 
        id: 'serotonin', time: "Next 24h", text: "Serotonin Support", 
        desc: "5-HTP + Green Tea Extract Wait at least 24h after your last dose", icon: Zap, color: "text-purple-500"
      });
    }

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

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-black text-white font-headline pb-64">
      <div className="bg-black/95 backdrop-blur-xl border-b border-white/5 px-6 py-8 sticky top-0 z-50">
        <div className="max-w-xl mx-auto space-y-6">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-white/40 uppercase font-black text-[10px] tracking-widest hover:text-primary transition-colors"><ArrowLeft className="w-4 h-4" /> Back to sanctuary</button>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">{isFinished ? t.integrated : t.recovery}</h1>
              <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mt-2">"{isFinished ? affirmation : t.personalProtocol}"</p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-full flex items-center gap-2"><Heart className="w-3 h-3 text-primary fill-primary animate-pulse-heart" /><span className="text-[8px] font-black text-primary uppercase tracking-widest">{t.activeProtection}</span></div>
              {!isFinished && <span className="font-mono text-primary text-xs font-black">{timeLeft}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-10 max-w-xl mx-auto space-y-12">
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
                    p.isAction ? "border-primary/40 bg-primary/5 cursor-pointer hover:bg-primary/10" : "hover:border-primary/40"
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

      <footer className="fixed bottom-0 left-0 right-0 h-auto min-h-[120px] py-8 bg-black/95 backdrop-blur-xl border-t border-white/5 flex flex-col items-center justify-center px-6 z-50 gap-4 pb-safe">
        {!isFinished ? (
          <button onClick={handleFinish} className="w-full max-w-sm py-6 bg-primary text-white rounded-full font-black uppercase text-lg tracking-[0.1em] neon-glow active:scale-95 transition-all shadow-lg shadow-primary/20">{t.finishBtn}</button>
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
