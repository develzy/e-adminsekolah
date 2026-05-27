import { NextRequest, NextResponse } from 'next/server';
import { PopupManager } from '@/lib/popup-manager';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const role = searchParams.get('role') || 'guru';
    const schoolLevel = searchParams.get('level') || undefined;
    const tenantId = searchParams.get('tenantId') || undefined;

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    const popups = await PopupManager.fetchActivePopupsForUser(
      userId,
      role,
      schoolLevel,
      tenantId
    );

    return NextResponse.json(popups);
  } catch (error: any) {
    console.error('Error fetching popups:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      message,
      type,
      targetRole,
      targetTenant,
      targetJenjang,
      isGlobal,
      priority,
      dismissible,
      startDate,
      endDate,
      token, // Mock API key verification for super_admin
    } = body;

    // Optional verification (token can be developer secret or NextAuth session checking)
    if (token !== 'develzy-dev-token-9981' && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized developer token' }, { status: 403 });
    }

    const newPopup = await PopupManager.createPopup({
      title,
      message,
      type,
      targetRole,
      targetTenant,
      targetJenjang,
      isGlobal,
      priority,
      dismissible,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });

    return NextResponse.json(newPopup, { status: 201 });
  } catch (error: any) {
    console.error('Error creating popup:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
