
"use client"

import { useState, useEffect } from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { LegalAgreements } from '@/app/onboarding/page';

export function Step1ImportantStuff({ onComplete }: { onComplete: (legal: LegalAgreements) => void }) {
  const [lang, setLang] = useState<'EN' | 'DE'>('EN');
  const [agreements, setAgreements] = useState({
    harmReduction: false,
    medicalAdvice: false,
    privacy: false,
    safetyNetwork: false,
  });
  
  useEffect(() => {
    const savedLang = localStorage.getItem('stayonbeat_lang');
    if (savedLang === 'DE' || savedLang === 'EN') {
      setLang(savedLang as 'EN' | 'DE');
    }
  }, []);

  const allAgreed = Object.values(agreements).every(v => v === true);

  const handleComplete = () => {
    if (!allAgreed) return;

    const legalData: LegalAgreements = {
      agreedToHarmReduction: agreements.harmReduction,
      agreedToMedicalDisclaimer: agreements.medicalAdvice,
      agreedToGDPR: agreements.privacy,
      agreedToSafetyNetwork: agreements.safetyNetwork,
      termsAcceptedAt: new Date().toISOString(),
      appVersion: "1.0.0"
    };

    onComplete(legalData);
  };

  const content = {
    EN: {
      back: "BACK",
      header: "The important stuff",
      subtext: "Please read and agree to the following",
      agree: "I agree & continue",
      understand: "I accept, respect and understand",
      sections: [
        { 
          id: 'harmReduction', 
          title: 'Harm reduction', 
          text: 'StayOnBeat is a harm reduction tool designed to provide information and support. It is not intended to encourage illegal activities.' 
        },
        { 
          id: 'medicalAdvice', 
          title: 'Not medical advice', 
          text: 'The information provided by this app is for educational purposes and does not constitute medical advice or diagnosis.' 
        },
        { 
          id: 'privacy', 
          title: 'Privacy & data (GDPR)', 
          text: 'We take your privacy seriously. Your biometric data is encrypted. We comply with GDPR standards.' 
        },
        { 
          id: 'safetyNetwork', 
          title: 'Immediate help', 
          text: 'In need of support, you can notify your Love Circle or the Awareness Team. Alerts to the Awareness Team are handled with absolute discretion and privacy, as your health and well-being are our only priority.' 
        },
      ]
    },
    DE: {
      back: "ZURÜCK",
      header: "Das Wichtigste",
      subtext: "Bitte lesen und stimme dem Folgenden zu",
      agree: "Zustimmen & weiter",
      understand: "Ich akzeptiere, respektiere und verstehe",
      sections: [
        { 
          id: 'harmReduction', 
          title: 'Schadensminimierung', 
          text: 'StayOnBeat ist ein Tool zur Schadensminimierung, das Informationen und Unterstützung bietet. Es ist nicht dazu gedacht, illegale Aktivitäten zu fördern.' 
        },
        { 
          id: 'medicalAdvice', 
          title: 'Kein medizinischer Rat', 
          text: 'Die von dieser App bereitgestellten Informationen dienen Bildungszwecken und stellen keine medizinische Beratung oder Diagnose dar.' 
        },
        { 
          id: 'privacy', 
          title: 'Datenschutz (DSGVO)', 
          text: 'Wir nehmen deine Privatsphäre ernst. Deine biometrischen Daten sind verschlüsselt. Wir halten uns an die DSGVO-Standards.' 
        },
        { 
          id: 'safetyNetwork', 
          title: 'Soforthilfe', 
          text: 'Wenn du Hilfe benötigst, kannst du deinen Love Circle oder das Awareness-Team benachrichtigen. Meldungen an das Awareness-Team werden absolut diskret und vertraulich behandelt, da deine Gesundheit und dein Wohlbefinden unsere einzige Priorität sind.' 
        },
      ]
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-xl font-headline mx-auto px-4 relative">
      <Link href="/auth" className="absolute top-0 left-4 text-white/40 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-50">
        <ArrowLeft className="w-4 h-4" /> {content[lang].back}
      </Link>

      <div className="text-center mb-6 mt-12">
        <h2 className="text-[22px] font-black uppercase mb-1 text-white leading-tight tracking-tighter">
          {content[lang].header}
        </h2>
        <p className="text-base font-bold uppercase tracking-widest text-white/40">
          {content[lang].subtext}
        </p>
      </div>

      <Accordion 
        type="single" 
        collapsible 
        className="w-full space-y-3 mb-10"
      >
        {content[lang].sections.map((item) => (
          <AccordionItem 
            key={item.id} 
            value={item.id} 
            className="border-2 border-white/10 bg-[#0a0a0a] rounded-[1.5rem] overflow-hidden px-5 py-0.5 transition-all data-[state=open]:border-[#3EB489]"
          >
            <AccordionTrigger className="hover:no-underline font-headline font-black uppercase text-left py-4 text-base tracking-tight">
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-white/70 text-sm mb-4 leading-relaxed font-bold">{item.text}</p>
              <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10 w-fit">
                <Switch 
                  id={`toggle-${item.id}`}
                  checked={agreements[item.id as keyof typeof agreements]}
                  onCheckedChange={(val) => setAgreements(prev => ({...prev, [item.id]: val}))}
                  className="data-[state=checked]:bg-[#3EB489]"
                />
                <Label htmlFor={`toggle-${item.id}`} className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3EB489] cursor-pointer">
                  {content[lang].understand}
                </Label>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <button
        onClick={handleComplete}
        disabled={!allAgreed}
        className={`pill-button w-full max-w-sm text-lg font-black uppercase tracking-[0.2em] transition-all ${
          allAgreed 
            ? 'bg-[#3EB489] text-black neon-glow active:scale-95' 
            : 'bg-white/10 text-white/10 cursor-not-allowed border-2 border-white/5'
        }`}
      >
        {content[lang].agree}
      </button>
    </div>
  );
}
