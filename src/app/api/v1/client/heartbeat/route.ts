import { NextRequest, NextResponse } from 'next/server';
import { ClientApiService } from '@/server/services/client-api.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0] || req.ip || '127.0.0.1';

    const result = await ClientApiService.heartbeat({
      session_token: body.session_token,
      hwid: body.hwid,
      timestamp: Number(body.timestamp || 0),
      nonce: body.nonce,
      signature: body.signature,
      ipAddress,
    });

    return NextResponse.json(result.body, { status: result.status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
