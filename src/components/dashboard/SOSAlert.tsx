
'use client';

import { useState, useEffect } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { collection, doc, serverTimestamp, getDocs } from 'firebase/firestore';
import { addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { Heart, Loader2, Sparkles, ShieldCheck, Phone, CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const SAFETY_LAYER_MESSAGES = [
  "Love and respect guide this moment.",
  "Acceptance and support are present.",
  "Unity ensures safety for all."
];

const LOVE_MESSAGES = [
  "I love, accept and respect myself and everyone unconditionally.",
  "Love and purity are my foundation.",
  "Acceptance flows through this sanctuary.",
  "I honor the light and purity in every soul.",
  "Unity and support define this circle.",
];

interface SOSAlertProps {
  onClose: () => void;
}

export function SOSAlert({ onClose }: SOSAlertProps) {
  const auth = useAuth();
  const firestore = useFirestore();
  const [step, setStep] = useState<'confirm' | 'sending' | 'sent'>('confirm');
  const [loveMessage] = useState(() => LOVE_MESSAGES[Math.floor(Math.random() * LOVE_MESSAGES.length)]);
  const [countdown, setCountdown] = useState(10);

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
    
    if (priority === 'urgent') {
      window.location.href = 'tel:112'; 
    }

    setStep('sending');

    const userUid = auth.currentUser.uid;
    const userRef = doc(firestore, 'users', userUid);
    const localEventsRef = collection(firestore, 'users', userUid, 'sosEvents');
    const globalAlertsRef = collection(firestore, 'sosAlerts');
    const networkRef = collection(firestore, 'users', userUid, 'safetyNetwork');

    addDocumentNonBlocking(localEventsRef, {
      triggeredAt: serverTimestamp(),
      status: 'sent',
      priority: priority,
      message: `User triggered ${priority === 'urgent' ? 'EMERGENCY' : 'CARE'} support alert - Sanctuary UX Protocol`,
      resolvedAt: null,
    });

    setDocumentNonBlocking(userRef, { sosActive: true }, { merge: true });

    try {
      const snap = await getDocs(networkRef);
      snap.docs.forEach((contactDoc) => {
        const contactData = contactDoc.data();
        addDocumentNonBlocking(globalAlertsRef, {
          fromUid: userUid,
          toContact: {
            name: contactData.name,
            phone: contactData.phone,
          },
          sentAt: serverTimestamp(),
          status: 'pending_delivery',
          priority: priority,
          message: priority === 'urgent' 
            ? 'URGENT EMERGENCY: Your person has requested immediate help and is calling emergency services.' 
            : 'CARE ALERT: Your person needs support. They are safe but need your presence.',
        });
      });
    } catch (e) {
      console.error("Failed to dispatch global alerts:", e);
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
        <h1 className="text-4xl font-black uppercase tracking-tighter text-white mb-4 leading-none">
          I am loved <br/> <span className="text-[#10B981]">and being taken care of</span>
        </h1>
        <p className="text-white/60 text-lg font-bold mb-10 leading-tight max-xs italic">
          "{loveMessage}"
        </p>
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 w-full max-w-sm mb-8 space-y-4 text-left">
          <div className="flex items-center gap-4 text-white/80">
            <CheckCircle2 size={18} className="text-[#10B981]" />
            <p className="text-xs font-bold uppercase tracking-widest leading-tight">Your circle has been notified.</p>
          </div>
          <div className="flex items-center gap-4 text-white/80">
            <ShieldCheck size={18} className="text-[#10B981]" />
            <p className="text-xs font-bold uppercase tracking-widest leading-tight">Awareness staff are aware.</p>
          </div>
        </div>
        <button onClick={onClose} className="text-white/20 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest underline underline-offset-8">
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
        <p className="text-[#10B981] font-black uppercase tracking-[0.3em] text-[10px]">Honoring your request for care</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[4000] flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-500 font-headline">
      <div className="bg-[#0a0a0a] w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] border-t-2 sm:border-2 border-white/10 p-10 pb-14 shadow-[0_-20px_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#DC2626]/20 to-transparent" />
        
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 bg-white/5 rounded-full border border-white/10 text-white/40 hover:text-white transition-all z-10"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-600/10 border-2 border-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(220,38,38,0.1)]">
            <Heart size={40} className="text-[#DC2626]" fill="#DC2626" />
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-white leading-none">Are You Safe?</h2>
          <p className="text-white/40 text-sm font-bold mt-4 leading-tight">
            We’re here with you. Take a breath.
          </p>
        </div>

        <div className="mb-10 space-y-3">
          {SAFETY_LAYER_MESSAGES.map((msg, i) => (
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
              🔴 CALL FOR HELP NOW
            </span>
            <span className="text-[8px] font-bold mt-2 opacity-60 uppercase tracking-widest">Triggers Emergency Services & Care Team</span>
          </button>
          
          <button 
            onClick={() => handleSendSOS('standard')} 
            className="w-full h-20 bg-[#F59E0B] text-black rounded-[1.5rem] font-black text-lg uppercase tracking-[0.1em] transition-all active:scale-95 shadow-lg shadow-amber-500/10 flex items-center justify-center gap-3"
          >
            🫶 Notify Care Team
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

        <div className="mt-8 pt-8 border-t border-white/5 text-center opacity-20">
          <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white">StayOnBeat Safety Protocol Active</p>
        </div>
      </div>
    </div>
  );
}
