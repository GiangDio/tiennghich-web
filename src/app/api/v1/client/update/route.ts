export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { ClientApiService } from '@/server/services/client-api.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const currentVersion = searchParams.get('version') || '1.0.0';
    const channel = (searchParams.get('channel') as 'STABLE' | 'BETA') || 'STABLE';

    const result = await ClientApiService.checkUpdate(currentVersion, channel);
    return NextResponse.json(result.body, { status: result.status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
