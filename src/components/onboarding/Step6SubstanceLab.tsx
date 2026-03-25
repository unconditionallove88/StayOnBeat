
'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Loader2, 
  Search, 
  ArrowRight, 
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
  Pill, 
  Wind,
  CheckCircle2,
  X,
  Diamond,
  CircleDot,
  ShieldCheck
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { AiSafetyChat } from '@/components/chat/AiSafetyChat';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import CareShield from '@/components/dashboard/CareShield';
import GuardianStatusBar from '@/components/dashboard/GuardianStatusBar';

/**
 * @fileOverview Pulse Lab component.
 * Fixed: Search functionality is now robust and cross-language.
 * Fixed: Scrolling architecture optimized for absolute iPhone stability.
 * Responsibility Portal: Mandatory affirmation before sync.
 */

const MushroomIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 21v-6" />
    <path d="M5 15c0-4 3-7 7-7s7 3 7 7" />
    <path d="M12 8c-2.5 0-4.5 2-4.5 4.5" />
  </svg>
);

const CONTENT = {
  en: {
    title: "Pulse Lab", advisor: "Open Safety Advisor", search: "Search substances...",
    diary: "Session Diary", records: "Records", sync: "Sync Session", intake: "Log Intake Entry",
    confirm: "Confirm & Log Intake", cancel: "Cancel Entry", amount: "Amount", doseLogged: "Dose logged",
    addedToDiary: "added to your session diary", causionTitle: "Pulse Guardian: Caution 🧪",
    poppersHR: (hr: number) => `Your heart rate is ${hr} BPM Poppers will drop your blood pressure sharply Please sit down and breathe before use`,
    responsibility: "I love and respect myself I take full responsibility for my actions",
    syncProceed: "Proceed with Love"
  },
  de: {
    title: "Sitzungs-Labor", advisor: "Sicherheits-Begleiter", search: "Substanzen suchen...",
    diary: "Sitzungs-Tagebuch", records: "Einträge", sync: "Синхронизация", intake: "Eintrag notieren",
    confirm: "Bestätigen & Notieren", cancel: "Abbrechen", amount: "Menge", doseLogged: "Dosis notiert",
    addedToDiary: "wurde deinem Tagebuch hinzugefügt", causionTitle: "Pulse Guardian: Vorsicht 🧪",
    poppersHR: (hr: number) => `Dein Puls liegt bei ${hr} BPM Poppers senkt den Blutdruck stark ab Bitte nimm dir einen Moment Zeit, setz dich hin und atme tief durch`,
    responsibility: "Ich liebe und achte mich selbst Ich übernehme die volle Verantwortung für mein Handeln",
    syncProceed: "Mit Liebe fortfahren"
  },
  pt: {
    title: "Pulse Lab", advisor: "Abrir Assessor de Segurança", search: "Buscar substâncias...",
    diary: "Diário da Sessão", records: "Registros", sync: "Sincronização", intake: "Registrar Entrada",
    confirm: "Confirmar e Registrar", cancel: "Cancelar Entrada", amount: "Quantidade", doseLogged: "Dose registrada",
    addedToDiary: "adicionada ao seu diário de sessão", causionTitle: "Pulse Guardian: Cuidado 🧪",
    poppersHR: (hr: number) => `Sua frequência cardíaca é ${hr} BPM Poppers reduzem a pressão arterial bruscamente Por favor sente-се e respire antes de usar`,
    responsibility: "Eu me amo e me respeito Assumo total responsabilidade pelas minhas ações",
    syncProceed: "Prosseguir com Amor"
  },
  ru: {
    title: "Лаборатория", advisor: "Забота", search: "Поиск веществ...",
    diary: "Дневник Сессии", records: "Записи", sync: "Синхронизация", intake: "Добавить запись",
    confirm: "Подтвердить и Добавить", cancel: "Отмена", amount: "Количество", doseLogged: "Запись добавлена",
    addedToDiary: "добавлено в твой дневник сессии", causionTitle: "Pulse Guardian: Внимание 🧪",
    poppersHR: (hr: number) => `Твой пульс составляет ${hr} уд/мин Попперс резко снижает давление Пожалуйста присядь и подыши перед использованием`,
    responsibility: "Я люблю и уважаю себя Я принимаю полную ответственность за свои действия",
    syncProceed: "Продолжить с Любовью"
  }
};

