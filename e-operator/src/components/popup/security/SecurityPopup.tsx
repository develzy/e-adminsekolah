'use client';

import React from 'react';
import { ShieldAlert, Laptop, Globe, Key, AlertTriangle, LogOut, Check } from 'lucide-react';
import { PopupData } from '@/types/popup';

interface SecurityPopupProps {
  popup: PopupData;
  onDismiss: () => void;
  onLogoutAllDevices: () => void;
}

export function SecurityPopup({ popup, onDismiss, onLogoutAllDevices }: SecurityPopupProps) {
  const { payload } = popup;
  const browser = payload?.browser || 'Chrome';
  const device = payload?.device || 'Windows Laptop';
  const location = payload?.location || 'Jakarta, Indonesia';
  const ipAddress = payload?.ipAddress || '180.252.124.91';
  const loginTime = payload?.loginTime || new Date().toLocaleString();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-8 text-white border-2 border-rose-500/40 shadow-[0_0_60px_rgba(244,63,94,0.3)] w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
      {/* Decorative Red Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-600/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Security Warning Emblem */}
        <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mb-5 animate-pulse">
          <ShieldAlert className="w-8 h-8 text-rose-500" />
        </div>

        <h3 className="text-lg font-black tracking-tight text-white flex items-center">
          <AlertTriangle className="w-4 h-4 text-yellow-400 mr-2" /> Login Baru Terdeteksi
        </h3>
        <p className="text-xs text-slate-400 mt-1 text-center">Tinjau aktivitas akses akun Anda di bawah ini.</p>

        {/* Device Information Grid */}
        <div className="w-full bg-slate-900/60 border border-white/5 rounded-2xl p-4 mt-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-xs text-slate-400 font-semibold flex items-center"><Laptop className="w-4 h-4 mr-2 text-rose-400" /> Perangkat & Browser</span>
            <span className="text-xs font-bold text-white text-right">{device} ({browser})</span>
          </div>
          
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-xs text-slate-400 font-semibold flex items-center"><Globe className="w-4 h-4 mr-2 text-rose-400" /> Lokasi & IP</span>
            <span className="text-xs font-bold text-white text-right">{location} ({ipAddress})</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold flex items-center"><Key className="w-4 h-4 mr-2 text-rose-400" /> Waktu Akses</span>
            <span className="text-xs font-bold text-white text-right">{loginTime}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full mt-6">
          <button
            onClick={onDismiss}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/10 flex items-center justify-center transition-all active:scale-95"
          >
            <Check className="w-4 h-4 mr-1.5" /> Ya, Itu Saya
          </button>
          
          <button
            onClick={onLogoutAllDevices}
            className="w-full py-3 bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 font-bold text-xs rounded-xl flex items-center justify-center transition-all border border-rose-500/20 active:scale-95"
          >
            <LogOut className="w-4 h-4 mr-1.5" /> Logout Semua Device
          </button>
        </div>
      </div>
    </div>
  );
}
