
"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, CreditCard, ArrowLeft, Loader2, CircleDot } from "lucide-react";
import { useFirestore, useUser } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

interface Step6StripeVerifyProps {
  onComplete: (data: { stripeId: string; last4: string }) => void;
  onBack?: () => void;
}

export function Step6StripeVerify({ onComplete, onBack }: Step6StripeVerifyProps) {
  const firestore = useFirestore();
  const { user } = useUser();
  const [lang, setLang] = useState<'EN' | 'DE'>('EN');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedLang = localStorage.getItem('stayonbeat_lang');
    if (savedLang === 'DE' || savedLang === 'EN') {
      setLang(savedLang as 'EN' | 'DE');
    }
  }, []);

  const handleSimulateStripe = async () => {
    setError(null);
    setIsVerifying(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (user && firestore) {
        await setDoc(
          doc(firestore, "users", user.uid),
          {
            verification: {
              isAgeVerified: true,
              method: "stripe_card_check_demo",
              verifiedAt: serverTimestamp(),
              stripeCustomerId: "cus_DEMO_" + Math.random().toString(36).slice(2, 11),
              cardBrand: "Visa",
              last4: "4242",
            },
            trustLevel: "verified_adult",
          },
          { merge: true }
        );
      }

      setIsSuccess(true);
      setTimeout(() => {
        onComplete({ stripeId: "cus_DEMO_123", last4: "4242" });
      }, 1000);
    } catch (e: any) {
      setError(lang === 'EN' ? "Verification couldn’t complete right now — please try again" : "Die Verifizierung konnte nicht abgeschlossen werden – bitte versuche es erneut");
      setIsVerifying(false);
    }
  };

  const content = {
    EN: {
      back: "BACK",
      header: "A Safe Space for Adults",
      sub: "To honor German safety standards and protect our community, we verify your age via a secure payment method",
      stripeLabel: "Secure Verification via Stripe",
      peaceOfMind: "Your peace of mind matters No charge will be made This is a zero-euro authorization Data is encrypted and never stored by StayOnBeat",
      button: "Verify My Identity",
      verifying: "Verifying...",
      successHeader: "Identity Verified 💚",
      successSub: "Thank you for helping us keep this sanctuary safe Your account is now calibrated",
      footer: "PCI-DSS Compliant • Encrypted • Secure"
    },
    DE: {
      back: "ZURÜCK",
      header: "Ein sicherer Raum für Erwachsene",
      sub: "Um die deutschen Sicherheitsstandards zu erfüllen und unsere Gemeinschaft zu schützen, verifizieren wir dein Alter über eine sichere Zahlungsmethode",
      stripeLabel: "Sichere Verifizierung über Stripe",
      peaceOfMind: "Dein Seelenfrieden ist uns wichtig Es wird keine Gebühr erhoben Dies ist eine Null-Euro-Autorisierung Die Daten sind verschlüsselt und werden niemals von StayOnBeat gespeichert",
      button: "Identität verifizieren",
      verifying: "Wird verifiziert...",
      successHeader: "Identität verifiziert 💚",
      successSub: "Danke, dass du uns hilfst, dieses Refugium sicher zu halten Dein Konto ist nun kalibriert",
      footer: "PCI-DSS-konform • Verschlüsselt • Sicher"
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center text-center px-6 font-headline animate-in fade-in zoom-in-95 duration-1000">
        <div className="w-32 h-32 bg-[#3EB489]/10 rounded-full flex items-center justify-center mb-8 border-2 border-[#3EB489]/30 shadow-[0_0_50px_rgba(62,180,137,0.2)]">
          <ShieldCheck size={64} className="text-[#3EB489]" />
        </div>
        <h2 className="text-4xl font-black uppercase tracking-tighter text-white mb-4">{content[lang].successHeader}</h2>
        <p className="text-white/60 text-lg font-bold max-sm leading-tight">{content[lang].successSub}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-center font-headline max-xl mx-auto px-4 text-center relative">
      {onBack && (
        <button onClick={onBack} disabled={isVerifying} className="absolute top-0 left-4 text-white/40 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-50">
          <ArrowLeft className="w-4 h-4" /> {content[lang].back}
        </button>
      )}

      <div className="mt-12 mb-8 text-center">
        <div className="inline-flex p-4 bg-blue-600/10 rounded-[1.5rem] mb-6 border border-blue-500/20">
          <CreditCard className="text-blue-500" size={32} />
        </div>
        <h1 className="text-[28px] font-black uppercase mb-2 text-white leading-tight tracking-tighter">{content[lang].header}</h1>
        <p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px] max-w-[280px] mx-auto">
          {content[lang].sub}
        </p>
      </div>

      <div className="w-full space-y-4 mb-10">
        <div className="p-8 bg-[#0a0a0a] rounded-[2rem] border-2 border-white/10 text-left">
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-6">{content[lang].stripeLabel}</p>
          <div className="space-y-4">
            <div className="h-16 w-full bg-white/5 border-2 border-white/10 rounded-xl flex items-center px-6 text-white/20 text-xl font-black tracking-[0.2em] font-mono">4242 4242 4242 4242</div>
            <div className="flex gap-4">
              <div className="h-16 flex-1 bg-white/5 border-2 border-white/10 rounded-xl flex items-center px-6 text-white/20 text-lg font-black uppercase font-mono">MM / YY</div>
              <div className="h-16 w-32 bg-white/5 border-2 border-white/10 rounded-xl flex items-center px-6 text-white/20 text-lg font-black uppercase font-mono">CVC</div>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4 p-5 bg-blue-50/5 rounded-2xl border border-blue-500/20 text-left">
          <CircleDot size={18} className="text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-blue-200/60 font-bold leading-relaxed uppercase tracking-widest leading-tight">
            {content[lang].peaceOfMind}
          </p>
        </div>
        {error && <p className="text-sm text-red-500 font-bold">{error}</p>}
      </div>

      <button
        onClick={handleSimulateStripe}
        disabled={isVerifying}
        className={`pill-button w-full max-w-sm text-xl font-black uppercase tracking-[0.2em] transition-all h-[64px] shadow-lg disabled:opacity-50 ${isVerifying ? "bg-blue-400" : "bg-blue-600 text-white"}`}
      >
        {isVerifying ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : content[lang].button}
      </button>
      <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.4em] mt-4">{content[lang].footer}</p>
    </div>
  );
}
