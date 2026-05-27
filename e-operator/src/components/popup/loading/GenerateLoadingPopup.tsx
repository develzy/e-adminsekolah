'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { PopupData } from '@/types/popup';

interface GenerateLoadingPopupProps {
  popup: PopupData;
  onComplete?: () => void;
}

const STEPS = [
  'Menganalisa Materi',
  'Menyusun Struktur',
  'Menghasilkan Dokumen',
  'Merapikan Format',
  'Menyiapkan PDF',
  'Finalisasi',
];

export function GenerateLoadingPopup({ popup, onComplete }: GenerateLoadingPopupProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(popup.payload?.estimatedSeconds || 12);

  useEffect(() => {
    const totalTime = popup.payload?.estimatedSeconds || 12;
    const intervalTime = (totalTime * 1000) / 100;
    
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          if (onComplete) onComplete();
          return 100;
        }
        
        // Map progress to steps
        const nextProgress = prev + 1;
        const nextStepIndex = Math.min(
          Math.floor((nextProgress / 100) * STEPS.length),
          STEPS.length - 1
        );
        setCurrentStepIndex(nextStepIndex);
        
        return nextProgress;
      });
    }, intervalTime);

    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(timerInterval);
    };
  }, [popup.payload?.estimatedSeconds, onComplete]);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900/95 p-8 text-white border border-blue-500/30 shadow-[0_0_80px_rgba(59,130,246,0.25)] backdrop-blur-xl w-full max-w-md">
      {/* Dynamic scan line effect */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan z-20 pointer-events-none" />
      
      {/* Rotating gradient backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-tr from-blue-600/10 to-purple-600/10 rounded-full filter blur-3xl animate-spin pointer-events-none" style={{ animationDuration: '10s' }} />

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated AI processing circle */}
        <div className="relative w-24 h-24 flex items-center justify-center mb-6">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-blue-500/40"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            className="absolute inset-2 rounded-full border border-blue-500/20 border-t-yellow-400"
          />
          <BrainCircuit className="w-10 h-10 text-blue-400 animate-pulse relative z-10" />
        </div>

        {/* Realtime AI Title */}
        <h3 className="text-lg font-black tracking-tight flex items-center">
          <Sparkles className="w-4 h-4 mr-1.5 text-yellow-400 animate-bounce" /> AI Generator Aktif
        </h3>
        
        {/* Estimated Time Indicator */}
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">
          Estimasi selesai: <span className="text-yellow-400 font-mono font-black">{timeLeft}s</span>
        </span>

        {/* Big Progress Percentage */}
        <div className="text-4xl font-black font-mono text-white mt-4 tracking-tighter">
          {progress}%
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 border border-white/5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Realtime checklist steps status */}
        <div className="w-full mt-6 bg-slate-950/40 border border-white/5 rounded-2xl p-4 space-y-2.5 text-left">
          {STEPS.map((step, idx) => {
            const isCompleted = progress > ((idx + 1) / STEPS.length) * 100 || idx < currentStepIndex;
            const isActive = idx === currentStepIndex;

            return (
              <div 
                key={step} 
                className={`flex items-center justify-between text-xs transition-opacity duration-300 ${isCompleted ? 'text-blue-400 font-medium' : isActive ? 'text-white font-bold' : 'text-slate-500'}`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="flex items-center justify-center shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-blue-400 animate-in zoom-in" />
                    ) : isActive ? (
                      <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-700" />
                    )}
                  </div>
                  <span>{step}</span>
                </div>
                <span className="text-[9px] uppercase tracking-wider font-bold">
                  {isCompleted ? 'Selesai' : isActive ? 'Proses' : 'Antri'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
