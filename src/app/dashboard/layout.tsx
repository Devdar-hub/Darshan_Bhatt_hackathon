import { Button } from "@/components/ui/button";
import { LayoutDashboard, Settings, Bell, LogOut, Search } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside className="hidden w-64 flex-col border-r border-border bg-card/30 backdrop-blur-xl md:flex">
                <div className="p-6">
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        MarketMind AI
                    </h2>
                </div>
                <nav className="flex-1 space-y-2 p-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Button>
                    </Link>
                    <Link href="/dashboard/alerts">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Bell className="h-4 w-4" />
                            Alerts
                        </Button>
                    </Link>
                    <Link href="/dashboard/settings">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Settings className="h-4 w-4" />
                            Settings
                        </Button>
                    </Link>
                </nav>
                <div className="p-4 border-t border-border">
                    <Button variant="ghost" className="w-full justify-start gap-2 text-red-400 hover:text-red-500 hover:bg-red-500/10">
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="flex items-center justify-between border-b border-border p-4 bg-background/50 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-4 w-full max-w-md">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search stocks (e.g. AAPL, BTC)..." className="h-9" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="icon" variant="ghost">
                            <Bell className="h-4 w-4" />
                        </Button>
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500" />
                    </div>
                </header>
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
