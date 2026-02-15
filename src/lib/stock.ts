const finnhub = require('finnhub');
// const fs = require('fs'); // Removed debug logging
function getFinnhubClient() {
    if (!process.env.FINNHUB_API_KEY) {
        throw new Error("FINNHUB_API_KEY is missing");
    }

    // According to local node_modules/finnhub/README.md:
    // const finnhubClient = new finnhub.DefaultApi("<API_key>")
    return new finnhub.DefaultApi(process.env.FINNHUB_API_KEY);
}

export interface StockData {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    high: number;
    low: number;
    open: number;
    prevClose: number;
}

export interface TechnicalIndicators {
    rsi: number;
    macd: {
        macd: number;
        signal: number;
        histogram: number;
    };
}

export async function getStockQuote(symbol: string): Promise<StockData | null> {
    const finnhubClient = getFinnhubClient();
    return new Promise((resolve, reject) => {
        finnhubClient.quote(symbol.toUpperCase(), (error: any, data: any, response: any) => {
            if (error) {
                console.error("Finnhub Quote Error:", error);
                resolve(null);
            } else {
                resolve({
                    symbol: symbol.toUpperCase(),
                    price: data.c,
                    change: data.d,
                    changePercent: data.dp,
                    high: data.h,
                    low: data.l,
                    open: data.o,
                    prevClose: data.pc,
                });
            }
        });
    });
}

// Mocking indicators for now as Finnhub free tier might not have easy access to technicals directly via simple calls without complex setup or paid tiers for some endpoints. To be safe for hackathon, we can calculate simpler ones or mock if API limits hit.
// Actually Finnhub has 'stock/technical-indicator' endpoint but checking compatibility.
// For MVP, we will start with a basic fetching if available, else we might calculate RSI from candles if needed.
// Let's try to fetch candles and calculate RSI/MACD if we can, or use the indicator endpoint if it's free.
// Finnhub indicator endpoint is often paid.
// Backup: Use manual calculation on candle data.

export async function getStockCandles(symbol: string, resolution: string = 'D', count: number = 30) {
    const finnhubClient = getFinnhubClient();
    const end = Math.floor(Date.now() / 1000);
    const start = end - (count * 24 * 60 * 60 * 2); // approximate lookback

    return new Promise((resolve, reject) => {
        finnhubClient.stockCandles(symbol.toUpperCase(), resolution, start, end, (error: any, data: any) => {
            if (error) {
                console.error("Finnhub Candles Error:", error);
                resolve(null);
            } else {
                if (data && data.s === 'ok') {
                    resolve(data);
                } else if (data && data.s === 'no_data') {
                    console.log("Finnhub returned no_data for candles");
                    resolve(null);
                } else {
                    console.error("Finnhub Invalid Data:", data);
                    resolve(null);
                }
            }
        });
    });
}
