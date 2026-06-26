'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePortfolioStore } from '@/lib/store';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Search,
  Filter,
  Trash2,
  Edit2,
  MoreVertical,
  TrendingUp,
  Briefcase,
  Activity,
  PlusCircle,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function StockRegistryPage() {
  const { investments, deleteInvestment, isInitialized } =
    usePortfolioStore();

  const [searchTerm, setSearchTerm] = useState('');

  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    minQty: '',
    maxQty: '',
    minCost: '',
    maxCost: '',
  });

  const filteredStocks = useMemo(() => {
    return investments.filter((inv) => {
      const matchesSearch =
        (inv.companyName || '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const qty = Number(inv.quantity);
      const cost = Number(inv.buyPrice);

      const matchesQty =
        (!filters.minQty || qty >= Number(filters.minQty)) &&
        (!filters.maxQty || qty <= Number(filters.maxQty));

      const matchesCost =
        (!filters.minCost || cost >= Number(filters.minCost)) &&
        (!filters.maxCost || cost <= Number(filters.maxCost));

      return (
        matchesSearch &&
        matchesQty &&
        matchesCost
      );
    });
  }, [investments, searchTerm, filters]);

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">
            Stock Registry
          </h1>

          <p className="text-muted-foreground font-body">
            Complete list of your stock portfolio holdings.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

              <Input
                placeholder="Search stocks..."
                className="pl-10 w-full md:w-64 bg-white border-primary/10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* ONLY FUNCTIONAL CHANGE HERE */}
            <Button
              variant="outline"
              className="gap-2 border-primary/10"
              onClick={() => setShowFilters((prev) => !prev)}
            >
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>

          {/* FILTER PANEL (NO UI CHANGE STYLE) */}
          {showFilters && (
            <div className="flex flex-wrap gap-2 bg-white border border-primary/10 p-3 rounded-md">

              <Input
                placeholder="Min Qty"
                type="number"
                className="w-24"
                value={filters.minQty}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    minQty: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Max Qty"
                type="number"
                className="w-24"
                value={filters.maxQty}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    maxQty: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Min Cost"
                type="number"
                className="w-24"
                value={filters.minCost}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    minCost: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Max Cost"
                type="number"
                className="w-24"
                value={filters.maxCost}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    maxCost: e.target.value,
                  })
                }
              />

              <Button
                variant="outline"
                onClick={() =>
                  setFilters({
                    minQty: '',
                    maxQty: '',
                    minCost: '',
                    maxCost: '',
                  })
                }
              >
                Clear
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStocks.length > 0 ? (
          filteredStocks.map((inv) => {
            const totalValue =
              Number(inv.quantity || 0) *
              Number(inv.buyPrice || 0);

            return (
              <Card
                key={inv.id}
                className="border-none shadow-sm hover:shadow-md transition-shadow group overflow-hidden bg-white"
              >
                <div className="h-1 bg-primary w-full opacity-10 group-hover:opacity-100 transition-opacity" />

                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/5 text-primary rounded-xl">
                      <Briefcase className="w-5 h-5" />
                    </div>

                    <div>
                      <CardTitle className="text-lg font-headline font-bold text-primary truncate max-w-[160px]">
                        {inv.companyName || 'Unknown Company'}
                      </CardTitle>

                      <CardDescription className="text-[10px] uppercase font-headline font-bold tracking-widest text-primary/40">
                        Equity Asset
                      </CardDescription>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Position
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() =>
                          deleteInvestment(inv.id)
                        }
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Stock
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>

                <CardContent className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <p className="text-[10px] uppercase font-headline font-bold text-muted-foreground">
                        Quantity
                      </p>

                      <p className="font-headline font-bold text-primary">
                        {inv.quantity}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase font-headline font-bold text-muted-foreground">
                        Buy Price
                      </p>

                      <p className="font-headline font-bold text-primary">
                        ₹{Number(inv.buyPrice || 0).toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase font-headline font-bold text-muted-foreground">
                        Total Value
                      </p>

                      <p className="font-headline font-bold text-primary">
                        ₹{totalValue.toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase font-headline font-bold text-muted-foreground">
                        Date
                      </p>

                      <p className="font-body text-xs text-muted-foreground">
                        {new Date(inv.purchaseDate).toLocaleDateString(
                          'en-GB'
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-accent uppercase">
                      <TrendingUp className="w-3 h-3" />
                      Active
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full py-32 text-center space-y-6 bg-white rounded-3xl border border-dashed border-primary/20">
            <div className="inline-flex p-8 bg-secondary/50 rounded-full">
              <Briefcase className="w-12 h-12 text-primary opacity-20" />
            </div>

            <div>
              <h3 className="text-2xl font-headline font-bold text-primary">
                No stocks found
              </h3>

              <p className="text-muted-foreground">
                Add a new stock position to start tracking your portfolio.
              </p>
            </div>

            <Link href="/dashboard/add">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add First Stock
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}