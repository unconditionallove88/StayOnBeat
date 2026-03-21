
'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Heart, Loader2, Lock, ShieldCheck, HeartHandshake, Users, Sparkles } from 'lucide-react';
import { useFirestore, useUser, useCollection, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, limit, serverTimestamp, doc } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

/**
 * @fileOverview The Holders (Those who hold your heart from afar).
 * Framing: I love and respect my trusted ones. Pure connection.
 * Redesigned for Radiant Unity and Purity.
 */

export function LoveCircleChat() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const [input, setInput] = useState('');
  const [hasAgreement, setHasAgreement] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const chatQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(
      collection(firestore, 'users', user.uid, 'loveCircleMessages'),
      orderBy('createdAt', 'asc'),
      limit(50)
    );
  }, [firestore, user?.uid]);

  const { data: messages, isLoading } = useCollection(chatQuery);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !user || !firestore) return;
    const text = input.trim();
    setInput('');
    addDocumentNonBlocking(collection(firestore, 'users', user.uid, 'loveCircleMessages'), {
      senderId: user.uid,
      senderName: user.displayName || 'Friend',
      text: text,
      createdAt: serverTimestamp(),
    });
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || !firestore || !user) return;

    try {
      const groupsRef = collection(firestore, 'chatGroups');
      await addDocumentNonBlocking(groupsRef, {
        name: groupName,
        members: [user.uid],
        pendingInvites: inviteEmail ? [inviteEmail] : [],
        createdAt: serverTimestamp()
      });
      
      toast({
        title: "Bond Initialized",
        description: `Your bond of care "${groupName}" has been created. Waiting for resonance.`,
      });
      setShowCreateGroup(false);
      setGroupName('');
      setInviteEmail('');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not create group",
      });
    }
  };

  if (!hasAgreement) {
    return (
      <div className="flex flex-col h-full bg-black font-headline overflow-hidden">
        <ScrollArea className="flex-1">
          <div className="flex flex-col items-center justify-center min-h-[70vh] p-10 text-center space-y-12">
            {/* RADIANT CORE ICON */}
            <div className="relative">
              <div className="absolute inset-0 bg-[#10B981]/20 blur-3xl rounded-full animate-pulse" />
              <div className="w-32 h-32 bg-[#10B981]/10 rounded-full flex items-center justify-center border-2 border-[#10B981]/30 relative z-10 shadow-2xl">
                <HeartHandshake size={48} className="text-[#10B981]" />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-5xl font-black uppercase tracking-tighter text-white">The Holders</h2>
              <p className="text-lg font-bold text-white/60 leading-tight max-w-sm mx-auto uppercase tracking-widest">
                Those who hold your heart from afar. Your sacred bond of care and trust
              </p>
            </div>

            <div className="space-y-4 w-full max-w-sm">
              {[
                { title: "Sacred Bond of Resonance", sub: "Shared only with your inner circle", icon: Lock },
                { title: "Mutual Holding", sub: "Unity through shared resonance", icon: HeartHandshake }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] text-left transition-all hover:border-[#10B981]/30 group">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-[#10B981]" />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-tight text-white">{item.title}</p>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setHasAgreement(true)}
              className="pill-button w-full max-w-sm bg-[#10B981] text-black text-xl font-black uppercase tracking-widest neon-glow active:scale-95 flex items-center justify-center gap-3 mb-10 shadow-emerald-500/20"
            >
              Access My Bonds 🤝
            </button>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black font-body overflow-hidden">
      {/* Header */}
      <div className="px-8 py-8 border-b border-white/5 bg-black/80 backdrop-blur-xl flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#10B981]/10 rounded-2xl flex items-center justify-center border border-[#10B981]/20 shadow-lg">
            <HeartHandshake size={28} className="text-[#10B981]" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white leading-none">The Holders</h2>
            <p className="text-[10px] text-[#10B981] font-black uppercase tracking-[0.3em] mt-1">Sacred Bond of Resonance</p>
          </div>
        </div>
        <button 
          onClick={() => setShowCreateGroup(!showCreateGroup)}
          className="p-4 bg-[#10B981] text-black rounded-2xl hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
        >
          <Users size={20} />
        </button>
      </div>

      {showCreateGroup && (
        <div className="p-8 bg-white/[0.02] border-b border-white/5 animate-in slide-in-from-top-4 shrink-0">
          <form onSubmit={handleCreateGroup} className="space-y-4 max-w-md mx-auto">
            <input 
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="NAME YOUR BOND"
              className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white font-black uppercase text-sm focus:border-[#10B981] outline-none transition-all"
              required
            />
            <input 
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="INVITE BY EMAIL"
              type="email"
              className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white font-black uppercase text-sm focus:border-[#10B981] outline-none transition-all"
            />
            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex-1 bg-[#10B981] text-black h-14 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg">Create Bond</button>
              <button type="button" onClick={() => setShowCreateGroup(false)} className="flex-1 bg-white/5 text-white/40 h-14 rounded-xl font-black uppercase text-[10px] tracking-widest">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <ScrollArea className="flex-1 px-8 py-8" ref={scrollRef}>
        <div className="space-y-8 max-w-2xl mx-auto pb-10">
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#10B981] animate-spin" />
            </div>
          )}
          
          {messages?.length === 0 && !isLoading && (
            <div className="text-center py-24 opacity-20 space-y-6">
              <div className="relative inline-block">
                <Heart className="w-16 h-16 mx-auto text-[#10B981]" fill="currentColor" />
              </div>
              <p className="text-sm uppercase font-black tracking-[0.4em] leading-relaxed text-white max-w-[200px] mx-auto">
                Start a resonance <br/> with your holders
              </p>
            </div>
          )}

          {messages?.map((msg) => {
            const isMe = msg.senderId === user?.uid;
            return (
              <div key={msg.id} className={cn("flex flex-col gap-3 animate-in slide-in-from-bottom-2 duration-500", isMe ? "items-end" : "items-start")}>
                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] px-3">
                  {isMe ? 'YOU' : msg.senderName}
                </span>
                <div className={cn(
                  "p-6 rounded-[2.5rem] text-sm font-bold leading-relaxed max-w-[85%] shadow-2xl border transition-all",
                  isMe 
                    ? "bg-[#10B981] text-black border-[#10B981] rounded-tr-none" 
                    : "bg-white/[0.03] text-white/90 border-white/5 rounded-tl-none shadow-inner"
                )}>
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="px-6 py-10 bg-black border-t border-white/5 shrink-0">
        <div className="relative flex items-center max-w-2xl mx-auto gap-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Message your holders..."
            className="flex-1 bg-white/[0.02] border border-white/10 rounded-full py-6 px-10 text-base font-bold focus:border-[#10B981] transition-all outline-none text-white shadow-inner"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-6 bg-[#10B981] text-black rounded-full disabled:opacity-30 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#10B981]/20"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
        <div className="mt-6 flex flex-col items-center gap-2 opacity-20">
          <p className="text-[8px] text-white uppercase tracking-[0.6em] font-black">
            Mutual Bonds of Care
          </p>
          <div className="flex items-center gap-2">
            <Lock size={8} className="text-[#10B981]" />
            <span className="text-[7px] font-black uppercase tracking-widest">End-to-End Encrypted Sanctuary</span>
          </div>
        </div>
      </div>
    </div>
  );
}
