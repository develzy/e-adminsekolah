export type PopupType =
  | 'welcome'
  | 'warning'
  | 'loading'
  | 'success'
  | 'error'
  | 'maintenance'
  | 'feature_update'
  | 'announcement'
  | 'security'
  | 'multi_login'
  | 'tutorial'
  | 'session_expired'
  | 'ai_processing'
  | 'system_info'
  | 'school_info'
  | 'wa_contact'
  | 'realtime'
  | 'backup_reminder'
  | 'sync_success'
  | 'dev_announcement';

export interface PopupData {
  id: string;
  title: string;
  message: string;
  type: PopupType;
  targetRole?: string | null;
  targetTenant?: string | null;
  targetJenjang?: string | null;
  isGlobal?: boolean;
  priority: number; // Higher value = higher priority
  dismissible: boolean;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  createdAt?: string | Date;
  
  // Custom interactive payloads (can be dynamic depending on the type)
  payload?: {
    userName?: string;
    schoolName?: string;
    role?: string;
    level?: string;
    
    // Success/Error fields
    documentName?: string;
    generateTime?: string;
    fileSize?: string;
    downloadUrl?: string;
    errorCode?: string;
    retryAction?: () => void;
    
    // Security fields
    browser?: string;
    device?: string;
    location?: string;
    ipAddress?: string;
    loginTime?: string;

    // AI loading/processing fields
    progress?: number; // 0 to 100
    statusText?: string;
    estimatedSeconds?: number;
  };
}

export interface PopupState {
  queue: PopupData[];
  activePopup: PopupData | null;
  history: { popupId: string; action: 'seen' | 'dismissed' | 'clicked'; timestamp: Date }[];
  dismissedPopupIds: Set<string>;
  
  // Actions
  enqueue: (popup: PopupData) => void;
  dismissActive: (userId?: string) => void;
  clearQueue: () => void;
  setActivePopup: (popup: PopupData | null) => void;
  trackAction: (popupId: string, action: 'seen' | 'dismissed' | 'clicked') => void;
}
