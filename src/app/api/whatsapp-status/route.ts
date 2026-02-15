import { NextRequest, NextResponse } from 'next/server';
import { initializeWhatsApp } from '@/lib/whatsapp';

export async function GET(request: NextRequest) {
    // Trigger initialization if not already running
    initializeWhatsApp();

    return NextResponse.json({
        message: 'WhatsApp initialization triggered. Check server terminal for QR Code.'
    });
}
