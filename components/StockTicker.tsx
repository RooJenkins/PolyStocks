'use client';

import { useEffect, useState } from 'react';
import AnimatedNumber from './AnimatedNumber';
import StockLogo from './StockLogo';
import type { Stock } from '@/types';

export default function StockTicker() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch('/api/stocks/ticker');
        const data = await response.json();
        setStocks(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch stock ticker:', error);
        setLoading(false);
      }
    };

    fetchStocks();
    const interval = setInterval(fetchStocks, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="w-full border-b border-[var(--border)] bg-[var(--card-bg)]">
        <div className="container mx-auto px-4 py-3">
          <div className="text-sm text-gray-500">Loading market data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full border-b border-[var(--border)] bg-[var(--card-bg)] overflow-hidden">
      <div className="relative">
        <style jsx>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .scroll-container {
            animation: scroll 60s linear infinite;
          }
          .scroll-container:hover {
            animation-play-state: paused;
          }
        `}</style>

        <div className="scroll-container flex py-3">
          {/* Duplicate the stocks array for seamless looping */}
          {[...stocks, ...stocks].map((stock, index) => (
            <div
              key={`${stock.symbol}-${index}`}
              className="flex items-center gap-6 px-10 border-r border-[var(--border)] whitespace-nowrap min-w-[220px]"
            >
              <div className="flex items-center gap-2">
                <StockLogo symbol={stock.symbol} size={16} />
                <div className="text-sm font-bold text-white">{stock.symbol}</div>
              </div>
              <div
                className={`text-sm font-mono font-semibold ${
                  stock.change >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'
                }`}
              >
                <AnimatedNumber value={stock.price} decimals={2} prefix="$" className="font-mono" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
