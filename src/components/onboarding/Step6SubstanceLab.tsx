'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Loader2, 
  Search, 
  Trash2,
  Calendar,
  Microscope,
  Wine, 
  Leaf, 
  FlaskConical, 
  Heart, 
  Droplets, 
  Zap, 
  Eye, 
  Orbit, 
  CheckCircle2,
  X,
  Diamond,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Wind,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { AiSafetyChat } from '@/components/chat/AiSafetyChat';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import CareShield from '@/components/dashboard/CareShield';
import GuardianStatusBar from '@/components/dashboard/GuardianStatusBar';

const MushroomIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 21v-6" /><path d="M5 15c0-4 3-7 7-7s7 3 7 7" /><path d="M12 8c-2.5 0-4.5 2-4.5 4.5" />
  </svg>
);

const CONTENT = {
  en: {
    title: "Pulse Lab", advisor: "Open Safety Advisor", search: "Find...",
    diary: "Session Diary", records: "Records", sync: "Sync Session", intake: "Log Intake Entry",
    confirm: "Confirm & Log Intake", cancel: "Cancel Entry", amount: "Amount", doseLogged: "Dose logged",
    addedToDiary: "added to your session diary", causionTitle: "Pulse Guardian: Caution 🧪",
    poppersHR: (hr: number) => `Your heart rate is ${hr} BPM Poppers will drop your blood pressure sharply Please sit down and breathe before use`,
    responsibility: "I love and respect myself I take full responsibility for my actions",
    syncProceed: "Proceed with Love", noResults: "No substances found",
    vibeAlert: {
      hazy: "I am drifting I choose with extra care for my clarity",
      overwhelmed: "I am vulnerable I love and respect my need for gentleness"
    }
  },
  de: {
    title: "Sitzungs-Labor", advisor: "Sicherheits-Begleiter", search: "Suchen...",
    diary: "Sitzungs-Tagebuch", records: "Einträge", sync: "Session synchronisieren", intake: "Eintrag notieren",
    confirm: "Bestätigen & Notieren", cancel: "Abbrechen", amount: "Menge", doseLogged: "Dosis notiert",
    addedToDiary: "wurde deinem Tagebuch hinzugefügt", causionTitle: "Pulse Guardian: Vorsicht 🧪",
    poppersHR: (hr: number) => `Dein Puls liegt bei ${hr} BPM Poppers senkt den Blutdruck stark ab Bitte nimm dir einen Moment Zeit, setz dich hin und atme tief durch`,
    responsibility: "Ich liebe und achte mich selbst Ich übernehme die volle Verantwortung für mein Handeln",
    syncProceed: "Mit Liebe fortfahren", noResults: "Keine Substanzen gefunden",
    vibeAlert: {
      hazy: "Ich lasse mich treiben Ich wähle mit besonderer Achtsamkeit für meine Klarheit",
      overwhelmed: "Ich fühle mich verletzlich Ich liebe und achte mein Bedürfnis nach Sanftheit"
    }
  },
  pt: {
    title: "Pulse Lab", advisor: "Abrir Assessor de Segurança", search: "Buscar...",
    diary: "Diário da Sessão", records: "Registros", sync: "Sincronizar Sessão", intake: "Registrar Entrada",
    confirm: "Confirmar e Registrar", cancel: "Cancelar Entrada", amount: "Quantidade", doseLogged: "Dose registrada",
    addedToDiary: "adicionada ao seu diário de sessão", causionTitle: "Pulse Guardian: Cuidado 🧪",
    poppersHR: (hr: number) => `Sua frequência cardíaca é ${hr} BPM Poppers reduzem a pressão arterial bruscamente Por favor sente-se e respire antes de usar`,
    responsibility: "Eu me amo e me respeito Assumo total responsabilidade pelas minhas ações",
    syncProceed: "Prosseguir com Amor", noResults: "Nenhuma substância encontrada",
    vibeAlert: {
      hazy: "Estou à deriva Escolho com cuidado redobrado pela minha clareza",
      overwhelmed: "Estou vulnerável Eu me amo e respeito minha necessidade de suavidade"
    }
  },
  ru: {
    title: "Лаборатория", advisor: "Забота", search: "Поиск...",
    diary: "Дневник Сессии", records: "Записи", sync: "Синхронизация", intake: "Добавить запись",
    confirm: "Подтвердить и Добавить", cancel: "Отмена", amount: "Количество", doseLogged: "Запись добавлена",
    addedToDiary: "добавлено в твой дневник сессии", causionTitle: "Pulse Guardian: Внимание 🧪",
    poppersHR: (hr: number) => `Твой пульс составляет ${hr} уд/мин Попперс резко снижает давление Пожалуйста присядь и подыши перед использованием`,
    responsibility: "Я люблю и уважаю себя Я принимаю полную ответственность за свои действия",
    syncProceed: "Продолжить с Любовью", noResults: "Веществ не найдено",
    vibeAlert: {
      hazy: "Я нахожусь в тумане Я выбираю с особой заботой о своей ясности",
      overwhelmed: "Я чувствую уязвимость Я люблю и уважаю свою потребность в бережности"
    }
  }
};

