'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles, Mic, MicOff } from 'lucide-react';
import { aiSafetyChat, type ChatMessage } from '@/ai/flows/substance-safety-chat';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

export function AiSafetyChat({ userProfile }: { userProfile: any }) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

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
          title: 'Voice Input Error',
          description: 'Could not access microphone or understand speech.',
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [toast]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (recognitionRef.current) {
        setIsListening(true);
        recognitionRef.current.start();
      } else {
        toast({
          title: 'Speech Not Supported',
          description: 'Your browser does not support voice input.',
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
        substance: 'Current session data',
        history: messages,
        userProfile: {
          medications: userProfile?.medications || [],
          healthConditions: userProfile?.healthConditions || [],
        },
      });

      setMessages(prev => [...prev, { role: 'ai', content: response.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Connection interrupted. Please ensure your safety is managed by on-site staff if this is an emergency." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black font-body">
      {/* ChatGPT Style Header */}
      <div className="px-8 py-6 border-b border-white/5 bg-black/80 backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center border border-blue-500/30">
            <Sparkles className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h2 className="text-[18px] font-bold">Safety Advisor</h2>
            <p className="text-[10px] text-[#3EB489] font-bold uppercase tracking-widest">Context Aware Active</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-8 py-10" ref={scrollRef}>
        <div className="space-y-8 max-w-2xl mx-auto">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                <Bot className="w-8 h-8 text-white/20" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-bold text-white/80">How can I help you stay safe tonight?</p>
                <p className="text-sm text-white/40">Ask about interactions, hydration, or recovery.</p>
              </div>
            </div>
          )}
          
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex gap-6 items-start",
                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border",
                msg.role === 'user' ? "bg-white/10 border-white/10" : "bg-blue-600/20 border-blue-500/30 text-blue-500"
              )}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
              </div>
              <div className={cn(
                "p-5 rounded-3xl text-sm leading-relaxed max-w-[80%]",
                msg.role === 'user' ? "bg-white/5 text-white rounded-tr-none" : "bg-white/10 text-white/90 rounded-tl-none border border-white/5 shadow-sm"
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
                Analyzing risk factors...
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* ChatGPT Style Sticky Footer Input */}
      <div className="px-6 py-8 bg-black border-t border-white/5">
        <div className="relative flex items-center max-w-2xl mx-auto gap-3">
          <div className="relative flex-1">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a safety question..."
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
