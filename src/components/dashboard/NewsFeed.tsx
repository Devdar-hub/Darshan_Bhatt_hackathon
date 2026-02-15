"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NewsItem } from "@/lib/news";
import { ExternalLink } from "lucide-react";

interface NewsFeedProps {
    news: NewsItem[];
}

export default function NewsFeed({ news }: NewsFeedProps) {
    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="text-lg">Recent News</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 p-0 overflow-hidden">
                <ScrollArea className="h-[300px] p-4">
                    {news.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No recent news found.</p>
                    ) : (
                        <div className="space-y-4">
                            {news.map((item) => (
                                <div key={item.id} className="border-b border-border/50 pb-4 last:border-0">
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="space-y-1">
                                            <h4 className="font-medium text-sm hover:text-blue-400 transition-colors">
                                                <a href={item.url} target="_blank" rel="noopener noreferrer">
                                                    {item.headline}
                                                </a>
                                            </h4>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>{item.source}</span>
                                                <span>•</span>
                                                <span>{new Date(item.datetime * 1000).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                {item.summary}
                                            </p>
                                        </div>
                                        {item.image && (
                                            <img
                                                src={item.image}
                                                alt=""
                                                className="w-16 h-16 object-cover rounded-md bg-muted"
                                                onError={(e) => (e.currentTarget.style.display = 'none')}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
