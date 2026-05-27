'use client';

import React from 'react';
import { Megaphone, Wrench, ShieldAlert, Sparkles, CheckCircle2, RefreshCw, Database, X, ExternalLink } from 'lucide-react';
import { PopupData } from '@/types/popup';

interface AnnouncementPopupProps {
  popup: PopupData;
  onDismiss: () => void;
}

export function AnnouncementPopup({ popup, onDismiss }: AnnouncementPopupProps) {
  const { type, title, message } = popup;

  // Determine colors and icon based on type
  const getConfig = () => {
    switch (type) {
      case 'maintenance':
        return {
          icon: Wrench,
          color: 'text-amber-500',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/20 dark:border-amber-500/10',
          glow: 'bg-amber-500/5',
          tag: 'Pemeliharaan Sistem',
        };
      case 'dev_announcement':
        return {
          icon: ShieldAlert,
          color: 'text-indigo-500',
          bg: 'bg-indigo-500/10',
          border: 'border-indigo-500/20 dark:border-indigo-500/10',
          glow: 'bg-indigo-500/5',
          tag: 'Developer Update',
        };
      case 'feature_update':
        return {
          icon: Sparkles,
          color: 'text-blue-500',
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/20 dark:border-blue-500/10',
          glow: 'bg-blue-500/5',
          tag: 'Fitur Baru Rilis',
        };
      case 'sync_success':
        return {
          icon: CheckCircle2,
          color: 'text-emerald-500',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/20 dark:border-emerald-500/10',
          glow: 'bg-emerald-500/5',
          tag: 'Sinkronisasi Sukses',
        };
      case 'backup_reminder':
        return {
          icon: Database,
          color: 'text-yellow-500',
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/20 dark:border-yellow-500/10',
          glow: 'bg-yellow-500/5',
          tag: 'Cadangan Basis Data',
        };
      default:
        return {
          icon: Megaphone,
          color: 'text-blue-600 dark:text-blue-400',
          bg: 'bg-blue-600/10',
          border: 'border-blue-500/20 dark:border-blue-500/10',
          glow: 'bg-blue-600/5',
          tag: 'Pengumuman Penting',
        };
    }
  };

  const config = getConfig();
  const IconComponent = config.icon;

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 p-8 text-slate-800 dark:text-slate-200 border ${config.border} shadow-2xl w-full max-w-md`}>
      {/* Decorative Glow Orb */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 ${config.glow} rounded-full filter blur-3xl pointer-events-none`} />

      {popup.dismissible && (
        <button onClick={onDismiss} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Thematic Icon */}
        <div className={`w-16 h-16 rounded-2xl ${config.bg} flex items-center justify-center mb-5`}>
          <IconComponent className={`w-8 h-8 ${config.color}`} />
        </div>

        {/* Small Tag */}
        <span className={`text-[10px] font-black uppercase tracking-widest ${config.color} px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800`}>
          {config.tag}
        </span>

        {/* Headline */}
        <h3 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-4">
          {title}
        </h3>

        {/* Description body */}
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 text-left">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3 w-full mt-6">
          <button
            onClick={onDismiss}
            className="flex-1 px-5 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
