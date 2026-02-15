import { NextRequest, NextResponse } from 'next/server';
import { getStockQuote } from '@/lib/stock';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol');

    if (!symbol) {
        return NextResponse.json({ error: 'Symbol required' }, { status: 400 });
    }

    const data = await getStockQuote(symbol);

    if (!data) {
        return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
    }

    return NextResponse.json(data);
}
