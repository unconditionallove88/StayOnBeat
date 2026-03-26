
'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Loader2, ShieldAlert, Flag, Users2, Shield, Wind, CircleDot } from 'lucide-react';
import { useFirestore, useUser, useCollection, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { moderateMessage } from '@/ai/flows/moderate-message';
import { GuardianLogo } from '@/components/ui/guardian-logo';

/**
 * @fileOverview The Spectators (Public & Moderated).
 * Integrated with Pulse Guardian for active monitoring.
 * Renamed from Witnesses to Spectators.
 * Full localization for EN, DE, PT, RU.
 */

const CONTENT = {
  en: {
    guardianNote: "Pulse Guardian: Active Monitoring & Slang Guard",
    title: "The Spectators",
    sub: "Connected with Care",
    rulesHeader: "A space of collective care Guarded by Pulse Guardian",
    rules: [
      "Unconditional Kindness for all",
      "Zero tolerance for illegal drug activity",
      "No slang for prohibited substances",
      "Protect your and others' anonymity",
      "Political divisive rhetoric is not permitted"
    ],
    enterBtn: "Enter guarded sanctuary",
    placeholder: "Share your resonance...",
    footer: "Grounded in Unconditional Love 🌿",
    blockedTitle: "Sanctuary Rest",
    blockedDesc: "Pulse Guardian has paused your communication To ensure the harmony of this circle illegal activities and divisive language are not permitted 🌿",
    blockedAffirmation: "I love and respect my need for stillness Use this time to ground yourself",
    violationTitle: "Pulse Guardian: Protocol Violation",
    violationDesc: "Your session in this chat has been paused for community harmony",
    errorTitle: "Connection Error",
    errorDesc: "Could not send message to the sanctuary"
  },
  de: {
    guardianNote: "Pulse Guardian: Aktive Überwachung & Slang-Schutz",
    title: "Die Spectator",
    sub: "Verbunden durch Fürsorge",
    rulesHeader: "Ein Raum gemeinsamer Fürsorge Bewacht vom Pulse Guardian",
    rules: [
      "Bedingungslose Freundlichkeit für alle",
      "Null Toleranz für illegalen Drogenhandel",
      "Kein Slang für verbotene Substanzen",
      "Schütze deine Anonymität und die der anderen",
      "Spaltende politische Rhetorik ist untersagt"
    ],
    enterBtn: "Bewachtes Sanctuary betreten",
    placeholder: "Teile deine Resonanz...",
    footer: "Geerdet in bedingungsloser Liebe 🌿",
    blockedTitle: "Sanctuary Pause",
    blockedDesc: "Pulse Guardian hat deine Kommunikation pausiert Um die Harmonie zu gewährleisten sind illegale Aktivitäten und spaltende Sprache nicht erlaubt 🌿",
    blockedAffirmation: "Ich achte mein Bedürfnis nach Ruhe Nutze diese Zeit zur Erdung",
    violationTitle: "Pulse Guardian: Protokoll-Verstoß",
    violationDesc: "Deine Sitzung in diesem Chat wurde zur Harmonie pausiert",
    errorTitle: "Verbindungsfehler",
    errorDesc: "Nachricht konnte nicht gesendet werden"
  },
  pt: {
    guardianNote: "Pulse Guardian: Monitoramento Ativo e Filtro de Gírias",
    title: "Os Espectadores",
    sub: "Conectados com Cuidado",
    rulesHeader: "Um espaço de cuidado coletivo Protegido pelo Pulse Guardian",
    rules: [
      "Gentileza incondicional para todos",
      "Tolerância zero para atividades ilegais",
      "Proibido o uso de gírias para substâncias",
      "Proteja o seu anonimato e o dos outros",
      "Retórica política divisiva não é permitida"
    ],
    enterBtn: "Entrar no santuário protegido",
    placeholder: "Compartilhe sua ressonância...",
    footer: "Apoiado em Amor Incondicional 🌿",
    blockedTitle: "Descanso do Santuário",
    blockedDesc: "O Pulse Guardian pausou sua comunicação Para garantir a harmonia deste círculo atividades ilegais e linguagem divisiva não são permitidas 🌿",
    blockedAffirmation: "Eu amo e respeito minha necessidade de silêncio Use este tempo para se aterrar",
    violationTitle: "Pulse Guardian: Violação de Protocolo",
    violationDesc: "Sua sessão neste chat foi pausada para a harmonia da comunidade",
    errorTitle: "Erro de Conexão",
    errorDesc: "Não foi possível enviar a mensagem ao santuário"
  },
  ru: {
    guardianNote: "Pulse Guardian: Активный мониторинг с любовью",
    title: "Зрители",
    sub: "Связанные заботой",
    rulesHeader: "Пространство коллективной заботы Под охраной Pulse Guardian",
    rules: [
      "Безусловная доброта ко всем",
      "Нулевая терпимость к незаконной деятельности",
      "Запрещено использование сленга веществ",
      "Береги анонимность — свою и чужую",
      "Политическая риторика не допускается"
    ],
    enterBtn: "Войти в пространство заботы",
    placeholder: "Поделись своим резонансом...",
    footer: "Основано на Безусловной Любви 🌿",
    blockedTitle: "Тишина в Пространстве",
    blockedDesc: "Pulse Guardian приостановил твое общение Для обеспечения гармонии этого круга незаконная деятельность и враждебная лексика не допускаются 🌿",
    blockedAffirmation: "Я люблю и уважаю свою потребность в тишине Используй это время для заземления",
    violationTitle: "Pulse Guardian: Нарушение резонанса",
    violationDesc: "Твоя сессия в этом чате приостановлена в целях общей гармонии",
    errorTitle: "Ошибка соединения",
    errorDesc: "Не удалось отправить сообщение в пространство"
  }
};

const NATURE_PREFIXES = ['Emerald', 'Golden', 'Mystic', 'Quiet', 'Velvet', 'Silver', 'Primal', 'Crystal'];
const NATURE_NOUNS = ['Leaf', 'Wave', 'Wind', 'Bloom', 'Echo', 'Flame', 'Stone', 'Mist'];

export function PartyCircleChat() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const [input, setInput] = useState('');
  const [hasAgreedToRules, setHasAgreedToRules] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [lang, setLang] = useState<'en' | 'de' | 'pt' | 'ru'>('en');
  const scrollRef = useRef<HTMLDivElement>(null);

  const natureName = useMemo(() => {
    const prefix = NATURE_PREFIXES[Math.floor(Math.random() * NATURE_PREFIXES.length)];
    const noun = NATURE_NOUNS[Math.floor(Math.random() * NATURE_NOUNS.length)];
    return `${prefix} ${noun}`;
  }, []);

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de', 'pt', 'ru'].includes(savedLang)) setLang(savedLang);

    const agreed = localStorage.getItem('stayonbeat_spectator_agreed');
    const blocked = localStorage.getItem('stayonbeat_spectator_blocked');
    if (agreed === 'true') setHasAgreedToRules(true);
    if (blocked === 'true') setIsBlocked(true);
  }, []);

  const t = CONTENT[lang] || CONTENT.en;

  const chatQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'partyCircle'),
      orderBy('createdAt', 'asc'),
      limit(50)
    );
  }, [firestore]);

  const { data: messages, isLoading } = useCollection(chatQuery);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const logViolation = async (content: string, reason: string, type: 'AI_FLAGGED' | 'USER_REPORT') => {
    if (!firestore || !user) return;
    const logsRef = collection(firestore, 'moderation_logs');
    addDocumentNonBlocking(logsRef, {
      userId: user.uid,
      userAlias: natureName,
      content,
      reason,
      type,
      timestamp: serverTimestamp()
    });
  };

  const handleSend = async () => {
    if (!input.trim() || !user || !firestore || isSending || isBlocked) return;
    
    const text = input.trim();
    setInput('');
    setIsSending(true);

    try {
      const moderation = await moderateMessage({ text });
      
      if (!moderation.isSafe) {
        setIsBlocked(true);
        localStorage.setItem('stayonbeat_spectator_blocked', 'true');
        await logViolation(text, moderation.reason || "Unsafe content detected", 'AI_FLAGGED');
        toast({
          variant: "destructive",
          title: t.violationTitle,
          description: t.violationDesc,
        });
        setIsSending(false);
        return;
      }

      addDocumentNonBlocking(collection(firestore, 'partyCircle'), {
        senderId: user.uid,
        senderAlias: natureName,
        text: moderation.filteredText || text,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Moderation error:", error);
      toast({
        variant: "destructive",
        title: t.errorTitle,
        description: t.errorDesc,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleEnterChat = () => {
    setIsEntering(true);
    localStorage.setItem('stayonbeat_spectator_agreed', 'true');
    
    setTimeout(() => {
      setHasAgreedToRules(true);
      setIsEntering(false);
    }, 800);
  };

  if (isBlocked) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 text-center space-y-8 bg-black font-headline overflow-hidden">
        <div className="w-24 h-24 bg-[#A855F7]/10 rounded-full flex items-center justify-center border-2 border-[#A855F7]/30 shadow-[0_0_40px_rgba(168,85,247,0.2)]">
          <GuardianLogo size={48} />
        </div>
        <div className="space-y-4">
          <h2 className={cn("text-3xl font-black uppercase tracking-tighter text-white", lang === 'ru' && "italic font-serif")}>{t.blockedTitle}</h2>
          <p className={cn("text-white/60 text-sm font-bold leading-relaxed uppercase tracking-widest", lang === 'ru' && "italic font-serif")}>
            {t.blockedDesc}
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 w-full flex items-center gap-4">
          <Wind className="text-[#A855F7]" size={24} />
          <p className={cn("text-[10px] font-black text-white/40 uppercase tracking-widest text-left", lang === 'ru' && "italic font-serif")}>
            {t.blockedAffirmation}
          </p>
        </div>
      </div>
    );
  }

  if (!hasAgreedToRules) {
    return (
      <div className="flex flex-col h-full bg-black font-headline overflow-hidden">
        <ScrollArea className="flex-1">
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-8">
            <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center border-2 border-amber-500/30">
              <Users2 size={40} className="text-amber-500" />
            </div>

            <div className="space-y-3">
              <h2 className={cn("text-3xl font-black uppercase tracking-tighter text-white", lang === 'ru' && "italic font-serif")}>{t.title}</h2>
              <p className={cn("text-sm font-bold text-white/60 uppercase tracking-widest leading-relaxed", lang === 'ru' && "italic font-serif")}>
                {t.rulesHeader}
              </p>
            </div>

            <div className="w-full space-y-3 text-left">
              {t.rules.map((rule, idx) => (
                <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                  <span className={cn("text-[11px] font-bold uppercase text-white/80", lang === 'ru' && "italic font-serif")}>{rule}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 w-full pb-8">
              <button 
                onClick={handleEnterChat}
                disabled={isEntering}
                className={cn("w-full bg-[#10B981] text-black h-20 rounded-2xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center px-8", lang === 'ru' && "italic font-serif")}
              >
                {isEntering ? <Loader2 className="animate-spin w-6 h-6" /> : <span className="text-xs leading-tight">{t.enterBtn}</span>}
              </button>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black font-body overflow-hidden">
      <div className="bg-[#A855F7]/10 border-b border-[#A855F7]/30 px-8 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <GuardianLogo size={18} />
          <span className={cn("text-[9px] font-black uppercase tracking-widest text-[#A855F7]", lang === 'ru' && "italic font-serif")}>{t.guardianNote}</span>
        </div>
        <CircleDot size={14} className="text-[#A855F7] animate-pulse" />
      </div>

      <div className="px-8 py-6 border-b border-white/5 bg-black/80 backdrop-blur-xl flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-500/30">
            <Users2 size={24} className="text-amber-500" />
          </div>
          <div>
            <h2 className={cn("text-lg font-black uppercase tracking-tight text-white", lang === 'ru' && "italic font-serif")}>{t.title}</h2>
            <p className={cn("text-[9px] text-amber-500 font-bold uppercase tracking-widest", lang === 'ru' && "italic font-serif")}>{t.sub}</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-8 py-6 touch-pan-y" ref={scrollRef}>
        <div className="space-y-6 max-w-2xl mx-auto pb-10">
          {isLoading && <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>}
          {messages?.map((msg) => {
            const isMe = msg.senderId === user?.uid;
            return (
              <div key={msg.id} className={cn("flex flex-col gap-2 animate-in slide-in-from-bottom-2 duration-300", isMe ? "items-end" : "items-start")}>
                <div className="flex items-center gap-3 px-2">
                  <span className={cn("text-[8px] font-black text-white/30 uppercase tracking-widest", lang === 'ru' && "italic font-serif")}>{isMe ? (lang === 'ru' ? 'ТЫ' : lang === 'pt' ? 'VOCÊ' : 'YOU') : msg.senderAlias}</span>
                  {!isMe && <button onClick={() => logViolation(msg.text, `Reported by user from ${msg.senderAlias}`, 'USER_REPORT')} className="text-white/20 hover:text-red-500 transition-colors"><Flag size={12} /></button>}
                </div>
                <div className={cn("p-4 rounded-2xl text-sm font-medium leading-relaxed max-w-[85%] shadow-sm border transition-all", isMe ? "bg-amber-500 text-black border-amber-500 rounded-tr-none" : "bg-white/5 text-white border-white/10 rounded-tl-none", lang === 'ru' && "italic font-serif")}>{msg.text}</div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="px-6 py-8 bg-black border-t border-white/5 shrink-0">
        <div className="relative flex items-center max-w-2xl mx-auto gap-3">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder={t.placeholder} disabled={isSending} className={cn("flex-1 bg-white/5 border border-white/10 rounded-full py-5 px-8 text-base focus:border-[#A855F7] transition-all outline-none disabled:opacity-50 text-white", lang === 'ru' && "italic font-serif")} />
          <button onClick={handleSend} disabled={!input.trim() || isSending} className="p-4 bg-amber-500 text-black rounded-full disabled:opacity-30 transition-all hover:scale-105 active:scale-95 shadow-lg">{isSending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}</button>
        </div>
        <p className={cn("text-center text-[8px] text-white/20 uppercase tracking-[0.5em] mt-4 font-black", lang === 'ru' && "italic font-serif")}>{t.footer}</p>
      </div>
    </div>
  );
}
