const finnhub = require('finnhub');

function getFinnhubClient() {
    if (!process.env.FINNHUB_API_KEY) {
        throw new Error("FINNHUB_API_KEY is missing");
    }
    return new finnhub.DefaultApi(process.env.FINNHUB_API_KEY);
}

export interface NewsItem {
    category: string;
    datetime: number;
    headline: string;
    id: number;
    image: string;
    related: string;
    source: string;
    summary: string;
    url: string;
}

export async function getCompanyNews(symbol: string): Promise<NewsItem[]> {
    const finnhubClient = getFinnhubClient();
    const end = new Date().toISOString().split('T')[0];
    const start = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 3 days ago

    return new Promise((resolve) => {
        finnhubClient.companyNews(symbol.toUpperCase(), start, end, (error: any, data: any) => {
            if (error) {
                console.error("Finnhub News Error:", error);
                resolve([]);
            } else {
                resolve(data || []);
            }
        });
    });
}

export async function getMarketNews(category: string = 'general'): Promise<NewsItem[]> {
    const finnhubClient = getFinnhubClient();
    return new Promise((resolve) => {
        finnhubClient.marketNews(category, {}, (error: any, data: any) => {
            if (error) {
                resolve([]);
            } else {
                resolve(data || []);
            }
        });
    });
}
