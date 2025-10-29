'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)] backdrop-blur-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity">
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
            <div className="flex items-center space-x-2 px-3 py-1 bg-[var(--card-bg)] rounded-md border border-[var(--border)]">
              <div className="w-2 h-2 bg-[var(--green)] rounded-full animate-pulse"></div>
              <span className="text-xs font-medium">LIVE</span>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
