'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, LayoutDashboard, Menu, BrainCircuit, FileDown, Building2, Settings, Share2, Database, X } from 'lucide-react';
import { PopupData } from '@/types/popup';

interface TutorialPopupProps {
  popup: PopupData;
  onDismiss: () => void;
}

const STEPS = [
  {
    title: 'Dashboard Overview',
    description: 'Pusat visualisasi data SaaS. Pantau statistik siswa, telemetri real-time, dan audit log sistem dalam satu dashboard.',
    icon: LayoutDashboard,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    title: 'Sidebar Navigasi',
    description: 'Akses cepat ke seluruh menu yang sesuai dengan hak akses Anda tanpa ada pembatasan fitur.',
    icon: Menu,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
  },
  {
    title: 'Generator Evaluasi AI',
    description: 'Buat bank soal, silabus kurikulum merdeka, kisi-kisi ujian, dan materi ajar dalam hitungan detik menggunakan asisten AI.',
    icon: BrainCircuit,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    title: 'Ekspor PDF Digital',
    description: 'Semua dokumen, raport, dan analisis hasil CBT dapat diekspor secara instan dengan satu klik ke format PDF resmi.',
    icon: FileDown,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    title: 'Manajemen Data Sekolah',
    description: 'Kelola data guru, siswa, kelas, wali kelas, dan informasi multi-tenant untuk sekolah Anda.',
    icon: Building2,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    title: 'Pengaturan Kustom',
    description: 'Sesuaikan konfigurasi tenant, template kop surat sekolah, logo, kop ujian CBT, dan preferensi branding.',
    icon: Settings,
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
  },
  {
    title: 'Integrasi AI & Google',
    description: 'Otentikasi aman menggunakan Google Account, Microsoft, dan sinkronkan dengan Google Classroom.',
    icon: Share2,
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
  },
  {
    title: 'Backup Data Otomatis',
    description: 'Unduh salinan cadangan D1 database Anda kapan saja dalam format JSON terenkripsi demi keamanan.',
    icon: Database,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
  },
];

export function TutorialPopup({ popup, onDismiss }: TutorialPopupProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onDismiss();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = STEPS[currentStep];
  const IconComponent = step.icon;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 p-8 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg">
      {/* Absolute Close */}
      <button onClick={onDismiss} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
        <X className="w-5 h-5" />
      </button>

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Step Header Indicator */}
        <div className="flex items-center justify-between w-full pb-4 border-b border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">
            Panduan Pengguna Baru
          </span>
          <span className="text-xs font-mono font-bold text-slate-400">
            Langkah {currentStep + 1} dari {STEPS.length}
          </span>
        </div>

        {/* Step Transition Wrapper */}
        <div className="w-full flex flex-col items-center text-center mt-6 min-h-[220px]">
          {/* Glowing Icon */}
          <div className={`w-16 h-16 rounded-2xl ${step.bg} flex items-center justify-center mb-5`}>
            <IconComponent className={`w-8 h-8 ${step.color}`} />
          </div>

          <h3 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {step.title}
          </h3>
          
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-3 max-w-md">
            {step.description}
          </p>
        </div>

        {/* Step Progress Indicators */}
        <div className="flex justify-center space-x-1.5 w-full mt-6">
          {STEPS.map((_, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${idx === currentStep ? 'w-6 bg-blue-600' : 'w-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300'}`}
            />
          ))}
        </div>

        {/* Navigation Actions */}
        <div className="flex justify-between items-center w-full mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-40 transition-colors flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
          </button>
          
          <button
            onClick={nextStep}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-500/10 flex items-center"
          >
            {currentStep === STEPS.length - 1 ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Selesai
              </>
            ) : (
              <>
                Lanjut <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
