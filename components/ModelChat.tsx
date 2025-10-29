'use client';

import { useEffect, useState } from 'react';

interface Decision {
  id: string;
  action: string;
  symbol?: string;
  quantity?: number;
  reasoning: string;
  confidence: number;
  riskAssessment?: string;
  targetPrice?: number;
  stopLoss?: number;
  portfolioValue: number;
  cashBalance: number;
  timestamp: Date;
  agent: {
    name: string;
    color: string;
  };
}

export default function ModelChat({ agentId }: { agentId: string }) {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDecisions = async () => {
      try {
        const response = await fetch(`/api/decisions?agentId=${agentId}&limit=20`);
        const data = await response.json();
        setDecisions(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching decisions:', error);
        setLoading(false);
      }
    };

    fetchDecisions();
    const interval = setInterval(fetchDecisions, 30000);
    return () => clearInterval(interval);
  }, [agentId]);

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading AI decisions...</div>;
  }

  if (decisions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No trading decisions yet. The AI will start analyzing the market soon.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {decisions.map((decision) => (
        <div
          key={decision.id}
          className="p-4 bg-[var(--background)] rounded-lg border border-[var(--border)]"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: decision.agent.color }}
              ></div>
              <div>
                <div className="font-semibold">{decision.agent.name}</div>
                <div className="text-xs text-gray-500">
                  {new Date(decision.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
            <div
              className={`px-3 py-1 rounded text-sm font-bold ${
                decision.action === 'BUY'
                  ? 'bg-green-500/20 text-[var(--green)]'
                  : decision.action === 'SELL'
                  ? 'bg-red-500/20 text-[var(--red)]'
                  : 'bg-gray-500/20 text-gray-400'
              }`}
            >
              {decision.action}
            </div>
          </div>

          {/* Decision Details */}
          {decision.symbol && (
            <div className="mb-3 p-3 bg-[var(--card-bg)] rounded border border-[var(--border)]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-400">Stock</div>
                  <div className="font-semibold">{decision.symbol}</div>
                </div>
                {decision.quantity && (
                  <div>
                    <div className="text-xs text-gray-400">Quantity</div>
                    <div className="font-mono font-semibold">{decision.quantity} shares</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reasoning */}
          <div className="mb-3">
            <div className="text-xs text-gray-400 mb-1">AI Reasoning:</div>
            <div className="text-sm leading-relaxed">{decision.reasoning}</div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <div className="text-gray-400">Confidence</div>
              <div className="font-mono font-semibold">
                {(decision.confidence * 100).toFixed(0)}%
              </div>
            </div>
            {decision.riskAssessment && (
              <div>
                <div className="text-gray-400">Risk</div>
                <div className="font-semibold">{decision.riskAssessment}</div>
              </div>
            )}
            {decision.targetPrice && (
              <div>
                <div className="text-gray-400">Target</div>
                <div className="font-mono font-semibold text-[var(--green)]">
                  ${decision.targetPrice.toFixed(2)}
                </div>
              </div>
            )}
            {decision.stopLoss && (
              <div>
                <div className="text-gray-400">Stop Loss</div>
                <div className="font-mono font-semibold text-[var(--red)]">
                  ${decision.stopLoss.toFixed(2)}
                </div>
              </div>
            )}
          </div>

          {/* Portfolio State */}
          <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs">
            <div>
              <span className="text-gray-400">Portfolio: </span>
              <span className="font-mono font-semibold">
                ${decision.portfolioValue.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Cash: </span>
              <span className="font-mono font-semibold">
                ${decision.cashBalance.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
