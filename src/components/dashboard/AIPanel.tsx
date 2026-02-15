"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { AIAnalysis } from "@/lib/ai";
import { Brain, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIPanelProps {
    analysis: AIAnalysis | null;
    loading: boolean;
    onSendAlert: () => void;
}

export default function AIPanel({ analysis, loading, onSendAlert }: AIPanelProps) {
    if (loading) {
        return (
            <Card className="h-full w-full flex items-center justify-center p-8 border-blue-500/20">
                <div className="flex flex-col items-center space-y-4">
                    <motion.div
                        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                        <Brain className="h-12 w-12 text-blue-500" />
                    </motion.div>
                    <p className="text-muted-foreground animate-pulse">AI Analyst is thinking...</p>
                </div>
            </Card>
        );
    }

    if (!analysis) {
        return (
            <Card className="h-full w-full flex items-center justify-center p-8 bg-muted/20">
                <div className="text-center space-y-2">
                    <Brain className="h-10 w-10 mx-auto text-muted-foreground" />
                    <h3 className="text-lg font-medium">Ready to Analyze</h3>
                    <p className="text-sm text-muted-foreground">Select a stock to start AI analysis.</p>
                </div>
            </Card>
        );
    }

    const signalColor =
        analysis.signal === 'BUY' ? 'buy' :
            analysis.signal === 'SELL' ? 'sell' : 'hold';

    const SignalIcon =
        analysis.signal === 'BUY' ? TrendingUp :
            analysis.signal === 'SELL' ? TrendingDown : AlertCircle;

    return (
        <Card className="h-full border-blue-500/30 bg-gradient-to-b from-card to-blue-900/10">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                            <Brain className="h-5 w-5 text-blue-400" />
                            AI Decision Engine
                        </CardTitle>
                        <CardDescription>Real-time market analysis</CardDescription>
                    </div>
                    <Badge variant={signalColor} className="text-lg px-4 py-1">
                        {analysis.signal}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Confidence Meter */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Confidence</span>
                        <span className="font-bold">{analysis.confidence}%</span>
                    </div>
                    <Progress value={analysis.confidence} className="h-2" />
                </div>

                {/* Reasoning */}
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-blue-200">Analysis Reasoning</h4>
                    <ul className="space-y-2">
                        {analysis.reasoning.map((point, i) => (
                            <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                                {point}
                            </motion.li>
                        ))}
                    </ul>
                </div>

                {/* Risk & Outlook */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-3 rounded-lg bg-background/50 border border-border/50">
                        <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
                        <p className={`font-medium ${analysis.riskLevel === 'High' ? 'text-red-400' :
                                analysis.riskLevel === 'Medium' ? 'text-yellow-400' : 'text-green-400'
                            }`}>{analysis.riskLevel}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background/50 border border-border/50">
                        <p className="text-xs text-muted-foreground mb-1">Outlook</p>
                        <p className="font-medium text-blue-200">{analysis.shortTermOutlook}</p>
                    </div>
                </div>

                <Button onClick={onSendAlert} variant="neon" className="w-full mt-4">
                    Send Alert to Telegram
                </Button>
            </CardContent>
        </Card>
    );
}
