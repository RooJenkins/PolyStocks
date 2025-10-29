'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
  ReferenceLine,
} from 'recharts';
import ModelIcon from './ModelIcon';
import AnimatedNumber from './AnimatedNumber';
import type { AIAgent } from '@/types';

interface PerformanceChartProps {
  agents: AIAgent[];
  timeframe?: '24h' | '7d' | 'all';
}

export default function PerformanceChart({ agents, timeframe = 'all' }: PerformanceChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredDataPoint, setHoveredDataPoint] = useState<any>(null);

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
    const interval = setInterval(fetchPerformanceData, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [timeframe]);

  // Use live account values from agents prop for real-time updates
  const getLatestValue = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    return agent?.accountValue || 0;
  };

  // Memoize label functions - completely independent of hover state
  // MUST be before early returns to satisfy Rules of Hooks
  const labelFunctions = useMemo(() => {
    const functions: Record<string, any> = {};

    agents.forEach((agent) => {
      functions[agent.id] = (props: any) => {
        const { x, y, index } = props;

        // Only render label at the last point (rightmost)
        if (index !== data.length - 1) return null;
        if (typeof x !== 'number' || typeof y !== 'number') return null;

        const latestValue = getLatestValue(agent.id);

        return (
          <g key={`label-${agent.id}`}>
            <foreignObject
              x={x + 10}
              y={y - 20}
              width={180}
              height={40}
              style={{ overflow: 'visible', pointerEvents: 'none' }}
            >
              <div
                className={`bubble-container bubble-${agent.id}`}
                style={{ pointerEvents: 'all' }}
              >
                <div
                  className="flex items-center gap-1.5 cursor-pointer"
                  style={{
                    transition: 'opacity 0.15s ease-out',
                  }}
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
                    <AnimatedNumber value={latestValue} decimals={2} prefix="$" className="font-mono" />
                  </div>
                </div>
              </div>
            </foreignObject>
          </g>
        );
      };
    });

    return functions;
  }, [agents, data]);

  // Custom cursor/crosshair component
  const CustomCursor = (props: any) => {
    const { points, width, height } = props;
    if (!points || points.length === 0) return null;

    const x = points[0].x;

    return (
      <line
        x1={x}
        y1={0}
        x2={x}
        y2={height}
        stroke="#666"
        strokeWidth={1}
        strokeDasharray="4 4"
      />
    );
  };

  // Early returns for loading/empty states
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
        <div className="text-gray-500">Loading chart data...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[var(--card-bg)] rounded-lg border border-[var(--border)]">
        <div className="text-gray-500">No performance data available yet</div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full bg-[#0a0a0f] rounded-lg relative"
      onMouseLeave={() => {
        setHoveredDataPoint(null);
      }}
    >
      {/* Pure CSS hover - zero React state, zero re-renders */}
      <style dangerouslySetInnerHTML={{ __html: `
        .bubble-container {
          will-change: transform;
        }
        ${agents.map(agent => `
          .bubble-${agent.id}:hover .bubble-icon {
            width: 36px !important;
            height: 36px !important;
            box-shadow: 0 0 20px ${agent.color}60 !important;
          }
          .bubble-${agent.id}:hover .bubble-value {
            transform: scale(1.05) !important;
            box-shadow: 0 0 20px ${agent.color}60 !important;
          }
        `).join('\n')}
      `}} />
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 160, bottom: 20, left: 20 }}
          onMouseMove={(e: any) => {
            if (e?.activePayload) {
              setHoveredDataPoint(e.activePayload);
            } else {
              setHoveredDataPoint(null);
            }
          }}
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
          <Tooltip
            content={() => null}
            cursor={<CustomCursor />}
          />
          {agents.map((agent) => {
            const hasCrosshair = hoveredDataPoint;

            return (
              <Line
                key={agent.id}
                type="monotone"
                dataKey={agent.id}
                name={agent.name}
                stroke={agent.color}
                strokeWidth={2}
                strokeOpacity={hasCrosshair ? 0.4 : 1}
                dot={false}
                activeDot={
                  hasCrosshair
                    ? {
                        r: 4,
                        fill: agent.color,
                        stroke: agent.color,
                        strokeWidth: 2,
                      }
                    : false
                }
                animationDuration={300}
                label={labelFunctions[agent.id]}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
