
'use client';

import { useState, useEffect } from 'react';
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
  CircleDot
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { AiSafetyChat } from '@/components/chat/AiSafetyChat';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import CareShield from '@/components/dashboard/CareShield';
import GuardianStatusBar from '@/components/dashboard/GuardianStatusBar';
import PulseGuardianBanner from '@/components/dashboard/PulseGuardianBanner';
import { SOSAlert } from '@/components/dashboard/SOSAlert';

/**
 * @fileOverview Pulse Lab component.
 * Fixed subtype logic and search functionality for PT/RU.
 * Implemented written font form for Russian.
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
    title: "Pulse Lab",
    advisor: "Open Safety Advisor",
    context: "Contextual check",
    search: "Search substances...",
    diary: "Session Diary",
    records: "Records",
    sync: "Sync Session",
    intake: "Log Intake Entry",
    confirm: "Confirm & Log Intake",
    cancel: "Cancel Entry",
    amount: "Amount",
    doseLogged: "Dose logged",
    addedToDiary: "added to your session diary",
    causionTitle: "Pulse Guardian: Caution 🧪",
    poppersHR: (hr: number) => `Your heart rate is ${hr} BPM Poppers will drop your blood pressure sharply Please sit down and breathe before use`
  },
  de: {
    title: "Sitzungs-Labor",
    advisor: "Sicherheits-Begleiter",
    context: "Dein Rhythmus",
    search: "Substanzen suchen...",
    diary: "Sitzungs-Tagebuch",
    records: "Einträge",
    sync: "Sitzung synchronisieren",
    intake: "Eintrag notieren",
    confirm: "Bestätigen & Notieren",
    cancel: "Abbrechen",
    amount: "Menge",
    doseLogged: "Dosis notiert",
    addedToDiary: "wurde deinem Tagebuch hinzugefügt",
    causionTitle: "Pulse Guardian: Vorsicht 🧪",
    poppersHR: (hr: number) => `Dein Puls liegt bei ${hr} BPM Poppers senkt den Blutdruck stark ab Bitte nimm dir einen Moment Zeit, setz dich hin und atme tief durch`
  },
  pt: {
    title: "Pulse Lab",
    advisor: "Abrir Assessor de Segurança",
    context: "Verificação contextual",
    search: "Buscar substâncias...",
    diary: "Diário da Sessão",
    records: "Registros",
    sync: "Sincronizar Sessão",
    intake: "Registrar Entrada",
    confirm: "Confirmar e Registrar",
    cancel: "Cancelar Entrada",
    amount: "Quantidade",
    doseLogged: "Dose registrada",
    addedToDiary: "adicionada ao seu diário de sessão",
    causionTitle: "Pulse Guardian: Cuidado 🧪",
    poppersHR: (hr: number) => `Sua frequência cardíaca é ${hr} BPM Poppers reduzem a pressão arterial bruscamente Por favor sente-se e respire antes de usar`
  },
  ru: {
    title: "Лаборатория",
    advisor: "Советник по Безопасности",
    context: "Контекстная проверка",
    search: "Поиск веществ...",
    diary: "Дневник Сессии",
    records: "Записи",
    sync: "Синхронизировать Сессию",
    intake: "Добавить запись",
    confirm: "Подтвердить и Добавить",
    cancel: "Отмена",
    amount: "Количество",
    doseLogged: "Запись добавлена",
    addedToDiary: "добавлено в ваш дневник сессии",
    causionTitle: "Пульс Страж: Осторожно 🧪",
    poppersHR: (hr: number) => `Ваш пульс составляет ${hr} уд/мин Попперс резко снижает кровяное давление Пожалуйста присядьте и подышите перед использованием`
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
  { id: 'viagra', icon: Pill, name: 'Viagra', deName: 'Viagra', ptName: 'Viagra', ruName: 'Виагра', color: 'text-blue-500', bg: 'bg-blue-500/10', unit: 'pills', deUnit: 'Tabletten', ptUnit: 'Comprimidos', ruUnit: 'Таб.', inputType: 'manual' },
  { id: '2mmc', icon: Diamond, name: '2-MMC', deName: '2-MMC', ptName: '2-MMC', ruName: '2-MMC', color: 'text-sky-300', bg: 'bg-sky-300/10', unit: 'g', deUnit: 'g', ptUnit: 'g', ruUnit: 'г', inputType: 'manual' },
  { id: '3mmc', icon: Diamond, name: '3-MMC', deName: '3-MMC', ptName: '3-MMC', ruName: '3-MMC', color: 'text-sky-400', bg: 'bg-sky-400/10', unit: 'g', deUnit: 'g', ptUnit: 'g', ruUnit: 'г', inputType: 'manual' },
  { id: '4mmc', icon: Diamond, name: '4-MMC', deName: '4-MMC', ptName: '4-MMC', ruName: '4-MMC', color: 'text-sky-500', bg: 'bg-sky-500/10', unit: 'g', deUnit: 'g', ptUnit: 'g', ruUnit: 'г', inputType: 'manual' },
];

export function Step6SubstanceLab({ 
  userData, 
  onComplete,
  showDiary = false,
  isLocked = false 
}: { 
  userData: any, 
  onComplete: (subs: any[]) => void,
  onBack?: () => void,
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
  const [lang, setLang] = useState<'en' | 'de' | 'pt' | 'ru'>('en');

  useEffect(() => {
    setMounted(true);
    const savedLogs = JSON.parse(localStorage.getItem('stayonbeat_logs') || '[]');
    setSessionLogs(savedLogs);
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de', 'pt', 'ru'].includes(savedLang)) setLang(savedLang);
  }, []);

  const t = CONTENT[lang as keyof typeof CONTENT] || CONTENT.en;

  const handleSelectSubstance = (substance: any) => {
    const currentHR = userData?.sessionStatus?.lastHeartRate || 75;
    if (substance.id === "poppers" && currentHR > 100) {
      toast({ variant: "destructive", title: t.causionTitle, description: t.poppersHR(currentHR) });
    }
    setActiveSubstance(substance);
    if (substance.id === 'alcohol') {
      const subtypes = lang === 'en' ? substance.subTypes : lang === 'de' ? substance.deSubTypes : lang === 'pt' ? substance.ptSubTypes : substance.ruSubTypes;
      if (subtypes) {
        setAlcoholCart(subtypes.map((type: string) => ({ type, count: 0 })));
      }
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

  const filtered = SUBSTANCES.filter(s => {
    const name = (lang === 'en' ? s.name : lang === 'de' ? s.deName : lang === 'pt' ? s.ptName : s.ruName) || s.name;
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const isSubstanceActive = (id: string) => sessionLogs.some(log => log.id === id);
  const intakeContext = sessionLogs.map(l => l.name).join(', ');

  if (!mounted) return null;

  const lastHR = userData?.sessionStatus?.lastHeartRate || 0;
  const guardianStatus: 'safe' | 'caution' | 'locked' = isLocked ? 'locked' : (lastHR > 110 ? 'caution' : 'safe');

  if (isLocked) {
    return (
      <div className="flex flex-col h-full bg-black font-body max-w-2xl mx-auto p-6 relative overflow-hidden">
        <ScrollArea className="h-full touch-pan-y">
          <div className="pb-20 space-y-6">
            <GuardianStatusBar status="locked" heartRate={lastHR > 0 ? lastHR : 128} lang={lang} />
            <CareShield 
              reason={userData?.sessionStatus?.lockReason || 'manual'}
              unlockAt={userData?.sessionStatus?.unlockAt ? new Date(userData.sessionStatus.unlockAt).getTime() : Date.now() + 4 * 60 * 60 * 1000}
              lang={lang as 'en' | 'de'}
            />
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black font-headline max-w-2xl mx-auto relative overflow-hidden">
      <header className="px-6 pt-12 pb-4 space-y-4 flex flex-col shrink-0 bg-black/95 backdrop-blur-md z-[60] border-b border-white/5 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 flex items-center justify-center border border-[#10B981]/20">
            <Microscope size={32} className="text-white" />
          </div>
          <h1 className={cn("text-2xl font-black tracking-tighter uppercase leading-none text-white", lang === 'ru' && "italic font-serif")}>{t.title}</h1>
        </div>
        
        <div className="space-y-3">
          <PulseGuardianBanner lang={lang} />
          <GuardianStatusBar status={guardianStatus} heartRate={lastHR > 0 ? lastHR : 98} lang={lang} />
          <button 
            onClick={() => setChatOpen(true)}
            className="w-full bg-blue-600/10 border border-blue-500/30 rounded-2xl py-3 px-4 flex items-center justify-between group hover:bg-blue-600/20 transition-all text-left shadow-lg active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <CircleDot size={16} className="text-blue-400 animate-pulse" />
              <span className={cn("text-[9px] font-black uppercase tracking-[0.2em] text-blue-400", lang === 'ru' && "italic font-serif")}>{t.advisor}</span>
            </div>
            <ArrowRight size={12} className="text-blue-500" />
          </button>
        </div>

        <div className="relative w-full pt-2">
          <Search className="absolute left-6 top-1/2 -translate-y-[calc(50%-4px)] w-4 h-4 text-white/20" />
          <input 
            placeholder={t.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              "w-full bg-white/5 border border-white/10 h-16 pl-14 rounded-3xl focus:border-[#3EB489] text-base outline-none transition-all shadow-inner text-white",
              lang === 'ru' && "italic font-serif"
            )}
          />
        </div>
      </header>

      <ScrollArea className="flex-1 px-6 pt-6 relative z-10 touch-pan-y">
        <div className="pb-40 space-y-8">
          {showDiary && sessionLogs.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className={cn("text-[10px] font-black text-[#10B981] uppercase tracking-[0.3em] flex items-center gap-3", lang === 'ru' && "italic font-serif")}>
                  <Calendar className="w-3 h-3" /> {t.diary}
                </h3>
                <span className={cn("text-[8px] font-bold text-white/20 uppercase tracking-widest", lang === 'ru' && "italic font-serif")}>{sessionLogs.length} {t.records}</span>
              </div>
              <div className="grid gap-3">
                {sessionLogs.slice().reverse().map((log, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between shadow-lg group active:scale-[0.98] transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                        <FlaskConical size={20} className="text-[#3EB489]" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className={cn("text-sm font-black uppercase text-white", lang === 'ru' && "italic font-serif")}>{log.name}</span>
                        <span className={cn("text-[10px] font-bold text-[#3EB489]", lang === 'ru' && "italic font-serif")}>
                          {log.id === 'alcohol' ? log.items.map((it: any) => `${it.count}x ${it.type}`).join(', ') : `${log.value}${log.unit}`}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => removeLog(sessionLogs.length - 1 - i)} className="p-2 text-white/10 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 w-full">
            {filtered.map(s => {
              const active = isSubstanceActive(s.id);
              const name = (lang === 'en' ? s.name : lang === 'de' ? s.deName : lang === 'pt' ? s.ptName : s.ruName) || s.name;
              return (
                <button 
                  key={s.id}
                  onClick={() => handleSelectSubstance(s)}
                  className={cn(
                    "aspect-square border rounded-[2.5rem] flex flex-col items-center justify-center gap-3 transition-all hover:bg-white/10 active:scale-95 group relative overflow-hidden shadow-xl",
                    active ? "bg-[#3EB489]/10 border-[#3EB489] shadow-[0_0_20px_#3EB48933]" : "bg-white/5 border-white/10"
                  )}
                >
                  <div className={cn("p-4 rounded-2xl bg-black/20 group-hover:scale-110 transition-transform", s.color)}>
                    <s.icon size={28} />
                  </div>
                  <span className={cn("text-[10px] font-black uppercase tracking-widest", active ? "text-[#3EB489]" : "text-white/60", lang === 'ru' && "italic font-serif")}>{name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </ScrollArea>

      <footer className="shrink-0 h-[100px] bg-black/95 backdrop-blur-xl border-t border-white/5 flex flex-col items-center justify-center px-6 z-[70] pb-safe">
        <button onClick={() => onComplete(sessionLogs)} className={cn("w-full max-sm py-6 bg-[#3EB489] text-black rounded-full font-black uppercase text-lg tracking-[0.1em] neon-glow active:scale-95 transition-all shadow-lg shadow-[#3EB489]/20 flex items-center justify-center gap-3", lang === 'ru' && "italic font-serif")}>
           <CheckCircle2 size={24} /> {t.sync}
        </button>
      </footer>

      {activeSubstance && (
        <div className="absolute inset-0 bg-black/95 backdrop-blur-md z-[100] animate-in fade-in duration-300 flex flex-col font-headline overflow-hidden">
          <header className="shrink-0 p-8 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shadow-lg", activeSubstance.color)}>
                <activeSubstance.icon size={24} />
              </div>
              <h2 className={cn("text-xl font-black uppercase tracking-tighter text-white", lang === 'ru' && "italic font-serif")}>{lang === 'en' ? activeSubstance.name : lang === 'de' ? activeSubstance.deName : lang === 'pt' ? activeSubstance.ptName : activeSubstance.ruName}</h2>
            </div>
            <button onClick={() => setActiveSubstance(null)} className="p-3 bg-white/5 rounded-full border border-white/10 text-white/40 hover:text-white transition-all active:scale-90"><X size={20} /></button>
          </header>

          <ScrollArea className="flex-1 px-8 touch-pan-y">
            <div className="flex flex-col items-center space-y-10 py-10 max-w-md mx-auto w-full pb-32">
              {activeSubstance.id === 'alcohol' ? (
                <div className="space-y-3 w-full">
                  {alcoholCart.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white/5 p-5 rounded-2xl border border-white/10">
                      <span className={cn("text-sm font-black uppercase tracking-widest text-white/80", lang === 'ru' && "italic font-serif")}>{item.type}</span>
                      <div className="flex items-center gap-6">
                        <button onClick={() => { const next = [...alcoholCart]; next[idx].count = Math.max(0, next[idx].count - 1); setAlcoholCart(next); }} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40">-</button>
                        <span className="w-6 text-center font-black text-xl text-white">{item.count}</span>
                        <button onClick={() => { const next = [...alcoholCart]; next[idx].count += 1; setAlcoholCart(next); }} className="w-10 h-10 rounded-full bg-[#3EB489] text-black flex items-center justify-center shadow-lg">+</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 w-full">
                  <label className={cn("text-[10px] font-black uppercase tracking-widest text-white/40 block ml-2", lang === 'ru' && "italic font-serif")}>{t.amount} ({lang === 'en' ? activeSubstance.unit : lang === 'de' ? activeSubstance.deUnit : lang === 'pt' ? activeSubstance.ptUnit : activeSubstance.ruUnit})</label>
                  <input type="number" value={manualValue} onChange={(e) => setManualValue(e.target.value)} autoFocus inputMode="decimal" className={cn("w-full h-24 bg-white/5 border-2 border-white/10 rounded-3xl px-8 text-5xl font-black outline-none focus:border-[#3EB489] transition-all text-white text-center shadow-inner", lang === 'ru' && "italic font-serif")} placeholder="0.00" />
                </div>
              )}
              <div className="w-full space-y-4 pt-6">
                <button onClick={saveLog} className={cn("w-full h-20 bg-[#3EB489] text-black rounded-[1.5rem] font-black uppercase tracking-widest neon-glow active:scale-[0.98] shadow-2xl flex items-center justify-center gap-3 text-lg", lang === 'ru' && "italic font-serif")}><CheckCircle2 size={24} /> {t.confirm}</button>
                <button onClick={() => setActiveSubstance(null)} className={cn("w-full h-14 text-white/20 font-black uppercase text-[10px] tracking-[0.4em] hover:text-white transition-colors", lang === 'ru' && "italic font-serif")}>{t.cancel}</button>
              </div>
            </div>
          </ScrollArea>
        </div>
      )}

      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="bg-black border-white/10 max-w-2xl p-0 rounded-[3rem] overflow-hidden flex flex-col h-[85dvh] mx-4 top-[50%] -translate-y-[50%]">
          <DialogTitle className="sr-only">AI Safety Advisor Chat</DialogTitle>
          <AiSafetyChat userProfile={userData} currentIntake={intakeContext} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