const SUBSTANCES = [
  { id: 'alcohol', icon: Wine, name: 'Alcohol', deName: 'Alkohol', ptName: 'Álcool', ruName: 'Алкоголь', aliases: ['beer', 'wine', 'shot', 'vodka', 'whiskey', 'gin', 'rum', 'tequila'], color: 'text-amber-500', isHeavy: false, unit: 'Items', inputType: 'cart' },
  { id: 'cannabis', icon: Leaf, name: 'Cannabis', deName: 'Cannabis', ptName: 'Cannabis', ruName: 'Каннабис', aliases: ['weed', 'pot', 'joint', 'grass', 'hash'], color: 'text-emerald-500', isHeavy: false, unit: 'g', inputType: 'manual' },
  { id: 'mdma', icon: Sparkles, name: 'MDMA', deName: 'MDMA', ptName: 'MDMA', ruName: 'МДМА', aliases: ['molly', 'mandy'], color: 'text-purple-400', isHeavy: true, unit: 'g', inputType: 'manual' },
  { id: 'cocaine', icon: Diamond, name: 'Cocaine', deName: 'Kokain', ptName: 'Cocaína', ruName: 'Кокаин', aliases: ['coke', 'snow', 'blow', 'white'], color: 'text-slate-200', isHeavy: true, unit: 'g', inputType: 'manual' },
  { id: 'ketamine', icon: FlaskConical, name: 'Ketamine', deName: 'Ketamin', ptName: 'Cetamina', ruName: 'Кетамин', aliases: ['k', 'special k', 'kitty'], color: 'text-indigo-400', isHeavy: true, unit: 'g', inputType: 'manual' },
  { id: 'ecstasy', icon: Heart, name: 'Ecstasy', deName: 'Ecstasy', ptName: 'Ecstasy', ruName: 'Экстази', aliases: ['e', 'beans', 'xtc', 'pills'], color: 'text-pink-500', isHeavy: true, unit: 'pills', inputType: 'manual' },
  { id: 'ghb', icon: Droplets, name: 'GHB/GBL', deName: 'GHB/GBL', ptName: 'GHB/GBL', ruName: 'ГОМК/ГБЛ', aliases: ['g', 'liquid x', 'gina'], color: 'text-blue-400', isHeavy: true, unit: 'ml', inputType: 'manual' },
  { id: 'speed', icon: Zap, name: 'Speed', deName: 'Speed', ptName: 'Speed', ruName: 'Спид', aliases: ['amphetamines', 'pep'], color: 'text-yellow-400', isHeavy: true, unit: 'g', inputType: 'manual' },
  { id: 'lsd', icon: Eye, name: 'LSD', deName: 'LSD', ptName: 'LSD', ruName: 'ЛСД', aliases: ['acid', 'tabs', 'lcd'], color: 'text-cyan-400', isHeavy: false, unit: 'ug', inputType: 'manual' },
  { id: '2cb', icon: Orbit, name: '2C-B', deName: '2C-B', ptName: '2C-B', ruName: '2C-B', aliases: ['nexus'], color: 'text-orange-400', isHeavy: true, unit: 'mg', inputType: 'manual' },
  { id: 'psilocybin', icon: MushroomIcon, name: 'Psilocybin', deName: 'Psilocybin', ptName: 'Psilocibina', ruName: 'Псилоцибин', aliases: ['mushrooms', 'shrooms'], color: 'text-emerald-400', isHeavy: false, unit: 'g', inputType: 'manual' },
  { id: 'poppers', icon: Wind, name: 'Poppers', deName: 'Poppers', ptName: 'Poppers', ruName: 'Попперс', aliases: ['amyl', 'nitrite'], color: 'text-amber-400', isHeavy: true, unit: 'hits', inputType: 'manual' },
];

