'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  PlusCircle, 
  BarChart3, 
  ListOrdered, 
  History, 
  LogOut,
  ShieldCheck,
  Menu
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const NAV_ITEMS = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Stock Registry', href: '/dashboard/investments', icon: ListOrdered },
  { label: 'Add Stock', href: '/dashboard/add', icon: PlusCircle },
  { label: 'Stock Analysis', href: '/dashboard/analyze', icon: BarChart3 },
  { label: 'Snapshot History', href: '/dashboard/history', icon: History },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <nav className="space-y-1">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onClick}
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
            pathname === item.href 
              ? 'bg-primary text-white shadow-lg shadow-primary/20' 
              : 'text-muted-foreground hover:bg-secondary hover:text-primary'
          )}
        >
          <item.icon className={cn('w-5 h-5 transition-transform group-hover:scale-110', pathname === item.href ? 'text-white' : 'text-muted-foreground')} />
          <span className="font-headline font-medium">{item.label}</span>
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 border-r bg-white p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 px-2">
          <ShieldCheck className="w-8 h-8 text-primary" />
          <span className="text-2xl font-headline font-bold text-primary">AssetNode</span>
        </div>
        
        <div className="flex-1">
          <NavLinks />
        </div>

        <div className="pt-6 border-t mt-auto">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-headline font-medium">Log Out</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-primary" />
          <span className="text-xl font-headline font-bold text-primary">AssetNode</span>
        </div>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <ShieldCheck className="w-8 h-8 text-primary" />
              <span className="text-2xl font-headline font-bold text-primary">AssetNode</span>
            </div>
            <div className="flex-1">
              <NavLinks onClick={() => setIsMobileMenuOpen(false)} />
            </div>
            <div className="pt-6 border-t">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-headline font-medium">Log Out</span>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
