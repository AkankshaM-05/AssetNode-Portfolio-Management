'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, UserPlus, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    // Simulate auth
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-headline font-bold tracking-tight text-primary">AssetNode</h1>
          <p className="text-muted-foreground font-body">Wealth Intelligence Platform</p>
        </div>

        <Card className="border-none shadow-2xl shadow-primary/5">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-headline">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </CardTitle>
            <CardDescription className="font-body">
              {isLogin 
                ? 'Enter your credentials to access your portfolio' 
                : 'Start tracking your investments today'}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleAuth}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  required 
                  className="bg-secondary/30 border-secondary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  className="bg-secondary/30 border-secondary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-headline transition-all" 
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : isLogin ? (
                  <span className="flex items-center gap-2"><LogIn className="w-4 h-4" /> Sign In</span>
                ) : (
                  <span className="flex items-center gap-2"><UserPlus className="w-4 h-4" /> Create Account</span>
                )}
              </Button>
              <Button 
                variant="link" 
                type="button"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign in"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}