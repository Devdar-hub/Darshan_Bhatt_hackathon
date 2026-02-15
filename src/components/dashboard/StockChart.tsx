"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
    Brush
} from "recharts";

interface StockChartProps {
    symbol: string;
}

export default function StockChart({ symbol }: StockChartProps) {
    const [candles, setCandles] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!symbol) return;
        fetchCandles();
    }, [symbol]);

    const fetchCandles = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`/api/stock-candles?symbol=${symbol}&resolution=D&count=90`); // Fetch more data for zoom
            const data = await res.json();
            if (res.ok && data.c) {
                setCandles(data);
            } else {
                setCandles(null);
                if (data.error) setError(data.error);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load chart data");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </Card>
        );
    }

    if (error || !candles || !candles.c || candles.c.length === 0) {
        return (
            <Card className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">{error || "No chart data available"}</p>
            </Card>
        );
    }

    // Format data for Recharts
    const chartData = candles.c.map((price: number, i: number) => ({
        date: new Date(candles.t[i] * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        fullDate: new Date(candles.t[i] * 1000).toLocaleDateString(),
        price: price
    }));

    const isPositive = chartData[chartData.length - 1].price >= chartData[0].price;
    const color = isPositive ? "#22c55e" : "#ef4444";

    return (
        <Card className="h-full flex flex-col overflow-hidden bg-card/50 backdrop-blur-sm border-muted/40">
            <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center text-lg">
                    <span>{symbol}</span>
                    <span className={isPositive ? "text-green-500 text-sm" : "text-red-500 text-sm"}>
                        Performance
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 w-full p-0">
                <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.3} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12, fill: '#888' }}
                                minTickGap={30}
                            />
                            <YAxis
                                domain={['auto', 'auto']}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12, fill: '#888' }}
                                tickFormatter={(val) => `$${val.toFixed(0)}`}
                                width={50}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                                labelStyle={{ color: '#888' }}
                                formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Price']}
                                labelFormatter={(label) => label}
                            />
                            <Area
                                type="monotone"
                                dataKey="price"
                                stroke={color}
                                fillOpacity={1}
                                fill="url(#colorPrice)"
                                strokeWidth={2}
                            />
                            <Brush
                                dataKey="date"
                                height={30}
                                stroke={color}
                                fill="#1e1e1e"
                                tickFormatter={() => ''}
                                y={260}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
