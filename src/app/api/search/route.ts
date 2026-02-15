import { NextRequest, NextResponse } from 'next/server';
import { searchSymbols } from '@/lib/stock';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ results: [] });
    }

    try {
        const results = await searchSymbols(query);
        return NextResponse.json({ results });
    } catch (error) {
        console.error("Search API Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
