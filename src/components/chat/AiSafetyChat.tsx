'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Mic, MicOff, Info, CircleDot } from 'lucide-react';
import { aiSafetyChat, type ChatMessage } from '@/ai/flows/substance-safety-chat';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

/**
 * @fileOverview AiSafetyChat Component.
 * Linguistic purification: Removed "safety" from greetings.
 */

const CONTENT = {
  en: {
    context: "Active intake context", question: "How can I help you stay aware tonight?", sub: "I'm aware of your profile and intake. Ask me anything.",
    water: "💧 Water check", banana: "magnesium", placeholder: "Ask an awareness question...", analyzing: "Analyzing resonance factors...",
    interrupted: "Connection interrupted. Please ensure your care is managed by on-site staff if this is an emergency.",
    voiceError: "Voice Input Error", voiceDesc: "Could not access microphone or understand speech.", voiceNotSupported: "Speech Not Supported", voiceNotSupportedDesc: "Your browser does not support voice input."
  },
  de: {
    context: "Aktueller Kontext", question: "Wie kann ich dich heute begleiten?", sub: "Ich kenne dein Profil und deine Einträge. Frag mich alles.",
    water: "💧 Wasser-Check", banana: "Magnesium", placeholder: "Resonanz-Frage stellen...", analyzing: "Faktoren werden sanft geprüft...",
    interrupted: "Verbindung unterbrochen. Bitte wende dich im Notfall direkt an das Awareness-Team vor Ort.",
    voiceError: "Spracheingabe-Fehler", voiceDesc: "Mikrofon-Zugriff nicht möglich oder Sprache nicht erkannt.", voiceNotSupported: "Sprache nicht unterstützt", voiceNotSupportedDesc: "Dein Browser unterstützt keine Spracheingabe."
  },
  pt: {
    context: "Contexto de consumo", question: "Como posso ajudar você a ficar consciente?", sub: "Eu conheço seu perfil e consumo. Pergunte qualquer coisa.",
    water: "💧 Água", banana: "magnésio", placeholder: "Faça uma pergunta...", analyzing: "Analisando ressonância...",
    interrupted: "Conexão interrompida. Procure a equipe no local se for uma emergência.",
    voiceError: "Erro de voz", voiceDesc: "Não foi possível acessar o microfone.", voiceNotSupported: "Sem suporte", voiceNotSupportedDesc: "Seu navegador não suporta entrada de voz."
  },
  ru: {
    context: "Контекст сессии", question: "Как я могу быть полезен?", sub: "Я знаю твой профиль и потребление. Спрашивай о чем угодно.",
    water: "💧 Вода", banana: "Магний", placeholder: "Задай вопрос...", analyzing: "Анализирую резонанс...",
    interrupted: "Связь прервана. Обратись к персоналу, если это экстренная ситуация.",
    voiceError: "Ошибка голоса", voiceDesc: "Нет доступа к микрофону.", voiceNotSupported: "Не поддерживается", voiceNotSupportedDesc: "Твой браузер не поддерживает голосовой ввод."
  }
};

interface Props {
  userProfile: any;
  currentIntake?: string;
}

export function AiSafetyChat({ userProfile, currentIntake }: Props) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [lang, setLang] = useState<'en' | 'de' | 'pt' | 'ru'>('en');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de', 'pt', 'ru'].includes(savedLang)) setLang(savedLang);

    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const t = CONTENT[lang] || CONTENT.en;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiSafetyChat({
        question: input,
        substance: currentIntake || 'General awareness',
        history: messages,
        userProfile: {
          medications: userProfile?.medications || [],
          healthConditions: userProfile?.healthConditions || [],
        },
        lang: lang,
      });
      setMessages(prev => [...prev, { role: 'ai', content: response.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: t.interrupted }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black font-body overflow-hidden">
      {currentIntake && (
        <div className="bg-blue-600/10 border-b border-blue-500/20 px-8 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Info size={14} className="text-blue-400" />
            <span className={cn("text-[9px] font-black uppercase tracking-widest text-blue-400 truncate max-w-[250px]", lang === 'ru' && "italic font-serif")}>
              {t.context}: {currentIntake}
            </span>
          </div>
          <CircleDot size={14} className="text-blue-400 animate-pulse" />
        </div>
      )}

      <ScrollArea className="flex-1 px-8 py-10 touch-pan-y" ref={scrollRef}>
        <div className="space-y-8 max-w-2xl mx-auto pb-10">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                <Bot className="w-8 h-8 text-white/20" />
              </div>
              <div className="space-y-2">
                <p className={cn("text-lg font-bold text-white/80", lang === 'ru' && "italic font-serif")}>{t.question}</p>
                <p className={cn("text-sm text-white/40 leading-relaxed", lang === 'ru' && "italic font-serif")}>{t.sub}</p>
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex gap-6 items-start animate-in slide-in-from-bottom-2 duration-300", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0 border", msg.role === 'user' ? "bg-white/10 border-white/10" : "bg-blue-600/20 border-blue-500/30 text-blue-500")}>{msg.role === 'user' ? <User className="w-5 h-5" /> : <CircleDot className="w-5 h-5" />}</div>
              <div className={cn("p-5 rounded-3xl text-sm leading-relaxed max-w-[80%] shadow-lg", msg.role === 'user' ? "bg-white/5 text-white rounded-tr-none" : "bg-white/10 text-white/90 rounded-tl-none border border-white/5", lang === 'ru' && "italic font-serif")}>{msg.content}</div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-500 flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin" /></div>
              <div className={cn("p-5 rounded-3xl bg-white/10 text-white/40 italic text-sm animate-pulse", lang === 'ru' && "font-serif")}>{t.analyzing}</div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="px-6 py-8 bg-black border-t border-white/5 shrink-0 pb-safe">
        <div className="relative flex items-center max-w-2xl mx-auto gap-3">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder={t.placeholder} className={cn("w-full bg-white/5 border border-white/10 rounded-full py-5 pl-8 pr-12 text-base focus:border-blue-500 transition-all outline-none text-white shadow-inner", lang === 'ru' && "italic font-serif")} />
          <button onClick={handleSend} disabled={!input.trim() || isLoading} className="p-4 bg-blue-600 text-white rounded-full disabled:opacity-30 transition-all hover:scale-105 active:scale-95 shadow-lg"><Send className="w-6 h-6" /></button>
        </div>
      </div>
    </div>
  );
}
