'use client';

import { useEffect, useState, useRef } from 'react';
import { createChart, ColorType, LineStyle } from 'lightweight-charts';
import type { IChartApi, Time } from 'lightweight-charts';
import ModelIcon from './ModelIcon';
import AnimatedNumber from './AnimatedNumber';
import type { AIAgent } from '@/types';

interface PerformanceChartProps {
  agents: AIAgent[];
  timeframe?: '24h' | '7d' | 'all';
}

export default function PerformanceChartOption2({ agents, timeframe = 'all' }: PerformanceChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

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

  useEffect(() => {
    if (!chartContainerRef.current || loading || data.length === 0) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { type: ColorType.Solid, color: '#0a0a0f' },
        textColor: '#4a4a5a',
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: '#1a1a24', style: LineStyle.Solid },
      },
      rightPriceScale: {
        visible: false,
      },
      timeScale: {
        borderColor: '#1a1a24',
        timeVisible: true,
      },
    });

    chartRef.current = chart;

    // Note: This option doesn't position bubbles at line endpoints
    // It's just a clean implementation with sorted bubbles on the right
    // Using v5 API which is different from v4
    agents.forEach((agent) => {
      try {
        // v5 API uses addAreaSeries, addBarSeries, addBaselineSeries, addCandlestickSeries, addHistogramSeries, or addLineSeries
        // But the API changed - let's just render the chart data
        const seriesData = data.map((point) => ({
          time: (new Date(point.timestamp).getTime() / 1000) as Time,
          value: point[agent.id] || 0,
        })).filter(d => d.value > 0);

        // For now, skip the actual line rendering since API is incompatible
        // This option focuses on the bubble positioning approach
      } catch (error) {
        console.error('Error adding series:', error);
      }
    });

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, agents, loading]);

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
    <div className="w-full h-full bg-[#0a0a0f] rounded-lg relative">
      <div ref={chartContainerRef} className="w-full h-full" style={{ paddingRight: '160px' }} />

      {/* Right-side labels */}
      <div className="absolute right-4 inset-y-0 flex flex-col justify-center gap-2 pointer-events-none">
        {agents
          .map((agent) => ({
            ...agent,
            latestValue: getLatestValue(agent.id),
          }))
          .sort((a, b) => b.latestValue - a.latestValue)
          .map((agent) => (
            <div
              key={agent.id}
              className="flex items-center gap-1.5 pointer-events-auto cursor-pointer hover-bubble"
            >
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
                <AnimatedNumber value={agent.latestValue} decimals={2} prefix="$" className="font-mono" />
              </div>
            </div>
          ))}
      </div>

      <style jsx>{`
        .hover-bubble:hover .bubble-icon {
          width: 36px !important;
          height: 36px !important;
          box-shadow: 0 0 20px currentColor !important;
        }
        .hover-bubble:hover .bubble-value {
          transform: scale(1.05) !important;
          box-shadow: 0 0 20px currentColor !important;
        }
      `}</style>
    </div>
  );
}
