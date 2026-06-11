'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePortfolioStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle2, AlertCircle, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function AddStockPage() {
  const router = useRouter();
  const { addInvestment } = usePortfolioStore();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    companyName: '',
    quantity: '',
    buyPrice: '',
    purchaseDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const qty = parseFloat(formData.quantity);
    const price = parseFloat(formData.buyPrice);

    if (!formData.companyName) return setError('Please enter a company name or ticker');
    if (isNaN(qty) || qty <= 0) return setError('Invalid quantity');
    if (isNaN(price) || price <= 0) return setError('Invalid buy price');

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      addInvestment({
        assetType: 'Stock',
        companyName: formData.companyName,
        quantity: qty,
        buyPrice: price,
        purchaseDate: new Date(formData.purchaseDate).toISOString(),
      });
      setIsLoading(false);
      setSuccess(true);
      
      setTimeout(() => {
        router.push('/dashboard/investments');
      }, 1500);
    }, 800);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in zoom-in-95">
        <div className="p-8 bg-accent/10 rounded-full">
          <CheckCircle2 className="w-20 h-20 text-accent" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-headline font-bold text-primary">Stock Added Successfully</h2>
          <p className="text-muted-foreground font-body">The new position is now part of your portfolio.</p>
        </div>
        <p className="text-sm text-primary animate-pulse font-headline font-bold">Redirecting to Stock Registry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/investments">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Add Stock</h1>
          <p className="text-muted-foreground font-body">Log a new stock purchase to your portfolio.</p>
        </div>
      </div>

      <Card className="border-none shadow-md overflow-hidden bg-white">
        <div className="bg-primary h-1 w-full opacity-10" />
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/5 text-primary rounded-lg">
              <Briefcase className="w-5 h-5" />
            </div>
            <CardTitle className="text-xl font-headline font-bold">New Stock Position</CardTitle>
          </div>
          <CardDescription className="text-sm font-body">Enter the essential metrics for your new stock holding.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-8 py-6">
            {error && (
              <div className="p-4 bg-destructive/5 text-destructive border border-destructive/20 rounded-xl flex items-center gap-3 text-sm font-medium animate-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5" /> {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2.5 md:col-span-2">
                <Label htmlFor="companyName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Company Name / Ticker</Label>
                <Input 
                  id="companyName" 
                  placeholder="e.g. Nvidia Corp (NVDA)" 
                  required 
                  className="bg-secondary/20 border-transparent focus:border-primary/20 h-12 text-base font-body"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                />
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="quantity" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quantity (Shares)</Label>
                <Input 
                  id="quantity" 
                  type="number" 
                  step="0.0001"
                  placeholder="0.00" 
                  required 
                  className="bg-secondary/20 border-transparent focus:border-primary/20 h-12 text-base font-body"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                />
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="buyPrice" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Buy Price (USD)</Label>
                <Input 
                  id="buyPrice" 
                  type="number" 
                  step="0.01"
                  placeholder="0.00" 
                  required 
                  className="bg-secondary/20 border-transparent focus:border-primary/20 h-12 text-base font-body"
                  value={formData.buyPrice}
                  onChange={(e) => setFormData({...formData, buyPrice: e.target.value})}
                />
              </div>
              <div className="space-y-2.5 md:col-span-2">
                <Label htmlFor="purchaseDate" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Purchase Date</Label>
                <Input 
                  id="purchaseDate" 
                  type="date" 
                  required 
                  className="bg-secondary/20 border-transparent focus:border-primary/20 h-12 text-base font-body"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                />
                <p className="text-[10px] text-muted-foreground font-body">Date of acquisition as recorded in your broker account.</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4 pt-6 border-t bg-secondary/10 px-6 py-8">
            <Button 
              type="submit" 
              className="w-full sm:flex-1 h-12 bg-primary hover:bg-primary/90 text-white font-headline font-bold text-base shadow-lg shadow-primary/20"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Save Stock Position'}
            </Button>
            <Link href="/dashboard/investments" className="w-full sm:flex-1">
              <Button type="button" variant="outline" className="w-full h-12 font-headline font-bold text-base border-primary/10 hover:bg-white">
                Cancel
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
