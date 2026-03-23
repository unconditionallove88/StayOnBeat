"use client"

import { useState, useEffect } from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { LegalAgreements } from '@/app/onboarding/page';

/**
 * @fileOverview Foundations of Care (Agreements).
 * Full localization for EN, DE, PT, RU.
 */

const CONTENT = {
  EN: {
    back: "BACK", header: "Foundations of care", subtext: "I read and honor our shared understanding",
    agree: "I walk this path with love", understand: "I accept, respect and understand",
    sections: [
      { id: 'harmReduction', title: 'Harm reduction', text: 'StayOnBeat is a harm reduction tool designed to provide information and support It is not intended to encourage illegal activities' },
      { id: 'medicalAdvice', title: 'Not medical advice', text: 'The information provided by this sanctuary is for educational purposes and does not constitute medical advice or diagnosis' },
      { id: 'privacy', title: 'Freedom & trust (GDPR)', text: 'We take your privacy seriously Your biometric data is encrypted We honor your data sovereignty and comply with GDPR standards' },
      { id: 'safetyNetwork', title: 'Circle of love', text: 'StayOnBeat allows you to create a network of trusted bonds who can be notified in case of a need for connection or support' },
      { id: 'immediateHelp', title: 'Sanctuary support', text: 'In need of support, you can notify your Circle or the Sanctuary Holders Alerts are handled with absolute discretion and respect for your journey' },
    ]
  },
  DE: {
    back: "ZURÜCK", header: "Fundament der Fürsorge", subtext: "Ich achte unser gemeinsames Verständnis",
    agree: "Ich gehe diesen Weg mit Liebe", understand: "Ich akzeptiere, respektiere und verstehe",
    sections: [
      { id: 'harmReduction', title: 'Schadensminimierung', text: 'StayOnBeat ist ein Tool zur Schadensminimierung, das Informationen und Unterstützung bietet Es ist nicht dazu gedacht, illegale Aktivitäten zu fördern' },
      { id: 'medicalAdvice', title: 'Kein medizinischer Rat', text: 'Die von diesem Sanctuary bereitgestellten Informationen dienen Bildungszwecken und stellen keine medizinische Beratung dar' },
      { id: 'privacy', title: 'Freiheit & Vertrauen (DSGVO)', text: 'Wir nehmen deine Privatsphäre ernst Deine biometrischen Daten sind verschlüsselt Wir achten deine Datensouveränität' },
      { id: 'safetyNetwork', title: 'Circle of Love', text: 'StayOnBeat ermöglicht es dir, ein Netzwerk aus vertrauenswürdigen Verbindungen zu erstellen, die bei Bedarf informiert werden können' },
      { id: 'immediateHelp', title: 'Sanctuary Unterstützung', text: 'Wenn du Unterstützung benötigst, kannst du deinen Circle oder die Sanctuary Holders rufen Meldungen werden absolut diskret und mit Respekt behandelt' },
    ]
  },
  PT: {
    back: "VOLTAR", header: "Fundamentos do cuidado", subtext: "Eu leio e honro nosso entendimento mútuo",
    agree: "Eu sigo este caminho com amor", understand: "Eu aceito, respeito e entendo",
    sections: [
      { id: 'harmReduction', title: 'Redução de danos', text: 'StayOnBeat é uma ferramenta de redução de danos projetada para fornecer informação e suporte Não se destina a encorajar atividades ilegais' },
      { id: 'medicalAdvice', title: 'Não é aconselhamento médico', text: 'As informações fornecidas por este santuário são para fins educacionais e não constituem aconselhamento médico ou diagnóstico' },
      { id: 'privacy', title: 'Liberdade e confiança (LGPD)', text: 'Levamos sua privacidade a sério Seus dados biométricos são criptografados Honramos sua soberania de dados' },
      { id: 'safetyNetwork', title: 'Círculo de amor', text: 'StayOnBeat permite que você crie uma rede de vínculos confiáveis que podem ser notificados em caso de necessidade' },
      { id: 'immediateHelp', title: 'Suporte do santuário', text: 'Em caso de necessidade, você pode notificar seu Círculo ou os Guardiões do Santuário Alertas são tratados com absoluta discrição' },
    ]
  },
  RU: {
    back: "НАЗАД", header: "Фундамент заботы", subtext: "Я читаю и принимаю наше общее понимание",
    agree: "Я иду по этому пути с любовью", understand: "Я принимаю, уважаю и понимаю",
    sections: [
      { id: 'harmReduction', title: 'Снижение вреда', text: 'StayOnBeat — это инструмент снижения вреда для предоставления информации и поддержки Он не предназначен для поощрения незаконной деятельности' },
      { id: 'medicalAdvice', title: 'Не является медсоветом', text: 'Информация предоставляется в образовательных целях и не является медицинской консультацией или диагнозом' },
      { id: 'privacy', title: 'Свобода и доверие (GDPR)', text: 'Мы серьезно относимся к вашей приватности Ваши биометрические данные зашифрованы Мы уважаем ваш суверенитет над данными' },
      { id: 'safetyNetwork', title: 'Круг любви', text: 'StayOnBeat позволяет создать сеть доверенных связей которые могут быть уведомлены в случае необходимости' },
      { id: 'immediateHelp', title: 'Поддержка пространства', text: 'При необходимости вы можете уведомить свой Круг или Команду Пространства Оповещения обрабатываются конфиденциально' },
    ]
  }
};

