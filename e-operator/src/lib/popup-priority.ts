import { PopupType } from '@/types/popup';

export const POPUP_PRIORITIES: Record<PopupType, number> = {
  // Urgent System Alerts
  session_expired: 1000,
  security: 900,
  maintenance: 800,
  multi_login: 750,
  
  // Interactive Flow / AI Actions
  loading: 600,
  ai_processing: 550,
  warning: 500, // AI Warning before generation
  error: 450,
  success: 400,
  sync_success: 350,
  backup_reminder: 300,
  
  // Information & onboarding
  welcome: 250,
  tutorial: 200,
  
  // Announcements
  dev_announcement: 150,
  announcement: 100,
  feature_update: 80,
  system_info: 70,
  school_info: 60,
  wa_contact: 50,
  realtime: 40,
};

export function getPopupPriority(type: PopupType, customPriority?: number): number {
  if (typeof customPriority === 'number') {
    return customPriority;
  }
  return POPUP_PRIORITIES[type] || 0;
}
