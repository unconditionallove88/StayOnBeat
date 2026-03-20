'use client';

import { useState, useEffect } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { collection, doc, serverTimestamp, getDocs } from 'firebase/firestore';
import { addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { Heart, Loader2, Sparkles, ShieldCheck, Phone, CheckCircle2, X, AlertTriangle, Navigation, Info, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @fileOverview SOSAlert Component.
 * Refined: Supports "Friend SOS" mode with professional dispatch confirmation and First Aid.
 * Framing: I love and respect my circle. Professional support is on the way.
 */

interface SOSAlertProps {
  onClose: () => void;
  friendName?: string;
  friendStatus?: string;
}

export function SOSAlert({ onClose, friendName, friendStatus }: SOSAlertProps) {
  const auth = useAuth();
  const firestore = useFirestore();
  const [step, setStep] = useState<'confirm' | 'sending' | 'sent'>('confirm');
  const [countdown, setCountdown] = useState(15);
  const isFriendMode = !!friendName;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'sent' && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    } else if (step === 'sent' && countdown === 0) {
      onClose();
    }
    return () => clearInterval(timer);
  }, [step, countdown, onClose]);

  const handleSendSOS = async (priority: 'urgent' | 'standard') => {
    if (!auth.currentUser || !firestore) return;
    
    setStep('sending');

    const userUid = auth.currentUser.uid;
    const userRef = doc(firestore, 'users', userUid);
    const globalAlertsRef = collection(firestore, 'sosAlerts');

    // Simulate notification payload
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

    if (!isFriendMode) {
      setDocumentNonBlocking(userRef, { sosActive: true }, { merge: true });
    }

    // Mock dispatch to Awareness
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
        
        {isFriendMode ? (
          <div className="space-y-6 max-w-sm">
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white leading-none">
              Professional Support <br/> <span className="text-[#10B981]">is on the way</span>
            </h1>
            <div className="bg-white/5 border border-[#10B981]/20 rounded-[2.5rem] p-8 space-y-6 text-left">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#10B981]/10 rounded-xl flex items-center justify-center border border-[#10B981]/30">
                  <Navigation className="text-[#10B981] animate-pulse" size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#10B981]">Dispatch Active</p>
                  <p className="text-sm font-bold text-white leading-tight">Staff Jay is responding.</p>
                </div>
              </div>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                ESTIMATED ARRIVAL: 3–5 MINUTES. WE HAVE THE LOCATION. 🌿
              </p>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-6 text-left space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-amber-500 flex items-center gap-2">
                <Info size={14} /> Immediate First Aid
              </h3>
              <ul className="space-y-3">
                {[
                  "Stay with them. Do not leave.",
                  "Place them in the recovery position.",
                  "Loosen tight clothing to cool them down.",
                  "Do NOT give water if they are semi-conscious."
                ].map((txt, i) => (
                  <li key={i} className="flex gap-3 text-[10px] font-bold uppercase tracking-wide text-white/60 leading-tight">
                    <span className="w-1 h-1 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                    {txt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-sm">
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white leading-none">
              I am loved <br/> <span className="text-[#10B981]">and being taken care of</span>
            </h1>
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-4 text-left">
              <div className="flex items-center gap-4 text-white/80">
                <CheckCircle2 size={18} className="text-[#10B981]" />
                <p className="text-xs font-bold uppercase tracking-widest leading-tight">Support nodes notified.</p>
              </div>
              <div className="flex items-center gap-4 text-white/80">
                <ShieldCheck size={18} className="text-[#10B981]" />
                <p className="text-xs font-bold uppercase tracking-widest leading-tight">Privacy protected.</p>
              </div>
            </div>
          </div>
        )}

        <button onClick={onClose} className="mt-10 text-white/20 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest underline underline-offset-8">
          Returning to hub in {countdown}s
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
          {isFriendMode ? `Dispatching aid for ${friendName}` : "Honoring your request for care"}
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[4000] flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-500 font-headline">
      <div className="bg-[#0a0a0a] w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] border-t-2 sm:border-2 border-white/10 p-10 pb-14 shadow-[0_-20px_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 bg-white/5 rounded-full border border-white/10 text-white/40 hover:text-white transition-all z-10"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-8">
          <div className={cn(
            "w-20 h-20 border-2 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl",
            isFriendMode ? "bg-amber-600/10 border-amber-600/30" : "bg-red-600/10 border-red-600/30"
          )}>
            {isFriendMode ? <AlertTriangle size={40} className="text-amber-500" /> : <Heart size={40} className="text-[#DC2626]" fill="#DC2626" />}
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-white leading-none">
            {isFriendMode ? "Collective Care" : "Are You Safe?"}
          </h2>
          <p className="text-white/40 text-sm font-bold mt-4 leading-tight">
            {isFriendMode ? `Initiating professional support for ${friendName}.` : "We’re here with you. Take a breath."}
          </p>
        </div>

        {isFriendMode ? (
          <div className="space-y-6">
            <div className="bg-red-600/10 border border-red-600/30 p-6 rounded-[2rem] text-center space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Intense Rhythm Detected</p>
              <p className="text-xs font-bold text-white/80 leading-relaxed uppercase">
                {friendName} is in a high-risk physiological state. Notifying the Awareness Team will dispatch professional medical support to your current tactical grid.
              </p>
            </div>
            <button 
              onClick={() => handleSendSOS('urgent')} 
              className="w-full h-24 bg-red-600 text-white rounded-[1.5rem] font-black text-xl uppercase tracking-widest transition-all active:scale-95 shadow-[0_0_40px_rgba(220,38,38,0.3)] flex flex-col items-center justify-center"
            >
              <span>NOTIFY AWARENESS TEAM</span>
              <span className="text-[8px] font-bold mt-2 opacity-60 uppercase tracking-widest">Handled with absolute discretion & privacy</span>
            </button>
          </div>
        ) : (
          <>
            <div className="mb-10 space-y-3">
              {[
                "Love guides us.",
                "Support is here.",
                "Unity brings safety."
              ].map((msg, i) => (
                <div key={i} className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#10B981]">
                  <CheckCircle2 size={14} className="text-[#10B981]" />
                  {msg}
                </div>
              ))}
            </div>

            <div className="space-y-5">
              <button 
                onClick={() => handleSendSOS('urgent')} 
                className="w-full h-24 bg-[#DC2626] text-white rounded-[1.5rem] font-black text-xl uppercase tracking-widest transition-all active:scale-95 shadow-[0_0_40px_rgba(220,38,38,0.3)] flex flex-col items-center justify-center leading-none"
              >
                <span className="flex items-center gap-3">
                  NOTIFY AWARENESS TEAM
                </span>
                <span className="text-[8px] font-bold mt-2 opacity-60 uppercase tracking-widest">Handled with absolute discretion & privacy</span>
              </button>
              
              <button 
                onClick={() => handleSendSOS('standard')} 
                className="w-full h-20 bg-[#F59E0B] text-black rounded-[1.5rem] font-black text-lg uppercase tracking-[0.1em] transition-all active:scale-95 shadow-lg shadow-amber-500/10 flex items-center justify-center gap-3"
              >
                Notify Friends
              </button>

              <div className="pt-4 text-center">
                <button 
                  onClick={onClose} 
                  className="text-[#10B981] font-black text-sm uppercase tracking-widest hover:underline underline-offset-8 transition-all active:scale-95 p-4"
                >
                  🟢 I'm okay now
                </button>
              </div>
            </div>
          </>
        )}

        <div className="mt-8 pt-8 border-t border-white/5 text-center opacity-20">
          <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white">Sanctuary Collective Care Protocol</p>
        </div>
      </div>
    </div>
  );
}
