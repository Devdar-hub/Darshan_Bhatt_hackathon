import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppMessage, initializeWhatsApp } from '@/lib/whatsapp';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { number, message } = body;

        if (!number || !message) {
            return NextResponse.json({ error: 'Missing number or message' }, { status: 400 });
        }

        // Trigger initialization if not ready (might need to perform this at app start)
        // Since this is an API route, we might trigger it here.
        // Note: Scan QR code in terminal.
        await initializeWhatsApp();

        try {
            await sendWhatsAppMessage(number, message);
            return NextResponse.json({ success: true, message: 'Message sent (or queued)' });
        } catch (error: any) {
            return NextResponse.json({ error: error.message || 'Failed to send message' }, { status: 500 });
        }

    } catch (error: any) {
        console.error('Error in WhatsApp API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
