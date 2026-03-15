"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useAuth, useFirestore, setDocumentNonBlocking } from "@/firebase";
import { 
  signInAnonymously,
  onAuthStateChanged
} from "firebase/auth";
import { doc, serverTimestamp } from "firebase/firestore";
import { 
  Heart, 
  Eye, 
  EyeOff, 
  Loader2, 
  ShieldCheck, 
  ChevronLeft,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Access Sanctuary (Auth) Page - Prototype Mode.
 * Bypasses real credential checks to allow any email/password for testing.
 * Uses Anonymous Auth to provide a functional UID for Firestore.
 */

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

  // Automatically redirect if a session is already active
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If we are on the auth page but already have a user, head to dashboard
        // Unless we just clicked signup/signin, let the handler manage redirects
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError(null);
    setIsLoading(true);

    try {
      // PROTOTYPE BYPASS: Sign in anonymously regardless of credentials
      // This gives us a real Firebase UID to work with Firestore
      const cred = await signInAnonymously(auth);
      
      const userEmail = email || "prototype@stayonbeat.app";
      const userName = userEmail.split("@")[0].toUpperCase();

      // Initialize/Update Profile Baseline
      setDocumentNonBlocking(
        doc(db, "users", cred.user.uid), 
        {
          uid: cred.user.uid,
          email: userEmail,
          name: userName,
          createdAt: serverTimestamp(),
          trustLevel: isSignUp ? "unverified" : "verified_adult",
          vibe: { 
            current: "calm", 
            currentEmoji: "🍃", 
            currentLabel: "Calm" 
          },
          verification: { 
            isAgeVerified: !isSignUp // Assume verified if just signing in for prototype
          }
        },
        { merge: true }
      );

      // Redirect based on intent
      if (isSignUp) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError("The sanctuary is calibrating... please try again. 🌿");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-6 font-headline relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#10B981]/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#EBFB3B]/5 blur-[120px] rounded-full" />

      <div className="w-full max-w-md bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/10 relative z-10 shadow-2xl shadow-[#10B981]/5">
        
        <button 
          onClick={() => router.push("/")} 
          className="absolute top-8 left-8 text-white/20 hover:text-[#10B981] transition-colors p-2"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="text-center mb-10 mt-4">
          <div className="w-20 h-20 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#10B981]/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <Heart size={40} fill="#10B981" className="text-[#10B981] animate-pulse-heart" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none mb-2">
            {isSignUp ? "Create Sanctuary" : "Welcome Home"}
          </h1>
          <p className="text-[#10B981] text-[10px] font-black uppercase tracking-[0.4em]">
            Prototype Mode: Any credentials work 💚
          </p>
        </div>

        {isSignUp && (
          <div className="mb-8 p-6 bg-[#10B981]/5 rounded-[2rem] border border-[#10B981]/20 flex items-start gap-4">
            <ShieldCheck className="text-[#10B981] mt-0.5 flex-shrink-0" size={20} />
            <div className="space-y-1">
              <p className="text-[11px] text-[#10B981] font-black uppercase tracking-widest leading-relaxed">
                Development Access Active
              </p>
              <p className="text-[10px] text-white/40 font-bold leading-relaxed uppercase">
                Auth validation is bypassed for prototyping. Proceed to test onboarding. 🔒
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Email Address</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-16 px-8 rounded-2xl border-2 border-white/5 bg-white/5 text-white placeholder:text-white/10 focus:border-[#10B981] focus:bg-white/10 outline-none transition-all font-bold text-base shadow-inner"
              placeholder="soul@stayonbeat.com"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 ml-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-16 px-8 rounded-2xl border-2 border-white/5 bg-white/5 text-white placeholder:text-white/10 focus:border-[#10B981] focus:bg-white/10 outline-none transition-all font-bold text-base shadow-inner"
                placeholder="••••••••"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-[#10B981] transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-600/10 border border-red-600/20 rounded-2xl text-red-500 text-[10px] text-center font-black uppercase tracking-widest">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full h-20 bg-[#10B981] text-black rounded-2xl font-black text-lg uppercase tracking-[0.1em] shadow-lg shadow-[#10B981]/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-4",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                <span>Entering...</span>
              </>
            ) : (
              <span className="flex items-center gap-3">
                {isSignUp ? "Begin Journey" : "Enter Sanctuary"} 💚
              </span>
            )}
          </button>
        </form>

        <button 
          onClick={() => router.push(isSignUp ? "/auth?mode=signin" : "/auth?mode=signup")}
          className="w-full mt-10 text-[9px] font-black text-white/20 hover:text-[#10B981] transition-colors uppercase tracking-[0.4em] flex items-center justify-center gap-2"
        >
          {isSignUp ? "Already have an account? Sign In" : "New here? Join the circle"}
          <Sparkles size={12} />
        </button>

        <div className="mt-12 pt-8 border-t border-white/5">
          <p className="text-center text-[8px] text-white/10 uppercase tracking-[0.5em] font-black">
            StayOnBeat • Prototype Mode Active
          </p>
        </div>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-[#10B981]" /></div>}>
      <AuthContent />
    </Suspense>
  );
}