const SUBSTANCES = [
  { id: 'alcohol', icon: Wine, name: 'Alcohol', deName: 'Alkohol', ptName: 'Álcool', ruName: 'Алкоголь', color: 'text-amber-500', bg: 'bg-amber-500/10', unit: 'Items', deUnit: 'Einheiten', ptUnit: 'Unidades', ruUnit: 'Ед.', subTypes: ['Beer', 'Wine', 'Shot', 'Mixer'], deSubTypes: ['Bier', 'Wein', 'Shot', 'Mixer'], ptSubTypes: ['Cerveja', 'Vinho', 'Dose', 'Mixer'], ruSubTypes: ['Пиво', 'Вино', 'Шот', 'Коктейль'], inputType: 'cart' },
  { id: 'cannabis', icon: Leaf, name: 'Cannabis', deName: 'Cannabis', ptName: 'Cannabis', ruName: 'Каннабис', color: 'text-emerald-500', bg: 'bg-emerald-500/10', unit: 'g', deUnit: 'g', ptUnit: 'g', ruUnit: 'г', inputType: 'manual' },
  { id: 'mdma', icon: CircleDot, name: 'MDMA', deName: 'MDMA', ptName: 'MDMA', ruName: 'МДМА', color: 'text-purple-400', bg: 'bg-purple-500/10', unit: 'g', deUnit: 'g', ptUnit: 'g', ruUnit: 'г', inputType: 'manual' },
  { id: 'cocaine', icon: Diamond, name: 'Cocaine', deName: 'Kokain', ptName: 'Cocaína', ruName: 'Кокаин', color: 'text-slate-200', bg: 'bg-slate-200/10', unit: 'g', deUnit: 'g', ptUnit: 'g', ruUnit: 'г', inputType: 'manual' },
  { id: 'ketamine', icon: FlaskConical, name: 'Ketamine', deName: 'Ketamin', ptName: 'Cetamina', ruName: 'Кетамин', color: 'text-indigo-400', bg: 'bg-indigo-400/10', unit: 'g', deUnit: 'g', ptUnit: 'g', ruUnit: 'г', inputType: 'manual' },
  { id: 'ecstasy', icon: Heart, name: 'Ecstasy', deName: 'Ecstasy', ptName: 'Ecstasy', ruName: 'Экстази', color: 'text-pink-500', bg: 'bg-pink-500/10', unit: 'pills', deUnit: 'Pillen', ptUnit: 'Balas', ruUnit: 'Таб.', inputType: 'manual' },
  { id: 'ghb', icon: Droplets, name: 'GHB/GBL', deName: 'GHB/GBL', ptName: 'GHB/GBL', ruName: 'ГОМК/ГБЛ', color: 'text-blue-400', bg: 'bg-blue-400/10', unit: 'ml', deUnit: 'ml', ptUnit: 'ml', ruUnit: 'мл', inputType: 'manual' },
  { id: 'speed', icon: Zap, name: 'Speed', deName: 'Speed', ptName: 'Speed', ruName: 'Спид', color: 'text-yellow-400', bg: 'bg-yellow-400/10', unit: 'g', deUnit: 'g', ptUnit: 'g', ruUnit: 'г', inputType: 'manual' },
  { id: 'lsd', icon: Eye, name: 'LSD', deName: 'LSD', ptName: 'LSD', ruName: 'ЛСД', color: 'text-cyan-400', bg: 'bg-cyan-400/10', unit: 'ug', deUnit: 'ug', ptUnit: 'ug', ruUnit: 'мкг', inputType: 'manual' },
  { id: '2cb', icon: Orbit, name: '2C-B', deName: '2C-B', ptName: '2C-B', ruName: '2C-B', color: 'text-orange-400', bg: 'bg-orange-400/10', unit: 'mg', deUnit: 'mg', ptUnit: 'mg', ruUnit: 'мг', inputType: 'manual' },
  { id: 'psilocybin', icon: MushroomIcon, name: 'Psilocybin', deName: 'Psilocybin', ptName: 'Psilocibina', ruName: 'Псилоцибин', color: 'text-emerald-400', bg: 'bg-emerald-500/10', unit: 'g', deUnit: 'g', ptUnit: 'g', ruUnit: 'г', inputType: 'manual' },
  { id: 'poppers', icon: Wind, name: 'Poppers', deName: 'Poppers', ptName: 'Poppers', ruName: 'Попперс', color: 'text-amber-400', bg: 'bg-amber-400/10', unit: 'hits', deUnit: 'Züge', ptUnit: 'Inaladas', ruUnit: 'Вдохов', inputType: 'manual' },
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

  const filteredSubstances = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return SUBSTANCES;
    return SUBSTANCES.filter(s => {
      // Check every language translation for a match
      const searchableNames = [
        s.name.toLowerCase(),
        s.deName.toLowerCase(),
        s.ptName.toLowerCase(),
        s.ruName.toLowerCase()
      ];
      return searchableNames.some(name => name.includes(term));
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
      setAlcoholCart(subtypes.map((type: string) => ({ type, count: 0 })));
    }
  };

  const saveLog = () => {
    if (isLocked) return;
    let entry: any;
    const substanceName = lang === 'en' ? activeSubstance.name : lang === 'de' ? activeSubstance.deName : lang === 'pt' ? activeSubstance.ptName : activeSubstance.ruName;
    const unit = lang === 'en' ? activeSubstance.unit : lang === 'de' ? activeSubstance.deUnit : lang === 'pt' ? activeSubstance.ptUnit : activeSubstance.ruUnit;

    if (activeSubstance.id === 'alcohol') {
      const activeItems = alcoholCart.filter(c => c.count > 0);
      if (activeItems.length === 0) return;
      entry = { id: 'alcohol', name: substanceName, items: activeItems, timestamp: new Date().toISOString() };
    } else {
      if (!manualValue || parseFloat(manualValue) === 0) return;
      entry = { id: activeSubstance.id, name: substanceName, value: manualValue, unit: unit, timestamp: new Date().toISOString() };
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

  const handleFinalSync = () => {
    setResponsibilityOpen(false);
    onComplete(sessionLogs);
  };

  if (!mounted) return null;

  const lastHR = userData?.sessionStatus?.lastHeartRate || 0;
  const guardianStatus: 'safe' | 'caution' | 'locked' = isLocked ? 'locked' : (lastHR > 110 ? 'caution' : 'safe');

  if (isLocked) {
    return (
      <div className="flex flex-col h-full bg-black font-body p-6 overflow-hidden">
        <ScrollArea className="flex-1 min-h-0 touch-pan-y">
          <div className="pb-20 space-y-6">
            <GuardianStatusBar status="locked" heartRate={lastHR > 0 ? lastHR : 128} lang={lang} />
            <CareShield 
              reason={userData?.sessionStatus?.lockReason || 'manual'}
              unlockAt={userData?.sessionStatus?.unlockAt || Date.now()}
              lang={lang as 'en' | 'de'}
            />
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black font-headline relative overflow-hidden">
      {/* Fixed Header */}
      <header className="px-6 pt-12 pb-4 space-y-4 flex flex-col shrink-0 bg-black/95 backdrop-blur-md z-[60] border-b border-white/5 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 flex items-center justify-center border border-[#10B981]/20 shadow-lg">
            <Microscope size={32} className="text-white" />
          </div>
          <h1 className={cn("text-2xl font-black tracking-tighter uppercase leading-none text-white", lang === 'ru' && "italic font-serif")}>{t.title}</h1>
        </div>
        
        <div className="space-y-2">
          <GuardianStatusBar status={guardianStatus} heartRate={lastHR > 0 ? lastHR : 98} lang={lang} />
          <button onClick={() => setChatOpen(true)} className="w-full bg-blue-600/10 border border-blue-500/30 rounded-2xl py-3 px-4 flex items-center justify-between shadow-lg active:scale-[0.99] transition-all">
            <div className="flex items-center gap-3">
              <CircleDot size={16} className="text-blue-400 animate-pulse" />
              <span className={cn("text-[9px] font-black uppercase tracking-[0.2em] text-blue-400", lang === 'ru' && "italic font-serif")}>{t.advisor}</span>
            </div>
            <ArrowRight size={12} className="text-blue-500" />
          </button>
        </div>

        <div className="relative w-full pt-2 pb-2">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input 
            type="text"
            placeholder={t.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn("w-full bg-white/5 border border-white/10 h-16 pl-14 rounded-3xl focus:border-[#3EB489] text-base outline-none text-white shadow-inner transition-all", lang === 'ru' && "italic font-serif")}
          />
        </div>
      </header>

      {/* Scrollable Content Area - Crucial flex-1 min-h-0 for iPhone stability */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <ScrollArea className="h-full px-6 pt-6 touch-pan-y">
          <div className="pb-48 space-y-10">
            {showDiary && sessionLogs.length > 0 && (
              <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-center justify-between px-2">
                  <h3 className={cn("text-[10px] font-black text-[#10B981] uppercase tracking-[0.3em] flex items-center gap-3", lang === 'ru' && "italic font-serif")}><Calendar className="w-3 h-3" /> {t.diary}</h3>
                  <span className={cn("text-[8px] font-bold text-white/20 uppercase tracking-widest", lang === 'ru' && "italic font-serif")}>{sessionLogs.length} {t.records}</span>
                </div>
                <div className="grid gap-3">
                  {sessionLogs.slice().reverse().map((log, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between shadow-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10"><FlaskConical size={20} className="text-[#3EB489]" /></div>
                        <div className="flex flex-col gap-1">
                          <span className={cn("text-sm font-black uppercase text-white", lang === 'ru' && "italic font-serif")}>{log.name}</span>
                          <span className={cn("text-[10px] font-bold text-[#3EB489]", lang === 'ru' && "italic font-serif")}>{log.id === 'alcohol' ? log.items.map((it: any) => `${it.count}x ${it.type}`).join(', ') : `${log.value}${log.unit}`}</span>
                        </div>
                      </div>
                      <button onClick={() => removeLog(sessionLogs.length - 1 - i)} className="p-2 text-white/10 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 w-full">
              {filteredSubstances.map(s => {
                const active = sessionLogs.some(log => log.id === s.id);
                const localizedName = lang === 'en' ? s.name : lang === 'de' ? s.deName : lang === 'pt' ? s.ptName : s.ruName;
                return (
                  <button 
                    key={s.id}
                    onClick={() => handleSelectSubstance(s)}
                    className={cn("aspect-square border rounded-[2.5rem] flex flex-col items-center justify-center gap-3 transition-all hover:bg-white/10 active:scale-95 group relative shadow-2xl", active ? "bg-[#3EB489]/10 border-[#3EB489]" : "bg-white/[0.02] border-white/5")}
                  >
                    <div className={cn("p-4 rounded-2xl bg-black/40 border border-white/5 group-hover:scale-110 transition-transform shadow-lg", s.color)}><s.icon size={28} /></div>
                    <span className={cn("text-[9px] font-black uppercase tracking-widest text-center px-2 leading-tight", active ? "text-[#3EB489]" : "text-white/40", lang === 'ru' && "italic font-serif")}>{localizedName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Fixed Footer */}
      <footer className="shrink-0 h-[110px] bg-black/95 backdrop-blur-2xl border-t border-white/5 flex items-center justify-center px-6 z-[70] pb-safe shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
        <button 
          onClick={() => setResponsibilityOpen(true)} 
          className={cn("w-full py-6 bg-[#3EB489] text-black rounded-full font-black uppercase text-lg tracking-[0.1em] neon-glow active:scale-95 transition-all shadow-lg flex items-center justify-center gap-3", lang === 'ru' && "italic font-serif")}
        >
          <CheckCircle2 size={24} /> {lang === 'ru' ? 'Синхронизация' : t.sync}
        </button>
      </footer>

      {/* Responsibility Affirmation Portal */}
      <Dialog open={responsibilityOpen} onOpenChange={setResponsibilityOpen}>
        <DialogContent className="bg-black border-white/10 max-w-md p-0 rounded-[3.5rem] overflow-hidden flex flex-col font-headline">
          <DialogTitle className="sr-only">Responsibility Affirmation</DialogTitle>
          <div className="p-10 flex flex-col items-center text-center space-y-10">
            <div className="relative">
              <div className="absolute inset-0 bg-[#3EB489]/20 blur-3xl rounded-full animate-pulse" />
              <div className="w-24 h-24 bg-[#3EB489]/10 border-2 border-[#3EB489]/30 rounded-full flex items-center justify-center relative z-10 shadow-2xl">
                <ShieldCheck size={48} className="text-[#3EB489]" />
              </div>
            </div>
            
            <div className="space-y-6">
              <p className={cn(
                "text-2xl md:text-3xl font-black uppercase tracking-tighter text-white leading-tight",
                lang === 'ru' && "italic font-serif"
              )}>
                {t.responsibility}
              </p>
              <div className="w-12 h-1 bg-[#3EB489]/20 rounded-full mx-auto" />
            </div>

            <button 
              onClick={handleFinalSync}
              className={cn(
                "w-full h-20 bg-[#3EB489] text-black rounded-3xl font-black uppercase text-lg tracking-widest active:scale-95 transition-all shadow-[0_0_40px_rgba(62,180,137,0.3)]",
                lang === 'ru' && "italic font-serif"
              )}
            >
              {t.syncProceed}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Substance Intake Entry Modal */}
      {activeSubstance && (
        <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl z-[100] animate-in fade-in duration-300 flex flex-col font-headline">
          <header className="shrink-0 p-8 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className={cn("w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-xl", activeSubstance.color)}><activeSubstance.icon size={28} /></div>
              <h2 className={cn("text-2xl font-black uppercase tracking-tighter text-white", lang === 'ru' && "italic font-serif")}>{lang === 'en' ? activeSubstance.name : lang === 'de' ? activeSubstance.deName : lang === 'pt' ? activeSubstance.ptName : activeSubstance.ruName}</h2>
            </div>
            <button onClick={() => setActiveSubstance(null)} className="p-4 bg-white/5 rounded-full border border-white/10 text-white/40 active:scale-90 transition-all"><X size={24} /></button>
          </header>

          <div className="flex-1 min-h-0 overflow-hidden">
            <ScrollArea className="h-full px-8 touch-pan-y">
              <div className="flex flex-col items-center space-y-12 py-12 max-w-md mx-auto w-full pb-40">
                {activeSubstance.id === 'alcohol' ? (
                  <div className="space-y-4 w-full">
                    {alcoholCart.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white/[0.03] p-6 rounded-3xl border border-white/10 shadow-lg">
                        <span className={cn("text-base font-black uppercase tracking-widest text-white/80", lang === 'ru' && "italic font-serif")}>{item.type}</span>
                        <div className="flex items-center gap-8">
                          <button onClick={() => { const next = [...alcoholCart]; next[idx].count = Math.max(0, next[idx].count - 1); setAlcoholCart(next); }} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 transition-all active:scale-90">-</button>
                          <span className="w-8 text-center font-black text-3xl text-white tabular-nums">{item.count}</span>
                          <button onClick={() => { const next = [...alcoholCart]; next[idx].count += 1; setAlcoholCart(next); }} className="w-12 h-12 rounded-full bg-[#3EB489] text-black flex items-center justify-center transition-all active:scale-90 shadow-lg">+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6 w-full text-center">
                    <label className={cn("text-[10px] font-black uppercase tracking-[0.4em] text-white/30 block", lang === 'ru' && "italic font-serif")}>{t.amount} ({lang === 'en' ? activeSubstance.unit : lang === 'de' ? activeSubstance.deUnit : lang === 'pt' ? activeSubstance.ptUnit : activeSubstance.ruUnit})</label>
                    <input 
                      type="number" 
                      value={manualValue} 
                      onChange={(e) => setManualValue(e.target.value)} 
                      autoFocus 
                      inputMode="decimal" 
                      className={cn("w-full bg-transparent border-b-4 border-[#3EB489] py-4 text-7xl font-black outline-none text-white text-center shadow-none transition-all placeholder:text-white/5", lang === 'ru' && "italic font-serif")} 
                      placeholder="0.00" 
                    />
                  </div>
                )}
                <div className="w-full space-y-4 pt-10">
                  <button onClick={saveLog} className={cn("w-full h-24 bg-[#3EB489] text-black rounded-[2rem] font-black uppercase tracking-widest neon-glow active:scale-[0.98] shadow-2xl flex items-center justify-center gap-4 text-xl", lang === 'ru' && "italic font-serif")}>{t.confirm}</button>
                  <button onClick={() => setActiveSubstance(null)} className={cn("w-full h-14 text-white/20 font-black uppercase text-[10px] tracking-[0.5em] transition-colors hover:text-white", lang === 'ru' && "italic font-serif")}>{t.cancel}</button>
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
