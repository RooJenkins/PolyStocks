'use client';

import { useEffect, useState, useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import ModelIcon from './ModelIcon';
import AnimatedNumber from './AnimatedNumber';
import type { AIAgent } from '@/types';

interface PerformanceChartProps {
  agents: AIAgent[];
  timeframe?: '24h' | '7d' | 'all';
}

export default function PerformanceChartOption1({ agents, timeframe = 'all' }: PerformanceChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bubblePositions, setBubblePositions] = useState<Record<string, { x: number; y: number }>>({});
  const chartRef = useRef<HTMLDivElement>(null);

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
    const interval = setInterval(fetchPerformanceData, 5000);

    return () => clearInterval(interval);
  }, [timeframe]);

  // Calculate bubble positions from chart dimensions
  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    const updatePositions = () => {
      const container = chartRef.current;
      if (!container) return;

      const svg = container.querySelector('svg');
      if (!svg) return;

      // Get all path elements (the lines)
      const paths = svg.querySelectorAll('.recharts-line-curve');
      const newPositions: Record<string, { x: number; y: number }> = {};

      agents.forEach((agent, idx) => {
        const path = paths[idx] as SVGPathElement;
        if (!path) return;

        // Get the last point of the path
        const pathLength = path.getTotalLength();
        const lastPoint = path.getPointAtLength(pathLength);

        newPositions[agent.id] = {
          x: lastPoint.x,
          y: lastPoint.y,
        };
      });

      setBubblePositions(newPositions);
    };

    // Update immediately and on resize
    updatePositions();
    const resizeObserver = new ResizeObserver(updatePositions);
    resizeObserver.observe(chartRef.current);

    // Also update after chart animation
    setTimeout(updatePositions, 500);

    return () => resizeObserver.disconnect();
  }, [data, agents]);

  const getLatestValue = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    return agent?.accountValue || 0;
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#0a0a0f] rounded-lg">
        <div className="text-gray-500">Loading chart data...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#0a0a0f] rounded-lg">
        <div className="text-gray-500">No performance data available yet</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#0a0a0f] rounded-lg relative" ref={chartRef}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 160, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1a1a24" vertical={false} />
          <XAxis
            dataKey="timestamp"
            stroke="#4a4a5a"
            style={{ fontSize: '11px' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#4a4a5a"
            style={{ fontSize: '11px' }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={() => null} />
          {agents.map((agent) => (
            <Line
              key={agent.id}
              type="monotone"
              dataKey={agent.id}
              stroke={agent.color}
              strokeWidth={2}
              dot={false}
              animationDuration={300}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* Absolutely positioned bubbles - completely separate from SVG */}
      {agents.map((agent) => {
        const pos = bubblePositions[agent.id];
        if (!pos) return null;

        return (
          <div
            key={agent.id}
            className="absolute pointer-events-auto bubble-wrapper"
            style={{
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              transform: 'translate(10px, -20px)',
              transition: 'left 0.3s ease-out, top 0.3s ease-out',
            }}
          >
            <div className="flex items-center gap-1.5 cursor-pointer hover-target">
              <div
                className="bubble-icon"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: agent.color,
                  transition: 'all 0.15s ease-out',
                }}
              >
                <ModelIcon model={agent.model} size={14} />
              </div>
              <div
                className="bubble-value"
                style={{
                  padding: '2px 8px',
                  borderRadius: '4px',
                  backgroundColor: agent.color,
                  color: '#000',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                  transition: 'all 0.15s ease-out',
                }}
              >
                <AnimatedNumber value={getLatestValue(agent.id)} decimals={2} prefix="$" className="font-mono" />
              </div>
            </div>
          </div>
        );
      })}

      <style jsx>{`
        .hover-target:hover .bubble-icon {
          width: 36px !important;
          height: 36px !important;
          box-shadow: 0 0 20px currentColor !important;
        }
        .hover-target:hover .bubble-value {
          transform: scale(1.05) !important;
          box-shadow: 0 0 20px currentColor !important;
        }
        .bubble-wrapper {
          will-change: transform;
        }
      `}</style>
    </div>
  );
}
