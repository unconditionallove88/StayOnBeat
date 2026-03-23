
'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Heart, Loader2, Lock, Users, CircleDot } from 'lucide-react';
import { useFirestore, useUser, useCollection, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

/**
 * @fileOverview The Holders (Those who hold your heart from afar).
 * Optimized for minimalist ritual and human-friendly iPhone experience.
 * Full localization for EN, DE, PT, RU.
 */

const CONTENT = {
  en: {
    title: "The Holders",
    sub: "Sacred Bond of Resonance",
    desc: "Those who hold your heart from afar Your sacred bond of care and trust",
    items: [
      { title: "Sacred Bond of Resonance", sub: "Shared only with your inner circle", icon: Lock },
      { title: "Mutual Holding", sub: "Unity through shared resonance", icon: CircleDot }
    ],
    button: "Access My Bonds",
    createTitle: "NAME YOUR BOND",
    inviteTitle: "INVITE BY EMAIL",
    createBtn: "Create Bond",
    cancelBtn: "Cancel",
    placeholder: "Message your holders",
    resonanceStart: "Start a resonance with your holders",
    successTitle: "Bond Initialized",
    successMsg: (name: string) => `Your bond of care "${name}" has been created Waiting for resonance`,
    footer: "Mutual Bonds of Care",
    encrypted: "End-to-End Encrypted Sanctuary"
  },
  de: {
    title: "Die Holder",
    sub: "Heiliges Band der Resonanz",
    desc: "Diejenigen, die dein Herz aus der Ferne halten Dein Band aus Fürsorge und Vertrauen",
    items: [
      { title: "Heiliges Band", sub: "Nur mit deinem inneren Kreis geteilt", icon: Lock },
      { title: "Gegenseitiges Halten", sub: "Einheit durch Resonanz", icon: CircleDot }
    ],
    button: "Bonds aufrufen",
    createTitle: "BENENNE DEIN BAND",
    inviteTitle: "PER E-MAIL EINLADEN",
    createBtn: "Band erstellen",
    cancelBtn: "Abbrechen",
    placeholder: "Nachricht an deine Holder",
    resonanceStart: "Starte eine Resonanz mit deinen Holdern",
    successTitle: "Band initialisiert",
    successMsg: (name: string) => `Dein Band der Fürsorge "${name}" wurde erstellt Warte auf Resonanz`,
    footer: "Gegenseitige Fürsorge",
    encrypted: "Ende-zu-Ende verschlüsseltes Sanctuary"
  },
  pt: {
    title: "Os Guardiões",
    sub: "Vínculo Sagrado de Ressonância",
    desc: "Aqueles que cuidam do seu coração de longe Seu vínculo sagrado de cuidado e confiança",
    items: [
      { title: "Vínculo Sagrado", sub: "Compartilhado apenas com seu círculo íntimo", icon: Lock },
      { title: "Cuidado Mútuo", sub: "Unidade através da ressonância", icon: CircleDot }
    ],
    button: "Acessar Vínculos",
    createTitle: "NOME DO VÍNCULO",
    inviteTitle: "CONVIDAR POR E-MAIL",
    createBtn: "Criar Vínculo",
    cancelBtn: "Cancelar",
    placeholder: "Mensagem para seus guardiões",
    resonanceStart: "Inicie uma ressonância com seus guardiões",
    successTitle: "Vínculo Iniciado",
    successMsg: (name: string) => `Seu vínculo de cuidado "${name}" foi criado Aguardando ressonância`,
    footer: "Vínculos Mútuos de Cuidado",
    encrypted: "Santuário Criptografado de Ponta a Ponta"
  },
  ru: {
    title: "Хранители",
    sub: "Интуитивная связь резонанса",
    desc: "Заботящиеся о Тебе на расстоянии Интуитивная связь заботы и доверия с близкими тебе",
    items: [
      { title: "Интуитивная связь", sub: "Доступно только твоему внутреннему кругу", icon: Lock },
      { title: "Взаимная поддержка", sub: "Единство через общий резонанс", icon: CircleDot }
    ],
    button: "Открыть связи",
    createTitle: "НАЗВАНИЕ СВЯЗИ",
    inviteTitle: "ПРИГЛАСИТЬ ПО E-MAIL",
    createBtn: "Создать связь",
    cancelBtn: "Отмена",
    placeholder: "Сообщение хранителям",
    resonanceStart: "Начни резонанс со своими хранителями",
    successTitle: "Связь установлена",
    successMsg: (name: string) => `Твоя связь "${name}" создана Ожидание резонанса`,
    footer: "Взаимные узы заботы",
    encrypted: "Зашифрованное пространство"
  }
};

export function LoveCircleChat() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const [input, setInput] = useState('');
  const [hasAgreement, setHasAgreement] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [lang, setLang] = useState<'en' | 'de' | 'pt' | 'ru'>('en');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de', 'pt', 'ru'].includes(savedLang)) setLang(savedLang);
  }, []);

  const t = CONTENT[lang] || CONTENT.en;

  const chatQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(
      collection(firestore, 'users', user.uid, 'loveCircleMessages'),
      orderBy('createdAt', 'asc'),
      limit(50)
    );
  }, [firestore, user?.uid]);

  const { data: messages, isLoading } = useCollection(chatQuery);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !user || !firestore) return;
    const text = input.trim();
    setInput('');
    addDocumentNonBlocking(collection(firestore, 'users', user.uid, 'loveCircleMessages'), {
      senderId: user.uid,
      senderName: user.displayName || 'Friend',
      text: text,
      createdAt: serverTimestamp(),
    });
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || !firestore || !user) return;

    try {
      const groupsRef = collection(firestore, 'chatGroups');
      await addDocumentNonBlocking(groupsRef, {
        name: groupName,
        members: [user.uid],
        pendingInvites: inviteEmail ? [inviteEmail] : [],
        createdAt: serverTimestamp()
      });
      
      toast({
        title: t.successTitle,
        description: t.successMsg(groupName),
      });
      setShowCreateGroup(false);
      setGroupName('');
      setInviteEmail('');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not create group",
      });
    }
  };

  if (!hasAgreement) {
    return (
      <div className="flex flex-col h-full bg-black font-headline overflow-hidden">
        <ScrollArea className="flex-1 touch-pan-y">
          <div className="flex flex-col items-center justify-center min-h-[70vh] p-10 text-center space-y-12">
            <div className="relative">
              <div className="absolute inset-0 bg-[#10B981]/20 blur-3xl rounded-full animate-pulse" />
              <div className="w-32 h-32 bg-[#10B981]/10 rounded-full flex items-center justify-center border-2 border-[#10B981]/30 relative z-10 shadow-2xl">
                <CircleDot size={48} className="text-[#10B981]" />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className={cn("text-5xl font-black uppercase tracking-tighter text-white leading-none", lang === 'ru' && "italic font-serif")}>{t.title}</h2>
              <p className={cn("text-lg font-bold text-white/60 leading-tight max-sm mx-auto uppercase tracking-widest", lang === 'ru' && "italic font-serif")}>
                {t.desc}
              </p>
            </div>

            <div className="space-y-4 w-full max-w-sm">
              {t.items.map((item, i) => (
                <div key={i} className="flex items-center gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] text-left transition-all hover:border-[#10B981]/30 group">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-[#10B981]" />
                  </div>
                  <div>
                    <p className={cn("text-sm font-black uppercase tracking-tight text-white", lang === 'ru' && "italic font-serif")}>{item.title}</p>
                    <p className={cn("text-[10px] font-bold text-white/30 uppercase tracking-widest", lang === 'ru' && "italic font-serif")}>{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setHasAgreement(true)}
              className={cn("pill-button w-full max-w-sm bg-[#10B981] text-black text-xl font-black uppercase tracking-widest active:scale-95 flex items-center justify-center gap-3 mb-10", lang === 'ru' && "italic font-serif")}
            >
              {t.button}
            </button>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black font-body overflow-hidden">
      <div className="px-8 py-8 border-b border-white/5 bg-black/80 backdrop-blur-xl flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#10B981]/10 rounded-2xl flex items-center justify-center border border-[#10B981]/20 shadow-lg">
            <CircleDot size={28} className="text-[#10B981]" />
          </div>
          <div>
            <h2 className={cn("text-2xl font-black uppercase tracking-tight text-white leading-none", lang === 'ru' && "italic font-serif")}>{t.title}</h2>
            <p className={cn("text-[10px] text-[#10B981] font-black uppercase tracking-[0.3em] mt-1", lang === 'ru' && "italic font-serif")}>{t.sub}</p>
          </div>
        </div>
        <button 
          onClick={() => setShowCreateGroup(!showCreateGroup)}
          className="p-4 bg-[#10B981] text-black rounded-2xl hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
        >
          <Users size={20} />
        </button>
      </div>

      {showCreateGroup && (
        <div className="p-8 bg-white/[0.02] border-b border-white/5 animate-in slide-in-from-top-4 shrink-0">
          <form onSubmit={handleCreateGroup} className="space-y-4 max-w-md mx-auto">
            <input 
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder={t.createTitle}
              className={cn("w-full bg-black border border-white/10 p-5 rounded-2xl text-white font-black uppercase text-sm focus:border-[#10B981] outline-none transition-all", lang === 'ru' && "italic font-serif")}
              required
            />
            <input 
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder={t.inviteTitle}
              type="email"
              className={cn("w-full bg-black border border-white/10 p-5 rounded-2xl text-white font-black uppercase text-sm focus:border-[#10B981] outline-none transition-all", lang === 'ru' && "italic font-serif")}
            />
            <div className="flex gap-3 pt-2">
              <button type="submit" className={cn("flex-1 bg-[#10B981] text-black h-14 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg", lang === 'ru' && "italic font-serif")}>{t.createBtn}</button>
              <button type="button" onClick={() => setShowCreateGroup(false)} className={cn("flex-1 bg-white/5 text-white/40 h-14 rounded-xl font-black uppercase text-[10px] tracking-widest", lang === 'ru' && "italic font-serif")}>{t.cancelBtn}</button>
            </div>
          </form>
        </div>
      )}

      <ScrollArea className="flex-1 px-8 py-8 touch-pan-y" ref={scrollRef}>
        <div className="space-y-8 max-w-2xl mx-auto pb-10">
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#10B981] animate-spin" />
            </div>
          )}
          
          {messages?.length === 0 && !isLoading && (
            <div className="text-center py-24 opacity-20 space-y-6">
              <div className="relative inline-block">
                <CircleDot className="w-16 h-16 mx-auto text-[#10B981]" />
              </div>
              <p className={cn("text-sm uppercase font-black tracking-[0.4em] leading-relaxed text-white max-w-[200px] mx-auto", lang === 'ru' && "italic font-serif")}>
                {t.resonanceStart}
              </p>
            </div>
          )}

          {messages?.map((msg) => {
            const isMe = msg.senderId === user?.uid;
            return (
              <div key={msg.id} className={cn("flex flex-col gap-3 animate-in slide-in-from-bottom-2 duration-500", isMe ? "items-end" : "items-start")}>
                <span className={cn("text-[9px] font-black text-white/20 uppercase tracking-[0.4em] px-3", lang === 'ru' && "italic font-serif")}>
                  {isMe ? (lang === 'ru' ? 'ТЫ' : lang === 'pt' ? 'VOCÊ' : 'YOU') : msg.senderName}
                </span>
                <div className={cn(
                  "p-6 rounded-[2.5rem] text-sm font-bold leading-relaxed max-w-[85%] shadow-2xl border transition-all",
                  isMe 
                    ? "bg-[#10B981] text-black border-[#10B981] rounded-tr-none" 
                    : "bg-white/[0.03] text-white/90 border-white/5 rounded-tl-none shadow-inner",
                  lang === 'ru' && "italic font-serif"
                )}>
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="px-6 py-10 bg-black border-t border-white/5 shrink-0 pb-safe">
        <div className="relative flex items-center max-w-2xl mx-auto gap-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.placeholder}
            className={cn("flex-1 bg-white/[0.02] border border-white/10 rounded-full py-6 px-10 text-base font-bold focus:border-[#10B981] transition-all outline-none text-white shadow-inner", lang === 'ru' && "italic font-serif")}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-6 bg-[#10B981] text-black rounded-full disabled:opacity-30 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#10B981]/20"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
        <div className="mt-6 flex flex-col items-center gap-2 opacity-20">
          <p className={cn("text-[8px] text-white uppercase tracking-[0.6em] font-black", lang === 'ru' && "italic font-serif")}>
            {t.footer}
          </p>
          <div className="flex items-center gap-2">
            <Lock size={8} className="text-[#10B981]" />
            <span className={cn("text-[7px] font-black uppercase tracking-widest", lang === 'ru' && "italic font-serif")}>{t.encrypted}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
