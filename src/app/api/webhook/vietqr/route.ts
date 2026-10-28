export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { VietQrWebhookService } from '@/server/services/vietqr-webhook.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiKeyHeader = req.headers.get('authorization')?.replace('Bearer ', '') || req.headers.get('x-api-key') || '';

    // Hỗ trợ chuẩn hóa payload từ nhiều cổng: SePay, Casso, Web2M
    const normalizedPayload = {
      gateway: body.gateway || 'vietqr',
      accountNumber: body.accountNumber || body.account_no || '',
      content: body.content || body.description || '',
      transferAmount: Number(body.transferAmount || body.amount || 0),
      referenceCode: String(body.referenceCode || body.reference || body.id || body.code || '').trim(),
      description: body.description || '',
    };

    const result = await VietQrWebhookService.processWebhook(normalizedPayload, apiKeyHeader);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi xử lý webhook!';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
