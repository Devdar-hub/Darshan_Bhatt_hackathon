import { NextRequest, NextResponse } from 'next/server';
import { getCompanyNews, getMarketNews } from '@/lib/news';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol');

    try {
        let news;
        if (symbol) {
            news = await getCompanyNews(symbol);
        } else {
            news = await getMarketNews();
        }
        return NextResponse.json(news);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}
