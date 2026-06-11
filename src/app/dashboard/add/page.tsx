'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePortfolioStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
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

    if (isNaN(qty) || qty <= 0) return setError('Invalid quantity');
    if (isNaN(price) || price <= 0) return setError('Invalid purchase price');

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
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 animate-in zoom-in-95">
        <div className="p-6 bg-accent/10 rounded-full">
          <CheckCircle2 className="w-16 h-16 text-accent" />
        </div>
        <h2 className="text-3xl font-headline font-bold text-primary">Stock Logged Successfully</h2>
        <p className="text-muted-foreground font-body">The position has been added to your equity registry.</p>
        <p className="text-sm text-primary animate-pulse font-headline">Redirecting to registry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Equity Registry</h1>
          <p className="text-muted-foreground font-body">Log a new stock acquisition to your portfolio.</p>
        </div>
      </div>

      <Card className="max-w-2xl border-none shadow-sm mx-auto">
        <CardHeader>
          <CardTitle className="text-xl font-headline">Stock Details</CardTitle>
          <CardDescription>Enter the primary metrics for your new equity position.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2 text-sm font-medium">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="companyName">Company Name / Ticker</Label>
                <Input 
                  id="companyName" 
                  placeholder="e.g. Nvidia Corp (NVDA)" 
                  required 
                  className="bg-secondary/30 border-secondary"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity (Shares)</Label>
                <Input 
                  id="quantity" 
                  type="number" 
                  step="0.0001"
                  placeholder="0.00" 
                  required 
                  className="bg-secondary/30 border-secondary"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyPrice">Purchase Price (USD per share)</Label>
                <Input 
                  id="buyPrice" 
                  type="number" 
                  step="0.01"
                  placeholder="0.00" 
                  required 
                  className="bg-secondary/30 border-secondary"
                  value={formData.buyPrice}
                  onChange={(e) => setFormData({...formData, buyPrice: e.target.value})}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="purchaseDate">Date of Acquisition</Label>
                <Input 
                  id="purchaseDate" 
                  type="date" 
                  required 
                  className="bg-secondary/30 border-secondary"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-4 pt-4 border-t">
            <Button 
              type="submit" 
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-headline"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Save Stock Position'}
            </Button>
            <Link href="/dashboard" className="flex-1">
              <Button type="button" variant="outline" className="w-full font-headline border-primary/20">
                Cancel
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
