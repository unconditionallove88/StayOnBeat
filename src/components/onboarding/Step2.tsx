
"use client"

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Identity Calibration step with full EN, DE, PT, RU support.
 * Refined RU phrasing for a more "lovable" acquaintance ritual.
 */

const CONTENT = {
  EN: {
    back: "BACK", header: "Let's get to know each other", sub: "Biometric calibration",
    text: "Your data helps us calibrate safety metrics and is stored locally",
    nameLabel: "Username", namePlaceholder: "ENTER NAME", dobLabel: "Date of birth", dobPlaceholder: "DD / MM / YYYY",
    weightLabel: "Weight (KG)", heightLabel: "Height (CM)", underageError: "Error: You must be 18+ to access",
    confirm: "Confirm & continue", skip: "Skip - no changes"
  },
  DE: {
    back: "ZURÜCK", header: "Lass uns einander kennenlernen", sub: "Biometrische Kalibrierung",
    text: "Deine Daten helfen uns, Sicherheitsmetriken zu kalibrieren, und werden lokal gespeichert",
    nameLabel: "Benutzername", namePlaceholder: "NAME EINGEBEN", dobLabel: "Geburtsdatum", dobPlaceholder: "TT / MM / JJJJ",
    weightLabel: "Gewicht (KG)", heightLabel: "Größe (CM)", underageError: "Fehler: Du musst 18+ sein, um beizutreten",
    confirm: "Bestätigen & weiter", skip: "Überspringen - keine Änderungen"
  },
  PT: {
    back: "VOLTAR", header: "Vamos nos conhecer", sub: "Calibração biométrica",
    text: "Seus dados nos ajudam a calibrar métricas de segurança e são armazenados localmente",
    nameLabel: "Nome de usuário", namePlaceholder: "DIGITE SEU NOME", dobLabel: "Data de nascimento", dobPlaceholder: "DD / MM / AAAA",
    weightLabel: "Peso (KG)", heightLabel: "Altura (CM)", underageError: "Erro: Você deve ter 18+ para acessar",
    confirm: "Confirmar e continuar", skip: "Pular - sem alterações"
  },
  RU: {
    back: "НАЗАД", header: "Давай познакомимся", sub: "Настройка твоего профиля",
    text: "Твои данные помогают нам беречь твое состояние и хранятся только у тебя",
    nameLabel: "Как тебя зовут?", namePlaceholder: "ВВЕДИТЕ ИМЯ", dobLabel: "Дата рождения", dobPlaceholder: "ДД / ММ / ГГГГ",
    weightLabel: "Вес (КГ)", heightLabel: "Рост (СМ)", underageError: "Ошибка: Тебе должно быть 18+ для доступа",
    confirm: "Продолжить", skip: "Пропустить"
  }
};

