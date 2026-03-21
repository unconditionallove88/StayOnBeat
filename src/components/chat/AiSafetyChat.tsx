
'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Mic, MicOff, Info, CircleDot } from 'lucide-react';
import { aiSafetyChat, type ChatMessage } from '@/ai/flows/substance-safety-chat';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

/**
 * @fileOverview AiSafetyChat Component.
 * Enhanced with current intake context and vital reminders.
 */

const CONTENT = {
  en: {
    context: "Active intake context",
    question: "How can I help you stay safe tonight?",
    sub: "I'm aware of your profile and intake. Ask me anything.",
    water: "💧 Water check",
    banana: "🍌 Banana / Magnesium",
    placeholder: "Ask a safety question...",
    analyzing: "Analyzing risk factors...",
    interrupted: "Connection interrupted. Please ensure your safety is managed by on-site staff if this is an emergency.",
    voiceError: "Voice Input Error",
    voiceDesc: "Could not access microphone or understand speech.",
    voiceNotSupported: "Speech Not Supported",
    voiceNotSupportedDesc: "Your browser does not support voice input."
  },
  de: {
    context: "Aktueller Kontext",
    question: "Wie kann ich dich heute begleiten?",
    sub: "Ich kenne dein Profil und deine Einträge. Frag mich alles.",
    water: "💧 Wasser-Check",
    banana: "🍌 Banane / Magnesium",
    placeholder: "Sicherheits-Frage stellen...",
    analyzing: "Risiken werden sanft geprüft...",
    interrupted: "Verbindung unterbrochen. Bitte wende dich im Notfall direkt an das Awareness-Team vor Ort.",
    voiceError: "Spracheingabe-Fehler",
    voiceDesc: "Mikrofon-Zugriff nicht möglich oder Sprache nicht erkannt.",
    voiceNotSupported: "Sprache nicht unterstützt",
    voiceNotSupportedDesc: "Dein Browser unterstützt keine Spracheingabe."
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
  const [lang, setLang] = useState<'en' | 'de'>('en');
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const savedLang = localStorage.getItem('stayonbeat_lang');
    if (savedLang === 'DE') setLang('de');

    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const t = CONTENT[lang];

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = lang === 'en' ? 'en-US' : 'de-DE';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + ' ' + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          variant: 'destructive',
          title: t.voiceError,
          description: t.voiceDesc,
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [lang, toast, t.voiceError, t.voiceDesc]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (recognitionRef.current) {
        setIsListening(true);
        recognitionRef.current.start();
      } else {
        toast({
          title: t.voiceNotSupported,
          description: t.voiceNotSupportedDesc,
        });
      }
    }
  };

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
            <span className="text-[9px] font-black uppercase tracking-widest text-blue-400">
              {t.context}: {currentIntake}
            </span>
          </div>
          <CircleDot size={14} className="text-blue-400 animate-pulse" />
        </div>
      )}

      <ScrollArea className="flex-1 px-8 py-10" ref={scrollRef}>
        <div className="space-y-8 max-w-2xl mx-auto pb-10">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                <Bot className="w-8 h-8 text-white/20" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-bold text-white/80">{t.question}</p>
                <p className="text-sm text-white/40">{t.sub}</p>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center pt-4">
                <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-blue-400">{t.water}</span>
                </div>
                <div className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-yellow-400">{t.banana}</span>
                </div>
              </div>
            </div>
          )}
          
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex gap-6 items-start animate-in slide-in-from-bottom-2 duration-300",
                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border",
                msg.role === 'user' ? "bg-white/10 border-white/10" : "bg-blue-600/20 border-blue-500/30 text-blue-500"
              )}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <CircleDot className="w-5 h-5" />}
              </div>
              <div className={cn(
                "p-5 rounded-3xl text-sm leading-relaxed max-w-[80%] shadow-lg",
                msg.role === 'user' ? "bg-white/5 text-white rounded-tr-none" : "bg-white/10 text-white/90 rounded-tl-none border border-white/5"
              )}>
                {msg.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-500 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <div className="p-5 rounded-3xl bg-white/10 text-white/40 italic text-sm animate-pulse">
                {t.analyzing}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="px-6 py-8 bg-black border-t border-white/5 shrink-0">
        <div className="relative flex items-center max-w-2xl mx-auto gap-3">
          <div className="relative flex-1">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t.placeholder}
              className="w-full bg-white/5 border border-white/10 rounded-full py-5 pl-8 pr-12 text-base focus:border-blue-500 transition-all outline-none"
            />
            <button
              onClick={toggleListening}
              className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all",
                isListening ? "text-red-500 animate-pulse bg-red-500/10" : "text-white/40 hover:text-white"
              )}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-4 bg-blue-600 text-white rounded-full disabled:opacity-30 transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
        <p className="text-center text-[9px] text-white/20 uppercase tracking-[0.4em] mt-4">Harm Reduction AI v4.2</p>
      </div>
    </div>
  );
}
