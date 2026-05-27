'use client';

import React from 'react';
import { AlertCircle, RefreshCw, HelpCircle, X } from 'lucide-react';
import { PopupData } from '@/types/popup';

interface ErrorPopupProps {
  popup: PopupData;
  onDismiss: () => void;
  onRetry?: () => void;
}

export function ErrorPopup({ popup, onDismiss, onRetry }: ErrorPopupProps) {
  const { payload } = popup;
  const errorCode = payload?.errorCode || 'ERR_SYSTEM_500';
  const errorMessage = popup.message || 'Terjadi kesalahan sistem saat menghubungi server.';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 p-8 text-slate-800 dark:text-slate-200 border border-rose-500/20 dark:border-rose-500/10 shadow-[0_0_50px_rgba(244,63,94,0.15)] w-full max-w-md">
      {/* Decorative Glow Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-500/5 dark:bg-rose-500/10 rounded-full filter blur-3xl pointer-events-none" />

      <button onClick={onDismiss} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
        <X className="w-5 h-5" />
      </button>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Warning Icon */}
        <div className="w-16 h-16 rounded-full bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/20 flex items-center justify-center mb-5">
          <AlertCircle className="w-10 h-10 text-rose-500 animate-bounce" />
        </div>

        <h3 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Terjadi Gangguan Sistem
        </h3>
        <p className="text-xs text-slate-400 mt-1">Kami tidak dapat menyelesaikan permintaan Anda saat ini.</p>

        {/* Error Details Box */}
        <div className="w-full bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/30 rounded-2xl p-4 mt-5 text-left">
          <span className="text-[10px] text-rose-500 dark:text-rose-400 font-extrabold uppercase tracking-wider block">Kode Error</span>
          <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 block mt-0.5">{errorCode}</span>
          
          <span className="text-[10px] text-rose-500 dark:text-rose-400 font-extrabold uppercase tracking-wider block mt-3">Keterangan</span>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5">{errorMessage}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full mt-6">
          {onRetry && (
            <button
              onClick={() => {
                onDismiss();
                onRetry();
              }}
              className="flex-1 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/15 flex items-center justify-center transition-all active:scale-95"
            >
              <RefreshCw className="w-4 h-4 mr-1.5" /> Coba Lagi
            </button>
          )}
          
          <a
            href="https://wa.me/6281234567890" // Develzy official admin support
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl flex items-center justify-center transition-all border border-slate-200 dark:border-slate-800 active:scale-95"
          >
            <HelpCircle className="w-4 h-4 mr-1.5" /> Hubungi Admin
          </a>
        </div>
      </div>
    </div>
  );
}
