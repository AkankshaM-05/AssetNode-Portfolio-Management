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
import { calculateComposition } from '@/lib/portfolioUtils';

export default function OverviewPage() {
  const { investments, history, isInitialized } = usePortfolioStore();
  const composition = calculateComposition(investments);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Activity className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  const totalValue = investments.reduce((sum, inv) => sum + (inv.quantity * inv.buyPrice), 0);
  const formattedValue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalValue);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">Overview</h1>
          <p className="text-muted-foreground font-body">Monitor your stock portfolio performance.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/add">
            <Button className="bg-primary hover:bg-primary/90 text-white font-headline gap-2">
              <Plus className="w-4 h-4" /> Add Stock
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Section: Summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-primary text-white">
          <CardHeader className="pb-2">
            <CardDescription className="text-primary-foreground/70 font-headline font-medium uppercase tracking-wider text-xs">Total Stock Value</CardDescription>
            <CardTitle className="text-3xl font-headline font-bold">{formattedValue}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-accent text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>Est. Portfolio Value</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-muted-foreground font-headline font-medium uppercase tracking-wider text-xs">Portfolio Health</CardDescription>
            <CardTitle className="text-3xl font-headline font-bold text-primary">
              {history.length > 0 ? history[0].status : 'N/A'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[80%]" />
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-body">Last analysis result</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardDescription className="text-muted-foreground font-headline font-medium uppercase tracking-wider text-xs">Active Stocks</CardDescription>
            <CardTitle className="text-3xl font-headline font-bold text-primary">{investments.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground font-body">Current equity holdings</p>
          </CardContent>
        </Card>
      </div>

      {/* Middle Section: Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm h-full">
          <CardHeader>
            <CardTitle className="text-xl font-headline">Portfolio Composition</CardTitle>
            <CardDescription>Visual distribution by industry sector</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">

              {/* Technology */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-body font-medium">Technology</span>
                  <span className="font-headline font-bold">
                    {composition.Technology ?? 0}%
                  </span>
                </div>
                <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full"
                    style={{ width: `${composition.Technology ?? 0}%` }}
                  />
                </div>
              </div>

              {/* Financials */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-body font-medium">Financials</span>
                  <span className="font-headline font-bold">
                    {composition.Financials ?? 0}%
                  </span>
                </div>
                <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-accent h-full"
                    style={{ width: `${composition.Financials ?? 0}%` }}
                  />
                </div>
              </div>

              {/* Others */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-body font-medium">Others</span>
                  <span className="font-headline font-bold">
                    {composition.Others ?? 0}%
                  </span>
                </div>
                <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-muted-foreground/30 h-full"
                    style={{ width: `${composition.Others ?? 0}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm h-full">
          <CardHeader>
            <CardTitle className="text-xl font-headline">Latest AI Analysis</CardTitle>
            <CardDescription>Automated stock portfolio insight</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {history.length > 0 ? (
              <div className="p-5 rounded-xl bg-secondary/30 border border-primary/5">
                <p className="text-sm font-body leading-relaxed text-foreground italic">
                  "{history[0].summary}"
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-headline font-bold bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-tighter">
                    {history[0].status}
                  </span>
                  <span className="text-xs text-muted-foreground font-body">
                    {new Date(history[0].date).toLocaleDateString('en-GB')}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground bg-secondary/20 rounded-xl">
                <Activity className="w-10 h-10 mb-2 opacity-20" />
                <p className="text-sm font-body">No stock analysis history found.</p>
              </div>
            )}
            <Link href="/dashboard/analyze" className="block mt-4">
              <Button variant="outline" className="w-full gap-2 border-primary/20 text-primary hover:bg-primary/5">
                Run New Analysis <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Stock Registry', icon: Search, href: '/dashboard/investments' },
          { label: 'Stock Analysis', icon: BarChartIcon, href: '/dashboard/analyze' },
          { label: 'Add Stock', icon: Plus, href: '/dashboard/add' },
          { label: 'Snapshot History', icon: HistoryIcon, href: '/dashboard/history' },
        ].map((action) => (
          <Link key={action.label} href={action.href}>
            <Button variant="ghost" className="w-full h-auto py-8 flex flex-col gap-3 rounded-2xl bg-white shadow-sm border border-transparent hover:border-primary/20 hover:bg-secondary/50 transition-all">
              <div className="p-4 bg-secondary rounded-xl text-primary">
                <action.icon className="w-6 h-6" />
              </div>
              <span className="font-headline font-bold text-xs uppercase tracking-widest">{action.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
