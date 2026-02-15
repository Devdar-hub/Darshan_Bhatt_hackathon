"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TechnicalCardProps {
    // Mocking data structure for now
    identifiers?: any;
}

export default function TechnicalCard() {
    // Hardcoded mock values for visual demo as free API doesn't provide real-time indicators easily
    const indicators = [
        { name: "RSI (14)", value: 65, status: "Neutral", color: "bg-yellow-500" },
        { name: "MACD", value: 12, status: "Bullish", color: "bg-green-500" },
        { name: "SMA (50)", value: 154, status: "Above", color: "bg-green-500" },
    ];

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Technical Indicators</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {indicators.map((ind) => (
                    <div key={ind.name} className="flex flex-col gap-1">
                        <div className="flex justify-between text-sm">
                            <span>{ind.name}</span>
                            <span className={`font-mono ${ind.status === 'Bullish' ? 'text-green-400' : ind.status === 'Bearish' ? 'text-red-400' : 'text-yellow-400'}`}>
                                {ind.value} ({ind.status})
                            </span>
                        </div>
                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${ind.color}`} style={{ width: `${Math.min(ind.value, 100)}%` }} />
                        </div>
                    </div>
                ))}
                <p className="text-xs text-muted-foreground mt-4 italic">
                    * Indicators calculated on daily timeframe (Mock data for demo)
                </p>
            </CardContent>
        </Card>
    );
}
