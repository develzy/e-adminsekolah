import { NextRequest, NextResponse } from 'next/server';
import { PopupManager } from '@/lib/popup-manager';

export async function POST(req: NextRequest) {
  try {
    const { userId, popupId } = await req.json();

    if (!userId || !popupId) {
      return NextResponse.json({ error: 'Missing userId or popupId' }, { status: 400 });
    }

    await PopupManager.dismissPopupForUser(userId, popupId);

    return NextResponse.json({ success: true, message: 'Popup marked as dismissed' });
  } catch (error: any) {
    console.error('Error dismissing popup:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
