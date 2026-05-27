'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, ShieldAlert, Check, X } from 'lucide-react';
import { PopupData } from '@/types/popup';

interface AiWarningPopupProps {
  popup: PopupData;
  onDismiss: (dontShowAgain: boolean) => void;
  onClose: () => void;
}

export function AiWarningPopup({ popup, onDismiss, onClose }: AiWarningPopupProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900/90 p-8 text-white border-2 border-blue-500/40 shadow-[0_0_50px_rgba(59,130,246,0.3)] backdrop-blur-xl w-full max-w-lg animate-in fade-in zoom-in-95 duration-300">
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/10 rounded-full filter blur-3xl pointer-events-none" />

      <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors">
        <X className="w-5 h-5" />
      </button>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Glowing AI Icon */}
        <div className="relative w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/30 mb-6">
          <BrainCircuit className="w-9 h-9 text-blue-400 animate-pulse" />
          <div className="absolute -inset-0.5 bg-blue-500/20 rounded-2xl blur-md opacity-50" />
        </div>

        <h3 className="text-xl font-extrabold tracking-tight flex items-center justify-center">
          <ShieldAlert className="w-5 h-5 text-yellow-400 mr-2" /> AI Assistant Disclaimer
        </h3>
        
        <p className="text-slate-300 text-sm leading-relaxed mt-4 bg-slate-950/40 border border-white/5 rounded-2xl p-4 text-left">
          “AI membantu mempercepat administrasi pendidikan, namun seluruh hasil tetap wajib ditinjau kembali oleh pengguna sebelum digunakan secara resmi.”
        </p>

        {/* Checkbox "Jangan tampilkan lagi" */}
        <label className="flex items-center space-x-3 cursor-pointer group mt-6 select-none">
          <div className="relative">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={() => setDontShowAgain(!dontShowAgain)}
              className="sr-only"
            />
            <div className={`w-5 h-5 rounded-md border transition-all flex items-center justify-center ${dontShowAgain ? 'bg-blue-600 border-blue-500 shadow-lg' : 'border-slate-500 bg-transparent group-hover:border-slate-400'}`}>
              {dontShowAgain && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
            </div>
          </div>
          <span className="text-xs text-slate-400 group-hover:text-slate-300 font-semibold transition-colors">
            Jangan tampilkan lagi untuk akun saya
          </span>
        </label>

        {/* Actions */}
        <div className="flex space-x-3 w-full mt-6">
          <button
            onClick={() => onDismiss(dontShowAgain)}
            className="flex-1 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/15 transition-all active:scale-95"
          >
            Saya Mengerti
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all border border-slate-700"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
