'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [marketStatus, setMarketStatus] = useState<{ isOpen: boolean; nextOpen?: string } | null>(null);

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const fetchMarketStatus = async () => {
      try {
        const response = await fetch('/api/market-status');
        const data = await response.json();
        setMarketStatus(data);
      } catch (error) {
        console.error('Error fetching market status:', error);
      }
    };

    fetchMarketStatus();
    // Update every minute
    const interval = setInterval(fetchMarketStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)] backdrop-blur-sm">
      <nav className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 sm:space-x-8">
            <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity">
              PolyStocks
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors hover:text-[var(--blue)] ${
                  isActive('/') ? 'text-[var(--blue)]' : 'text-[var(--foreground)]'
                }`}
              >
                LIVE
              </Link>
              <Link
                href="/leaderboard"
                className={`text-sm font-medium transition-colors hover:text-[var(--blue)] ${
                  isActive('/leaderboard') ? 'text-[var(--blue)]' : 'text-[var(--foreground)]'
                }`}
              >
                LEADERBOARD
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {marketStatus && (
              <div className="flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1 bg-[var(--card-bg)] rounded-md border border-[var(--border)]">
                <div
                  className={`w-2 h-2 rounded-full ${marketStatus.isOpen ? 'bg-[var(--green)] animate-pulse' : 'bg-[var(--red)]'}`}
                  title={marketStatus.isOpen ? 'Market is open' : `Market closed - Opens ${marketStatus.nextOpen}`}
                ></div>
                <span className="text-[10px] sm:text-xs font-medium">
                  {marketStatus.isOpen ? 'MARKET OPEN' : 'MARKET CLOSED'}
                </span>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
