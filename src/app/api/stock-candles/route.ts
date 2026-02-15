import { NextRequest, NextResponse } from 'next/server';
import { getStockCandles } from '@/lib/stock';
import '@/lib/whatsapp'; // Force WhatsApp client initialization on dashboard load

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol');
    const resolution = searchParams.get('resolution') || 'D';
    const count = parseInt(searchParams.get('count') || '30', 10);

    if (!symbol) {
        return NextResponse.json({ error: 'Symbol required' }, { status: 400 });
    }

    try {
        const data = await getStockCandles(symbol, resolution, count);
        if (!data || (data && (data as any).s === 'no_data')) {
            console.log("Returning mock data for candles");
            // Mock data for demo purposes since free API often fails for candles
            const mockCount = parseInt(searchParams.get('count') || '30', 10);
            const mockData = generateMockCandles(mockCount, 150); // Basic mock around $150
            return NextResponse.json(mockData);
        }
        return NextResponse.json(data);
    } catch (error) {
        console.error("Candle Fetch Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

function generateMockCandles(count: number, startPrice: number) {
    const c = [];
    const h = [];
    const l = [];
    const o = [];
    const t = [];
    let currentPrice = startPrice;
    const now = Math.floor(Date.now() / 1000);

    for (let i = 0; i < count; i++) {
        const change = (Math.random() - 0.5) * 5;
        const open = currentPrice;
        const close = currentPrice + change;
        const high = Math.max(open, close) + Math.random() * 2;
        const low = Math.min(open, close) - Math.random() * 2;

        c.push(close);
        h.push(high);
        l.push(low);
        o.push(open);
        t.push(now - (count - i) * 86400);
        currentPrice = close;
    }
    return { c, h, l, o, t, s: 'ok' };
}