export function Step6SubstanceLab({ 
  userData, 
  onComplete,
  showDiary = false,
  isLocked = false 
}: { 
  userData: any, 
  onComplete: (subs: any[]) => void,
  showDiary?: boolean,
  isLocked?: boolean
}) {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [sessionLogs, setSessionLogs] = useState<any[]>([]);
  const [activeSubstance, setActiveSubstance] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [manualValue, setManualValue] = useState('');
  const [alcoholCart, setAlcoholCart] = useState<{type: string, count: number}[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [responsibilityOpen, setResponsibilityOpen] = useState(false);
  const [lang, setLang] = useState<'en' | 'de' | 'pt' | 'ru'>('en');

  useEffect(() => {
    setMounted(true);
    const savedLogs = JSON.parse(localStorage.getItem('stayonbeat_logs') || '[]');
    setSessionLogs(savedLogs);
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de', 'pt', 'ru'].includes(savedLang)) setLang(savedLang);
  }, []);

  const t = CONTENT[lang] || CONTENT.en;
  const currentVibe = userData?.vibe?.current;

  const filteredSubstances = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return SUBSTANCES;
    return SUBSTANCES.filter(s => {
      const searchSpace = [s.name, s.deName, s.ptName, s.ruName, ...(s.aliases || [])].map(v => v.toLowerCase());
      return searchSpace.some(v => v.includes(term));
    });
  }, [searchTerm]);

  const handleSelectSubstance = (substance: any) => {
    const currentHR = userData?.sessionStatus?.lastHeartRate || 75;
    if (substance.id === "poppers" && currentHR > 100) {
      toast({ variant: "destructive", title: t.causionTitle, description: t.poppersHR(currentHR) });
    }
    setActiveSubstance(substance);
    if (substance.id === 'alcohol') {
      const subtypes = lang === 'en' ? substance.subTypes : lang === 'de' ? substance.deSubTypes : lang === 'pt' ? substance.ptSubTypes : substance.ruSubTypes;
      setAlcoholCart((subtypes || ['Beer', 'Wine', 'Shot', 'Mixer']).map((type: string) => ({ type, count: 0 })));
    }
  };

  const saveLog = () => {
    if (isLocked) return;
    let entry: any;
    const localizedSub = SUBSTANCES.find(s => s.id === activeSubstance.id);
    const substanceName = lang === 'en' ? localizedSub?.name : lang === 'de' ? localizedSub?.deName : lang === 'pt' ? localizedSub?.ptName : localizedSub?.ruName;
    
    if (activeSubstance.id === 'alcohol') {
      const activeItems = alcoholCart.filter(c => c.count > 0);
      if (activeItems.length === 0) return;
      entry = { id: 'alcohol', name: substanceName, items: activeItems, timestamp: new Date().toISOString() };
    } else {
      if (!manualValue || parseFloat(manualValue) === 0) return;
      entry = { id: activeSubstance.id, name: substanceName, value: manualValue, unit: activeSubstance.unit, timestamp: new Date().toISOString() };
    }

    const updated = [...sessionLogs, entry];
    setSessionLogs(updated);
    localStorage.setItem('stayonbeat_logs', JSON.stringify(updated));
    setActiveSubstance(null);
    setManualValue('');
    setAlcoholCart([]);
    toast({ title: t.doseLogged, description: `${substanceName} ${t.addedToDiary}` });
  };

  const removeLog = (index: number) => {
    const updated = sessionLogs.filter((_, i) => i !== index);
    setSessionLogs(updated);
    localStorage.setItem('stayonbeat_logs', JSON.stringify(updated));
  };

  const lastHR = userData?.sessionStatus?.lastHeartRate || 0;
  const guardianStatus: 'safe' | 'caution' | 'locked' = isLocked ? 'locked' : (lastHR > 110 ? 'caution' : 'safe');

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-full bg-black font-headline relative overflow-hidden">
      <header className="px-6 pt-10 pb-4 space-y-4 flex flex-col shrink-0 bg-black/95 backdrop-blur-md z-[60] border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center border border-[#10B981]/20"><Microscope size={24} className="text-white" /></div>
            <h1 className={cn("text-xl font-black tracking-tighter uppercase leading-none text-white", lang === 'ru' && "italic font-serif")}>{t.title}</h1>
          </div>
          <button onClick={() => setChatOpen(true)} className="p-3 bg-blue-600/10 border border-blue-500/30 rounded-xl active:scale-95 transition-all"><Sparkles size={18} className="text-blue-400 animate-pulse" /></button>
        </div>
        
        <GuardianStatusBar status={guardianStatus} heartRate={lastHR > 0 ? lastHR : 75} lang={lang} />

        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
          <input 
            type="search" placeholder={t.search} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
            className={cn("w-full bg-white/5 border border-white/10 h-12 pl-10 pr-4 rounded-2xl focus:border-[#3EB489] text-sm outline-none text-white transition-all", lang === 'ru' && "italic font-serif")}
          />
        </div>
      </header>

      <div className="flex-1 min-h-0 overflow-hidden relative">
        <ScrollArea className="h-full px-6 pt-6 touch-pan-y">
          <div className="pb-40 space-y-8">
            {showDiary && sessionLogs.length > 0 && (
              <div className="space-y-3 animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-center justify-between px-1">
                  <h3 className={cn("text-[9px] font-black text-[#10B981] uppercase tracking-[0.3em] flex items-center gap-2", lang === 'ru' && "italic font-serif")}><Calendar className="w-3 h-3" /> {t.diary}</h3>
                  <span className={cn("text-[8px] font-bold text-white/20 uppercase tracking-widest", lang === 'ru' && "italic font-serif")}>{sessionLogs.length} {t.records}</span>
                </div>
                <div className="grid gap-2">
                  {sessionLogs.slice().reverse().map((log, i) => (
                    <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center border border-white/5"><FlaskConical size={16} className="text-[#3EB489]" /></div>
                        <div className="flex flex-col">
                          <span className={cn("text-xs font-black uppercase text-white", lang === 'ru' && "italic font-serif")}>{log.name}</span>
                          <span className={cn("text-[9px] font-bold text-[#3EB489]", lang === 'ru' && "italic font-serif")}>{log.id === 'alcohol' ? log.items.map((it: any) => `${it.count}x ${it.type}`).join(', ') : `${log.value}${log.unit}`}</span>
                        </div>
                      </div>
                      <button onClick={() => removeLog(sessionLogs.length - 1 - i)} className="p-2 text-white/10 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 w-full">
              {filteredSubstances.map(s => {
                const active = sessionLogs.some(log => log.id === s.id);
                const localizedName = lang === 'en' ? s.name : lang === 'de' ? s.deName : lang === 'pt' ? s.ptName : s.ruName;
                return (
                  <button 
                    key={s.id} onClick={() => handleSelectSubstance(s)}
                    className={cn("aspect-square border rounded-3xl flex flex-col items-center justify-center gap-2 transition-all active:scale-95 group relative shadow-lg", active ? "bg-[#3EB489]/10 border-[#3EB489]" : "bg-white/[0.02] border-white/5")}
                  >
                    <div className={cn("p-3 rounded-xl bg-black/40 border border-white/5 group-hover:scale-110 transition-transform", s.color)}><s.icon size={22} /></div>
                    <span className={cn("text-[8px] font-black uppercase tracking-widest text-center px-1 leading-tight", active ? "text-[#3EB489]" : "text-white/40", lang === 'ru' && "italic font-serif")}>{localizedName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </div>

      <footer className="shrink-0 h-[100px] bg-black/95 backdrop-blur-2xl border-t border-white/5 flex items-center justify-center px-6 z-[70] pb-safe">
        <button 
          onClick={() => setResponsibilityOpen(true)} 
          className={cn("w-full py-5 bg-[#3EB489] text-black rounded-full font-black uppercase text-base tracking-[0.1em] neon-glow active:scale-95 transition-all shadow-lg flex items-center justify-center gap-3", lang === 'ru' && "italic font-serif")}
        >
          <CheckCircle2 size={20} /> {lang === 'ru' ? 'Синхронизация' : t.sync}
        </button>
      </footer>

      <Dialog open={responsibilityOpen} onOpenChange={setResponsibilityOpen}>
        <DialogContent className="bg-black border-white/10 max-w-md p-0 rounded-[3.5rem] overflow-hidden flex flex-col font-headline">
          <DialogTitle className="sr-only">Responsibility Affirmation</DialogTitle>
          <div className="p-10 flex flex-col items-center text-center space-y-10">
            <div className="relative">
              <div className="absolute inset-0 bg-[#3EB489]/20 blur-3xl rounded-full animate-pulse" />
              <div className="w-20 h-20 bg-[#3EB489]/10 border-2 border-[#3EB489]/30 rounded-full flex items-center justify-center relative z-10 shadow-2xl"><ShieldCheck size={40} className="text-[#3EB489]" /></div>
            </div>
            
            <div className="space-y-6">
              <p className={cn("text-xl md:text-2xl font-black uppercase tracking-tighter text-white leading-tight", lang === 'ru' && "italic font-serif")}>{t.responsibility}</p>
              {(currentVibe === 'hazy' || currentVibe === 'overwhelmed') && (
                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                  <AlertTriangle className="text-amber-500 shrink-0" size={20} />
                  <p className={cn("text-[10px] font-bold text-amber-500 uppercase tracking-widest text-left leading-tight", lang === 'ru' && "italic font-serif")}>
                    {t.vibeAlert[currentVibe as 'hazy' | 'overwhelmed']}
                  </p>
                </div>
              )}
              <div className="w-10 h-1 bg-[#3EB489]/20 rounded-full mx-auto" />
            </div>

            <button onClick={() => { setResponsibilityOpen(false); onComplete(sessionLogs); }} className={cn("w-full h-16 bg-[#3EB489] text-black rounded-2xl font-black uppercase text-base tracking-widest active:scale-95 transition-all shadow-lg", lang === 'ru' && "italic font-serif")}>{t.syncProceed}</button>
          </div>
        </DialogContent>
      </Dialog>

      {activeSubstance && (
        <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl z-[100] animate-in fade-in duration-300 flex flex-col font-headline">
          <header className="shrink-0 p-8 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-xl", activeSubstance.color)}><activeSubstance.icon size={24} /></div>
              <h2 className={cn("text-xl font-black uppercase tracking-tighter text-white", lang === 'ru' && "italic font-serif")}>{lang === 'en' ? activeSubstance.name : lang === 'de' ? activeSubstance.deName : lang === 'pt' ? activeSubstance.ptName : activeSubstance.ruName}</h2>
            </div>
            <button onClick={() => setActiveSubstance(null)} className="p-3 bg-white/5 rounded-full border border-white/10 text-white/40 active:scale-90 transition-all"><X size={20} /></button>
          </header>

          <div className="flex-1 min-h-0 overflow-hidden">
            <ScrollArea className="h-full px-8 touch-pan-y">
              <div className="flex flex-col items-center space-y-10 py-10 max-w-md mx-auto w-full pb-40">
                {(activeSubstance.isHeavy && (currentVibe === 'hazy' || currentVibe === 'overwhelmed')) && (
                  <div className="w-full p-6 bg-amber-500/5 border-2 border-amber-500/20 rounded-[2rem] space-y-4 animate-in fade-in zoom-in-95">
                    <div className="flex items-center gap-3">
                      <Wind className="text-amber-500" size={24} />
                      <p className={cn("text-[10px] font-black uppercase tracking-[0.3em] text-amber-500", lang === 'ru' && "italic font-serif")}>Conscious Resonance</p>
                    </div>
                    <p className={cn("text-xs font-bold text-white/60 leading-relaxed uppercase tracking-widest", lang === 'ru' && "italic font-serif")}>
                      {t.vibeAlert[currentVibe as 'hazy' | 'overwhelmed']}
                    </p>
                  </div>
                )}

                {activeSubstance.id === 'alcohol' ? (
                  <div className="space-y-3 w-full">
                    {alcoholCart.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white/[0.03] p-5 rounded-2xl border border-white/5 shadow-lg">
                        <span className={cn("text-sm font-black uppercase tracking-widest text-white/80", lang === 'ru' && "italic font-serif")}>{item.type}</span>
                        <div className="flex items-center gap-6">
                          <button onClick={() => { const next = [...alcoholCart]; next[idx].count = Math.max(0, next[idx].count - 1); setAlcoholCart(next); }} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 transition-all active:scale-90">-</button>
                          <span className="w-6 text-center font-black text-2xl text-white tabular-nums">{item.count}</span>
                          <button onClick={() => { const next = [...alcoholCart]; next[idx].count += 1; setAlcoholCart(next); }} className="w-10 h-10 rounded-full bg-[#3EB489] text-black flex items-center justify-center transition-all active:scale-90 shadow-lg">+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4 w-full text-center">
                    <label className={cn("text-[9px] font-black uppercase tracking-[0.4em] text-white/30 block", lang === 'ru' && "italic font-serif")}>{t.amount} ({activeSubstance.unit})</label>
                    <input 
                      type="number" value={manualValue} onChange={(e) => setManualValue(e.target.value)} autoFocus inputMode="decimal" 
                      className={cn("w-full bg-transparent border-b-2 border-[#3EB489] py-2 text-6xl font-black outline-none text-white text-center shadow-none transition-all placeholder:text-white/5", lang === 'ru' && "italic font-serif")} placeholder="0.00" 
                    />
                  </div>
                )}
                <div className="w-full space-y-3 pt-6">
                  <button onClick={saveLog} className={cn("w-full h-20 bg-[#3EB489] text-black rounded-3xl font-black uppercase tracking-widest neon-glow active:scale-[0.98] shadow-xl flex items-center justify-center gap-3 text-lg", lang === 'ru' && "italic font-serif")}>{t.confirm}</button>
                  <button onClick={() => setActiveSubstance(null)} className={cn("w-full h-12 text-white/20 font-black uppercase text-[9px] tracking-[0.5em] transition-colors hover:text-white", lang === 'ru' && "italic font-serif")}>{t.cancel}</button>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="bg-black border-white/10 max-w-2xl p-0 rounded-[3rem] overflow-hidden flex flex-col h-[85dvh] top-[50%] -translate-y-[50%] shadow-[0_0_100px_rgba(0,0,0,0.9)]">
          <DialogTitle className="sr-only">AI Safety Advisor</DialogTitle>
          <AiSafetyChat userProfile={userData} currentIntake={sessionLogs.map(l => l.name).join(', ')} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
