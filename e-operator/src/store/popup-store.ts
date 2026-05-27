import { create } from 'zustand';
import { PopupData, PopupState } from '@/types/popup';

export const usePopupStore = create<PopupState>((set, get) => ({
  queue: [],
  activePopup: null,
  history: [],
  dismissedPopupIds: new Set<string>(),

  enqueue: (popup: PopupData) => {
    const { queue, activePopup, dismissedPopupIds } = get();

    // Do not enqueue if already dismissed or already in queue
    if (dismissedPopupIds.has(popup.id) || queue.some((p) => p.id === popup.id)) {
      return;
    }

    // Merge and sort by priority descending, then by date created
    const updatedQueue = [...queue, popup].sort((a, b) => {
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    set({ queue: updatedQueue });

    // If there is no active popup or the new popup has higher priority than the active one, trigger it
    if (!activePopup || popup.priority > activePopup.priority) {
      if (activePopup) {
        // Put the old active back into the queue
        const reQueue = [...updatedQueue].filter((p) => p.id !== popup.id);
        set({
          activePopup: popup,
          queue: reQueue,
        });
      } else {
        set({
          activePopup: popup,
          queue: updatedQueue.filter((p) => p.id !== popup.id),
        });
      }
      get().trackAction(popup.id, 'seen');
    }
  },

  dismissActive: async (userId?: string) => {
    const { activePopup, queue, dismissedPopupIds } = get();
    if (!activePopup) return;

    // Add to local dismissed set
    const updatedDismissed = new Set(dismissedPopupIds);
    updatedDismissed.add(activePopup.id);

    // Record dismissed action
    get().trackAction(activePopup.id, 'dismissed');

    // Notify backend if userId is provided
    if (userId) {
      fetch('/api/popups/dismiss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ popupId: activePopup.id, userId }),
      }).catch((err) => console.error('Failed to report popup dismissal:', err));
    }

    // Load next from queue
    if (queue.length > 0) {
      const nextPopup = queue[0];
      const remainingQueue = queue.slice(1);
      set({
        activePopup: nextPopup,
        queue: remainingQueue,
        dismissedPopupIds: updatedDismissed,
      });
      get().trackAction(nextPopup.id, 'seen');
    } else {
      set({
        activePopup: null,
        dismissedPopupIds: updatedDismissed,
      });
    }
  },

  clearQueue: () => {
    set({ queue: [], activePopup: null });
  },

  setActivePopup: (popup: PopupData | null) => {
    set({ activePopup: popup });
    if (popup) {
      get().trackAction(popup.id, 'seen');
    }
  },

  trackAction: (popupId: string, action: 'seen' | 'dismissed' | 'clicked') => {
    const newLog = { popupId, action, timestamp: new Date() };
    set((state) => ({
      history: [...state.history, newLog],
    }));

    // Post to analytics backend in a non-blocking way
    fetch('/api/popups/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ popupId, action }),
    }).catch(() => {});
  },
}));
