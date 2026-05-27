import { usePopupStore } from '@/store/popup-store';
import { PopupData, PopupType } from '@/types/popup';

export function usePopup() {
  const { enqueue, dismissActive, activePopup, queue, history, trackAction } = usePopupStore();

  const showPopup = (popup: Omit<PopupData, 'id' | 'createdAt'>) => {
    const id = `${popup.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fullPopup: PopupData = {
      ...popup,
      id,
      createdAt: new Date(),
    };
    enqueue(fullPopup);
    return id;
  };

  const showWelcome = (payload: { userName: string; schoolName: string; role: string; level: string }) => {
    return showPopup({
      title: 'Selamat Datang Kembali',
      message: 'Masuk ke dalam sistem portal administrasi sekolah.',
      type: 'welcome',
      priority: 100, // Very high
      dismissible: true,
      payload,
    });
  };

  const showAiWarning = (onConfirm?: () => void) => {
    return showPopup({
      title: 'AI Verification & Disclaimer',
      message: 'AI membantu mempercepat administrasi pendidikan, namun seluruh hasil tetap wajib ditinjau kembali oleh pengguna sebelum digunakan secara resmi.',
      type: 'warning',
      priority: 90,
      dismissible: false,
      payload: {
        retryAction: onConfirm, // Reuse click action callback
      },
    });
  };

  const showAiLoading = (statusText: string = 'Menyusun Struktur...', estimatedSeconds = 12) => {
    return showPopup({
      title: 'AI Generator Sedang Memproses',
      message: 'Mohon tunggu, model kecerdasan buatan sedang merancang data administrasi sekolah Anda.',
      type: 'loading',
      priority: 95, // High priority so it sits on top of warnings
      dismissible: false,
      payload: {
        progress: 5,
        statusText,
        estimatedSeconds,
      },
    });
  };

  const showSuccess = (payload: { documentName: string; generateTime: string; fileSize: string; downloadUrl: string }) => {
    return showPopup({
      title: 'Dokumen Berhasil Dihasilkan',
      message: 'AI berhasil menyelesaikan proses kompilasi dokumen administrasi sekolah Anda.',
      type: 'success',
      priority: 80,
      dismissible: true,
      payload,
    });
  };

  const showError = (message: string, errorCode: string = 'ERR_AI_500', onRetry?: () => void) => {
    return showPopup({
      title: 'Gagal Menghasilkan Dokumen',
      message,
      type: 'error',
      priority: 85,
      dismissible: true,
      payload: {
        errorCode,
        retryAction: onRetry,
      },
    });
  };

  const showSecurityWarning = (payload: { browser: string; device: string; location: string; ipAddress: string; loginTime: string }) => {
    return showPopup({
      title: 'Deteksi Login Perangkat Baru',
      message: 'Kami mendeteksi aktivitas login baru dari perangkat yang belum pernah digunakan sebelumnya.',
      type: 'security',
      priority: 98, // Critical security popup
      dismissible: false,
      payload,
    });
  };

  return {
    activePopup,
    queue,
    history,
    showPopup,
    showWelcome,
    showAiWarning,
    showAiLoading,
    showSuccess,
    showError,
    showSecurityWarning,
    dismissActive,
    trackAction,
  };
}
