
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
  Sparkles, 
  Leaf,
  Lock,
  ChevronRight,
  Loader2,
  ShieldCheck,
  HelpCircle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CoCreation } from "@/components/dashboard/CoCreation";

/**
 * @fileOverview Your Sanctuary (Profile Page).
 * A high-fidelity space for biometric calibration and privacy.
 * Features Emerald theme and route protection.
 */
export default function ProfilePage() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const [successMessage, setSuccessMessage] = useState("");
  const [mounted, setMounted] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [coCreationOpen, setCoCreationOpen] = useState(false);

  // Auth Protection
  useEffect(() => {
    setMounted(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/auth");
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  // Memoize and fetch profile data
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: profile, isLoading } = useDoc(userDocRef);

  const handleUpdate = (updates: any) => {
    if (!user || !firestore || !userDocRef) return;
    
    updateDocumentNonBlocking(userDocRef, updates);
    setSuccessMessage("Your profile reflects your light 💚");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  if (!mounted || isUserLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center space-y-6">
          <div className="relative">
            <Heart size={64} fill="#10B981" stroke="#10B981" className="mx-auto animate-pulse-heart drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
            <Loader2 className="absolute inset-0 w-full h-full animate-spin text-[#10B981]/20" />
          </div>
          <p className="text-[#10B981] font-black uppercase tracking-[0.4em] text-xs">Entering sanctuary...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white font-headline pb-32">
      {/* Header */}
      <nav className="bg-black/90 backdrop-blur-2xl border-b border-white/5 px-6 py-8 sticky top-0 z-[100]">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => router.push("/dashboard")}
            className="p-3 bg-white/5 rounded-full border border-white/10 hover:border-[#10B981] transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white/40" />
          </button>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-[#10B981]/10 border border-[#10B981]/30 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="text-[10px] font-black uppercase text-[#10B981] tracking-widest">Sanctuary</span>
          </div>
        </div>
      </nav>

      <div className="px-6 py-10 max-xl mx-auto space-y-10">
        {/* Identity Section */}
        <section className="text-center space-y-6">
          <div className="relative inline-block">
            <div className="w-28 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto border-2 border-white/10 shadow-2xl relative overflow-hidden group">
              <User size={48} className="text-white/20 group-hover:text-[#10B981] transition-colors" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10B981]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-[#10B981] p-2 rounded-full border-4 border-black shadow-lg">
              <Sparkles size={16} className="text-black" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">
              {profile?.name || "VALUED SOUL"}
            </h2>
            <p className="text-[#10B981] text-[10px] font-black uppercase tracking-[0.4em]">You are exactly where you need to be 🌿</p>
          </div>
        </section>

        {/* Success Toast Overlay */}
        {successMessage && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-[#10B981] text-black px-6 py-3 rounded-full flex items-center gap-3 animate-in slide-in-from-top-4 duration-500 shadow-2xl font-black uppercase text-[10px] tracking-widest">
            <CheckCircle2 size={16} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Settings Groups */}
        <div className="space-y-6">
          
          {/* Group 1: Personal Essence */}
          <div className="bg-white/5 rounded-[2.5rem] border border-white/10 p-8 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/5 blur-3xl -z-10" />
            
            <h3 className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.3em] flex items-center gap-3">
              <Leaf size={14} className="text-[#10B981]" /> Your Essence
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-[#10B981] tracking-widest ml-1">Username</label>
                <input 
                  type="text" 
                  defaultValue={profile?.name}
                  onBlur={(e) => handleUpdate({ name: e.target.value.toUpperCase() })}
                  className="w-full h-16 px-6 bg-white/5 border border-white/10 rounded-2xl focus:border-[#10B981] outline-none transition-all text-xl font-black uppercase"
                  placeholder="ENTER NAME"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-[#10B981] tracking-widest ml-1">Weight (kg)</label>
                  <input 
                    type="number" 
                    defaultValue={profile?.biometrics?.weightKg}
                    onBlur={(e) => handleUpdate({ "biometrics.weightKg": Number(e.target.value) })}
                    className="w-full h-16 px-6 bg-white/5 border border-white/10 rounded-2xl focus:border-[#10B981] outline-none text-xl font-black"
                    placeholder="70"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-[#10B981] tracking-widest ml-1">Height (cm)</label>
                  <input 
                    type="number" 
                    defaultValue={profile?.biometrics?.heightCm}
                    onBlur={(e) => handleUpdate({ "biometrics.heightCm": Number(e.target.value) })}
                    className="w-full h-16 px-6 bg-white/5 border border-white/10 rounded-2xl focus:border-[#10B981] outline-none text-xl font-black"
                    placeholder="175"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Group 2: Safety & Support */}
          <div className="bg-white/5 rounded-[2.5rem] border border-white/10 p-8 space-y-6">
            <h3 className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.3em] flex items-center gap-3">
              <Shield size={14} className="text-[#10B981]" /> Safety & Support
            </h3>
            
            <button 
              onClick={() => router.push("/safety-network")}
              className="w-full flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-[#10B981]/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#10B981]/10 rounded-xl group-hover:scale-110 transition-transform">
                  <Heart size={24} className="text-[#10B981]" />
                </div>
                <div className="text-left">
                  <span className="block font-black text-sm uppercase tracking-tight">Circle of Love</span>
                  <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Trusted contacts</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-white/20 group-hover:text-[#10B981]" />
            </button>

            <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <Bell size={24} className="text-blue-400" />
                </div>
                <div className="text-left">
                  <span className="block font-black text-sm uppercase tracking-tight">Heart Reminders</span>
                  <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Daily check-ins active</span>
                </div>
              </div>
              <div className="w-12 h-6 bg-[#10B981] rounded-full relative cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <div className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full" />
              </div>
            </div>
          </div>

          {/* Group 3: Privacy & Commitment */}
          <div className="bg-white/5 rounded-[2.5rem] border border-white/10 p-8 text-center space-y-6">
             <div className="flex justify-center">
               <Lock size={24} className="text-white/10" />
             </div>
             <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest leading-relaxed">
               Your data is a sacred trust. We use high-fidelity encryption to ensure your journey remains private and protected. 💚
             </p>
             <button 
               onClick={() => setPrivacyOpen(true)}
               className="text-[8px] font-black text-[#10B981] uppercase tracking-[0.3em] hover:underline underline-offset-8"
             >
               View Privacy Commitment
             </button>
          </div>

          {/* Logout */}
          <button 
            onClick={() => auth.signOut().then(() => router.push("/"))}
            className="w-full py-6 bg-red-600/10 border border-red-600/20 text-red-500 text-xs font-black uppercase tracking-[0.4em] hover:bg-red-600/20 rounded-[2rem] transition-all"
          >
            Step away for a moment
          </button>
        </div>
      </div>

      {/* Privacy Commitment Dialog */}
      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="bg-[#050505] border-white/10 max-w-lg p-0 rounded-[3rem] overflow-hidden flex flex-col font-headline h-[90vh] max-h-[90vh]">
          <div className="p-8 pb-4 shrink-0">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-[#10B981]/10 rounded-2xl flex items-center justify-center border border-[#10B981]/20">
                <ShieldCheck size={32} className="text-[#10B981]" />
              </div>
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-white">Privacy Commitment</DialogTitle>
            </div>
          </div>
          
          <ScrollArea className="flex-1 px-8 pb-6">
            <div className="space-y-8">
              <section className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#10B981]">Data Sovereignty</h4>
                <p className="text-sm font-bold text-white/60 leading-relaxed uppercase tracking-widest">
                  I love and respect my privacy. My data is my own. StayOnBeat is built on the principle that your personal journey is a sacred trust.
                </p>
              </section>

              <section className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#10B981]">High-Fidelity Encryption</h4>
                <p className="text-sm font-bold text-white/60 leading-relaxed uppercase tracking-widest">
                  All biometric signals, health profiles, and location logs are protected by industry-leading encryption. We ensure that your sensitive information is visible only to you and those you explicitly trust.
                </p>
              </section>

              <section className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#10B981]">Data sharing</h4>
                <p className="text-sm font-bold text-white/60 leading-relaxed uppercase tracking-widest">
                  We never sell, rent, or trade your data. Your resonance remains within the sanctuary. Our mission is pure support, love, care and harm reduction.
                </p>
              </section>

              <section className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#10B981]">Unconditional Acceptance</h4>
                <p className="text-sm font-bold text-white/60 leading-relaxed uppercase tracking-widest">
                  We collect only the information necessary to keep you safe and provide high-fidelity support. Every data point is used to calibrate your protection and nurture your well-being.
                </p>
              </section>

              <section className="pt-10 border-t border-white/5 text-center space-y-6 pb-8">
                <div className="flex flex-col items-center gap-2">
                  <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Have more questions?</p>
                  <button 
                    onClick={() => {
                      setPrivacyOpen(false);
                      setCoCreationOpen(true);
                    }}
                    className="flex items-center gap-3 bg-[#10B981]/10 border border-[#10B981]/20 px-8 py-4 rounded-2xl text-[10px] font-black text-[#10B981] uppercase tracking-[0.4em] hover:bg-[#10B981]/20 transition-all active:scale-95"
                  >
                    <HelpCircle size={14} />
                    Questions?
                  </button>
                </div>
                <p className="text-[8px] font-black text-white/10 uppercase tracking-[0.5em]">
                  Encrypted with Love • Protected by Sanctuary Protocol
                </p>
              </section>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Co-Creation Dialog (Redirect Target) */}
      <Dialog open={coCreationOpen} onOpenChange={setCoCreationOpen}>
        <DialogContent className="bg-black border-white/10 max-lg p-0 rounded-[3rem] overflow-hidden">
          <CoCreation onComplete={() => setCoCreationOpen(false)} />
        </DialogContent>
      </Dialog>
    </main>
  );
}
