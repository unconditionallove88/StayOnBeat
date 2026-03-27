"use client"

import { useState, useEffect } from 'react';
import { ArrowLeft, Target, Music, Users, Shield, Ban, ZapOff, Moon, GlassWater, Clock, Heart, Radio, Ear, CircleDot } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Party Goals selection with full multilingual support.
 * Updated: Action button color to wise dark green (#1b4d3e).
 * TR Language added.
 */

const POSITIVE_GOALS = [
  { id: 'dance', icon: Music, label: 'Dance all night', de: 'Die ganze Nacht tanzen', pt: 'Dançar a noite toda', tr: 'Tüm gece dans etmek' },
  { id: 'social', icon: Users, label: 'Meet new people', de: 'Neue Leute treffen', pt: 'Conhecer novas pessoas', tr: 'Yeni insanlar tanışmak' },
  { id: 'forget-self', icon: CircleDot, label: 'Forget myself', de: 'Sich vergessen', pt: 'Me esquecer', tr: 'Kendimi tamamen unutmak' },
  { id: 'intimacy', icon: Heart, label: 'Find intimacy', de: 'Intimität finden', pt: 'Encontrar intimidade', tr: 'İçsel bir yakınlık' },
  { id: 'hydrate', icon: GlassWater, label: 'Stay hydrated', de: 'Hydriert bleiben', pt: 'Manter a hidratação', tr: 'Yeterli su içmek' },
  { id: 'safe', icon: Shield, label: 'Priority: Safety', de: 'Priorität: Sicherheit', pt: 'Prioridade: Segurança', tr: 'Güvenliği önceliklendirmek' },
  { id: 'discover', icon: Target, label: 'Discover music', de: 'Musik entdecken', pt: 'Descobrir música', tr: 'Yeni müzikler keşfetmek' },
];

const NEGATIVE_GOALS = [
  { id: 'no-mixing', icon: Ban, label: 'Avoid mixing', de: 'Kein Mischen', pt: 'Evitar misturas', tr: 'Karıştırmaktan kaçınmak' },
  { id: 'limit-dose', icon: ZapOff, label: 'Limit intake', de: 'Dosis begrenzen', pt: 'Limitar consumo', tr: 'Tüketimi sınırlı tutmak' },
  { id: 'early-end', icon: Clock, label: 'Leave early', de: 'Früh gehen', pt: 'Sair cedo', tr: 'Erken ayrılmak' },
  { id: 'no-alcohol', icon: GlassWater, label: 'No alcohol', de: 'Kein Alkohol', pt: 'Sem álcool', tr: 'Alkol kullanmamak' },
  { id: 'rest-breaks', icon: Moon, label: 'Take breaks', de: 'Pausen machen', pt: 'Fazer pausas', tr: 'Düzenli molalar vermek' },
];

const RESONANCE_GOALS = [
  { id: 'radiate-presence', icon: Radio, label: 'Radiate Presence', de: 'Präsenz ausstrahlen', pt: 'Irradiar Presença', tr: 'Varlığını dışarı yansıt' },
  { id: 'deep-listening', icon: Ear, label: 'Deep Listening', de: 'Tiefes Zuhören', pt: 'Escuta profunda', tr: 'Derin dinleme hali' },
  { id: 'shining-love', icon: Heart, label: 'Shining with Love', de: 'Mit Liebe strahlen', pt: 'Brilhando com Amor', tr: 'Sevgiyle parlamaya devam' },
];

const UI = {
  EN: { header: 'Your focus', sub: 'What is your main focus for the party?', res: 'The Resonance', pos: 'Positive Intentions', neg: 'Safety Boundaries', confirm: 'Confirm goals' },
  DE: { header: 'Dein Fokus', sub: 'Was ist dein Hauptfokus für die Party?', res: 'Die Resonanz', pos: 'Positive Intentionen', neg: 'Sicherheitsgrenzen', confirm: 'Ziele bestätigen' },
  PT: { header: 'Seu foco', sub: 'Qual o seu foco principal na festa?', res: 'A Ressonância', pos: 'Intenções Positivas', neg: 'Limites de Segurança', confirm: 'Confirmar focos' },
  TR: { header: 'Odak noktan', sub: 'Bu geceki ana odağın nedir?', res: 'Rezonans', pos: 'Pozitif Niyetler', neg: 'Güvenlik Sınırları', confirm: 'Odakları onayla' }
};

export function StepPartyGoal({ onComplete, onBack }: { onComplete: (goals: string[]) => void, onBack?: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [lang, setLang] = useState<'EN' | 'DE' | 'PT' | 'TR'>('EN');

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toUpperCase() as any;
    if (['EN', 'DE', 'PT', 'TR'].includes(savedLang)) setLang(savedLang);
  }, []);

  const toggleGoal = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const t = UI[lang] || UI.EN;

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-center font-headline max-xl mx-auto px-4 text-center relative">
      {onBack && <button onClick={onBack} className="absolute top-0 left-4 text-white/40 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-50"><ArrowLeft className="w-4 h-4" /> BACK</button>}
      <div className="mt-12 mb-8"><h2 className="text-[22px] font-black uppercase mb-2 text-white leading-tight tracking-tighter">{t.header}</h2><p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px] max-w-[280px] mx-auto">{t.sub}</p></div>
      <div className="flex-1 w-full overflow-y-auto max-h-[55vh] custom-scrollbar pr-2 mb-8 space-y-8">
        <div className="space-y-3"><h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary text-left px-2">{t.res}</h3><div className="grid grid-cols-1 gap-3">{RESONANCE_GOALS.map((goal) => (<button key={goal.id} onClick={() => toggleGoal(goal.id)} className={cn("p-5 rounded-[1.5rem] border-2 flex items-center gap-6 transition-all active:scale-[0.98] text-left", selected.includes(goal.id) ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(27,77,62,0.2)]' : 'bg-[#0a0a0a] border-white/10 hover:border-white/30')}><div className={cn("p-3 rounded-xl", selected.includes(goal.id) ? 'bg-primary text-white' : 'bg-white/5 text-white/40')}><goal.icon className="w-5 h-5" /></div><span className={cn("font-black text-base uppercase tracking-tight", selected.includes(goal.id) ? 'text-white' : 'text-white/60')}>{lang === 'EN' ? goal.label : lang === 'DE' ? goal.de : lang === 'PT' ? goal.pt : goal.tr}</span></button>))}</div></div>
        <div className="space-y-3"><h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-left px-2">{t.pos}</h3><div className="grid grid-cols-1 gap-3">{POSITIVE_GOALS.map((goal) => (<button key={goal.id} onClick={() => toggleGoal(goal.id)} className={cn("p-5 rounded-[1.5rem] border-2 flex items-center gap-6 transition-all active:scale-[0.98] text-left", selected.includes(goal.id) ? 'bg-primary/10 border-primary neon-glow' : 'bg-[#0a0a0a] border-white/10 hover:border-white/30')}><div className={cn("p-3 rounded-xl", selected.includes(goal.id) ? 'bg-primary text-white' : 'bg-white/5 text-white/40')}><goal.icon className="w-5 h-5" /></div><span className={cn("font-black text-base uppercase tracking-tight", selected.includes(goal.id) ? 'text-white' : 'text-white/60')}>{lang === 'EN' ? goal.label : lang === 'DE' ? goal.de : lang === 'PT' ? goal.pt : goal.tr}</span></button>))}</div></div>
        <div className="space-y-3"><h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500/40 text-left px-2">{t.neg}</h3><div className="grid grid-cols-1 gap-3">{NEGATIVE_GOALS.map((goal) => (<button key={goal.id} onClick={() => toggleGoal(goal.id)} className={cn("p-5 rounded-[1.5rem] border-2 flex items-center gap-6 transition-all active:scale-[0.98] text-left", selected.includes(goal.id) ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'bg-[#0a0a0a] border-white/10 hover:border-white/30')}><div className={cn("p-3 rounded-xl", selected.includes(goal.id) ? 'bg-red-500 text-white' : 'bg-white/5 text-white/40')}><goal.icon className="w-5 h-5" /></div><span className={cn("font-black text-base uppercase tracking-tight", selected.includes(goal.id) ? 'text-white' : 'text-white/60')}>{lang === 'EN' ? goal.label : lang === 'DE' ? goal.de : lang === 'PT' ? goal.pt : goal.tr}</span></button>))}</div></div>
      </div>
      <button onClick={() => onComplete(selected)} disabled={selected.length === 0} className={cn("pill-button w-full max-w-sm uppercase tracking-[0.2em] font-black text-xl h-[64px] transition-all", selected.length > 0 ? 'bg-[#1b4d3e] text-white neon-glow active:scale-95' : 'bg-white/10 text-white/10 cursor-not-allowed border-2 border-white/5 opacity-50')}>{t.confirm}</button>
    </div>
  );
}
