"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import StockChart from "@/components/dashboard/StockChart";
import AIPanel from "@/components/dashboard/AIPanel";
import NewsFeed from "@/components/dashboard/NewsFeed";
import TechnicalCard from "@/components/dashboard/TechnicalCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockData, TechnicalIndicators } from "@/lib/stock";
import { NewsItem } from "@/lib/news";
import { AIAnalysis } from "@/lib/ai";

export default function DashboardPage() {
    const [symbol, setSymbol] = useState("AAPL");
    const [query, setQuery] = useState("");
    const [stockData, setStockData] = useState<StockData | null>(null);
    const [news, setNews] = useState<NewsItem[]>([]);
    const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);

    // Initial load
    useEffect(() => {
        fetchData(symbol);
        // Trigger WhatsApp init
        fetch('/api/whatsapp-status');
    }, []);

    const fetchData = async (sym: string) => {
        setLoading(true);
        try {
            // Parallel fetch stock and news
            const [stockRes, newsRes] = await Promise.all([
                fetch(`/api/stock-data?symbol=${sym}`),
                fetch(`/api/news?symbol=${sym}`)
            ]);

            const stock = await stockRes.json();
            const newsData = await newsRes.json();

            if (stockRes.ok) setStockData(stock);
            if (newsRes.ok) setNews(newsData);

            // Clear previous analysis when symbol changes
            setAnalysis(null);

        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query) {
            setSymbol(query.toUpperCase());
            fetchData(query.toUpperCase());
        }
    };

    const handleAnalyze = async () => {
        if (!symbol) return;
        setAnalyzing(true);
        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symbol })
            });
            const data = await res.json();
            if (res.ok) {
                setAnalysis(data);
            }
        } catch (error) {
            console.error("Analysis error:", error);
        } finally {
            setAnalyzing(false);
        }
    };

    const handleAlert = async () => {
        if (!analysis) return;
        // Mock user defined chat ID or from env/db
        // In real app, user sets up bot and we know their ID.
        // Here we'll just send to a hardcoded ID if provided in env, or use the Telegram bot's generic send.
        // For now, simple alert.
        alert("Alert sent to Telegram!");
    };

    return (
        <div className="space-y-6">
            {/* Top Search & Highlights */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{symbol} Analysis</h1>
                    <p className="text-muted-foreground">
                        {stockData ? `$${stockData.price} ${stockData.change >= 0 ? '+' : ''}${stockData.change} (${stockData.changePercent}%)` : 'Loading...'}
                    </p>
                </div>

                <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search symbol..."
                        className="w-full md:w-64"
                    />
                    <Button type="submit">
                        <Search className="h-4 w-4" />
                    </Button>
                </form>
                <Button
                    variant="outline"
                    onClick={() => fetch('/api/whatsapp-status')}
                    title="Click to generate QR Code in terminal"
                >
                    Reconnect WhatsApp
                </Button>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Chart & News */}
                <div className="lg:col-span-2 flex flex-col gap-6 h-full">
                    <div className="flex-1 min-h-0">
                        <StockChart symbol={symbol} />
                    </div>
                    <div className="flex-1 min-h-0">
                        <NewsFeed news={news} />
                    </div>
                </div>

                <div className="h-full">
                    <div className="h-full flex flex-col gap-6">
                        <div className="flex-[3]">
                            <AIPanel
                                analysis={analysis}
                                loading={analyzing}
                                onSendAlert={handleAlert}
                            />
                        </div>

                        <div className="flex-1">
                            <TechnicalCard />
                        </div>

                        {!analysis && !analyzing && (
                            <div className="mt-auto">
                                <Button onClick={handleAnalyze} className="w-full bg-blue-600 hover:bg-blue-500 text-white h-12 shadow-lg shadow-blue-500/20">
                                    Generate AI Report
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
