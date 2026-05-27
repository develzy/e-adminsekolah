'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, GraduationCap, Building2, UserCheck, ShieldCheck } from 'lucide-react';
import { PopupData } from '@/types/popup';

interface WelcomePopupProps {
  popup: PopupData;
  onDismiss: () => void;
  onStartTutorial?: () => void;
}

export function WelcomePopup({ popup, onDismiss, onStartTutorial }: WelcomePopupProps) {
  const { payload } = popup;
  const userName = payload?.userName || 'Pengguna';
  const schoolName = payload?.schoolName || 'Portal Eduadmin';
  const role = payload?.role || 'Guru';
  const level = payload?.level || 'SMA';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white/75 dark:bg-slate-900/75 p-8 text-slate-800 dark:text-slate-200 border border-white/20 dark:border-slate-800/50 shadow-2xl backdrop-blur-xl w-full max-w-lg">
      {/* Decorative Glow Orbs */}
      <div className="absolute -left-10 -top-10 w-40 h-40 bg-blue-500/20 rounded-full filter blur-2xl animate-pulse" />
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/10 rounded-full filter blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }} />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Animated Brand Emblem */}
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 10, stiffness: 100 }}
          className="w-20 h-20 bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-400 p-0.5 rounded-2xl shadow-xl shadow-blue-500/10 flex items-center justify-center mb-6 relative"
        >
          <div className="w-full h-full bg-slate-900 rounded-[14px] flex flex-col items-center justify-center p-2 border border-white/10">
            <span className="text-lg font-black tracking-tighter text-white">DEVELZY</span>
            <span className="text-[7px] font-black uppercase text-yellow-400 tracking-widest mt-0.5">EDUADMIN</span>
          </div>
          <motion.div 
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="absolute -top-2 -right-2 bg-yellow-400 text-blue-950 p-1 rounded-full shadow"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </motion.div>
        </motion.div>

        {/* Shimmer Greeting */}
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Selamat Datang,{' '}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-yellow-500 bg-clip-text text-transparent animate-shimmer">
            {userName}
          </span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1.5 flex items-center justify-center">
          <Building2 className="w-4 h-4 mr-1 text-blue-500" /> {schoolName}
        </p>

        {/* Metadata Badges */}
        <div className="grid grid-cols-2 gap-3 w-full mt-6">
          <div className="bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 rounded-2xl p-3 flex flex-col items-center">
            <UserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-1" />
            <span className="text-[10px] text-slate-400 font-bold uppercase">Hak Akses</span>
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-0.5 capitalize">
              {role.replace('_', ' ')}
            </span>
          </div>
          <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 flex flex-col items-center">
            <GraduationCap className="w-5 h-5 text-amber-500 mb-1" />
            <span className="text-[10px] text-slate-400 font-bold uppercase">Jenjang</span>
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-0.5 uppercase">
              {level}
            </span>
          </div>
        </div>

        {/* System Brief Info */}
        <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-left w-full mt-4">
          <div className="flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Sistem Siap Digunakan</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                Lisensi Enterprise penuh aktif. Anda memiliki akses penuh ke seluruh modul CBT, penilaian AI generator, backup database D1, dan portal sinkronisasi data tanpa pembatasan.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full mt-6">
          <button
            onClick={onDismiss}
            className="flex-1 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            Mulai Sekarang
          </button>
          {onStartTutorial && (
            <button
              onClick={onStartTutorial}
              className="flex-1 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all active:scale-95 border border-slate-200 dark:border-slate-800"
            >
              Lihat Tutorial
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
