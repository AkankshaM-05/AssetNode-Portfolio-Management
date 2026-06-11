'use client';

import { usePortfolioStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  ChevronRight, 
  FileText,
  Clock,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function SnapshotHistoryPage() {
  const { history = [], isInitialized } = usePortfolioStore();

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Activity className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary">Snapshot History</h1>
        <p className="text-muted-foreground font-body">View past stock analysis reports.</p>
      </div>

      <div className="space-y-6">
        {history && history.length > 0 ? (
          history.map((item) => (
            <Card key={item.id} className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden bg-white">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center">
                  <div className={cn(
                    "w-full sm:w-2 sm:min-h-[120px] h-2",
                    item.status === 'Excellent' || item.status === 'Good' 
                      ? 'bg-accent' 
                      : item.status === 'Moderate' 
                        ? 'bg-amber-400' 
                        : 'bg-destructive'
                  )} />
                  
                  <div className="flex-1 p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-4">
                        <Badge className={cn(
                          "font-headline font-bold text-[10px] tracking-widest uppercase border-none px-3 py-1",
                          item.status === 'Excellent' || item.status === 'Good' ? 'bg-accent/10 text-accent' : 'bg-amber-400/10 text-amber-600'
                        )}>
                          {item.status}
                        </Badge>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-body font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(item.date).toLocaleDateString('en-GB')}
                        </div>
                      </div>
                      <p className="text-sm md:text-base font-body text-foreground leading-relaxed max-w-2xl italic">
                        "{item.summary}"
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <Link href="/dashboard/analyze">
                        <Button variant="ghost" className="gap-2 font-headline font-bold text-xs hover:bg-primary/5 hover:text-primary h-10 px-5">
                          <FileText className="w-4 h-4" /> Review Analysis
                        </Button>
                      </Link>
                      <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all hidden sm:block" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-32 text-center bg-white rounded-3xl border border-primary/5 shadow-sm">
            <div className="p-10 bg-secondary/50 rounded-full inline-flex mb-6">
              <Clock className="w-16 h-16 text-primary opacity-20" />
            </div>
            <h2 className="text-2xl font-headline font-bold text-primary">No Snapshot History</h2>
            <p className="text-muted-foreground font-body max-w-sm mx-auto mt-2 text-lg">Your AI stock reports will be archived here once generated.</p>
            <Link href="/dashboard/analyze" className="mt-8 inline-block">
              <Button className="bg-primary hover:bg-primary/90 text-white font-headline font-bold px-8 h-12 shadow-lg shadow-primary/20">
                Analyze Stock Portfolio
              </Button>
            </Link>
          </div>
        )}
      </div>

      {history && history.length > 0 && (
        <div className="pt-12 border-t flex items-center justify-center">
          <p className="text-xs text-muted-foreground font-body font-medium tracking-widest uppercase opacity-40">
            End of snapshot history
          </p>
        </div>
      )}
    </div>
  );
}
