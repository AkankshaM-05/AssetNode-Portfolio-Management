'use client';

import { useState } from 'react';
import { usePortfolioStore } from '@/lib/store';
import { generatePortfolioInsights, type GeneratePortfolioInsightsOutput } from '@/ai/flows/generate-portfolio-insights';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShieldAlert, 
  Lightbulb, 
  CheckCircle2, 
  Activity, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AnalysisPage() {
  const { investments, addHistory, isInitialized } = usePortfolioStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<GeneratePortfolioInsightsOutput | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setReport(null);
    
    try {
      // Prepare input for AI flow
      const input = {
        investments: investments.map(inv => ({
          assetType: inv.assetType,
          companyName: inv.companyName,
          quantity: inv.quantity,
          buyPrice: inv.buyPrice,
          purchaseDate: inv.purchaseDate
        }))
      };

      const result = await generatePortfolioInsights(input);
      setReport(result);
      
      // Save to local history
      addHistory({
        date: new Date().toISOString(),
        summary: result.portfolioHealth.summary,
        status: result.portfolioHealth.overallStatus as any
      });
    } catch (err) {
      console.error('Analysis failed', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isInitialized) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">AI Portfolio Strategy Tool</h1>
          <p className="text-muted-foreground font-body">Deep analysis of risk, concentration, and diversification.</p>
        </div>
        <Button 
          onClick={handleAnalyze} 
          disabled={isAnalyzing} 
          className="bg-primary hover:bg-primary/90 text-white font-headline gap-2 h-12 px-8 shadow-lg shadow-primary/20"
        >
          {isAnalyzing ? (
            <span className="flex items-center gap-2"><Activity className="w-5 h-5 animate-spin" /> Analyzing Positions...</span>
          ) : (
            <span className="flex items-center gap-2"><Sparkles className="w-5 h-5" /> Start Full Analysis</span>
          )}
        </Button>
      </div>

      {!report && !isAnalyzing && (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 bg-white rounded-3xl border border-primary/5 shadow-sm">
          <div className="p-8 bg-primary/5 rounded-full">
            <Sparkles className="w-16 h-16 text-primary opacity-40" />
          </div>
          <div className="space-y-2 max-w-md">
            <h2 className="text-2xl font-headline font-bold text-primary">Ready for Intelligence?</h2>
            <p className="text-muted-foreground font-body">Our AI will evaluate your holdings across {investments.length} positions and generate a professional-grade strategy report.</p>
          </div>
        </div>
      )}

      {isAnalyzing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-48 bg-secondary rounded-3xl" />
          ))}
        </div>
      )}

      {report && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
          {/* Summary Section */}
          <Card className="border-none shadow-md overflow-hidden">
            <div className="bg-primary p-1" />
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-headline">Overall Portfolio Health</CardTitle>
                <CardDescription className="text-base font-body mt-2">{report.portfolioHealth.summary}</CardDescription>
              </div>
              <div className="text-right">
                <Badge variant="outline" className={cn(
                  "text-lg font-headline px-4 py-2 border-2",
                  report.portfolioHealth.overallStatus === 'Excellent' || report.portfolioHealth.overallStatus === 'Good' ? 'text-accent border-accent bg-accent/5' : 'text-amber-500 border-amber-500 bg-amber-50'
                )}>
                  {report.portfolioHealth.overallStatus}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Allocation Insights */}
            <div className="space-y-6">
              <h3 className="text-xl font-headline font-bold text-primary flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" /> Allocation Insights
              </h3>
              <div className="grid gap-4">
                {report.allocationInsights.map((insight, idx) => (
                  <Card key={idx} className="border-none shadow-sm hover:translate-x-1 transition-transform">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-headline font-bold text-primary">{insight.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm font-body text-muted-foreground leading-relaxed">{insight.details}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Concentration Insights */}
            <div className="space-y-6">
              <h3 className="text-xl font-headline font-bold text-primary flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" /> Risk & Concentration
              </h3>
              <div className="grid gap-4">
                {report.concentrationInsights.map((insight, idx) => (
                  <Card key={idx} className="border-none shadow-sm border-l-4 border-l-amber-400">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-base font-headline font-bold text-primary">{insight.area}</CardTitle>
                      <Badge variant="secondary" className="font-headline text-[10px] tracking-widest">{insight.riskLevel} Risk</Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm font-body text-muted-foreground leading-relaxed">{insight.details}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="space-y-6">
            <h3 className="text-xl font-headline font-bold text-primary flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-accent" /> Strategic Suggestions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {report.suggestions.map((sug, idx) => (
                <Card key={idx} className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none font-headline text-[10px] uppercase">
                        {sug.type}
                      </Badge>
                      <Badge variant={sug.priority === 'High' ? 'destructive' : 'secondary'} className="font-headline text-[10px]">
                        {sug.priority} Priority
                      </Badge>
                    </div>
                    <CardTitle className="text-base font-headline font-bold text-primary mt-2">{sug.description}</CardTitle>
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