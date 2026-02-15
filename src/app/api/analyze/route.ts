import { NextRequest, NextResponse } from 'next/server';
import { getStockQuote } from '@/lib/stock';
import { getCompanyNews } from '@/lib/news';
import { analyzeStock } from '@/lib/ai';
import { createClient } from '@/lib/supabase'; // Server client if needed, but here we can use the shared one or create one
// Actually for API routes we might want @supabase/ssr createServerClient with cookies if we need user context, 
// but for now let's use the basic client for inserting if we have an authenticated user.
// Wait, to insert into 'analyses' table linked to a user, we need the user's session.
// So we should verify auth here.

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { symbol } = body;

        if (!symbol) {
            return NextResponse.json({ error: 'Symbol required' }, { status: 400 });
        }

        // Sanitize input
        const cleanSymbol = symbol.trim().toUpperCase();
        // Basic mapping for common mistakes (optional but helpful for "TESLA")
        const symbolMap: Record<string, string> = {
            'TESLA': 'TSLA',
            'GOOGLE': 'GOOGL',
            'FACEBOOK': 'META'
        };
        const finalSymbol = symbolMap[cleanSymbol] || cleanSymbol;

        // 1. Get User Session
        const cookieStore = cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                },
            }
        );

        const { data: { user } } = await supabase.auth.getUser();

        // 2. Fetch Data
        const [stock, news] = await Promise.all([
            getStockQuote(finalSymbol),
            getCompanyNews(finalSymbol)
        ]);

        if (!stock) {
            return NextResponse.json({ error: 'Stock data not found' }, { status: 404 });
        }

        // 3. AI Analyze
        const analysis = await analyzeStock(finalSymbol, stock, news);

        // 4. Save to Supabase (if user is logged in)
        if (user) {
            await supabase.from('analyses').insert({
                user_id: user.id,
                stock_symbol: finalSymbol,
                signal: analysis.signal,
                confidence: analysis.confidence,
                reasoning: JSON.stringify(analysis.reasoning), // Store as JSON or Text
            });
        }

        return NextResponse.json(analysis);

    } catch (error: any) {
        console.error("Analysis API Error:", error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
