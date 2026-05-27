import { db } from './db';
import { PopupData, PopupType } from '@/types/popup';
import { PopupScheduler } from './popup-scheduler';
import { getPopupPriority } from './popup-priority';

export class PopupManager {
  /**
   * Fetch all active and non-dismissed popups for a specific user and tenant
   */
  static async fetchActivePopupsForUser(
    userId: string,
    role: string,
    schoolLevel?: string,
    tenantId?: string
  ): Promise<PopupData[]> {
    const now = new Date();

    // Query active popups from DB
    const popups = await db.popup.findMany({
      where: {
        AND: [
          {
            OR: [
              { startDate: null },
              { startDate: { lte: now } }
            ]
          },
          {
            OR: [
              { endDate: null },
              { endDate: { gte: now } }
            ]
          }
        ]
      }
    });

    // Query popups already dismissed by this user
    const dismissedPopups = await db.userPopup.findMany({
      where: {
        userId,
        dismissed: true,
      },
      select: {
        popupId: true,
      },
    });

    const dismissedIds = new Set(dismissedPopups.map((dp) => dp.popupId));

    // Convert and filter based on scheduler target and dismissal
    const formatted: PopupData[] = popups
      .map((p) => ({
        id: p.id,
        title: p.title,
        message: p.message,
        type: p.type as PopupType,
        targetRole: p.targetRole,
        targetTenant: p.targetTenant,
        targetJenjang: p.targetJenjang,
        isGlobal: p.isGlobal,
        priority: p.priority,
        dismissible: p.dismissible,
        startDate: p.startDate,
        endDate: p.endDate,
        createdAt: p.createdAt,
      }))
      .filter((p) => !dismissedIds.has(p.id));

    return PopupScheduler.getTargetedPopups(formatted, role, schoolLevel, tenantId);
  }

  /**
   * Save dismissal to DB for a user
   */
  static async dismissPopupForUser(userId: string, popupId: string): Promise<void> {
    await db.userPopup.upsert({
      where: {
        userId_popupId: {
          userId,
          popupId,
        },
      },
      update: {
        dismissed: true,
        seenAt: new Date(),
      },
      create: {
        userId,
        popupId,
        dismissed: true,
        seenAt: new Date(),
      },
    });
  }

  /**
   * Create a new popup from Super Admin Panel
   */
  static async createPopup(data: {
    title: string;
    message: string;
    type: PopupType;
    targetRole?: string;
    targetTenant?: string;
    targetJenjang?: string;
    isGlobal?: boolean;
    priority?: number;
    dismissible?: boolean;
    startDate?: Date;
    endDate?: Date;
  }): Promise<PopupData> {
    const priority = getPopupPriority(data.type, data.priority);

    const created = await db.popup.create({
      data: {
        title: data.title,
        message: data.message,
        type: data.type,
        targetRole: data.targetRole || null,
        targetTenant: data.targetTenant || null,
        targetJenjang: data.targetJenjang || null,
        isGlobal: data.isGlobal ?? true,
        priority,
        dismissible: data.dismissible ?? true,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
      },
    });

    return {
      ...created,
      type: created.type as PopupType,
    };
  }
}
