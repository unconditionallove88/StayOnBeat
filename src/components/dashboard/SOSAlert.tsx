
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore } from '@/firebase';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { 
  Heart, 
  Loader2, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  AlertTriangle, 
  Navigation, 
  Info, 
  Wind, 
  Users, 
  Moon,
  PhoneCall,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { playHeartbeat } from '@/lib/resonance';

/**
 * @fileOverview Immediate Help (SOS) Portal.
 * Redesigned into a high-fidelity, categorized support center.
 * Framing: I love and respect my state of being. Support is a choice.
 * Calibrated for iPhone scrolling integrity.
 */

interface SOSAlertProps {
  onClose: () => void;
  friendName?: string;
  friendStatus?: string;
}

export function SOSAlert({ onClose, friendName, friendStatus }: SOSAlertProps) {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const [step, setStep] = useState<'confirm' | 'sending' | 'sent'>('confirm');
  const [countdown, setCountdown] = useState(15);
  const isFriendMode = !!friendName;

  useEffect(() => {
    playHeartbeat();
    let timer: NodeJS.Timeout;
    if (step === 'sent' && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    } else if (step === 'sent' && countdown === 0) {
      onClose();
    }
    return () => clearInterval(timer);
  }, [step, countdown, onClose]);

  const handleSendSOS = async (priority: 'urgent' | 'standard' | 'grounding') => {
    playHeartbeat();
    
    if (priority === 'grounding') {
      onClose();
      router.push('/self-care');
      return;
    }

    if (!auth.currentUser || !firestore) return;
    setStep('sending');

    const userUid = auth.currentUser.uid;
    const userRef = doc(firestore, 'users', userUid);

    const logMessage = isFriendMode 
      ? `USER REPORTED DISTRESS FOR FRIEND: ${friendName} (Status: ${friendStatus})`
      : `User triggered ${priority === 'urgent' ? 'AWARENESS' : 'FRIENDS'} support alert`;

    addDocumentNonBlocking(collection(firestore, 'users', userUid, 'sosEvents'), {
      triggeredAt: serverTimestamp(),
      status: 'sent',
      priority: priority,
      message: logMessage,
      resolvedAt: null,
    });

    if (!isFriendMode && priority === 'urgent') {
      setDocumentNonBlocking(userRef, { sosActive: true }, { merge: true });
    }

    setTimeout(() => {
      setStep('sent');
    }, 2000);
  };

  if (step === 'sent') {
    return (
      <div className="fixed inset-0 bg-[#050505] z-[4000] flex flex-col items-center justify-center px-8 text-center font-headline animate-in fade-in duration-700">
        <div className="mb-8 relative">
          <Heart size={100} fill="#10B981" className="text-[#10B981] animate-pulse-heart drop-shadow-[0_0_40px_rgba(16,185,129,0.5)]" />
          <Sparkles className="absolute -top-4 -right-4 text-[#10B981] w-6 h-6 animate-pulse" />
        </div>
        
        <div className="space-y-6 max-w-sm">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white leading-none">
            I am loved <br/> <span className="text-[#10B981]">and being taken care of</span>
          </h1>
          <div className="bg-white/5 border border-[#10B981]/20 rounded-[2.5rem] p-8 space-y-4 text-left">
            <div className="flex items-center gap-4 text-white/80">
              <CheckCircle2 size={18} className="text-[#10B981]" />
              <p className="text-xs font-bold uppercase tracking-widest leading-tight">Help request dispatched.</p>
            </div>
            <div className="flex items-center gap-4 text-white/80">
              <ShieldCheck size={18} className="text-[#10B981]" />
              <p className="text-xs font-bold uppercase tracking-widest rendering-tight">Privacy protocols active.</p>
            </div>
          </div>
        </div>

        <button onClick={onClose} className="mt-10 text-white/20 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest underline underline-offset-8">
          Returning to sanctuary in {countdown}s
        </button>
      </div>
    );
  }

  if (step === 'sending') {
    return (
      <div className="fixed inset-0 bg-black/95 z-[4000] flex flex-col items-center justify-center px-8 text-center font-headline">
        <Loader2 size={80} className="text-[#10B981] animate-spin mb-8" />
        <h1 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">Connecting...</h1>
        <p className="text-[#10B981] font-black uppercase tracking-[0.3em] text-[10px]">
          Honoring your request for care
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[4000] flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-500 font-headline">
      <div className="bg-[#0a0a0a] w-full max-w-2xl rounded-t-[3.5rem] sm:rounded-[3.5rem] border-t-2 sm:border-2 border-white/10 flex flex-col h-[95dvh] sm:h-[90vh] max-h-[95dvh] sm:max-h-[90vh] shadow-[0_-20px_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
        
        <button 
          onClick={() => { playHeartbeat(); onClose(); }}
          className="absolute top-8 right-8 p-3 bg-white/5 rounded-full border border-white/10 text-white/40 hover:text-white transition-all z-[100]"
        >
          <X size={18} />
        </button>

        <div className="p-10 pb-4 text-center shrink-0">
          <div className="w-16 h-16 bg-red-600/10 border-2 border-red-600/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <Heart size={32} className="text-[#DC2626]" fill="#DC2626" />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white leading-none">
            Do you need help?
          </h2>
          <p className="text-white/40 text-[9px] font-black uppercase mt-3 tracking-[0.3em]">
            Choose the pathway that resonates now.
          </p>
        </div>

        <ScrollArea className="flex-1 px-6">
          <div className="max-w-md mx-auto w-full pb-32">
            <Tabs defaultValue="emergency" className="w-full">
              <TabsList className="w-full h-14 bg-white/5 border border-white/10 rounded-full p-1.5 mb-6">
                <TabsTrigger value="emergency" className="flex-1 rounded-full text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-red-600 data-[state=active]:text-white">Emergency</TabsTrigger>
                <TabsTrigger value="support" className="flex-1 rounded-full text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-[#F59E0B] data-[state=active]:text-black">Circle</TabsTrigger>
                <TabsTrigger value="stillness" className="flex-1 rounded-full text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-[#10B981] data-[state=active]:text-black">Stillness</TabsTrigger>
              </TabsList>

              <TabsContent value="emergency" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 focus-visible:outline-none">
                <div className="p-6 bg-red-600/5 border-2 border-red-600/20 rounded-[2rem] space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-600/20 rounded-xl">
                      <PhoneCall className="text-red-500" size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase text-white tracking-tight">Awareness Dispatch</p>
                      <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Medical & Security</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed font-medium uppercase tracking-wide">
                    Request professional support to your current tactical grid. Handled with absolute discretion.
                  </p>
                  <button 
                    onClick={() => handleSendSOS('urgent')}
                    className="w-full py-6 bg-red-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-red-600/20 active:scale-95 transition-all"
                  >
                    Notify Awareness Team
                  </button>
                </div>
              </TabsContent>

              <TabsContent value="support" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 focus-visible:outline-none">
                <div className="p-6 bg-amber-500/5 border-2 border-amber-500/20 rounded-[2rem] space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-500/20 rounded-xl">
                      <Users className="text-amber-500" size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase text-white tracking-tight">Circle Alert</p>
                      <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Mutual Care</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed font-medium uppercase tracking-wide">
                    Let your inner circle know you need a moment of connection or assistance.
                  </p>
                  <button 
                    onClick={() => handleSendSOS('standard')}
                    className="w-full py-6 bg-[#F59E0B] text-black rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg active:scale-95 transition-all"
                  >
                    Notify My Circle
                  </button>
                </div>
              </TabsContent>

              <TabsContent value="stillness" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 focus-visible:outline-none">
                <div className="p-6 bg-emerald-500/5 border-2 border-emerald-500/20 rounded-[2rem] space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/20 rounded-xl">
                      <Wind className="text-emerald-500" size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase text-white tracking-tight">Grounding Path</p>
                      <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Self-Care Mode</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed font-medium uppercase tracking-wide">
                    I love and respect my need for stillness. Access breathing tools and calming guidance.
                  </p>
                  <button 
                    onClick={() => handleSendSOS('grounding')}
                    className="w-full py-6 bg-[#10B981] text-black rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg active:scale-95 transition-all"
                  >
                    Open Stillness Tools
                  </button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t border-white/5 text-center">
              <button 
                onClick={() => { playHeartbeat(); onClose(); }}
                className="text-[#10B981] font-black text-xs uppercase tracking-[0.4em] hover:underline underline-offset-8 transition-all active:scale-95"
              >
                All is well
              </button>
            </div>
          </div>
        </ScrollArea>

        <div className="p-8 pt-4 bg-black/40 backdrop-blur-md border-t border-white/5 text-center shrink-0">
          <p className="text-[8px] font-black uppercase tracking-[0.5em] text-white/20">
            Sanctuary Support Protocol • Encrypted with Love
          </p>
        </div>
      </div>
    </div>
  );
}
