'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Heart, Loader2, Lock, ShieldCheck, Shield, Users } from 'lucide-react';
import { useFirestore, useUser, useCollection, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, limit, serverTimestamp, doc } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

/**
 * @fileOverview The Holders (Private & Mutual).
 * Framing: I love and respect my trusted ones. Pure connection.
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
        title: "Group Initialized",
        description: `Your bond of care "${groupName}" has been created. Waiting for others to confirm.`,
      });
      setShowCreateGroup(false);
      setGroupName('');
      setInviteEmail('');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not create group.",
      });
    }
  };

  if (!hasAgreement) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 text-center space-y-10 font-headline bg-black">
        <div className="relative">
          <div className="w-24 h-24 bg-[#10B981]/10 rounded-full flex items-center justify-center border-2 border-[#10B981]/30">
            <Shield className="w-10 h-10 text-[#10B981]" />
          </div>
          <Heart className="absolute -bottom-2 -right-2 text-[#10B981] fill-[#10B981] w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-black uppercase tracking-tighter text-white">The Holders</h2>
          <p className="text-base font-bold text-white/60 leading-tight max-w-xs mx-auto">
            Those who hold your heart from afar. Your functional bond of care.
          </p>
        </div>

        <div className="space-y-6 w-full max-w-sm">
          <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-[2rem] group hover:border-[#10B981]/40 transition-all text-left">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
                <Lock className="w-5 h-5 text-white/40" />
              </div>
              <div className="text-left">
                <p className="text-xs font-black uppercase tracking-tight">Functional Bond of Care</p>
                <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Shared only with your inner circle</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-[2rem] text-left">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#10B981]" />
              </div>
              <div className="text-left">
                <p className="text-xs font-black uppercase tracking-tight">Mutual Confirmation</p>
                <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Everyone must agree to join the group</p>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setHasAgreement(true)}
          className="pill-button w-full max-w-sm bg-[#10B981] text-black text-lg font-black uppercase tracking-widest neon-glow active:scale-95 flex items-center justify-center gap-3"
        >
          Access My Bonds 🤝
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black font-body">
      {/* Header */}
      <div className="px-8 py-8 border-b border-white/5 bg-black/80 backdrop-blur-xl flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#10B981]/20 rounded-full flex items-center justify-center border border-[#10B981]/30">
            <Shield size={24} className="text-[#10B981]" />
          </div>
          <div>
            <h2 className="text-[20px] font-black uppercase tracking-tight">The Holders</h2>
            <p className="text-[9px] text-[#10B981] font-black uppercase tracking-[0.2em]">Functional Bond of Care</p>
          </div>
        </div>
        <button 
          onClick={() => setShowCreateGroup(true)}
          className="p-3 bg-[#10B981] text-black rounded-xl hover:opacity-90 transition-all"
        >
          <Users size={20} />
        </button>
      </div>

      {showCreateGroup && (
        <div className="p-6 bg-white/5 border-b border-white/10 animate-in slide-in-from-top-4">
          <form onSubmit={handleCreateGroup} className="space-y-4 max-w-md mx-auto">
            <input 
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="GROUP NAME"
              className="w-full bg-black border border-white/20 p-4 rounded-xl text-white font-black uppercase text-xs"
              required
            />
            <input 
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="INVITE BY EMAIL (OPTIONAL)"
              type="email"
              className="w-full bg-black border border-white/20 p-4 rounded-xl text-white font-black uppercase text-xs"
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-[#10B981] text-black p-3 rounded-xl font-black uppercase text-[10px]">Create Group</button>
              <button type="button" onClick={() => setShowCreateGroup(false)} className="flex-1 bg-white/10 text-white p-3 rounded-xl font-black uppercase text-[10px]">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <ScrollArea className="flex-1 px-8 py-10" ref={scrollRef}>
        <div className="space-y-6 max-w-2xl mx-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#10B981] animate-spin" />
            </div>
          )}
          
          {messages?.length === 0 && !isLoading && (
            <div className="text-center py-24 opacity-20 space-y-4">
              <Heart className="w-12 h-12 mx-auto" />
              <p className="text-xs uppercase font-black tracking-widest leading-relaxed">
                Start a conversation <br/> with your holders.
              </p>
            </div>
          )}

          {messages?.map((msg) => {
            const isMe = msg.senderId === user?.uid;
            return (
              <div key={msg.id} className={cn("flex flex-col gap-2", isMe ? "items-end" : "items-start")}>
                <span className="text-[8px] font-black text-white/30 uppercase tracking-widest px-2">
                  {isMe ? 'YOU' : msg.senderName}
                </span>
                <div className={cn(
                  "p-5 rounded-[2rem] text-sm font-bold leading-relaxed max-w-[85%] shadow-lg border transition-all",
                  isMe 
                    ? "bg-[#10B981] text-black border-[#10B981] rounded-tr-none" 
                    : "bg-white/5 text-white border-white/10 rounded-tl-none"
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
            className="flex-1 bg-white/5 border border-white/10 rounded-full py-6 px-10 text-base font-bold focus:border-[#10B981] transition-all outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-6 bg-[#10B981] text-black rounded-full disabled:opacity-30 transition-all hover:scale-105 active:scale-95"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
