import { RSI, MACD } from 'technicalindicators';

const finnhub = require('finnhub');

function getFinnhubClient() {
    if (!process.env.FINNHUB_API_KEY) {
        throw new Error("FINNHUB_API_KEY is missing");
    }
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
    rsi?: number;
    macd?: {
        macd: number;
        signal: number;
        histogram: number;
    };
}

export async function getStockQuote(symbol: string): Promise<StockData | null> {
    const finnhubClient = getFinnhubClient();
    return new Promise(async (resolve, reject) => {
        // Fetch quote
        finnhubClient.quote(symbol.toUpperCase(), async (error: any, data: any, response: any) => {
            if (error) {
                console.error("Finnhub Quote Error:", error);
                resolve(null);
                return;
            }

            // Fetch candles for indicators
            const candles = await getStockCandles(symbol, 'D', 60); // Get 60 days for RSI/MACD
            let rsiValue = undefined;
            let macdValue = undefined;

            if (candles && (candles as any).c && (candles as any).c.length > 50) {
                rsiValue = calculateRSI((candles as any).c);
                macdValue = calculateMACD((candles as any).c);
            }

            resolve({
                symbol: symbol.toUpperCase(),
                price: data.c,
                change: data.d,
                changePercent: data.dp,
                high: data.h,
                low: data.l,
                open: data.o,
                prevClose: data.pc,
                rsi: rsiValue,
                macd: macdValue
            });
        });
    });
}

export async function searchSymbols(query: string): Promise<any[]> {
    const finnhubClient = getFinnhubClient();
    return new Promise((resolve, reject) => {
        finnhubClient.symbolSearch(query, {}, (error: any, data: any, response: any) => {
            if (error) {
                console.error("Finnhub Search Error:", error);
                resolve([]);
            } else {
                resolve(data.result || []);
            }
        });
    });
}

function calculateRSI(prices: number[]): number {
    const inputRSI = {
        values: prices,
        period: 14
    };
    const rsi = RSI.calculate(inputRSI);
    return rsi[rsi.length - 1]; // Return latest RSI
}

function calculateMACD(prices: number[]): { macd: number, signal: number, histogram: number } | undefined {
    const macdInput = {
        values: prices,
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9,
        SimpleMAOscillator: false,
        SimpleMASignal: false
    };
    const macd = MACD.calculate(macdInput);
    const latest = macd[macd.length - 1];

    if (!latest) return undefined;

    return {
        macd: latest.MACD || 0,
        signal: latest.signal || 0,
        histogram: latest.histogram || 0
    };
}

export async function getStockCandles(symbol: string, resolution: string = 'D', count: number = 30) {
    const finnhubClient = getFinnhubClient();
    const end = Math.floor(Date.now() / 1000);
    const start = end - (count * 24 * 60 * 60 * 2); // approximate lookback

    return new Promise((resolve, reject) => {
        finnhubClient.stockCandles(symbol.toUpperCase(), resolution, start, end, (error: any, data: any) => {
            if (error) {
                // Suppress "You don't have access to this resource" error for free tier users
                if (error.toString().includes("access") || error.toString().includes("403") || error.toString().includes("401")) {
                    // console.warn("Finnhub Candles Access Restricted (Free Tier)"); 
                    resolve(null);
                } else {
                    console.error("Finnhub Candles Error:", error);
                    resolve(null);
                }
            } else {
                if (data && data.s === 'ok') {
                    resolve(data);
                } else if (data && data.s === 'no_data') {
                    console.log("Finnhub returned no_data for candles");
                    resolve(null);
                } else {
                    // console.error("Finnhub Invalid Data:", data); // Suppress invalid data logs for cleanliness
                    resolve(null);
                }
            }
        });
    });
}
