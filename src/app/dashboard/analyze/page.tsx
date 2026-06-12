'use client';

import { useState } from 'react';
import { usePortfolioStore } from '@/lib/store';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import {
  Activity,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function StockAnalysisPage() {
  const { investments, addHistory, isInitialized } = usePortfolioStore();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setReport(null);
    setError(null);

    try {
      const input = {
        investments: investments.map(inv => ({
          assetType: inv.assetType,
          companyName: inv.companyName,
          quantity: inv.quantity,
          buyPrice: inv.buyPrice,
          purchaseDate: inv.purchaseDate,
        })),
      };

      const res = await fetch('/api/analyze-portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      const result = await res.json();

      if (!res.ok || !result?.success) {

        switch (result?.error ?? "UNKNOWN") {
          case "AI_QUOTA_EXCEEDED":
            setError(result?.message ?? "AI limit reached. Try again later.");
            break;

          case "INVALID_AI_RESPONSE":
            setError("We received an incomplete analysis. Please retry.");
            break;

          default:
            setError(
              result?.message ||
              "Analysis couldn’t be completed at the moment. Please try again shortly."
            );
        }

        return;
      }

      setReport(result.data);

      addHistory({
        date: new Date().toISOString(),
        summary: result.data?.portfolioHealth?.summary ?? "",
        status: result.data?.portfolioHealth?.overallStatus ?? "Unknown",
      });

    } catch (err) {
      console.error(err);
      setError('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Activity className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">
            Stock Analysis
          </h1>
          <p className="text-muted-foreground font-body">
            AI-powered analysis of your stock portfolio.
          </p>
        </div>

        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing || investments.length === 0}
          className="bg-primary hover:bg-primary/90 text-white font-headline font-bold gap-2 h-14 px-10 shadow-xl shadow-primary/20"
        >
          {isAnalyzing ? (
            <>
              <Activity className="w-5 h-5 animate-spin" />
              Analyzing Portfolio...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Stock Analysis
            </>
          )}
        </Button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-6 py-4 rounded-2xl font-body">
          {error}
        </div>
      )}

      {/* EMPTY STATE */}
      {!report && !isAnalyzing && !error && (
        <div className="flex flex-col items-center justify-center py-32 text-center space-y-8 bg-white rounded-3xl border border-primary/5 shadow-sm px-6">
          <div className="p-10 bg-primary/5 rounded-full">
            <Sparkles className="w-20 h-20 text-primary opacity-30" />
          </div>

          <div className="space-y-3 max-w-lg">
            <h2 className="text-3xl font-headline font-bold text-primary">
              Intelligent Market Insight
            </h2>

            <p className="text-muted-foreground font-body text-lg">
              {investments.length > 0
                ? `AI will analyze your ${investments.length} stock positions.`
                : 'Add stocks to begin analysis.'}
            </p>
          </div>
        </div>
      )}

      {/* LOADING */}
      {isAnalyzing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
          <div className="col-span-full h-40 bg-secondary/50 rounded-3xl" />
          <div className="h-64 bg-secondary/30 rounded-3xl" />
          <div className="h-64 bg-secondary/30 rounded-3xl" />
        </div>
      )}

      {/* REPORT */}
      {report && (
        <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-700">

          {/* SUMMARY */}
          <Card className="border-none shadow-lg overflow-hidden bg-white">
            <div className="bg-primary h-2 w-full" />

            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-8">
              <div className="space-y-3">
                <CardTitle className="text-3xl font-headline font-bold text-primary">
                  Overall Stock Health
                </CardTitle>

                <p className="text-lg font-body text-muted-foreground italic border-l-4 border-primary/20 pl-4">
                  "{report.portfolioHealth?.summary}"
                </p>
              </div>

              <Badge
                className={cn(
                  'text-lg font-headline font-bold px-6 py-3 rounded-2xl',
                  report.portfolioHealth?.overallStatus === 'Excellent' ||
                    report.portfolioHealth?.overallStatus === 'Good'
                    ? 'bg-accent text-white'
                    : report.portfolioHealth?.overallStatus === 'Moderate'
                      ? 'bg-amber-500 text-white'
                      : 'bg-destructive text-white'
                )}
              >
                {report.portfolioHealth?.overallStatus}
              </Badge>
            </CardHeader>
          </Card>

          {/* INSIGHTS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* ALLOCATION */}
            <div className="space-y-6">
              <h3 className="text-2xl font-headline font-bold text-primary flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-accent" />
                Allocation Insights
              </h3>

              {report.allocationInsights?.map((i: any, idx: number) => (
                <Card key={idx} className="border-none shadow-sm bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg font-headline font-bold text-primary">
                      {i.category}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-muted-foreground">{i.details}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* RISK */}
            <div className="space-y-6">
              <h3 className="text-2xl font-headline font-bold text-primary flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
                Concentration Risk
              </h3>

              {report.concentrationInsights?.map((i: any, idx: number) => (
                <Card key={idx} className="border-none shadow-sm bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg font-headline font-bold text-primary">
                      {i.area}
                    </CardTitle>

                    <Badge variant="secondary">
                      {i.riskLevel} Risk
                    </Badge>
                  </CardHeader>

                  <CardContent>
                    <p className="text-muted-foreground">{i.details}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* SUGGESTIONS */}
          <div className="space-y-6">
            <h3 className="text-2xl font-headline font-bold text-primary flex items-center gap-3">
              <Lightbulb className="w-6 h-6 text-accent" />
              Strategic Suggestions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {report.suggestions?.map((s: any, idx: number) => (
                <Card key={idx} className="border-none shadow-sm bg-white">
                  <CardHeader>
                    <Badge className="bg-primary/10 text-primary">
                      {s.type}
                    </Badge>

                    <CardTitle className="text-lg font-headline font-bold">
                      {s.description}
                    </CardTitle>

                    <Badge variant={s.priority === 'High' ? 'destructive' : 'secondary'}>
                      {s.priority}
                    </Badge>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}