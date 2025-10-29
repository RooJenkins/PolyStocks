'use client';

import { useEffect, useState } from 'react';

interface Position {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  openedAt: Date;
}

export default function PositionsList({ agentId }: { agentId: string }) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await fetch(`/api/positions?agentId=${agentId}`);
        const data = await response.json();
        setPositions(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching positions:', error);
        setLoading(false);
      }
    };

    fetchPositions();
    const interval = setInterval(fetchPositions, 30000);
    return () => clearInterval(interval);
  }, [agentId]);

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading positions...</div>;
  }

  if (positions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No open positions. All positions have been closed.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {positions.map((position) => (
        <div
          key={position.id}
          className="p-4 bg-[var(--background)] rounded-lg border border-[var(--border)] hover:border-gray-600 transition-colors"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="font-semibold text-lg">{position.symbol}</div>
              <div className="text-sm text-gray-400">{position.name}</div>
            </div>
            <div
              className={`text-lg font-mono font-bold ${
                position.unrealizedPnL >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'
              }`}
            >
              {position.unrealizedPnL >= 0 ? '+' : ''}${position.unrealizedPnL.toFixed(2)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <div className="text-xs text-gray-400">Quantity</div>
              <div className="font-mono font-semibold">{position.quantity} shares</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Entry Price</div>
              <div className="font-mono font-semibold">${position.entryPrice.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Current Price</div>
              <div className="font-mono font-semibold">${position.currentPrice.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">P&L %</div>
              <div
                className={`font-mono font-semibold ${
                  position.unrealizedPnLPercent >= 0
                    ? 'text-[var(--green)]'
                    : 'text-[var(--red)]'
                }`}
              >
                {position.unrealizedPnLPercent >= 0 ? '+' : ''}
                {position.unrealizedPnLPercent.toFixed(2)}%
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 border-t border-[var(--border)] pt-2">
            Opened: {new Date(position.openedAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
