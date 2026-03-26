
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Heart } from "lucide-react";

/**
 * @fileOverview Heart Check Redirect Page.
 * Calibrated German localization (Refugium -> Sanctuary).
 * Unified ethereal blurry heart.
 */

const CONTENT = {
  en: { title: "Your heart", highlight: "is home", sub: "Preparing your sanctuary" },
  de: { title: "Dein Herz", highlight: "ist dein Zuhause", sub: "Dein Sanctuary wird vorbereitet" }
};

export default function HeartCheckRedirect() {
  const router = useRouter();
  const auth = useAuth();
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<'en' | 'de'>('en');

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('stayonbeat_lang');
    if (savedLang === 'DE') setLang('de');
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) { router.replace("/auth"); return; }
      const timer = setTimeout(() => router.replace("/dashboard"), 1500);
      return () => clearTimeout(timer);
    });
    return () => unsub();
  }, [auth, router]);

  if (!mounted) return null;
  const t = CONTENT[lang];

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-6 font-headline overflow-hidden relative">
      <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full" />
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 w-48 h-48 bg-primary/10 blur-[60px] rounded-full" />
          <Heart 
            size={80} 
            fill="currentColor" 
            className="relative z-10 animate-pulse-heart text-primary" 
            style={{ filter: 'blur(12px)' }}
          />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white leading-none">{t.title} <br /> <span className="text-primary">{t.highlight}</span></h1>
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em] opacity-60">{t.sub}</p>
        </div>
      </div>
    </div>
  );
}
