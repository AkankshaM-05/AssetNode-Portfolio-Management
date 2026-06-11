'use client';

import { usePortfolioStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Activity, 
  ArrowRight, 
  Plus, 
  BarChart as BarChartIcon, 
  History as HistoryIcon,
  Search
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { investments, history, isInitialized } = usePortfolioStore();

  if (!isInitialized) return <div className="flex items-center justify-center h-[50vh]"><Activity className="animate-spin text-primary" /></div>;

  const totalValue = investments.reduce((sum, inv) => sum + (inv.quantity * inv.buyPrice), 0);
  const formattedValue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalValue);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">Stock Intelligence</h1>
          <p className="text-muted-foreground font-body">Real-time oversight of your public equity holdings.</p>
        </div>
        <div className="flex gap-2">
           <Link href="/dashboard/add">
            <Button className="bg-primary hover:bg-primary/90 text-white font-headline gap-2">
              <Plus className="w-4 h-4" /> Log New Stock
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Section: Summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-primary text-white">
          <CardHeader className="pb-2">
            <CardDescription className="text-primary-foreground/70 font-headline font-medium uppercase tracking-wider text-xs">Total Stock Equity</CardDescription>
            <CardTitle className="text-3xl font-headline font-bold">{formattedValue}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-accent text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>+4.2% Estimated Return</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-muted-foreground font-headline font-medium uppercase tracking-wider text-xs">Portfolio Health</CardDescription>
            <CardTitle className="text-3xl font-headline font-bold text-primary">Good</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[75%]" />
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-body">Diversity Score: 82/100</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardDescription className="text-muted-foreground font-headline font-medium uppercase tracking-wider text-xs">Active Stocks</CardDescription>
            <CardTitle className="text-3xl font-headline font-bold text-primary">{investments.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground font-body">Equity Positions: {investments.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Middle Section: Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-headline">Sector Allocation</CardTitle>
            <CardDescription>Visual distribution by industry sector</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-body font-medium">Technology</span>
                <span className="font-headline font-bold">65%</span>
              </div>
              <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[65%]" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-body font-medium">Automotive</span>
                <span className="font-headline font-bold">25%</span>
              </div>
              <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
                <div className="bg-accent h-full w-[25%]" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-body font-medium">Other</span>
                <span className="font-headline font-bold">10%</span>
              </div>
              <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
                <div className="bg-muted-foreground/30 h-full w-[10%]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-headline">AI Stock Insight</CardTitle>
            <CardDescription>Latest automated strategy analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {history.length > 0 ? (
              <div className="p-4 rounded-xl bg-secondary/50 border border-primary/5">
                <p className="text-sm font-body leading-relaxed text-foreground">
                  {history[0].summary}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-headline font-medium bg-primary/10 text-primary px-2 py-1 rounded-md">
                    {history[0].status}
                  </span>
                  <span className="text-xs text-muted-foreground font-body">
                    {new Date(history[0].date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <Activity className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm font-body">No stock insights generated yet.</p>
              </div>
            )}
            <Link href="/dashboard/analyze" className="block">
              <Button variant="outline" className="w-full gap-2 border-primary/20 text-primary hover:bg-primary/5">
                Full Stock Analysis <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section: Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'View Stocks', icon: Search, href: '/dashboard/investments' },
          { label: 'AI Analytics', icon: BarChartIcon, href: '/dashboard/analyze' },
          { label: 'Add Stock', icon: Plus, href: '/dashboard/add' },
          { label: 'History', icon: HistoryIcon, href: '/dashboard/history' },
        ].map((action) => (
          <Link key={action.label} href={action.href}>
            <Button variant="ghost" className="w-full h-auto py-6 flex flex-col gap-3 rounded-2xl bg-white shadow-sm border border-transparent hover:border-primary/20 hover:bg-secondary/50 transition-all">
              <div className="p-3 bg-secondary rounded-xl text-primary">
                <action.icon className="w-5 h-5" />
              </div>
              <span className="font-headline font-bold text-xs uppercase tracking-tight">{action.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
