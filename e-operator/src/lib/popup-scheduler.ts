import { PopupData } from '@/types/popup';

export class PopupScheduler {
  /**
   * Filter popups that are currently active based on date range
   */
  static getActiveScheduledPopups(popups: PopupData[]): PopupData[] {
    const now = new Date();
    return popups.filter((popup) => {
      // Check start date
      if (popup.startDate) {
        const start = new Date(popup.startDate);
        if (now < start) return false;
      }
      
      // Check end date
      if (popup.endDate) {
        const end = new Date(popup.endDate);
        if (now > end) return false;
      }
      
      return true;
    });
  }

  /**
   * Filter popups targeting specific school tenant level and user role
   */
  static getTargetedPopups(
    popups: PopupData[],
    role: string,
    schoolLevel?: string,
    tenantId?: string
  ): PopupData[] {
    return popups.filter((popup) => {
      // 1. Tenant match (if specific tenant, check it)
      if (popup.targetTenant && popup.targetTenant !== tenantId) {
        return false;
      }

      // 2. Role match (if specific role, check it)
      if (popup.targetRole && popup.targetRole !== role) {
        return false;
      }

      // 3. Jenjang (school level) match (if specified, e.g. "SMK")
      if (popup.targetJenjang && schoolLevel) {
        if (popup.targetJenjang.toUpperCase() !== schoolLevel.toUpperCase()) {
          return false;
        }
      }

      return true;
    });
  }
}
