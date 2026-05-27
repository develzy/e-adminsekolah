import { NextRequest, NextResponse } from 'next/server';

// Simplistic high-speed developer analytical logs storage (could write to clickhouse/db log table)
export async function POST(req: NextRequest) {
  try {
    const { popupId, action } = await req.json();

    if (!popupId || !action) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // In a real application, you can persist this to a system_audit or popup_analytics table:
    // await db.popupAnalytics.create({ data: { popupId, action, timestamp: new Date() } });
    console.log(`[POPUP ANALYTICS] ID: ${popupId} | Action: ${action} | Time: ${new Date().toISOString()}`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error logging popup analytics:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
