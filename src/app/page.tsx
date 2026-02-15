import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart2, Brain, TrendingUp } from "lucide-react";

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <header className="px-6 h-16 flex items-center justify-between border-b border-white/5 backdrop-blur-sm sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <Brain className="h-6 w-6 text-blue-500" />
                    <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                        MarketMind AI
                    </span>
                </div>
                <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
                    <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
                    <Link href="#how-it-works" className="hover:text-primary transition-colors">How it Works</Link>
                    <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
                </nav>
                <div className="flex gap-4">
                    <Link href="/login">
                        <Button variant="ghost">Sign In</Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button className="bg-blue-600 hover:bg-blue-500">Launch Dashboard</Button>
                    </Link>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative py-20 md:py-32 overflow-hidden flex flex-col items-center justify-center text-center px-4">
                    <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
                    <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl opacity-50" />
                    <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl opacity-50" />

                    <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-300 mb-8 backdrop-blur-md">
                        <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse" />
                        AI Analyst Agent V1.0 Live
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mb-6 bg-clip-text text-transparent bg-gradient-to-bg from-white via-blue-100 to-gray-400">
                        AI decides when to <span className="text-blue-400">buy</span> or <span className="text-red-400">sell</span> stocks using real-time insights.
                    </h1>

                    <p className="max-w-2xl text-lg text-muted-foreground mb-10 leading-relaxed">
                        Stop guessing. Our autonomous agent analyzes millions of data points—news, technicals, and financials—to give you actionable trading signals instantly.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <Link href="/dashboard">
                            <Button size="lg" className="h-12 px-8 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all">
                                Launch Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Button size="lg" variant="outline" className="h-12 px-8 text-base border-white/10 hover:bg-white/5">
                            Watch Demo video
                        </Button>
                    </div>

                    {/* Stats / Trust */}
                    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 w-full max-w-4xl border-t border-white/5 pt-10">
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-white">94%</span>
                            <span className="text-sm text-muted-foreground">Accuracy</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-white">24/7</span>
                            <span className="text-sm text-muted-foreground">Monitoring</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-white">50k+</span>
                            <span className="text-sm text-muted-foreground">News Sources</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-white">Real-time</span>
                            <span className="text-sm text-muted-foreground">Alerts</span>
                        </div>
                    </div>
                </section>

                {/* Feature Grid */}
                <section className="py-20 px-4 bg-black/20" id="features">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-16">Supercharge your trading</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: BarChart2,
                                    title: "Advanced Technicals",
                                    desc: "Auto-detection of RSI, MACD, and Bollinger Bands patterns."
                                },
                                {
                                    icon: Brain,
                                    title: "Sentiment Analysis",
                                    desc: "LLMs read thousands of news articles to gauge market mood."
                                },
                                {
                                    icon: TrendingUp,
                                    title: "Telegram Alerts",
                                    desc: "Get instant buy/sell signals sent directly to your phone."
                                }
                            ].map((f, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-card/50 border border-white/5 hover:border-blue-500/30 transition-colors group">
                                    <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                                        <f.icon className="h-6 w-6 text-blue-400" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                                    <p className="text-muted-foreground">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-6 border-t border-white/5 text-center text-sm text-muted-foreground">
                © 2024 MarketMind AI. Hackathon MVP.
            </footer>
        </div>
    );
}
