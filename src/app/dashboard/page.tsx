'use client';

import { usePortfolioStore } from '@/lib/store';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';

import {
  TrendingUp,
  Activity,
  ArrowRight,
  Plus,
  BarChart as BarChartIcon,
  History as HistoryIcon,
  Search,
} from 'lucide-react';

import Link from 'next/link';
import { calculateComposition } from '@/lib/portfolioUtils';

export default function OverviewPage() {
  const { investments, history, isInitialized } = usePortfolioStore();

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Activity className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  const cleanedInvestments = investments.map((inv) => ({
    ...inv,
    sector: inv.sector && inv.sector !== 'Unknown' ? inv.sector : 'Others',
  }));

  const composition = calculateComposition(cleanedInvestments);

  const totalValue = investments.reduce(
    (sum, inv) => sum + inv.quantity * inv.buyPrice,
    0
  );

  const formattedValue = `₹${totalValue.toFixed(2)}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">
            Overview
          </h1>
          <p className="text-muted-foreground font-body">
            Monitor your stock portfolio performance.
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/dashboard/add">
            <Button className="bg-primary hover:bg-primary/90 text-white font-headline gap-2 shadow-sm">
              <Plus className="w-4 h-4" /> Add Stock
            </Button>
          </Link>
        </div>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <Card className="border-none shadow-sm bg-primary text-white">
          <CardHeader className="pb-2">
            <CardDescription className="text-white/70 text-xs uppercase tracking-wider">
              Total Stock Value
            </CardDescription>
            <CardTitle className="text-3xl font-bold">
              {formattedValue}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-1 text-white/80 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>Est. Portfolio Value</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase tracking-wider">
              Portfolio Health
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-primary">
              {history.length > 0 ? history[0].status : 'N/A'}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[80%]" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Last analysis result
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase tracking-wider">
              Active Stocks
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-primary">
              {investments.length}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              Current equity holdings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* COMPOSITION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-primary">
              Portfolio Composition
            </CardTitle>
            <CardDescription>
              Visual distribution by industry sector
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {Object.entries(composition).map(([sector, percentage], index) => {
              const colors = [
                'bg-primary',
                'bg-accent',
                'bg-emerald-500',
                'bg-orange-500',
                'bg-gray-400',
              ];

              return (
                <div key={sector} className="space-y-2">

                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">{sector}</span>
                    <span className="font-bold text-primary">{percentage}%</span>
                  </div>

                  <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${colors[index] || 'bg-gray-400'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* AI ANALYSIS */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-primary">
              Latest AI Analysis
            </CardTitle>
            <CardDescription>
              Automated stock portfolio insight
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">

            {history.length > 0 ? (
              <div className="p-5 rounded-xl bg-secondary/30 border border-primary/10">
                <p className="text-sm italic text-foreground">
                  "{history[0].summary}"
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full uppercase">
                    {history[0].status}
                  </span>

                  <span className="text-xs text-muted-foreground">
                    {new Date(history[0].date).toLocaleDateString('en-GB')}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <Activity className="w-10 h-10 mb-2 opacity-20" />
                <p className="text-sm">
                  No stock analysis history found.
                </p>
              </div>
            )}

            <Link href="/dashboard/analyze">
              <Button
                variant="outline"
                className="w-full gap-2 border-primary/20 text-primary hover:bg-primary/5"
              >
                Run New Analysis <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

          </CardContent>
        </Card>

      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

        {[
          { label: 'Stock Registry', icon: Search, href: '/dashboard/investments' },
          { label: 'Stock Analysis', icon: BarChartIcon, href: '/dashboard/analyze' },
          { label: 'Add Stock', icon: Plus, href: '/dashboard/add' },
          { label: 'Snapshot History', icon: HistoryIcon, href: '/dashboard/history' },
        ].map((action) => (
          <Link key={action.label} href={action.href}>
            <Button
              className="
          w-full h-28 flex flex-col gap-3
          bg-white border border-primary/10
          hover:border-primary/30 hover:bg-primary/5
          shadow-sm hover:shadow-md
          transition-all duration-300
          rounded-2xl
        "
            >
              <div className="p-3 rounded-xl bg-primary/5 text-primary">
                <action.icon className="w-6 h-6" />
              </div>

              <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-primary">
                {action.label}
              </span>
            </Button>
          </Link>
        ))}
      </div>

    </div>
  );
}