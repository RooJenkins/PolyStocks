'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { AIAgent } from '@/types';

interface PerformanceChartProps {
  agents: AIAgent[];
  timeframe?: '24h' | '7d' | 'all';
}

export default function PerformanceChart({ agents, timeframe = 'all' }: PerformanceChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await fetch(`/api/performance?timeframe=${timeframe}`);
        const performanceData = await response.json();
        setData(performanceData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching performance data:', error);
        setLoading(false);
      }
    };

    fetchPerformanceData();
    const interval = setInterval(fetchPerformanceData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [timeframe]);

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
        <div className="text-gray-500">Loading chart data...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
        <div className="text-gray-500">No performance data available yet</div>
      </div>
    );
  }

  return (
    <div className="w-full h-96 bg-[var(--card-bg)] rounded-lg border border-[var(--border)] p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="timestamp"
            stroke="var(--foreground)"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="var(--foreground)"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'var(--foreground)' }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Account Value']}
          />
          <Legend
            wrapperStyle={{ fontSize: '14px' }}
            iconType="line"
          />
          {agents.map((agent) => (
            <Line
              key={agent.id}
              type="monotone"
              dataKey={agent.id}
              name={agent.name}
              stroke={agent.color}
              strokeWidth={2}
              dot={false}
              animationDuration={300}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
