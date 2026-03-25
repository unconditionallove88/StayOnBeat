"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  useAuth, 
  useFirestore, 
  useUser, 
  useDoc, 
  useMemoFirebase, 
  updateDocumentNonBlocking 
} from "@/firebase";
import { doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { 
  Heart, 
  User, 
  Shield, 
  Bell, 
  ArrowLeft, 
  CheckCircle2, 
  Leaf,
  Lock,
  ChevronRight,
  Loader2,
  ShieldCheck,
  HelpCircle,
  Activity
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CoCreation } from "@/components/dashboard/CoCreation";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Your Sanctuary (Profile Page).
 * Full localization for EN, DE, PT, RU.
 * Replaced CircleDot with ShieldCheck.
 */

const CONTENT = {
  en: {
    sanctuary: "Sanctuary", entering: "Entering sanctuary", reflection: "Your profile reflects your light",
    greeting: "You are exactly where you need to be", essence: "Your Essence", name: "Username",
    weight: "Weight (kg)", height: "Height (cm)", circle: "Circle of Love", trusted: "Trusted Bonds",
    resonant: "Resonant contacts", reminders: "Heart Reminders", checkins: "Daily check-ins active",
    journey: "Your journey is your own We use high-fidelity encryption to ensure your sanctuary remains private and your soul free",
    promise: "Our Promise of Freedom and Trust", logout: "Step away for a moment",
    privacy: {
      title: "Freedom & Trust",
      sovereignty: "Data Sovereignty",
      sovereigntyDesc: "I love and respect my privacy My data is my own StayOnBeat is built on the principle that your personal journey is a sacred trust",
      encryption: "High-Fidelity Encryption",
      encryptionDesc: "All biometric signals health profiles and location logs are protected by high-fidelity encryption We ensure that your sensitive information is visible only to you and those you explicitly trust",
      freedom: "Inner Freedom",
      freedomDesc: "We never sell rent or trade your data Your resonance remains within the sanctuary Our mission is pure support love care and harm reduction",
      acceptance: "Unconditional Acceptance",
      acceptanceDesc: "We collect only the information necessary to keep you safe and provide high-fidelity support Every data point is used to calibrate your protection and nurture your well-being",
      questions: "Have more questions?", qBtn: "Questions?", footer: "Encrypted with Love • Protected by Sanctuary Protocol"
    }
  },
  de: {
    sanctuary: "Sanctuary", entering: "Eintritt...", reflection: "Dein Profil spiegelt dein Licht wider",
    greeting: "Du bist genau dort, wo du sein musst", essence: "Deine Essenz", name: "Benutzername",
    weight: "Gewicht (kg)", height: "Größe (cm)", circle: "Circle of Love", trusted: "Vertrauenswürdige Bindungen",
    resonant: "Resonante Kontakte", reminders: "Heart Reminders", checkins: "Tägliche Check-ins aktiv",
    journey: "Deine Reise gehört dir allein Wir nutzen High-Fidelity-Verschlüsselung um sicherzustellen dass dein Sanctuary privat und deine Seele frei bleibt",
    promise: "Unser Versprechen von Freiheit und Vertrauen", logout: "Einen Moment heraustreten",
    privacy: {
      title: "Freiheit & Vertrauen",
      sovereignty: "Datensouveränität",
      sovereigntyDesc: "Ich achte meine Privatsphäre Meine Daten gehören mir StayOnBeat baut auf dem Prinzip auf dass deine persönliche Reise ein heiliges Vertrauen ist",
      encryption: "High-Fidelity-Verschlüsselung",
      encryptionDesc: "Alle biometrischen Signale Gesundheitsprofile und Standortprotokolle sind geschützt Wir stellen sicher dass deine sensiblen Informationen nur für dich und deine Vertrauten sichtbar sind",
      freedom: "Innere Freiheit",
      freedomDesc: "Wir verkaufen oder handeln niemals mit deinen Daten Deine Resonanz bleibt im Sanctuary Unsere Mission ist reine Unterstützung Liebe Fürsorge und Schadensminimierung",
      acceptance: "Bedingungslose Akzeptanz",
      acceptanceDesc: "Wir sammeln nur Informationen die notwendig sind um dich sicher zu halten Jeder Datenpunkt dient dazu deinen Schutz zu kalibrieren und dein Wohlbefinden zu fördern",
      questions: "Hast du noch Fragen?", qBtn: "Fragen?", footer: "Verschlüsselt mit Liebe • Sanctuary-Protokoll"
    }
  },
  pt: {
    sanctuary: "Santuário", entering: "Entrando no santuário", reflection: "Seu perfil reflete sua luz",
    greeting: "Você está exatamente onde precisa estar", essence: "Sua Essência", name: "Nome de usuário",
    weight: "Peso (kg)", height: "Altura (cm)", circle: "Círculo de Amor", trusted: "Vínculos de Confiança",
    resonant: "Contatos ressonantes", reminders: "Lembretes do Coração", checkins: "Check-ins diários ativos",
    journey: "Sua jornada é sua Usamos criptografia de alta fidelidade para garantir que seu santuário permaneça privado e sua alma livre",
    promise: "Nossa Promessa de Liberdade e Confiança", logout: "Sair por um momento",
    privacy: {
      title: "Liberdade e Confiança",
      sovereignty: "Soberania de Dados",
      sovereigntyDesc: "Eu amo e respeito minha privacidade Meus dados são meus StayOnBeat é construído no princípio de que sua jornada pessoal é um pacto sagrado",
      encryption: "Criptografia de Alta Fidelidade",
      encryptionDesc: "Todos os sinais biométricos perfis de saúde e logs de localização são protegidos Garantimos que suas informações sensíveis sejam visíveis apenas para você e quem você confiar",
      freedom: "Liberdade Interior",
      freedomDesc: "Nunca vendemos ou trocamos seus dados Sua ressonância permanece no santuário Nossa missão é puro suporte amor cuidado e redução de danos",
      acceptance: "Aceitação Incondicional",
      acceptanceDesc: "Coletamos apenas as informações necessárias para manter você seguro Cada dado é usado para calibrar sua proteção e nutrir seu bem-estar",
      questions: "Tem mais perguntas?", qBtn: "Dúvidas?", footer: "Criptografado com Amor • Protocolo do Santuário"
    }
  },
  ru: {
    sanctuary: "Пространство", entering: "Вход в пространство", reflection: "Твой профиль отражает твой свет",
    greeting: "Ты именно там где должен быть", essence: "Твоя Сущность", name: "Имя пользователя",
    weight: "Вес (кг)", height: "Рост (см)", circle: "Круг Любви", trusted: "Доверенные связи",
    resonant: "Резонансные контакты", reminders: "Напоминания сердца", checkins: "Ежедневные проверки активны",
    journey: "Твой путь принадлежит тебе Мы используем шифрование высокой четкости чтобы твое пространство оставалось приватным а душа свободной",
    promise: "Наше обещание Свободы и Доверия", logout: "Выйти на мгновение",
    privacy: {
      title: "Свобода и Доверие",
      sovereignty: "Суверенитет данных",
      sovereigntyDesc: "Я люблю и уважаю свою приватность Мои данные принадлежат мне StayOnBeat построен на принципе того что твой личный путь — это священное доверие",
      encryption: "Шифрование высокой четкости",
      encryptionDesc: "Все биометрические сигналы профили здоровья и журналы местоположения защищены Мы гарантируем что твоя информация видна только тебе и тем кому ты доверяешь",
      freedom: "Внутренняя свобода",
      freedomDesc: "Мы никогда не продаем твои данные Твой резонанс остается внутри пространства Наша миссия — поддержка любовь забота и снижение вреда",
      acceptance: "Безусловное принятие",
      acceptanceDesc: "Мы собираем только ту информацию которая необходима для твоей безопасности Каждая точка данных используется для калибровки твоей защиты",
      questions: "Остались вопросы?", qBtn: "Вопросы?", footer: "Зашифровано с любовью • Протокол Пространства"
    }
  }
};

export default function ProfilePage() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const [successMessage, setSuccessMessage] = useState("");
  const [mounted, setMounted] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [coCreationOpen, setCoCreationOpen] = useState(false);
  const [lang, setLang] = useState<'en' | 'de' | 'pt' | 'ru'>('en');

  useEffect(() => {
    setMounted(true);
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de', 'pt', 'ru'].includes(savedLang)) setLang(savedLang);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.replace("/auth");
    });
    return () => unsubscribe();
  }, [auth, router]);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: profile, isLoading } = useDoc(userDocRef);
  const t = CONTENT[lang as keyof typeof CONTENT] || CONTENT.en;

  const handleUpdate = (updates: any) => {
    if (!user || !firestore || !userDocRef) return;
    updateDocumentNonBlocking(userDocRef, updates);
    setSuccessMessage(t.reflection);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  if (!mounted || isUserLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center space-y-8">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 w-32 h-32 bg-white/10 blur-[60px] rounded-full" />
            <Heart size={64} fill="#10B981" stroke="#10B981" className="relative z-10 animate-pulse-heart" />
          </div>
          <p className={cn("text-[#10B981] font-black uppercase tracking-[0.4em] text-xs", lang === 'ru' && "italic font-serif")}>{t.entering}</p>
        </div>
      </div>
    );
  }

  const displayName = profile?.name || (lang === 'ru' ? "ЦЕННАЯ ДУША" : lang === 'pt' ? "ALMA VALORIZADA" : "VALUED SOUL");

  return (
    <main className="min-h-screen bg-black text-white font-headline pb-32">
      <nav className="bg-black/90 backdrop-blur-2xl border-b border-white/5 px-6 py-8 sticky top-0 z-[100]">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button onClick={() => router.push("/dashboard")} className="p-3 bg-white/5 rounded-full border border-white/10 hover:border-[#10B981] transition-all"><ArrowLeft className="w-5 h-5 text-white/40" /></button>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-[#10B981]/10 border border-[#10B981]/30 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span className={cn("text-[10px] font-black uppercase text-[#10B981] tracking-widest", lang === 'ru' && "italic font-serif")}>{t.sanctuary}</span>
          </div>
        </div>
      </nav>

      <div className="px-6 py-10 max-xl mx-auto space-y-10">
        <section className="text-center space-y-6">
          <div className="relative inline-block">
            <div className="w-28 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto border-2 border-white/10 shadow-2xl relative overflow-hidden group">
              <User size={48} className="text-white/20 group-hover:text-[#10B981] transition-colors" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10B981]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className={cn("text-4xl font-black uppercase tracking-tighter leading-none", lang === 'ru' && "italic font-serif")}>{displayName}</h2>
            <p className={cn("text-[#10B981] text-[10px] font-black uppercase tracking-[0.4em]", lang === 'ru' && "italic font-serif")}>{t.greeting}</p>
          </div>
        </section>

        {successMessage && (
          <div className={cn("fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-[#10B981] text-black px-6 py-3 rounded-full flex items-center gap-3 animate-in slide-in-from-top-4 duration-500 shadow-2xl font-black uppercase text-[10px] tracking-widest", lang === 'ru' && "italic font-serif")}>
            <CheckCircle2 size={16} />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-white/5 rounded-[2.5rem] border border-white/10 p-8 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/5 blur-3xl -z-10" />
            <h3 className={cn("text-[10px] font-black text-[#10B981] uppercase tracking-[0.3em] flex items-center gap-3", lang === 'ru' && "italic font-serif")}><Leaf size={14} className="text-[#10B981]" /> {t.essence}</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className={cn("text-[10px] font-black uppercase text-[#10B981] tracking-widest ml-1", lang === 'ru' && "italic font-serif")}>{t.name}</label>
                <input type="text" defaultValue={profile?.name} onBlur={(e) => handleUpdate({ name: e.target.value.toUpperCase() })} className={cn("w-full h-16 px-6 bg-white/5 border border-white/10 rounded-2xl focus:border-[#10B981] outline-none transition-all text-xl font-black uppercase placeholder:text-white/10", lang === 'ru' && "italic font-serif")} placeholder="ENTER NAME" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className={cn("text-[10px] font-black uppercase text-[#10B981] tracking-widest ml-1", lang === 'ru' && "italic font-serif")}>{t.weight}</label>
                  <input type="number" defaultValue={profile?.biometrics?.weightKg} onBlur={(e) => handleUpdate({ "biometrics.weightKg": Number(e.target.value) })} className={cn("w-full h-16 px-6 bg-white/5 border border-white/10 rounded-2xl focus:border-[#10B981] outline-none text-xl font-black", lang === 'ru' && "italic font-serif")} placeholder="70" />
                </div>
                <div className="space-y-2">
                  <label className={cn("text-[10px] font-black uppercase text-[#10B981] tracking-widest ml-1", lang === 'ru' && "italic font-serif")}>{t.height}</label>
                  <input type="number" defaultValue={profile?.biometrics?.heightCm} onBlur={(e) => handleUpdate({ "biometrics.heightCm": Number(e.target.value) })} className={cn("w-full h-16 px-6 bg-white/5 border border-white/10 rounded-2xl focus:border-[#10B981] outline-none text-xl font-black", lang === 'ru' && "italic font-serif")} placeholder="175" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-[2.5rem] border border-white/10 p-8 space-y-6">
            <h3 className={cn("text-[10px] font-black text-[#10B981] uppercase tracking-[0.3em] flex items-center gap-3", lang === 'ru' && "italic font-serif")}><Shield size={14} className="text-[#10B981]" /> {t.circle}</h3>
            <button onClick={() => router.push("/safety-network")} className="w-full flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-[#10B981]/30 transition-all group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#10B981]/10 rounded-xl group-hover:scale-110 transition-transform"><Heart size={24} className="text-[#10B981]" /></div>
                <div className="text-left"><span className={cn("block font-black text-sm uppercase tracking-tight", lang === 'ru' && "italic font-serif")}>{t.trusted}</span><span className={cn("text-[8px] font-bold text-white/30 uppercase tracking-widest", lang === 'ru' && "italic font-serif")}>{t.resonant}</span></div>
              </div>
              <ChevronRight size={16} className="text-white/20 group-hover:text-[#10B981]" />
            </button>
            <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-xl"><Bell size={24} className="text-blue-400" /></div>
                <div className="text-left"><span className={cn("block font-black text-sm uppercase tracking-tight", lang === 'ru' && "italic font-serif")}>{t.reminders}</span><span className={cn("text-[8px] font-bold text-white/30 uppercase tracking-widest", lang === 'ru' && "italic font-serif")}>{t.checkins}</span></div>
              </div>
              <div className="w-12 h-6 bg-[#10B981] rounded-full relative cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"><div className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full" /></div>
            </div>
          </div>

          <div className="bg-white/5 rounded-[2.5rem] border border-white/10 p-8 text-center space-y-6">
             <div className="flex justify-center"><Lock size={24} className="text-white/10" /></div>
             <p className={cn("text-[10px] text-white/30 font-bold uppercase tracking-widest leading-relaxed", lang === 'ru' && "italic font-serif")}>{t.journey}</p>
             <button onClick={() => setPrivacyOpen(true)} className={cn("text-[8px] font-black text-[#10B981] uppercase tracking-[0.3em] hover:underline underline-offset-8", lang === 'ru' && "italic font-serif")}>{t.promise}</button>
          </div>

          <button onClick={() => auth.signOut().then(() => router.push("/"))} className={cn("w-full py-6 bg-red-600/10 border border-red-600/20 text-red-500 text-xs font-black uppercase tracking-[0.4em] hover:bg-red-600/20 rounded-[2rem] transition-all", lang === 'ru' && "italic font-serif")}>{t.logout}</button>
        </div>
      </div>

      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="bg-[#050505] border-white/10 max-lg p-0 rounded-[3rem] overflow-hidden flex flex-col font-headline h-[90vh] max-h-[90vh]">
          <DialogTitle className="sr-only">Privacy Policy</DialogTitle>
          <div className="p-8 pb-4 shrink-0">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-[#10B981]/10 rounded-2xl flex items-center justify-center border border-[#10B981]/20"><ShieldCheck size={32} className="text-[#10B981]" /></div>
              <DialogTitle className={cn("text-2xl font-black uppercase tracking-tighter text-white", lang === 'ru' && "italic font-serif")}>{t.privacy.title}</DialogTitle>
            </div>
          </div>
          <ScrollArea className="flex-1 px-8 pb-6 touch-pan-y">
            <div className="space-y-8">
              <section className="space-y-3"><h4 className={cn("text-[10px] font-black uppercase tracking-[0.4em] text-[#10B981]", lang === 'ru' && "italic font-serif")}>{t.privacy.sovereignty}</h4><p className={cn("text-sm font-bold text-white/60 leading-relaxed uppercase tracking-widest", lang === 'ru' && "italic font-serif")}>{t.privacy.sovereigntyDesc}</p></section>
              <section className="space-y-3"><h4 className={cn("text-[10px] font-black uppercase tracking-[0.4em] text-[#10B981]", lang === 'ru' && "italic font-serif")}>{t.privacy.encryption}</h4><p className={cn("text-sm font-bold text-white/60 leading-relaxed uppercase tracking-widest", lang === 'ru' && "italic font-serif")}>{t.privacy.encryptionDesc}</p></section>
              <section className="space-y-3"><h4 className={cn("text-[10px] font-black uppercase tracking-[0.4em] text-[#10B981]", lang === 'ru' && "italic font-serif")}>{t.privacy.freedom}</h4><p className={cn("text-sm font-bold text-white/60 leading-relaxed uppercase tracking-widest", lang === 'ru' && "italic font-serif")}>{t.privacy.freedomDesc}</p></section>
              <section className="space-y-3"><h4 className={cn("text-[10px] font-black uppercase tracking-[0.4em] text-[#10B981]", lang === 'ru' && "italic font-serif")}>{t.privacy.acceptance}</h4><p className={cn("text-sm font-bold text-white/60 leading-relaxed uppercase tracking-widest", lang === 'ru' && "italic font-serif")}>{t.privacy.acceptanceDesc}</p></section>
              <section className="pt-10 border-t border-white/5 text-center space-y-6 pb-8">
                <div className="flex flex-col items-center gap-2"><p className={cn("text-[10px] text-white/20 font-bold uppercase tracking-widest", lang === 'ru' && "italic font-serif")}>{t.privacy.questions}</p><button onClick={() => { setPrivacyOpen(false); setCoCreationOpen(true); }} className={cn("flex items-center gap-3 bg-[#10B981]/10 border border-[#10B981]/20 px-8 py-4 rounded-2xl text-[10px] font-black text-[#10B981] uppercase tracking-[0.4em] hover:bg-[#10B981]/20 transition-all active:scale-95", lang === 'ru' && "italic font-serif")}><HelpCircle size={14} /> {t.privacy.qBtn}</button></div>
                <p className={cn("text-[8px] font-black text-[#10B981] uppercase tracking-[0.5em]", lang === 'ru' && "italic font-serif")}>{t.privacy.footer}</p>
              </section>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={coCreationOpen} onOpenChange={setCoCreationOpen}>
        <DialogContent className="bg-black border-white/10 max-lg p-0 rounded-[3rem] overflow-hidden">
          <DialogTitle className="sr-only">Co-Creation</DialogTitle>
          <CoCreation onComplete={() => setCoCreationOpen(false)} />
        </DialogContent>
      </Dialog>
    </main>
  );
}
