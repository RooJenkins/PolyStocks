'use client';

import { useEffect, useState } from 'react';

interface Trade {
  id: string;
  symbol: string;
  name: string;
  action: string;
  quantity: number;
  price: number;
  total: number;
  realizedPnL?: number;
  reasoning: string;
  confidence: number;
  timestamp: Date;
}

export default function TradesList({ agentId }: { agentId: string }) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await fetch(`/api/trades?agentId=${agentId}&limit=20`);
        const data = await response.json();
        setTrades(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trades:', error);
        setLoading(false);
      }
    };

    fetchTrades();
    const interval = setInterval(fetchTrades, 30000);
    return () => clearInterval(interval);
  }, [agentId]);

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading trades...</div>;
  }

  if (trades.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No trades yet. This AI will start trading soon.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {trades.map((trade) => (
        <div
          key={trade.id}
          className="p-4 bg-[var(--background)] rounded-lg border border-[var(--border)] hover:border-gray-600 transition-colors"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div
                className={`px-2 py-1 rounded text-xs font-bold ${
                  trade.action === 'BUY'
                    ? 'bg-green-500/20 text-[var(--green)]'
                    : 'bg-red-500/20 text-[var(--red)]'
                }`}
              >
                {trade.action}
              </div>
              <div>
                <div className="font-semibold">
                  {trade.quantity} shares of {trade.symbol}
                </div>
                <div className="text-sm text-gray-400">{trade.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono font-semibold">${trade.price.toFixed(2)}</div>
              <div className="text-xs text-gray-400">
                Total: ${trade.total.toFixed(2)}
              </div>
            </div>
          </div>

          {trade.realizedPnL !== null && trade.realizedPnL !== undefined && (
            <div
              className={`text-sm font-mono font-semibold mb-2 ${
                trade.realizedPnL >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'
              }`}
            >
              P&L: {trade.realizedPnL >= 0 ? '+' : ''}${trade.realizedPnL.toFixed(2)}
            </div>
          )}

          <div className="text-sm text-gray-400 mb-2">{trade.reasoning}</div>

          <div className="flex items-center justify-between text-xs">
            <div className="text-gray-500">
              Confidence: {(trade.confidence * 100).toFixed(0)}%
            </div>
            <div className="text-gray-500">
              {new Date(trade.timestamp).toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