export function Step1ImportantStuff({ onComplete }: { onComplete: (legal: LegalAgreements) => void }) {
  const [lang, setLang] = useState<'EN' | 'DE' | 'PT' | 'RU'>('EN');
  const [agreements, setAgreements] = useState({
    harmReduction: false, medicalAdvice: false, privacy: false, safetyNetwork: false, immediateHelp: false,
  });
  
  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toUpperCase() as any;
    if (['EN', 'DE', 'PT', 'RU'].includes(savedLang)) setLang(savedLang);
  }, []);

  const t = CONTENT[lang] || CONTENT.EN;
  const allAgreed = Object.values(agreements).every(v => v === true);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-xl font-headline mx-auto px-4 relative">
      <Link href="/auth" className="absolute top-0 left-4 text-white/40 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-50">
        <ArrowLeft className="w-4 h-4" /> {t.back}
      </Link>
      <div className="text-center mb-6 mt-12">
        <h2 className="text-[22px] font-black uppercase mb-1 text-white leading-tight tracking-tighter">{t.header}</h2>
        <p className="text-base font-bold uppercase tracking-widest text-white/40">{t.subtext}</p>
      </div>
      <Accordion type="single" collapsible className="w-full space-y-3 mb-10">
        {t.sections.map((item) => (
          <AccordionItem key={item.id} value={item.id} className="border-2 border-white/10 bg-[#0a0a0a] rounded-[1.5rem] px-5 py-0.5 transition-all data-[state=open]:border-[#3EB489]">
            <AccordionTrigger className="hover:no-underline font-headline font-black uppercase text-left py-4 text-base tracking-tight">{item.title}</AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-white/70 text-sm mb-4 leading-relaxed font-bold">{item.text}</p>
              <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10 w-fit">
                <Switch checked={agreements[item.id as keyof typeof agreements]} onCheckedChange={(val) => setAgreements(prev => ({...prev, [item.id]: val}))} className="data-[state=checked]:bg-[#3EB489]" />
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3EB489] cursor-pointer">{t.understand}</Label>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <button onClick={() => onComplete({ agreedToHarmReduction: agreements.harmReduction, agreedToMedicalDisclaimer: agreements.medicalAdvice, agreedToGDPR: agreements.privacy, agreedToSafetyNetwork: agreements.safetyNetwork, agreedToImmediateHelp: agreements.immediateHelp, termsAcceptedAt: new Date().toISOString(), appVersion: "1.0.0" })} disabled={!allAgreed} className={`pill-button w-full max-w-sm text-lg font-black uppercase tracking-[0.2em] transition-all ${allAgreed ? 'bg-[#3EB489] text-black neon-glow active:scale-95' : 'bg-white/10 text-white/10 cursor-not-allowed border-2 border-white/5'}`}>{t.agree}</button>
    </div>
  );
}
