'use client';

import { useEffect, useState } from 'react';
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
    const interval = setInterval(fetchStocks, 30000); // Update every 30 seconds

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
    <div className="w-full border-b border-[var(--border)] bg-[var(--card-bg)]">
      <div className="container mx-auto px-4 py-3">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {stocks.slice(0, 6).map((stock) => (
            <div key={stock.symbol} className="flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-gray-400">{stock.symbol}</div>
                <div className="text-sm font-mono font-semibold">
                  ${stock.price.toFixed(2)}
                </div>
              </div>
              <div className={`text-sm font-mono ${stock.change >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
                {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
