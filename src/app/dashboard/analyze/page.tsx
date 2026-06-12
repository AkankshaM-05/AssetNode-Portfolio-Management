'use client';

import { useState } from 'react';
import { usePortfolioStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ShieldAlert,
  Lightbulb,
  CheckCircle2,
  Activity,
  Sparkles,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function StockAnalysisPage() {
  const { investments, addHistory, isInitialized } = usePortfolioStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  if (report && !report.portfolioHealth) {
    console.error("Bad report:", report);
    return null;
  }

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
          purchaseDate: inv.purchaseDate
        }))
      };

      const res = await fetch("/api/analyze-portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(input)
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.type === "QUOTA_EXCEEDED") {
          setError(result.error);
        } else {
          setError(result.error || "Analysis failed");
        }
        return;
      }

      if (!result?.portfolioHealth) {
        console.error("Invalid AI response:", result);
        setError("Invalid response from AI");
        return;
      }

      console.log("API RESULT:", result);
      setReport(result);

      addHistory({
        date: new Date().toISOString(),
        summary: result.portfolioHealth.summary,
        status: result.portfolioHealth.overallStatus as any
      });

    } catch (err) {
      setError("Analysis failed. Please try again.");
      console.error("Analysis failed", err);
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Stock Analysis</h1>
          <p className="text-muted-foreground font-body">AI-powered analysis of your stock portfolio.</p>
        </div>
        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing || investments.length === 0}
          className="bg-primary hover:bg-primary/90 text-white font-headline font-bold gap-2 h-14 px-10 shadow-xl shadow-primary/20"
        >
          {isAnalyzing ? (
            <span className="flex items-center gap-3"><Activity className="w-5 h-5 animate-spin" /> Analyzing Portfolio...</span>
          ) : (
            <span className="flex items-center gap-3"><Sparkles className="w-5 h-5" /> Generate Stock Analysis</span>
          )}
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-6 py-4 rounded-2xl font-body">
          {error}
        </div>
      )}

      {!report && !isAnalyzing && !error && (
        <div className="flex flex-col items-center justify-center py-32 text-center space-y-8 bg-white rounded-3xl border border-primary/5 shadow-sm px-6">
          <div className="p-10 bg-primary/5 rounded-full">
            <Sparkles className="w-20 h-20 text-primary opacity-30" />
          </div>
          <div className="space-y-3 max-w-lg">
            <h2 className="text-3xl font-headline font-bold text-primary">Intelligent Market Insight</h2>
            <p className="text-muted-foreground font-body text-lg leading-relaxed">
              {investments.length > 0
                ? `Our AI model will evaluate your ${investments.length} stock positions for risk, allocation, and growth potential.`
                : "Add stock positions to your registry to begin AI-driven portfolio analysis."}
            </p>
          </div>
        </div>
      )}

      {isAnalyzing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
          <div className="col-span-full h-40 bg-secondary/50 rounded-3xl" />
          <div className="h-64 bg-secondary/30 rounded-3xl" />
          <div className="h-64 bg-secondary/30 rounded-3xl" />
          <div className="col-span-full h-48 bg-secondary/20 rounded-3xl" />
        </div>
      )}

      {report && (
        <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-700">
          <Card className="border-none shadow-lg overflow-hidden bg-white">
            <div className="bg-primary h-2 w-full" />
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-8">
              <div className="space-y-3">
                <CardTitle className="text-3xl font-headline font-bold text-primary">Overall Stock Health</CardTitle>
                <p className="text-lg font-body text-muted-foreground leading-relaxed italic border-l-4 border-primary/20 pl-4">
                  "{report?.portfolioHealth?.summary ?? 'No analysis available'}"
                </p>
              </div>
              <div className="shrink-0">
                <Badge className={cn(
                  "text-xl font-headline font-bold px-6 py-3 rounded-2xl border-none shadow-sm",
                  report.portfolioHealth.overallStatus === 'Excellent' || report.portfolioHealth.overallStatus === 'Good'
                    ? 'bg-accent text-white'
                    : report.portfolioHealth.overallStatus === 'Moderate'
                      ? 'bg-amber-500 text-white'
                      : 'bg-destructive text-white'
                )}>
                  {report?.portfolioHealth?.overallStatus ?? 'N/A'}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <h3 className="text-2xl font-headline font-bold text-primary flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-accent" /> Allocation Insights
              </h3>
              <div className="grid gap-6">
                {report?.allocationInsights?.map?.((insight: any, idx: number) => (
                  <Card key={idx} className="border-none shadow-sm hover:translate-x-1 transition-transform bg-white">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-headline font-bold text-primary">{insight.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-base font-body text-muted-foreground leading-relaxed">{insight.details}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-headline font-bold text-primary flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-500" /> Concentration Risk
              </h3>
              <div className="grid gap-6">
                {report?.allocationInsights?.map?.((insight: any, idx: number) => (
                  <Card key={idx} className="border-none shadow-sm border-l-8 border-l-amber-400 bg-white">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-lg font-headline font-bold text-primary">{insight.area}</CardTitle>
                      <Badge variant="secondary" className="font-headline font-bold text-[10px] tracking-widest uppercase">
                        {insight.riskLevel} Risk
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-base font-body text-muted-foreground leading-relaxed">{insight.details}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8 bg-secondary/20 p-8 md:p-12 rounded-[2.5rem] border border-primary/5">
            <h3 className="text-2xl font-headline font-bold text-primary flex items-center gap-3">
              <Lightbulb className="w-6 h-6 text-accent" /> Strategic Suggestions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {report?.suggestions?.map?.((sug: any, idx: number) => (
                <Card key={idx} className="border-none shadow-sm bg-white hover:shadow-lg transition-all duration-300">
                  <CardHeader className="space-y-4">
                    <div className="flex justify-between items-start">
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none font-headline font-bold text-[10px] uppercase tracking-tighter">
                        {sug.type}
                      </Badge>
                      <Badge variant={sug.priority === 'High' ? 'destructive' : 'secondary'} className="font-headline font-bold text-[10px] uppercase tracking-tighter">
                        {sug.priority} Priority
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-headline font-bold text-primary leading-tight">
                      {sug.description}
                    </CardTitle>
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