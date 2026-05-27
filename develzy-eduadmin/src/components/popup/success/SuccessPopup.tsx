'use client';

import React from 'react';
import { CheckCircle2, Download, Eye, X, FileText } from 'lucide-react';
import { PopupData } from '@/types/popup';

interface SuccessPopupProps {
  popup: PopupData;
  onDismiss: () => void;
  onPreview?: () => void;
}

export function SuccessPopup({ popup, onDismiss, onPreview }: SuccessPopupProps) {
  const { payload } = popup;
  const documentName = payload?.documentName || 'Dokumen Administrasi';
  const generateTime = payload?.generateTime || '0.8s';
  const fileSize = payload?.fileSize || '142 KB';
  const downloadUrl = payload?.downloadUrl || '#';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 p-8 text-slate-800 dark:text-slate-200 border border-emerald-500/20 dark:border-emerald-500/10 shadow-[0_0_50px_rgba(16,185,129,0.15)] w-full max-w-md">
      {/* Decorative Glow Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none" />

      <button onClick={onDismiss} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
        <X className="w-5 h-5" />
      </button>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Animated Check Emblem */}
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center mb-5">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 animate-in zoom-in" />
        </div>

        <h3 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Pembuatan Dokumen Sukses!
        </h3>
        <p className="text-xs text-slate-400 mt-1">AI Berhasil menyusun data administrasi sekolah Anda.</p>

        {/* Document Stats Box */}
        <div className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 mt-5 space-y-3 text-left">
          <div className="flex items-start space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <FileText className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="overflow-hidden">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Nama File</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">{documentName}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Ukuran File</span>
              <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 mt-0.5 block">{fileSize}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Waktu Analisa</span>
              <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 mt-0.5 block">{generateTime}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full mt-6">
          <a
            href={downloadUrl}
            download
            onClick={onDismiss}
            className="flex-1 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/10 flex items-center justify-center transition-all active:scale-95"
          >
            <Download className="w-4 h-4 mr-1.5" /> Unduh Dokumen
          </a>
          
          {onPreview && (
            <button
              onClick={onPreview}
              className="px-5 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl flex items-center justify-center transition-all border border-slate-200 dark:border-slate-800 active:scale-95"
            >
              <Eye className="w-4 h-4 mr-1.5" /> Preview
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
