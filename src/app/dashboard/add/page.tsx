'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePortfolioStore } from '@/lib/store';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

import Link from 'next/link';

export default function AddStockPage() {
  const router = useRouter();
  const { addInvestment } = usePortfolioStore();

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    companyName: '',
    ticker: '',
    sector: '',
    quantity: '',
    buyPrice: '',
    purchaseDate: new Date().toISOString().split('T')[0],
  });

  const searchStocks = async (q: string) => {
    if (!q || q.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(`/api/search-stock?q=${q}`);
      const data = await res.json();
      setSuggestions(Array.isArray(data) ? data : []);
    } catch {
      setSuggestions([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const qty = Number(formData.quantity);
    const price = Number(formData.buyPrice);

    if (!formData.companyName) return setError('Select company');
    if (!formData.ticker) return setError('Select valid stock');
    if (!qty || qty <= 0) return setError('Invalid quantity');
    if (!price || price <= 0) return setError('Invalid price');

    setIsLoading(true);

    setTimeout(() => {
      addInvestment({
        assetType: 'Stock',
        companyName: formData.companyName,
        ticker: formData.ticker,
        sector: formData.sector || 'Unknown',
        quantity: qty,
        buyPrice: price,
        purchaseDate: new Date(formData.purchaseDate).toISOString(),
      });

      setIsLoading(false);
      setSuccess(true);

      setTimeout(() => {
        router.push('/dashboard/investments');
      }, 1000);
    }, 400);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in">
        <div className="p-6 bg-primary/5 rounded-full">
          <CheckCircle2 className="w-16 h-16 text-primary" />
        </div>

        <h2 className="text-2xl font-bold text-primary">
          Stock Added Successfully
        </h2>

        <p className="text-sm text-muted-foreground">
          Redirecting to portfolio...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-primary">
          Add Stock
        </h1>
        <p className="text-muted-foreground">
          Log a new position to your portfolio
        </p>
      </div>

      {/* CARD */}
      <Card className="border-none shadow-sm overflow-hidden bg-white">

        {/* top accent line */}
        <div className="h-1 w-full bg-primary/10" />

        <CardHeader className="space-y-2">
          <CardTitle className="text-xl text-primary font-bold">
            New Stock Position
          </CardTitle>

          <CardDescription>
            Search and select stock, then enter investment details
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">

            {/* ERROR */}
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 p-3 rounded-md text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* SEARCH */}
            <div className="relative space-y-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Company
              </Label>

              <Input
                value={formData.companyName}
                placeholder="Type Apple, Tesla..."
                className="h-11 focus-visible:ring-2 focus-visible:ring-primary/20"
                onChange={(e) => {
                  const value = e.target.value;

                  setFormData({
                    ...formData,
                    companyName: value,
                    ticker: '',
                    sector: '',
                  });

                  searchStocks(value);
                }}
              />

              {/* DROPDOWN */}
              {suggestions.length > 0 && (
                <div className="absolute z-50 w-full bg-white border border-muted/30 rounded-md shadow-lg mt-1 overflow-hidden">

                  {suggestions.map((s, i) => (
                    <div
                      key={i}
                      className="p-3 hover:bg-primary/5 cursor-pointer transition"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          companyName: s.name || '',
                          ticker: s.ticker || '',
                          sector: s.sector || 'Unknown',
                        });

                        setSuggestions([]);
                      }}
                    >
                      <div className="font-medium text-primary">
                        {s.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {s.ticker} • {s.sector || 'Unknown'}
                      </div>
                    </div>
                  ))}

                </div>
              )}
            </div>

            {/* INPUT GRID */}
            <div className="grid gap-5">

              <Input
                placeholder="Quantity"
                type="number"
                className="h-11"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
              />

              <Input
                placeholder="Buy Price"
                type="number"
                className="h-11"
                value={formData.buyPrice}
                onChange={(e) =>
                  setFormData({ ...formData, buyPrice: e.target.value })
                }
              />

              <Input
                type="date"
                className="h-11"
                value={formData.purchaseDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    purchaseDate: e.target.value,
                  })
                }
              />

            </div>

          </CardContent>

          {/* FOOTER */}
          <div className="flex gap-3 p-5 border-t bg-secondary/10">

            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold"
            >
              {isLoading ? 'Saving...' : 'Save Stock'}
            </Button>

            <Link href="/dashboard/investments" className="flex-1">
              <Button
                type="button"
                variant="outline"
                className="w-full border-primary/20 hover:bg-primary/5"
              >
                Cancel
              </Button>
            </Link>

          </div>

        </form>
      </Card>
    </div>
  );
}