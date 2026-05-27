'use client';

import React, { useState, useEffect } from 'react';
import { Lock, LogIn, Hourglass } from 'lucide-react';
import { PopupData } from '@/types/popup';

interface SessionExpiredPopupProps {
  popup: PopupData;
  onRedirect: () => void;
}

export function SessionExpiredPopup({ popup, onRedirect }: SessionExpiredPopupProps) {
  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onRedirect]);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white border border-slate-800 shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Animated Timeout Icon */}
        <div className="w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-5 animate-pulse">
          <Lock className="w-8 h-8 text-yellow-400" />
        </div>

        <h3 className="text-xl font-extrabold tracking-tight text-white">
          Sesi Anda Telah Berakhir
        </h3>
        
        <p className="text-slate-400 text-xs mt-2">
          Demi menjaga keamanan data multi-tenant sekolah Anda, sesi login Anda otomatis ditutup karena tidak ada aktivitas.
        </p>

        {/* Redirect timer alert */}
        <div className="w-full mt-6 bg-slate-950/50 border border-white/5 rounded-2xl p-4 flex items-center justify-center space-x-2 text-xs">
          <Hourglass className="w-4 h-4 text-blue-400 animate-spin" />
          <span className="text-slate-300">
            Mengarahkan ke halaman login dalam{' '}
            <span className="text-yellow-400 font-mono font-black">{secondsLeft}</span> detik...
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={onRedirect}
          className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/15 flex items-center justify-center transition-all active:scale-95"
        >
          <LogIn className="w-4 h-4 mr-1.5" /> Login Kembali
        </button>
      </div>
    </div>
  );
}
