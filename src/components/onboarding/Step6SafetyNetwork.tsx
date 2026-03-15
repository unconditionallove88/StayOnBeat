
"use client"

import { useState, useRef, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { QrCode, Heart, Scan, MapPin, Navigation, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function Step6SafetyNetwork({ 
  onComplete,
  onBack
}: { 
  onComplete: () => void,
  onBack?: () => void
}) {
  const { toast } = useToast();
  const [shareLocation, setShareLocation] = useState(false);
  const [friendRadar, setFriendRadar] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [showMyCode, setShowMyCode] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (scanning) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          setScanning(false);
          toast({
            variant: 'destructive',
            title: 'Camera access denied',
            description: 'Please enable camera permissions in your browser settings to use this app.',
          });
        }
      };
      getCameraPermission();
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [scanning, toast]);

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-center font-headline max-w-2xl px-4 mx-auto text-center relative">
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-0 left-4 text-white/40 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-50"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      )}

      <div className="mt-12 mb-8">
        <h2 className="text-[22px] font-black uppercase mb-2 text-white leading-tight tracking-tighter">
          Safety network
        </h2>
        <p className="text-white/40 font-bold tracking-widest text-[10px] max-w-[280px] mx-auto uppercase">
          Connect with friends and awareness teams
        </p>
      </div>

      <div className="flex-1 w-full space-y-4 mb-10 overflow-y-auto max-h-[55vh] custom-scrollbar pr-2">
        <div className="bg-[#0a0a0a] rounded-[2rem] border-2 border-white/10 p-6 flex flex-col gap-4 group hover:border-[#3EB489]/30 transition-all text-left">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1 pr-4">
              <Label className="text-base font-black tracking-tight text-white leading-tight">Share location with awareness</Label>
              <p className="text-[10px] text-white/30 font-bold leading-tight">Allow on-site teams to find you in an emergency</p>
            </div>
            <Switch 
              checked={shareLocation}
              onCheckedChange={setShareLocation}
              className="data-[state=checked]:bg-[#3EB489]"
            />
          </div>
          <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-relaxed border-t border-white/5 pt-4">
            You can revoke access at any point and put it back on—you control it.
          </p>
        </div>

        <div className="bg-[#0a0a0a] rounded-[2rem] border-2 border-white/10 p-6 space-y-6 group hover:border-[#3EB489]/30 transition-all text-left">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <Label className="text-base font-black tracking-tight text-white leading-tight">Friend radar</Label>
              <p className="text-[10px] text-white/30 font-bold leading-tight">Sync with your group to see each other on the map</p>
            </div>
            <Switch 
              checked={friendRadar}
              onCheckedChange={setFriendRadar}
              className="data-[state=checked]:bg-[#3EB489]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => { setShowMyCode(!showMyCode); setScanning(false); }}
              className={`flex items-center justify-center gap-3 border-2 p-5 rounded-xl transition-all font-black text-[10px] tracking-widest ${showMyCode ? 'bg-[#3EB489] text-black border-[#3EB489] shadow-[0_0_20px_#3EB489]' : 'bg-white/5 border-white/10 text-white hover:border-white/30'}`}
            >
              <QrCode className="w-4 h-4" /> My code
            </button>
            <button 
              onClick={() => { setScanning(!scanning); setShowMyCode(false); }}
              className={`flex items-center justify-center gap-3 border-2 p-5 rounded-xl transition-all font-black text-[10px] tracking-widest ${scanning ? 'bg-[#3EB489] text-black border-[#3EB489] shadow-[0_0_20px_#3EB489]' : 'bg-white/5 border-white/10 text-white hover:border-white/30'}`}
            >
              <Scan className="w-4 h-4" /> Scan
            </button>
          </div>

          {(scanning || showMyCode) && (
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#3EB489] animate-in zoom-in-95 duration-500 bg-black aspect-square max-w-xs mx-auto flex items-center justify-center w-full mt-4">
              {scanning && (
                <>
                  <video ref={videoRef} className="w-full h-full object-cover opacity-60" autoPlay muted />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80 pointer-events-none" />
                  {hasCameraPermission === false && (
                    <div className="absolute inset-0 bg-black/90 flex items-center justify-center p-8 text-center">
                      <p className="text-red-500 font-black text-[10px] tracking-widest">Camera access required</p>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-48 border-2 border-[#3EB489] rounded-3xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-[#3EB489] shadow-[0_0_15px_#3EB489] animate-[bounce_2s_infinite]" />
                    </div>
                  </div>
                </>
              )}
              {showMyCode && (
                <div className="bg-white p-6 rounded-2xl shadow-[0_0_50px_rgba(62,180,137,0.3)]">
                  <QrCode className="w-40 h-40 text-black" />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-[#050505] rounded-[2rem] border-2 border-white/5 h-48 overflow-hidden relative group">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
             <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#3EB489" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <line x1="10%" y1="0" x2="15%" y2="100%" stroke="#3EB489" strokeWidth="2" strokeOpacity="0.4" />
                <line x1="0" y1="40%" x2="100%" y2="35%" stroke="#3EB489" strokeWidth="2" strokeOpacity="0.4" />
                <line x1="70%" y1="0" x2="65%" y2="100%" stroke="#3EB489" strokeWidth="2" strokeOpacity="0.4" />
             </svg>
          </div>

          <div className="absolute inset-0 pointer-events-none">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-gradient-to-r from-transparent via-[#3EB489]/5 to-transparent rotate-[45deg] animate-[spin_4s_linear_infinite]" />
          </div>

          <div className="relative z-10 flex items-center justify-center w-full h-full p-4">
            <div className="relative">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-[2px] border-white relative z-10 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
              <div className="absolute inset-0 w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-40" />
            </div>
            
            <div className="absolute top-10 right-12 flex flex-col items-center gap-1">
               <div className="relative">
                 <Heart className="w-5 h-5 text-[#3EB489] fill-[#3EB489] animate-pulse drop-shadow-[0_0_10px_#3EB489]" />
               </div>
               <span className="text-[7px] font-black bg-black/60 px-2 py-0.5 rounded-full border border-white/10 tracking-tighter">Max</span>
            </div>

            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 flex flex-col items-center gap-1">
               <MapPin className="w-3 h-3 text-pink-500 fill-pink-500/20 animate-bounce" />
               <span className="text-[6px] font-black uppercase text-pink-500 tracking-tighter">Medic station</span>
            </div>
            
            <div className="absolute bottom-3 right-6 flex items-center gap-2">
               <Navigation className="w-2.5 h-2.5 text-white/20 animate-pulse" />
               <span className="text-[7px] font-black uppercase tracking-[0.3em] text-white/20">GPS active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full shrink-0 flex justify-center mt-4">
        <button
          onClick={onComplete}
          className="pill-button w-full max-w-sm bg-[#3EB489] text-black text-xl font-black neon-glow active:scale-95 transition-all h-[64px]"
        >
          Confirm network
        </button>
      </div>
    </div>
  );
}
