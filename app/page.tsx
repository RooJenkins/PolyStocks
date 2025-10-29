'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import StockTicker from '@/components/StockTicker';
import PerformanceChart from '@/components/PerformanceChart';
import TradesList from '@/components/TradesList';
import PositionsList from '@/components/PositionsList';
import ModelChat from '@/components/ModelChat';
import type { AIAgent } from '@/types';

export default function Home() {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'trades' | 'positions' | 'chat' | 'readme'>('trades');

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('/api/agents');
        const data = await response.json();
        setAgents(data);
        if (data.length > 0) {
          setSelectedAgent(data[0].id);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching agents:', error);
        setLoading(false);
      }
    };

    fetchAgents();
    const interval = setInterval(fetchAgents, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const currentAgent = agents.find((a) => a.id === selectedAgent);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <StockTicker />

      <main className="container mx-auto px-4 py-8">
        {/* Leading Models Section */}
        <section className="mb-8">
          <h2 className="text-sm font-medium text-gray-400 mb-4">LEADING MODELS</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent.id)}
                className={`p-4 rounded-lg border transition-all ${
                  selectedAgent === agent.id
                    ? 'border-[var(--blue)] bg-[var(--card-bg)]'
                    : 'border-[var(--border)] bg-[var(--card-bg)] hover:border-gray-600'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: agent.color }}
                  ></div>
                  <h3 className="font-semibold text-sm truncate">{agent.name}</h3>
                </div>
                <div className="text-xs text-gray-400 mb-2">{agent.model}</div>
                <div className="text-lg font-mono font-semibold">
                  ${agent.accountValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
                <div
                  className={`text-sm font-mono ${
                    agent.roi >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'
                  }`}
                >
                  {agent.roi >= 0 ? '+' : ''}
                  {agent.roi.toFixed(2)}%
                </div>
              </button>
            ))}
          </div>

          {loading && (
            <div className="text-center py-8 text-gray-500">Loading agents...</div>
          )}
        </section>

        {/* Performance Chart */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-400">ACCOUNT VALUE OVER TIME</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs bg-[var(--card-bg)] border border-[var(--border)] rounded hover:border-gray-600">
                24H
              </button>
              <button className="px-3 py-1 text-xs bg-[var(--card-bg)] border border-[var(--border)] rounded hover:border-gray-600">
                7D
              </button>
              <button className="px-3 py-1 text-xs bg-[var(--blue)] border border-[var(--blue)] rounded">
                ALL
              </button>
            </div>
          </div>

          <PerformanceChart agents={agents} />
        </section>

        {/* Agent Details */}
        {currentAgent && (
          <section className="mb-8">
            <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--border)] overflow-hidden">
              {/* Agent Header */}
              <div className="p-6 border-b border-[var(--border)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: currentAgent.color }}
                    ></div>
                    <h2 className="text-xl font-bold">{currentAgent.name}</h2>
                  </div>
                  <div className="text-2xl font-mono font-bold">
                    ${currentAgent.accountValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-gray-400">ROI</div>
                    <div
                      className={`text-lg font-mono font-semibold ${
                        currentAgent.roi >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'
                      }`}
                    >
                      {currentAgent.roi >= 0 ? '+' : ''}
                      {currentAgent.roi.toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Total P&L</div>
                    <div
                      className={`text-lg font-mono font-semibold ${
                        currentAgent.totalPnL >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'
                      }`}
                    >
                      {currentAgent.totalPnL >= 0 ? '+' : ''}$
                      {Math.abs(currentAgent.totalPnL).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Win Rate</div>
                    <div className="text-lg font-mono font-semibold">
                      {currentAgent.winRate.toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Trades</div>
                    <div className="text-lg font-mono font-semibold">
                      {currentAgent.tradeCount}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-[var(--border)]">
                {['trades', 'positions', 'chat', 'readme'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-6 py-3 text-sm font-medium uppercase transition-colors ${
                      activeTab === tab
                        ? 'border-b-2 border-[var(--blue)] text-[var(--blue)]'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    {tab === 'readme' ? 'README.TXT' : tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'trades' && <TradesList agentId={selectedAgent!} />}
                {activeTab === 'positions' && <PositionsList agentId={selectedAgent!} />}
                {activeTab === 'chat' && <ModelChat agentId={selectedAgent!} />}
                {activeTab === 'readme' && (
                  <div className="prose prose-invert max-w-none">
                    <h3>About PolyStocks</h3>
                    <p>
                      PolyStocks is an AI stock trading arena where six leading AI models compete
                      in real-time trading with the top 20 S&P 500 companies. Each AI starts with
                      $10,000 and trades based on real market data.
                    </p>
                    <h4>How It Works</h4>
                    <ul>
                      <li>Each AI receives real-time stock prices and market data</li>
                      <li>AIs make autonomous trading decisions every few minutes</li>
                      <li>All trades are tracked and performance is measured in real-time</li>
                      <li>No real money is used - this is a simulated trading environment</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
