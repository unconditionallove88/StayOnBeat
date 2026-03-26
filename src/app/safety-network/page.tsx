"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  useFirestore, 
  useUser, 
  useCollection, 
  useDoc,
  useMemoFirebase,
  addDocumentNonBlocking,
  deleteDocumentNonBlocking,
  updateDocumentNonBlocking
} from "@/firebase";
import { collection, serverTimestamp, doc } from "firebase/firestore";
import { 
  Heart, 
  Plus, 
  Trash2, 
  Shield, 
  ArrowLeft, 
  User, 
  Phone, 
  Loader2, 
  Lock, 
  ShieldCheck,
  UserPlus,
  HeartHandshake
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Circle of Love (Safety Network) Page.
 * Linguistic purification: Removed "safety" and replaced with Care/Love.
 */

const RELATIONSHIP_OPTIONS = [
  "Best Friend",
  "Partner",
  "Sister",
  "Brother",
  "Parent",
  "Therapist",
  "Trusted Friend",
];

export default function SafetyNetworkPage() {
  const router = useRouter();
  const firestore = useFirestore();
  const { user } = useUser();
  const [showAddForm, setShowAddForm] = useState(false);
  const [secretWordInput, setSecretWordInput] = useState("");
  
  // Form State
  const [form, setForm] = useState({
    name: "", 
    relationship: "", 
    phone: "", 
    email: "", 
    notifyBySMS: true, 
    notifyByEmail: true 
  });

  // Fetch Safety Network (Guardians)
  const contactsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return collection(firestore, 'users', user.uid, 'safetyNetwork');
  }, [firestore, user?.uid]);

  const { data: contacts, isLoading: isContactsLoading } = useCollection(contactsQuery);

  // Fetch User Profile (for Secret Word)
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: profile } = useDoc(userDocRef);

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.relationship || !firestore || !user?.uid) return;
    
    const contactsRef = collection(firestore, "users", user.uid, "safetyNetwork");
    addDocumentNonBlocking(contactsRef, {
      ...form,
      addedAt: serverTimestamp(),
      addedWithLove: true,
    });

    setForm({ name: "", relationship: "", phone: "", email: "", notifyBySMS: true, notifyByEmail: true });
    setShowAddForm(false);
  };

  const handleRemoveContact = (contactId: string) => {
    if (!firestore || !user?.uid) return;
    const contactRef = doc(firestore, "users", user.uid, "safetyNetwork", contactId);
    deleteDocumentNonBlocking(contactRef);
  };

  const handleSaveSecretWord = () => {
    if (!userDocRef || !secretWordInput.trim()) return;
    
    updateDocumentNonBlocking(userDocRef, {
      secretWord: secretWordInput.trim()
    });
    
    // Clear local input to show it was "sealed"
    setSecretWordInput("");
  };

  const guardiansCount = contacts?.length || 0;

  return (
    <main className="min-h-screen bg-black text-white font-headline pb-32">
      {/* Header */}
      <nav className="bg-black/90 backdrop-blur-2xl border-b border-white/5 px-6 py-8 sticky top-0 z-[100]">
        <div className="max-md mx-auto flex items-center justify-between">
          <button 
            onClick={() => router.push("/dashboard")} 
            className="p-3 bg-white/5 rounded-full border border-white/10 hover:border-[#3EB489] transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white/40" />
          </button>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-[#3EB489]/10 border border-[#3EB489]/30 rounded-full">
            <Shield className="w-3.5 h-3.5 text-[#3EB489]" />
            <span className="text-[10px] font-black uppercase text-[#3EB489] tracking-widest">Circle of Love</span>
          </div>
        </div>
      </nav>

      <div className="px-6 py-10 max-md mx-auto space-y-10">
        
        {/* Intro Affirmation Card */}
        <section className="bg-gradient-to-br from-[#3EB489] to-teal-600 rounded-[2.5rem] p-8 text-black shadow-lg relative overflow-hidden group">
          <Heart className="absolute -right-6 -bottom-6 opacity-10 rotate-12 transition-transform group-hover:scale-110" size={160} fill="white" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={18} className="text-black/40" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">Care Network</span>
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter leading-none mb-4">Who holds you?</h2>
            <p className="text-sm font-bold leading-relaxed opacity-80 max-w-[280px]">
              Add the people who love you unconditionally. If you ever feel in need of connection, we will alert them instantly with your resonance status
            </p>
          </div>
        </section>

        {/* Guardians List */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Your Guardians</h3>
            <span className="text-[9px] font-black text-[#3EB489] bg-[#3EB489]/10 px-3 py-1 rounded-full border border-[#3EB489]/20 uppercase">
              {guardiansCount}/5 Slots
            </span>
          </div>

          <div className="grid gap-4">
            {isContactsLoading ? (
              <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#3EB489]" /></div>
            ) : contacts?.length ? (
              contacts.map((contact) => (
                <div key={contact.id} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex items-center justify-between group hover:border-[#3EB489]/30 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-[#3EB489]/20 transition-colors">
                      <User className="w-6 h-6 text-white/40" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase tracking-tight text-white">{contact.name}</h3>
                      <p className="text-[10px] font-bold text-[#3EB489] uppercase tracking-widest">{contact.relationship} • {contact.phone}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRemoveContact(contact.id)} 
                    className="p-3 bg-red-600/10 rounded-xl border border-red-500/20 hover:bg-red-600 text-red-500 hover:text-white transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-40">
                <p className="text-[10px] font-black uppercase tracking-[0.4em]">Empty circle</p>
              </div>
            )}
          </div>

          {guardiansCount < 5 && !showAddForm && (
            <button 
              onClick={() => setShowAddForm(true)} 
              className="w-full bg-white/5 border-2 border-dashed border-white/10 rounded-[2rem] py-10 flex flex-col items-center gap-4 hover:bg-[#3EB489]/5 hover:border-[#3EB489]/30 transition-all group"
            >
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:border-[#3EB489]/30 transition-all">
                <UserPlus className="w-6 h-6 text-white/20 group-hover:text-[#3EB489]" />
              </div>
              <span className="text-[10px] font-black uppercase text-white/20 group-hover:text-[#3EB489] tracking-[0.3em]">Add someone who loves you</span>
            </button>
          )}

          {/* Add Guardian Form */}
          {showAddForm && (
            <form onSubmit={handleAddContact} className="bg-[#0a0a0a] border-2 border-[#3EB489]/30 rounded-[2.5rem] p-8 space-y-6 animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center gap-3 mb-2">
                <UserPlus size={20} className="text-[#3EB489]" />
                <h2 className="text-xl font-black uppercase tracking-tight">New Guardian</h2>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-white/30 tracking-widest ml-1">Full Name</label>
                  <input 
                    value={form.name} 
                    onChange={(e) => setForm({...form, name: e.target.value})} 
                    placeholder="Enter name" 
                    className="w-full bg-white/5 border border-white/10 h-14 px-6 rounded-2xl focus:border-[#3EB489] outline-none text-white font-bold"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-white/30 tracking-widest ml-1">Relationship</label>
                    <select 
                      value={form.relationship} 
                      onChange={(e) => setForm({...form, relationship: e.target.value})} 
                      className="w-full bg-white/5 border border-white/10 h-14 px-6 rounded-2xl focus:border-[#3EB489] outline-none text-white font-bold appearance-none"
                      required
                    >
                      <option value="" className="bg-black">Select role</option>
                      {RELATIONSHIP_OPTIONS.map(opt => <option key={opt} value={opt} className="bg-black">{opt}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-white/30 tracking-widest ml-1">Phone Number</label>
                    <input 
                      value={form.phone} 
                      onChange={(e) => setForm({...form, phone: e.target.value})} 
                      placeholder="+49..." 
                      className="w-full bg-white/5 border border-white/10 h-14 px-6 rounded-2xl focus:border-[#3EB489] outline-none text-white font-bold"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)} 
                  className="bg-white/5 text-white/40 font-black uppercase text-[10px] py-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-[#3EB489] text-black font-black uppercase text-[10px] py-5 rounded-2xl neon-glow active:scale-[0.98] transition-all"
                >
                  Save Guardian
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Secret Word Section */}
        <section className="bg-white/5 rounded-[2.5rem] border-2 border-amber-500/20 p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl -z-10" />
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
              <Lock size={24} className="text-amber-500" />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight">The Secret Word</h3>
              <p className="text-[10px] font-bold text-amber-500/60 uppercase tracking-widest">Resonance Dispatch Code</p>
            </div>
          </div>
          
          <p className="text-xs font-bold text-white/40 leading-relaxed uppercase tracking-widest">
            If you text this word to your Circle, they know to come get you immediately — no questions asked
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text"
              value={secretWordInput}
              onChange={(e) => setSecretWordInput(e.target.value)}
              placeholder={profile?.secretWord || "e.g. PINEAPPLE"}
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-black uppercase placeholder:text-white/10 outline-none focus:border-amber-500 transition-all"
            />
            <button 
              onClick={handleSaveSecretWord}
              className="bg-amber-500 text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-amber-500/10"
            >
              Seal Code 🔒
            </button>
          </div>

          {profile?.secretWord && (
            <p className="text-[9px] font-black text-[#3EB489] uppercase tracking-[0.2em] text-center animate-pulse">
              Active Code: {profile.secretWord}
            </p>
          )}
        </section>

        {/* Trust Footer */}
        <footer className="text-center space-y-4 pt-10 opacity-30">
          <Heart size={24} className="mx-auto text-[#3EB489]" />
          <p className="text-[9px] font-black text-white uppercase tracking-[0.4em] max-w-[200px] mx-auto leading-relaxed">
            Your care network is private and encrypted
          </p>
        </footer>

      </div>
    </main>
  );
}