export function Step2WhoAreYou({ initialData, onComplete, onSkip, onBack }: { initialData?: any, onComplete: (profile: any) => void, onSkip?: () => void, onBack?: () => void }) {
  const [lang, setLang] = useState<'EN' | 'DE' | 'PT' | 'RU'>('EN');
  const [form, setForm] = useState({
    name: initialData?.name || '',
    dob: initialData?.dob || '', 
    weight: initialData?.weight?.toString() || '',
    height: initialData?.height?.toString() || '',
  });

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toUpperCase() as any;
    if (['EN', 'DE', 'PT', 'RU'].includes(savedLang)) setLang(savedLang);
  }, []);

  const calculateAge = (dobString: string) => {
    const parts = dobString.split(' / ');
    if (parts.length !== 3 || parts[2].length !== 4) return 0;
    const birthDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    const ref = new Date();
    let age = ref.getFullYear() - birthDate.getFullYear();
    if (ref.getMonth() < birthDate.getMonth() || (ref.getMonth() === birthDate.getMonth() && ref.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleDobInput = (val: string) => {
    const digits = val.replace(/\D/g, '').substring(0, 8);
    let f = '';
    if (digits.length > 0) {
      f += digits.substring(0, 2);
      if (digits.length > 2) f += ' / ' + digits.substring(2, 4);
      if (digits.length > 4) f += ' / ' + digits.substring(4, 8);
    }
    setForm(p => ({ ...p, dob: f }));
  };

  const t = CONTENT[lang] || CONTENT.EN;
  const weightVal = parseInt(form.weight) || 0;
  const heightVal = parseInt(form.height) || 0;
  const age = calculateAge(form.dob);
  const isFormValid = form.name && form.dob.length === 14 && weightVal >= 30 && heightVal >= 50 && age >= 18;

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-center max-w-xl font-headline mx-auto px-4 relative">
      {onBack && <button onClick={onBack} className="absolute top-0 left-4 text-white/40 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-50"><ArrowLeft className="w-4 h-4" /> {t.back}</button>}
      <div className="text-center mb-8 mt-12">
        <h2 className={cn("text-[22px] font-black uppercase mb-1 text-white tracking-tighter", lang === 'RU' && "italic font-serif")}>{t.header}</h2>
        <p className={cn("text-[#10B981] font-black uppercase tracking-[0.3em] text-[10px] mb-4", lang === 'RU' && "italic font-serif")}>{t.sub}</p>
        <p className={cn("text-[9px] font-black text-white/30 uppercase tracking-widest max-w-[280px] mx-auto leading-relaxed", lang === 'RU' && "italic font-serif")}>{t.text}</p>
      </div>
      <div className="w-full space-y-4 mb-10">
        <div className="space-y-2">
          <Label className={cn("uppercase font-black tracking-[0.3em] text-[10px] text-[#10B981] block", lang === 'RU' && "italic font-serif")}>{t.nameLabel}</Label>
          <Input 
            value={form.name} 
            onChange={(e) => setForm(p => ({...p, name: e.target.value.toUpperCase()}))} 
            className={cn("bg-[#0a0a0a] border-2 border-white/20 h-16 px-6 rounded-[1rem] focus:border-[#3EB489] text-2xl font-black uppercase text-white", lang === 'RU' && "italic font-serif")} 
            placeholder={t.namePlaceholder} 
          />
        </div>
        <div className="space-y-2">
          <Label className={cn("uppercase font-black tracking-[0.3em] text-[10px] text-[#10B981] block", lang === 'RU' && "italic font-serif")}>{t.dobLabel}</Label>
          <Input 
            type="text" 
            placeholder={t.dobPlaceholder} 
            value={form.dob} 
            onChange={(e) => handleDobInput(e.target.value)} 
            className={cn("bg-[#0a0a0a] border-2 h-16 px-6 rounded-[1rem] focus:border-[#3EB489] text-2xl font-black text-white", lang === 'RU' && "italic font-serif")} 
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className={cn("uppercase font-black tracking-[0.3em] text-[10px] text-[#10B981] block", lang === 'RU' && "italic font-serif")}>{t.weightLabel}</Label>
            <Input 
              value={form.weight} 
              onChange={(e) => setForm(p => ({...p, weight: e.target.value.replace(/\D/g, '')}))} 
              className={cn("bg-[#0a0a0a] border-2 h-16 px-6 rounded-[1rem] focus:border-[#3EB489] text-2xl font-black text-white", lang === 'RU' && "italic font-serif")} 
              placeholder="70" 
            />
          </div>
          <div className="space-y-2">
            <Label className={cn("uppercase font-black tracking-[0.3em] text-[10px] text-[#10B981] block", lang === 'RU' && "italic font-serif")}>{t.heightLabel}</Label>
            <Input 
              value={form.height} 
              onChange={(e) => setForm(p => ({...p, height: e.target.value.replace(/\D/g, '')}))} 
              className={cn("bg-[#0a0a0a] border-2 h-16 px-6 rounded-[1rem] focus:border-[#3EB489] text-2xl font-black text-white", lang === 'RU' && "italic font-serif")} 
              placeholder="175" 
            />
          </div>
        </div>
      </div>
      <button 
        onClick={() => onComplete({...form, weight: weightVal, height: heightVal, age})} 
        disabled={!isFormValid} 
        className={cn(`pill-button w-full max-w-sm text-xl font-black uppercase tracking-[0.2em] transition-all h-[64px] ${isFormValid ? 'bg-[#3EB489] text-black neon-glow active:scale-95' : 'bg-white/10 text-white/10 cursor-not-allowed opacity-50'}`, lang === 'RU' && "italic font-serif")}
      >
        {t.confirm}
      </button>
    </div>
  );
}
