'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import StockTicker from '@/components/StockTicker';
import PerformanceChart from '@/components/PerformanceChart';
import PerformanceChartOption1 from '@/components/PerformanceChartOption1';
import PerformanceChartOption2 from '@/components/PerformanceChartOption2';
import PerformanceChartOption3 from '@/components/PerformanceChartOption3';
import TradesList from '@/components/TradesList';
import PositionsList from '@/components/PositionsList';
import ModelChat from '@/components/ModelChat';
import AnimatedNumber from '@/components/AnimatedNumber';
import ModelIcon from '@/components/ModelIcon';
import type { AIAgent } from '@/types';

export default function Home() {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'trades' | 'positions' | 'chat'>('trades');
  const [chartOption, setChartOption] = useState<'current' | 'option1' | 'option2' | 'option3'>('current');

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('/api/agents');
        const data = await response.json();
        setAgents(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching agents:', error);
        setLoading(false);
      }
    };

    fetchAgents();
    const interval = setInterval(fetchAgents, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [selectedAgent]);

  const currentAgent = agents.find((a) => a.id === selectedAgent);

  return (
    <div className="h-screen flex flex-col bg-[var(--background)] overflow-hidden">
      <Header />
      <StockTicker />

      {/* Main Content Area - Split Screen */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Agent Cards Section */}
        <div className="border-b border-[var(--border)] bg-[var(--background)] px-6 py-4">
          <div className="grid grid-cols-6 gap-3">
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent.id)}
                className={`p-3 rounded-lg border transition-all text-left ${
                  selectedAgent === agent.id
                    ? 'border-[var(--blue)] bg-[var(--card-bg)] ring-2 ring-[var(--blue)] ring-opacity-50'
                    : 'border-[var(--border)] bg-[var(--card-bg)] hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: agent.color }}
                    ></div>
                    <ModelIcon model={agent.model} size={16} />
                    <span className="text-xs font-bold truncate">{agent.name}</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-xl font-mono font-bold text-white">
                    <AnimatedNumber value={agent.accountValue} decimals={0} prefix="$" className="font-mono" />
                  </div>
                  <div
                    className={`text-sm font-mono font-bold flex items-center ${
                      agent.roi >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'
                    }`}
                  >
                    <span>{agent.roi >= 0 ? '+' : '-'}</span>
                    <AnimatedNumber value={Math.abs(agent.roi)} decimals={2} suffix="%" className="font-mono" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chart + Activity Feed Section */}
        <div className="flex-1 flex min-h-0">
          {/* Left: Performance Chart */}
          <div className="flex-1 flex flex-col p-6 border-r border-[var(--border)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold uppercase tracking-wide text-white">TOTAL ACCOUNT VALUE</h2>
              <div className="flex space-x-1">
                <select
                  value={chartOption}
                  onChange={(e) => setChartOption(e.target.value as any)}
                  className="px-3 py-1 text-xs font-medium bg-[var(--card-bg)] border border-[var(--border)] rounded text-white hover:border-gray-500 transition-colors cursor-pointer"
                >
                  <option value="current">Current (Recharts Labels)</option>
                  <option value="option1">Option 1 (Recharts + Absolute)</option>
                  <option value="option2">Option 2 (Lightweight Charts)</option>
                  <option value="option3">Option 3 (Canvas)</option>
                </select>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              {chartOption === 'current' && <PerformanceChart agents={agents} />}
              {chartOption === 'option1' && <PerformanceChartOption1 agents={agents} />}
              {chartOption === 'option2' && <PerformanceChartOption2 agents={agents} />}
              {chartOption === 'option3' && <PerformanceChartOption3 agents={agents} />}
            </div>
          </div>

          {/* Right: Activity Feed */}
          <div className="w-[500px] flex flex-col bg-[var(--card-bg)] border-l border-[var(--border)]">
            {/* Tabs */}
            <div className="flex border-b border-[var(--border)] bg-[var(--background)]">
              <button
                onClick={() => setActiveTab('trades')}
                className={`flex-1 px-4 py-3 text-[11px] font-bold uppercase tracking-wide transition-colors ${
                  activeTab === 'trades'
                    ? 'bg-[var(--card-bg)] text-white border-b-2 border-[var(--blue)]'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Completed Trades
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 px-4 py-3 text-[11px] font-bold uppercase tracking-wide transition-colors ${
                  activeTab === 'chat'
                    ? 'bg-[var(--card-bg)] text-white border-b-2 border-[var(--blue)]'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Model Chat
              </button>
              <button
                onClick={() => setActiveTab('positions')}
                className={`flex-1 px-4 py-3 text-[11px] font-bold uppercase tracking-wide transition-colors ${
                  activeTab === 'positions'
                    ? 'bg-[var(--card-bg)] text-white border-b-2 border-[var(--blue)]'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Positions
              </button>
            </div>

            {/* Filter */}
            <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--background)]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">FILTER:</span>
                <select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  className="px-3 py-1.5 text-xs font-medium bg-[var(--card-bg)] border border-[var(--border)] rounded text-white hover:border-gray-500 transition-colors cursor-pointer"
                >
                  <option value="all">All Models</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Content Area with Scroll */}
            <div className="flex-1 overflow-y-auto p-4 pb-8">
              {activeTab === 'trades' && <TradesList agentId={selectedAgent === 'all' ? '' : selectedAgent} />}
              {activeTab === 'chat' && <ModelChat agentId={selectedAgent === 'all' ? '' : selectedAgent} />}
              {activeTab === 'positions' && <PositionsList agentId={selectedAgent === 'all' ? '' : selectedAgent} />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
