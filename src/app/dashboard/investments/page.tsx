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
  Briefcase,
  Activity
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

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Activity className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Stock Registry</h1>
          <p className="text-muted-foreground font-body">Complete list of your stock portfolio holdings.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search stocks..." 
              className="pl-10 w-full md:w-64 bg-white border-primary/10 focus:border-primary/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2 border-primary/10 h-10">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStocks.length > 0 ? (
          filteredStocks.map((inv) => (
            <Card key={inv.id} className="border-none shadow-sm hover:shadow-md transition-shadow group overflow-hidden bg-white">
              <div className="h-1 bg-primary w-full opacity-10 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/5 text-primary rounded-xl">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-headline font-bold text-primary truncate max-w-[150px]">{inv.companyName}</CardTitle>
                    <CardDescription className="text-[10px] uppercase font-headline font-bold tracking-widest text-primary/40">Equity Asset</CardDescription>
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
                      <Trash2 className="w-4 h-4" /> Delete Stock
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <p className="text-[10px] uppercase font-headline font-bold text-muted-foreground tracking-tighter mb-0.5">Quantity</p>
                    <p className="font-headline font-bold text-primary">{inv.quantity.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-headline font-bold text-muted-foreground tracking-tighter mb-0.5">Buy Price</p>
                    <p className="font-headline font-bold text-primary">${inv.buyPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-headline font-bold text-muted-foreground tracking-tighter mb-0.5">Total Value</p>
                    <p className="font-headline font-bold text-primary">${(inv.quantity * inv.buyPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-headline font-bold text-muted-foreground tracking-tighter mb-0.5">Date</p>
                    <p className="font-body text-xs text-muted-foreground">{new Date(inv.purchaseDate).toLocaleDateString('en-GB')}</p>
                  </div>
                </div>
                <div className="pt-4 border-t flex items-center justify-between">
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-accent uppercase tracking-tighter">
                    <TrendingUp className="w-3 h-3" /> Target Status: Active
                  </div>
                  <span className="text-[9px] font-headline font-bold uppercase text-muted-foreground/50">Market: NASDAQ/NYSE</span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-32 text-center space-y-6 bg-white rounded-3xl border border-dashed border-primary/20">
            <div className="inline-flex p-8 bg-secondary/50 rounded-full">
              <Briefcase className="w-12 h-12 text-primary opacity-20" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-headline font-bold text-primary">No stocks found</h3>
              <p className="text-muted-foreground font-body max-w-sm mx-auto">Add a new stock position to start tracking your portfolio.</p>
            </div>
            <Link href="/dashboard/add" className="inline-block">
              <Button className="bg-primary hover:bg-primary/90 text-white font-headline">
                <PlusCircle className="w-4 h-4 mr-2" /> Add First Stock
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
