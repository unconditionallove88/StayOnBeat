
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useAuth, useFirestore } from "@/firebase";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { signInAnonymously } from "firebase/auth";
import { doc, serverTimestamp } from "firebase/firestore";
import { Eye, EyeOff, Loader2, ShieldCheck, ChevronLeft, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Access Sanctuary (Auth) Page.
 * Added Portuguese (Brazilian) and Russian support.
 * Unified ethereal blurry pulsating heart.
 */

const CONTENT = {
  en: {
    welcome: "Welcome Home", create: "Create Sanctuary", prototype: "Prototype Mode Active 🔒",
    emailLabel: "Email Address", emailPlaceholder: "soul@stayonbeat.com",
    passwordLabel: "Password", passwordPlaceholder: "••••••••",
    entering: "Entering...", begin: "Begin Journey", enter: "Enter Sanctuary",
    alreadyAccount: "Already have an account? Sign In", newHere: "New here? Join the circle",
    staffAccess: "StayOnBeat • Staff Access via awareness@love.com", errorMsg: "The sanctuary is calibrating please try again"
  },
  de: {
    welcome: "Willkommen Zuhause", create: "Sanctuary erstellen", prototype: "Prototyp-Modus Aktiv 🔒",
    emailLabel: "E-Mail-Adresse", emailPlaceholder: "seele@stayonbeat.com",
    passwordLabel: "Passwort", passwordPlaceholder: "••••••••",
    entering: "Eintritt...", begin: "Reise beginnen", enter: "Sanctuary betreten",
    alreadyAccount: "Bereits ein Konto? Anmelden", newHere: "Neu hier? Werde Teil des Kreises",
    staffAccess: "StayOnBeat • Team-Zugang über awareness@love.com", errorMsg: "Das Sanctuary kalibriert sich bitte versuche es erneut"
  },
  pt: {
    welcome: "Bem-vindo ao Lar", create: "Criar Santuário", prototype: "Modo Protótipo Ativo 🔒",
    emailLabel: "Endereço de E-mail", emailPlaceholder: "alma@stayonbeat.com",
    passwordLabel: "Password", passwordPlaceholder: "••••••••",
    entering: "Entrando...", begin: "Começar Jornada", enter: "Entrar no Santuário",
    alreadyAccount: "Já tem uma conta? Entrar", newHere: "Novo aqui? Junte-se ao círculo",
    staffAccess: "StayOnBeat • Acesso da Equipe via awareness@love.com", errorMsg: "O santuário está calibrando, por favor tente novamente"
  },
  ru: {
    welcome: "Мы рады Тебе", create: "Создать Пространство", prototype: "Активен режим прототипа 🔒",
    emailLabel: "Адрес электронной почты", emailPlaceholder: "soul@stayonbeat.com",
    passwordLabel: "Пароль", passwordPlaceholder: "••••••••",
    entering: "Вход...", begin: "Начать путешествие", enter: "Войти в пространство",
    alreadyAccount: "Уже есть аккаунт? Войти", newHere: "Впервые здесь? Присоединяйся к Нам",
    staffAccess: "StayOnBeat • Доступ персонала через awareness@love.com", errorMsg: "Пространство калибруется, пожалуйста, попробуйте позже"
  }
};

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();
  const db = useFirestore();
  
  const mode = searchParams.get("mode") || "signin";
  const isSignUp = mode === "signup";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<'en' | 'de' | 'pt' | 'ru'>('en');

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de', 'pt', 'ru'].includes(savedLang)) setLang(savedLang);
  }, []);

  const t = CONTENT[lang];

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const cred = await signInAnonymously(auth);
      const userEmail = email.toLowerCase().trim();
      const userName = userEmail.split("@")[0].toUpperCase();

      if (userEmail === 'awareness@love.com') {
        router.push("/awareness");
        return;
      }

      const vibeLabels: Record<string, string> = {
        en: "Calm",
        de: "Beruhigt",
        pt: "Calmo",
        ru: "Спокойное"
      };

      setDocumentNonBlocking(
        doc(db, "users", cred.user.uid), 
        {
          uid: cred.user.uid,
          email: userEmail || "prototype@stayonbeat.app",
          name: userName,
          createdAt: serverTimestamp(),
          trustLevel: isSignUp ? "unverified" : "verified_adult",
          vibe: { 
            current: "calm", 
            currentEmoji: "🍃", 
            currentLabel: vibeLabels[lang] || "Calm" 
          }
        },
        { merge: true }
      );

      if (isSignUp) router.push("/onboarding");
      else router.push("/dashboard");
    } catch (err: any) {
      setError(t.errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-6 font-headline relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full" />

      <div className="w-full max-w-md bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/10 relative z-10 shadow-2xl shadow-primary/5">
        <button onClick={() => router.push("/")} className="absolute top-8 left-8 text-white/20 hover:text-primary transition-colors p-2"><ChevronLeft size={24} /></button>
        <div className="text-center mb-10 mt-4">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <Heart size={40} fill="currentColor" className="text-primary animate-pulse-heart" style={{ filter: 'blur(8px)' }} />
          </div>
          <h1 className={cn("text-4xl font-black text-white tracking-tighter uppercase leading-none mb-2", lang === 'ru' && "italic font-serif")}>{isSignUp ? t.create : t.welcome}</h1>
          <p className={cn("text-primary text-[10px] font-black uppercase tracking-[0.4em]", lang === 'ru' && "italic font-serif")}>{t.prototype}</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          <div className="space-y-1.5">
            <label className={cn("text-[9px] font-black uppercase tracking-[0.3em] text-primary ml-2", lang === 'ru' && "italic font-serif")}>{t.emailLabel}</label>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className={cn("w-full h-16 px-8 rounded-2xl border-2 border-white/5 bg-white/5 text-white placeholder:text-white/10 focus:border-primary outline-none transition-all font-bold", lang === 'ru' && "italic font-serif")} placeholder={t.emailPlaceholder} required />
          </div>
          <div className="space-y-1.5">
            <label className={cn("text-[9px] font-black uppercase tracking-[0.3em] text-primary ml-2", lang === 'ru' && "italic font-serif")}>{t.passwordLabel}</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className={cn("w-full h-16 px-8 rounded-2xl border-2 border-white/5 bg-white/5 text-white placeholder:text-white/10 focus:border-primary outline-none transition-all font-bold", lang === 'ru' && "italic font-serif")} placeholder={t.passwordPlaceholder} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-primary">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
            </div>
          </div>
          {error && <div className={cn("p-4 bg-red-600/10 border border-red-600/20 rounded-2xl text-red-500 text-[10px] text-center font-black uppercase tracking-widest", lang === 'ru' && "italic font-serif")}>{error}</div>}
          <button type="submit" disabled={isLoading} className={cn("w-full h-20 bg-primary text-black rounded-2xl font-black text-lg uppercase tracking-[0.1em] shadow-lg shadow-primary/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-4", isLoading && "opacity-50 cursor-not-allowed", lang === 'ru' && "italic font-serif")}>{isLoading ? <><Loader2 size={24} className="animate-spin" /><span>{t.entering}</span></> : <span className="flex items-center gap-3">{isSignUp ? t.begin : t.enter}</span>}</button>
        </form>
        <button onClick={() => router.push(isSignUp ? "/auth?mode=signin" : "/auth?mode=signup")} className={cn("w-full mt-10 text-[9px] font-black text-white/20 hover:text-primary transition-colors uppercase tracking-[0.4em] flex items-center justify-center gap-2", lang === 'ru' && "italic font-serif")}>{isSignUp ? t.alreadyAccount : t.newHere}</button>
        <div className="mt-12 pt-8 border-t border-white/5"><p className={cn("text-center text-[8px] text-white/10 uppercase tracking-[0.5em] font-black", lang === 'ru' && "italic font-serif")}>{t.staffAccess}</p></div>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-8">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full" />
          <Heart size={64} fill="currentColor" className="relative z-10 animate-pulse-heart text-primary" style={{ filter: 'blur(12px)' }} />
        </div>
        <Loader2 className="animate-spin text-primary/20" />
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
