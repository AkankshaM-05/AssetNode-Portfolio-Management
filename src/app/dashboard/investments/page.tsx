'use client';

import { useState, useMemo } from 'react';
import { usePortfolioStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Trash2, 
  Edit2, 
  MoreVertical,
  ArrowUpDown,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function StockRegistryPage() {
  const { investments, deleteInvestment, isInitialized } = usePortfolioStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStocks = useMemo(() => {
    return investments.filter((inv) => 
      inv.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [investments, searchTerm]);

  if (!isInitialized) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Equity Ledger</h1>
          <p className="text-muted-foreground font-body">Complete inventory of your public stock positions.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search by ticker or name..." 
              className="pl-10 w-full md:w-64 bg-white border-primary/10 focus:border-primary/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2 border-primary/10">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStocks.length > 0 ? (
          filteredStocks.map((inv) => (
            <Card key={inv.id} className="border-none shadow-sm hover:shadow-md transition-shadow group overflow-hidden">
              <div className="h-1 bg-primary w-full opacity-20 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/5 text-primary rounded-lg">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-headline">{inv.companyName}</CardTitle>
                    <CardDescription className="text-xs uppercase font-headline tracking-widest text-primary/60">Public Equity</CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="font-body">
                    <DropdownMenuItem className="gap-2 cursor-pointer">
                      <Edit2 className="w-4 h-4" /> Edit Position
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/5"
                      onClick={() => deleteInvestment(inv.id)}
                    >
                      <Trash2 className="w-4 h-4" /> Close Position
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase font-headline text-muted-foreground tracking-wider mb-1">Shares</p>
                    <p className="font-headline font-bold text-primary">{inv.quantity.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-headline text-muted-foreground tracking-wider mb-1">Avg Cost</p>
                    <p className="font-headline font-bold text-primary">${inv.buyPrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-headline text-muted-foreground tracking-wider mb-1">Total Cost</p>
                    <p className="font-headline font-bold text-primary">${(inv.quantity * inv.buyPrice).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-headline text-muted-foreground tracking-wider mb-1">Acquired</p>
                    <p className="font-body text-xs text-muted-foreground">{new Date(inv.purchaseDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="pt-4 border-t flex items-center justify-between">
                   <div className="flex items-center gap-1 text-xs font-bold text-accent">
                    <TrendingUp className="w-3 h-3" /> Growth Target: Active
                  </div>
                  <span className="text-[10px] font-headline uppercase text-muted-foreground">Status: LONG</span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4 bg-white rounded-3xl border border-dashed border-primary/20">
            <div className="inline-flex p-6 bg-secondary rounded-full">
              <Search className="w-12 h-12 text-primary opacity-20" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-headline font-bold text-primary">No stocks found</h3>
              <p className="text-muted-foreground font-body max-w-sm mx-auto">Add a new stock position to populate your registry.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
