'use client';

import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePopupStore } from '@/store/popup-store';
import { WelcomePopup } from './welcome/WelcomePopup';
import { AiWarningPopup } from './warning/AiWarningPopup';
import { GenerateLoadingPopup } from './loading/GenerateLoadingPopup';
import { SuccessPopup } from './success/SuccessPopup';
import { ErrorPopup } from './error/ErrorPopup';
import { AnnouncementPopup } from './announcement/AnnouncementPopup';
import { SecurityPopup } from './security/SecurityPopup';
import { SessionExpiredPopup } from './session/SessionExpiredPopup';
import { TutorialPopup } from './tutorial/TutorialPopup';
import { useSession } from 'next-auth/react';

export function PopupProvider() {
  const { activePopup, dismissActive } = usePopupStore();
  
  // Optional next-auth session context to pass user ID
  const sessionResult = useSession();
  const userId = sessionResult?.data?.user ? (sessionResult.data.user as any).id : undefined;

  // Listen for keyboard ESC key to close dismissible popups
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activePopup && activePopup.dismissible) {
        dismissActive(userId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePopup, dismissActive, userId]);

  const handleDismiss = () => {
    dismissActive(userId);
  };

  const handleAiWarningDismiss = (dontShowAgain: boolean) => {
    // If user checked "don't show again", register persistence
    dismissActive(dontShowAgain ? userId : undefined);
  };

  // Render the specific active popup component
  const renderPopupContent = () => {
    if (!activePopup) return null;

    switch (activePopup.type) {
      case 'welcome':
        return (
          <WelcomePopup
            popup={activePopup}
            onDismiss={handleDismiss}
            onStartTutorial={() => {
              handleDismiss();
              // Queue a tutorial popup right after welcome dismisses
              setTimeout(() => {
                usePopupStore.getState().enqueue({
                  id: 'tutorial-onboarding',
                  title: 'Onboarding Tutorial',
                  message: 'Panduan navigasi aplikasi SaaS e-operator by develzy.',
                  type: 'tutorial',
                  priority: 200,
                  dismissible: true,
                  createdAt: new Date(),
                });
              }, 400);
            }}
          />
        );
      
      case 'warning':
        return (
          <AiWarningPopup
            popup={activePopup}
            onDismiss={handleAiWarningDismiss}
            onClose={handleDismiss}
          />
        );

      case 'loading':
      case 'ai_processing':
        return (
          <GenerateLoadingPopup
            popup={activePopup}
            onComplete={handleDismiss}
          />
        );

      case 'success':
      case 'sync_success':
        return (
          <SuccessPopup
            popup={activePopup}
            onDismiss={handleDismiss}
            onPreview={activePopup.payload?.retryAction} // Reuse callbacks
          />
        );

      case 'error':
        return (
          <ErrorPopup
            popup={activePopup}
            onDismiss={handleDismiss}
            onRetry={activePopup.payload?.retryAction}
          />
        );

      case 'security':
        return (
          <SecurityPopup
            popup={activePopup}
            onDismiss={handleDismiss}
            onLogoutAllDevices={() => {
              alert('Mengirim permintaan logout global untuk perangkat lain...');
              handleDismiss();
            }}
          />
        );

      case 'session_expired':
        return (
          <SessionExpiredPopup
            popup={activePopup}
            onRedirect={() => {
              handleDismiss();
              window.location.href = '/api/auth/signin';
            }}
          />
        );

      case 'tutorial':
        return (
          <TutorialPopup
            popup={activePopup}
            onDismiss={handleDismiss}
          />
        );

      // Map other announcement-style popups to the modular Announcement component
      case 'maintenance':
      case 'dev_announcement':
      case 'feature_update':
      case 'announcement':
      case 'system_info':
      case 'school_info':
      case 'wa_contact':
      case 'realtime':
      case 'backup_reminder':
        return (
          <AnnouncementPopup
            popup={activePopup}
            onDismiss={handleDismiss}
          />
        );

      default:
        return (
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm border border-slate-100">
            <h3 className="font-bold text-slate-900">{activePopup.title}</h3>
            <p className="text-xs text-slate-500 mt-2">{activePopup.message}</p>
            <button onClick={handleDismiss} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs">Tutup</button>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {activePopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/40 dark:bg-slate-950/60 backdrop-blur-md p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15, rotateX: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10, rotateX: 10 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
            className="w-full max-w-lg flex items-center justify-center perspective-[1000px]"
          >
            {renderPopupContent()}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
