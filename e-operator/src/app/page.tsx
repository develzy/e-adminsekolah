'use client';

import React, { useState } from 'react';
import { usePopup } from '@/hooks/usePopup';
import { usePopupStore } from '@/store/popup-store';
import { 
  Sparkles, BrainCircuit, CheckCircle2, AlertCircle, Wrench, RefreshCw, Megaphone, 
  Lock, Laptop, LogIn, Hourglass, Menu, GraduationCap, Building2, UserCheck, 
  ShieldCheck, Share2, Database, HelpCircle, Server, Info, Phone, MessageSquare, Zap, Settings
} from 'lucide-react';

export default function Home() {
  const popupHelper = usePopup();
  const { enqueue, clearQueue } = usePopupStore();
  const [tenantName, setTenantName] = useState('Pondok Pesantren Darussalam');
  const [userName, setUserName] = useState('DEVELZY Developer');

  const triggerPopup = (type: string) => {
    switch (type) {
      case 'welcome':
        popupHelper.showWelcome({
          userName,
          schoolName: tenantName,
          role: 'super_admin',
          level: 'PONDOK PESANTREN',
        });
        break;

      case 'warning':
        popupHelper.showAiWarning(() => {
          alert('Disclaimer disetujui!');
        });
        break;

      case 'loading':
        popupHelper.showAiLoading('Menganalisa Silabus Kurikulum...', 10);
        break;

      case 'success':
        popupHelper.showSuccess({
          documentName: 'Laporan_Evaluasi_Akademik_2026.pdf',
          fileSize: '320 KB',
          generateTime: '1.2s',
          downloadUrl: '#',
        });
        break;

      case 'error':
        popupHelper.showError('Limit token API Gemini terlampaui. Harap tunggu beberapa menit.', 'ERR_GEMINI_429', () => {
          alert('Mencoba memproses ulang generator AI...');
        });
        break;

      case 'maintenance':
        enqueue({
          id: 'maintenance-pop',
          title: 'Pemeliharaan Server Berkala',
          message: 'Server Cloudflare D1 akan diistirahatkan untuk migrasi optimasi database pada tanggal 28 Mei 2026 pukul 01:00-03:00 WIB.',
          type: 'maintenance',
          priority: 800,
          dismissible: true,
          createdAt: new Date(),
        });
        break;

      case 'feature_update':
        enqueue({
          id: 'feat-update-pop',
          title: 'Fitur Pembuatan Raport K-Merdeka V2',
          message: 'Kini Anda dapat langsung mengimpor nilai spreadsheet secara bulk dan AI akan menyusun kalimat deskripsi capaian kompetensi secara otomatis.',
          type: 'feature_update',
          priority: 80,
          dismissible: true,
          createdAt: new Date(),
        });
        break;

      case 'announcement':
        enqueue({
          id: 'ann-pop',
          title: 'Pemberitahuan Ujian CBT Bersama',
          message: 'Jadwal pelaksanaan CBT Online serentak tingkat SMA/SMK dimulai senin depan. Pastikan server lokal terhubung ke database cloud.',
          type: 'announcement',
          priority: 100,
          dismissible: true,
          createdAt: new Date(),
        });
        break;

      case 'security':
        popupHelper.showSecurityWarning({
          browser: 'Firefox Developer Edition',
          device: 'MacBook Pro M3 Max',
          location: 'Surabaya, Indonesia',
          ipAddress: '112.215.174.12',
          loginTime: new Date().toLocaleString(),
        });
        break;

      case 'multi_login':
        enqueue({
          id: 'multi-login-pop',
          title: 'Deteksi Sesi Login Ganda',
          message: 'Akun Anda terdeteksi sedang login dari perangkat lain. Sesi ini akan ditutup secara otomatis untuk mencegah kebocoran data.',
          type: 'multi_login',
          priority: 750,
          dismissible: false,
          createdAt: new Date(),
        });
        break;

      case 'tutorial':
        enqueue({
          id: 'tutorial-pop',
          title: 'Panduan E-Operator',
          message: 'Mulai ikuti tur panduan menggunakan portal admin.',
          type: 'tutorial',
          priority: 200,
          dismissible: true,
          createdAt: new Date(),
        });
        break;

      case 'session_expired':
        enqueue({
          id: 'session-exp-pop',
          title: 'Sesi Login Berakhir',
          message: 'Sesi login Anda telah habis.',
          type: 'session_expired',
          priority: 1000,
          dismissible: false,
          createdAt: new Date(),
        });
        break;

      case 'ai_processing':
        enqueue({
          id: 'ai-processing-pop',
          title: 'AI Menghasilkan Konten Ujian',
          message: 'Harap tunggu, sistem sedang merancang 50 butir soal matematika berbasis HOTS.',
          type: 'ai_processing',
          priority: 550,
          dismissible: false,
          payload: {
            estimatedSeconds: 15,
            progress: 10,
            statusText: 'Merancang Butir Soal...',
          },
          createdAt: new Date(),
        });
        break;

      case 'system_info':
        enqueue({
          id: 'sys-info-pop',
          title: 'Informasi Node Cloudflare',
          message: 'Sistem sedang berjalan pada edge network Cloudflare di node CGK (Jakarta) dengan status D1 SQLite terhubung 100% online.',
          type: 'system_info',
          priority: 70,
          dismissible: true,
          createdAt: new Date(),
        });
        break;

      case 'school_info':
        enqueue({
          id: 'school-info-pop',
          title: 'Pembaruan Kapasitas Sekolah',
          message: 'Kapasitas database sekolah Anda telah ditingkatkan menjadi maksimum 1.500 akun siswa aktif.',
          type: 'school_info',
          priority: 60,
          dismissible: true,
          createdAt: new Date(),
        });
        break;

      case 'wa_contact':
        enqueue({
          id: 'wa-contact-pop',
          title: 'Pusat Bantuan WhatsApp',
          message: 'Butuh bantuan integrasi CBT lokal? Hubungi admin support Develzy langsung melalui chat WhatsApp resmi kami.',
          type: 'wa_contact',
          priority: 50,
          dismissible: true,
          createdAt: new Date(),
        });
        break;

      case 'realtime':
        enqueue({
          id: 'realtime-pop',
          title: 'Pemberitahuan Darurat',
          message: 'Peringatan kegagalan sinkronisasi hosting ujian sekolah. Mohon admin sekolah segera memeriksa koneksi internet.',
          type: 'realtime',
          priority: 40,
          dismissible: true,
          createdAt: new Date(),
        });
        break;

      case 'backup_reminder':
        enqueue({
          id: 'backup-rem-pop',
          title: 'Pengingat Backup Basis Data',
          message: 'Anda belum mencadangkan database D1 sekolah Anda dalam minggu ini. Disarankan melakukan backup demi mencegah kehilangan data.',
          type: 'backup_reminder',
          priority: 300,
          dismissible: true,
          createdAt: new Date(),
        });
        break;

      case 'sync_success':
        enqueue({
          id: 'sync-succ-pop',
          title: 'Penyelarasan Data Selesai',
          message: '1.248 data profil siswa dan wali murid sukses disinkronkan ke server pusat portal kemendikbud.',
          type: 'sync_success',
          priority: 350,
          dismissible: true,
          createdAt: new Date(),
        });
        break;

      case 'dev_announcement':
        enqueue({
          id: 'dev-ann-pop',
          title: 'Pembaruan SDK Gemini AI 1.5 Pro',
          message: 'Seluruh engine kecerdasan buatan telah dimigrasikan menggunakan LLM Gemini 1.5 Pro terbaru untuk meningkatkan akurasi analisis raport hingga 40%.',
          type: 'dev_announcement',
          priority: 150,
          dismissible: true,
          createdAt: new Date(),
        });
        break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans relative overflow-hidden">
      {/* Dynamic Background Mesh Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />

      {/* Decorative Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse" />

      {/* Navbar */}
      <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 relative z-10 bg-slate-950/40 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center p-1.5 shadow-lg shadow-blue-500/20">
            <Zap className="w-full h-full text-white" />
          </div>
          <div>
            <span className="text-sm font-black tracking-tight text-white uppercase">e-operator <span className="text-yellow-400">by develzy</span></span>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Enterprise SaaS Portal • v3.0</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <span className="text-xs font-bold text-slate-300 block">{userName}</span>
            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Super Admin / Developer</span>
          </div>
        </div>
      </header>

      {/* Main Console Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-8 relative z-10 space-y-8">
        
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-900/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="relative z-10 max-w-2xl">
            <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest bg-yellow-400/10 px-2.5 py-1 rounded-full border border-yellow-400/20">
              Enterprise Dashboard
            </span>
            <h1 className="text-3xl font-black text-white mt-3 tracking-tight">
              Enterprise Popup & Queue System Console
            </h1>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Konsol manajemen dan pengujian sistem antrian pop-up global SaaS e-operator by develzy. Gunakan panel di bawah ini untuk mensimulasikan otentikasi user, AI generator loading, warning disclaimers, dan 20 jenis pengumuman real-time lainnya.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 relative z-10 shrink-0">
            <button 
              onClick={() => triggerPopup('welcome')}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center"
            >
              <LogIn className="w-4 h-4 mr-1.5" /> Simulasi Login User
            </button>
            <button 
              onClick={clearQueue}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all border border-slate-700 active:scale-95"
            >
              Bersihkan Antrian
            </button>
          </div>
        </div>

        {/* Configurations Forms Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Configure mock credentials */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-4 backdrop-blur-sm">
            <h3 className="font-extrabold text-white text-sm flex items-center border-b border-slate-850 pb-3">
              <Settings className="w-4.5 h-4.5 mr-2 text-blue-500" /> Konfigurasi Simulasi Tenant
            </h3>
            
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Nama Sekolah Tenant</label>
              <input 
                type="text" 
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 text-white rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:outline-none transition-colors"
                placeholder="Nama sekolah..." 
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Nama Akun User</label>
              <input 
                type="text" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 text-white rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:outline-none transition-colors"
                placeholder="Nama pengguna..." 
              />
            </div>
            
            <div className="bg-slate-950/40 border border-slate-850 p-3.5 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Pemberitahuan Sistem</span>
              <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                Pop-up diatur berdasarkan skala prioritas numerik. Sistem antrian Zustand akan otomatis mendahulukan pop-up dengan tingkat urgensi tertinggi (seperti session timeout / security) di atas dialog tutorial dan welcome screen.
              </p>
            </div>
          </div>

          {/* Interactive Trigger Grid */}
          <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm space-y-4">
            <h3 className="font-extrabold text-white text-sm flex items-center border-b border-slate-850 pb-3">
              <Sparkles className="w-4.5 h-4.5 mr-2 text-yellow-400" /> Daftar Pengujian 20 Jenis Pop-up
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              
              {/* Row 1 */}
              <button 
                onClick={() => triggerPopup('welcome')}
                className="p-3 bg-slate-950 hover:bg-slate-850 border border-slate-850 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] active:scale-95 group"
              >
                <LogIn className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-[10px] font-bold text-slate-200">1. Welcome Popup</span>
              </button>

              <button 
                onClick={() => triggerPopup('warning')}
                className="p-3 bg-slate-950 hover:bg-slate-850 border border-slate-850 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] active:scale-95 group"
              >
                <BrainCircuit className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-[10px] font-bold text-slate-200">2. AI Warning Popup</span>
              </button>

              <button 
                onClick={() => triggerPopup('loading')}
                className="p-3 bg-slate-950 hover:bg-slate-850 border border-slate-850 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] active:scale-95 group"
              >
                <Hourglass className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform mb-1.5 animate-spin" />
                <span className="text-[10px] font-bold text-slate-200">3. Generate Loading</span>
              </button>

              <button 
                onClick={() => triggerPopup('success')}
                className="p-3 bg-slate-950 hover:bg-slate-850 border border-slate-850 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] active:scale-95 group"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-[10px] font-bold text-slate-200">4. Success Popup</span>
              </button>

              <button 
                onClick={() => triggerPopup('error')}
                className="p-3 bg-slate-950 hover:bg-slate-850 border border-slate-850 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] active:scale-95 group"
              >
                <AlertCircle className="w-5 h-5 text-rose-500 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-[10px] font-bold text-slate-200">5. Error Popup</span>
              </button>

              <button 
                onClick={() => triggerPopup('maintenance')}
                className="p-3 bg-slate-950 hover:bg-slate-850 border border-slate-850 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] active:scale-95 group"
              >
                <Wrench className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-[10px] font-bold text-slate-200">6. Maintenance</span>
              </button>

              <button 
                onClick={() => triggerPopup('feature_update')}
                className="p-3 bg-slate-950 hover:bg-slate-850 border border-slate-850 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] active:scale-95 group"
              >
                <Sparkles className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-[10px] font-bold text-slate-200">7. Feature Update</span>
              </button>

              <button 
                onClick={() => triggerPopup('announcement')}
                className="p-3 bg-slate-950 hover:bg-slate-850 border border-slate-850 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] active:scale-95 group"
              >
                <Megaphone className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-[10px] font-bold text-slate-200">8. Announcement</span>
              </button>

              <button 
                onClick={() => triggerPopup('security')}
                className="p-3 bg-slate-950 hover:bg-slate-850 border border-slate-850 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] active:scale-95 group"
              >
                <Laptop className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-[10px] font-bold text-slate-200">9. Security Check</span>
              </button>

              <button 
                onClick={() => triggerPopup('multi_login')}
                className="p-3 bg-slate-950 hover:bg-slate-850 border border-slate-850 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] active:scale-95 group"
              >
                <ShieldCheck className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-[10px] font-bold text-slate-200">10. Multi Login Check</span>
              </button>

              <button 
                onClick={() => triggerPopup('tutorial')}
                className="p-3 bg-slate-950 hover:bg-slate-850 border border-slate-850 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] active:scale-95 group"
              >
                <Menu className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-[10px] font-bold text-slate-200">11. Onboarding Tour</span>
              </button>

              <button 
                onClick={() => triggerPopup('session_expired')}
                className="p-3 bg-slate-950 hover:bg-slate-850 border border-slate-850 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] active:scale-95 group"
              >
                <Lock className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-[10px] font-bold text-slate-200">12. Session Expired</span>
              </button>

              <button 
                onClick={() => triggerPopup('ai_processing')}
                className="p-3 bg-slate-950 hover:bg-slate-850 border border-slate-850 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] active:scale-95 group"
              >
                <BrainCircuit className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-[10px] font-bold text-slate-200">13. AI Processing</span>
              </button>

              <button 
                onClick={() => triggerPopup('system_info')}
                className="p-3 bg-slate-950 hover:bg-slate-850 border border-slate-850 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] active:scale-95 group"
              >
                <Info className="w-5 h-5 text-slate-400 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-[10px] font-bold text-slate-200">14. System Info</span>
              </button>

              <button 
                onClick={() => triggerPopup('school_info')}
                className="p-3 bg-slate-950 hover:bg-slate-850 border border-slate-850 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] active:scale-95 group"
              >
                <Building2 className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-[10px] font-bold text-slate-200">15. School Info</span>
              </button>

              <button 
                onClick={() => triggerPopup('wa_contact')}
                className="p-3 bg-slate-950 hover:bg-slate-850 border border-slate-850 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] active:scale-95 group"
              >
                <Phone className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-[10px] font-bold text-slate-200">16. WA Contact</span>
              </button>

              <button 
                onClick={() => triggerPopup('realtime')}
                className="p-3 bg-slate-950 hover:bg-slate-850 border border-slate-850 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] active:scale-95 group"
              >
                <AlertCircle className="w-5 h-5 text-rose-500 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-[10px] font-bold text-slate-200">17. Realtime Notice</span>
              </button>

              <button 
                onClick={() => triggerPopup('backup_reminder')}
                className="p-3 bg-slate-950 hover:bg-slate-850 border border-slate-850 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] active:scale-95 group"
              >
                <Database className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-[10px] font-bold text-slate-200">18. Backup Alert</span>
              </button>

              <button 
                onClick={() => triggerPopup('sync_success')}
                className="p-3 bg-slate-950 hover:bg-slate-850 border border-slate-850 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] active:scale-95 group"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-[10px] font-bold text-slate-200">19. Sync Success</span>
              </button>

              <button 
                onClick={() => triggerPopup('dev_announcement')}
                className="p-3 bg-slate-950 hover:bg-slate-850 border border-slate-850 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] active:scale-95 group col-span-2 sm:col-span-1"
              >
                <ShieldCheck className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform mb-1.5" />
                <span className="text-[10px] font-bold text-slate-200">20. Developer Notice</span>
              </button>

            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-800 text-center text-xs text-slate-500 relative z-10 bg-slate-950/40 backdrop-blur-md">
        © 2026 e-operator by develzy. All rights reserved. Managed globally via Cloudflare Edge Network.
      </footer>
    </div>
  );
}
