'use client';

import { usePortfolioStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  ChevronRight, 
  FileText,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function HistoryPage() {
  const { history = [], isInitialized } = usePortfolioStore();

  if (!isInitialized) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary">Relational History Ledger</h1>
        <p className="text-muted-foreground font-body">Historical snapshots of portfolio health and AI analysis.</p>
      </div>

      <div className="space-y-4">
        {history && history.length > 0 ? (
          history.map((item) => (
            <Card key={item.id} className="border-none shadow-sm hover:shadow-md transition-all group cursor-pointer overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center">
                  {/* Status Indicator Bar */}
                  <div className={`w-full sm:w-3 sm:h-auto h-2 ${
                    item.status === 'Excellent' || item.status === 'Good' 
                      ? 'bg-accent' 
                      : item.status === 'Moderate' 
                        ? 'bg-amber-400' 
                        : 'bg-destructive'
                  }`} />
                  
                  <div className="flex-1 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-headline text-[10px] tracking-widest text-primary border-primary/20">
                          {item.status}
                        </Badge>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-body">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(item.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                        </div>
                      </div>
                      <p className="text-sm font-body text-foreground leading-relaxed">
                        {item.summary}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <Link href="/dashboard/analyze">
                        <Button variant="ghost" className="gap-2 font-headline text-xs hover:bg-primary/5 hover:text-primary">
                          <FileText className="w-4 h-4" /> View Full Details
                        </Button>
                      </Link>
                      <div className="hidden sm:block">
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-24 text-center bg-white rounded-3xl border border-primary/5">
            <div className="p-6 bg-secondary rounded-full inline-flex mb-4">
              <Clock className="w-12 h-12 text-primary opacity-20" />
            </div>
            <h2 className="text-xl font-headline font-bold text-primary">No Ledger Records Found</h2>
            <p className="text-muted-foreground font-body max-w-sm mx-auto mt-2">Previous analysis records will appear here after you run your first portfolio health check.</p>
            <Link href="/dashboard/analyze" className="mt-6 inline-block">
              <Button className="bg-primary hover:bg-primary/90 text-white font-headline">
                Analyze Portfolio Now
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Pagination Placeholder */}
      {history && history.length > 0 && (
        <div className="pt-8 border-t flex items-center justify-center">
          <p className="text-xs text-muted-foreground font-body italic">
            End of records. Integration with PostgreSQL will enable unlimited historical storage.
          </p>
        </div>
      )}
    </div>
  );
}
