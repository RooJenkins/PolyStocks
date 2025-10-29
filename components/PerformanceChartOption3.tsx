'use client';

import { useEffect, useState, useRef } from 'react';
import ModelIcon from './ModelIcon';
import AnimatedNumber from './AnimatedNumber';
import type { AIAgent } from '@/types';

interface PerformanceChartProps {
  agents: AIAgent[];
  timeframe?: '24h' | '7d' | 'all';
}

export default function PerformanceChartOption3({ agents, timeframe = 'all' }: PerformanceChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lineEndpoints, setLineEndpoints] = useState<Record<string, { x: number; y: number }>>({});
  const [hoveredBubble, setHoveredBubble] = useState<string | null>(null);
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [crosshairValues, setCrosshairValues] = useState<Record<string, number>>({});
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const linePointsRef = useRef<Record<string, Array<{ x: number; y: number; value: number }>>>({});

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
    if (!canvasRef.current || !containerRef.current || data.length === 0) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawChart = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      const padding = { top: 20, right: 160, bottom: 40, left: 50 };

      canvas.width = width;
      canvas.height = height;

      // Clear canvas
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, width, height);

      // Calculate scales
      const chartWidth = width - padding.left - padding.right;
      const chartHeight = height - padding.top - padding.bottom;

      // Get all values for scaling
      const allValues: number[] = [];
      data.forEach(point => {
        agents.forEach(agent => {
          const val = point[agent.id];
          if (typeof val === 'number') allValues.push(val);
        });
      });

      const minValue = Math.min(...allValues);
      const maxValue = Math.max(...allValues);
      const valueRange = maxValue - minValue;

      // Draw grid
      ctx.strokeStyle = '#1a1a24';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const y = padding.top + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
      }

      // Draw Y-axis labels
      ctx.fillStyle = '#4a4a5a';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'right';
      for (let i = 0; i <= 5; i++) {
        const y = padding.top + (chartHeight / 5) * i;
        const value = maxValue - (valueRange / 5) * i;
        ctx.fillText(`$${Math.round(value).toLocaleString()}`, padding.left - 10, y + 4);
      }

      // Draw crosshair if mouse is over chart
      if (mousePos && mousePos.x >= padding.left && mousePos.x <= width - padding.right) {
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(mousePos.x, padding.top);
        ctx.lineTo(mousePos.x, height - padding.bottom);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw lines and track endpoints
      const endpoints: Record<string, { x: number; y: number }> = {};
      const newCrosshairValues: Record<string, number> = {};
      const allLinePoints: Record<string, Array<{ x: number; y: number; value: number }>> = {};

      const activeAgentId = hoveredBubble || hoveredLine;

      // Draw non-hovered lines first
      agents.forEach((agent) => {
        if (agent.id === activeAgentId) return; // Skip active line, draw it last

        const shouldFade = activeAgentId ? true : (mousePos && !hoveredBubble && !hoveredLine);

        ctx.strokeStyle = agent.color;
        ctx.globalAlpha = shouldFade ? 0.15 : 1;
        ctx.lineWidth = 2;
        ctx.beginPath();

        let lastPoint: { x: number; y: number } | null = null;
        const points: Array<{ x: number; y: number; value: number }> = [];

        data.forEach((point, idx) => {
          const value = point[agent.id];
          if (typeof value !== 'number') return;

          const x = padding.left + (chartWidth / (data.length - 1)) * idx;
          const y = padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;

          points.push({ x, y, value });

          if (idx === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          lastPoint = { x, y };
        });

        allLinePoints[agent.id] = points;
        ctx.stroke();
        ctx.globalAlpha = 1;

        if (lastPoint) {
          endpoints[agent.id] = lastPoint;
        }
      });

      // Draw hovered/active line last (on top)
      if (activeAgentId) {
        const agent = agents.find(a => a.id === activeAgentId);
        if (agent) {
          ctx.strokeStyle = agent.color;
          ctx.globalAlpha = 1;
          ctx.lineWidth = 4;
          ctx.beginPath();

          let lastPoint: { x: number; y: number } | null = null;
          const points: Array<{ x: number; y: number; value: number }> = [];

          data.forEach((point, idx) => {
            const value = point[agent.id];
            if (typeof value !== 'number') return;

            const x = padding.left + (chartWidth / (data.length - 1)) * idx;
            const y = padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;

            points.push({ x, y, value });

            if (idx === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }

            lastPoint = { x, y };

            // Find value at crosshair for hovered line only
            if (mousePos && Math.abs(mousePos.x - x) < chartWidth / (data.length - 1) / 2) {
              newCrosshairValues[agent.id] = value;
            }
          });

          allLinePoints[agent.id] = points;
          ctx.stroke();
          ctx.globalAlpha = 1;

          // Draw dots at crosshair intersections (only for hovered line)
          if (mousePos && newCrosshairValues[agent.id]) {
            const dataIndex = Math.round(((mousePos.x - padding.left) / chartWidth) * (data.length - 1));
            if (dataIndex >= 0 && dataIndex < data.length) {
              const value = data[dataIndex][agent.id];
              if (typeof value === 'number') {
                const x = padding.left + (chartWidth / (data.length - 1)) * dataIndex;
                const y = padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;

                ctx.fillStyle = agent.color;
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }

          if (lastPoint) {
            endpoints[agent.id] = lastPoint;
          }
        }
      }

      linePointsRef.current = allLinePoints;
      setLineEndpoints(endpoints);
      setCrosshairValues(newCrosshairValues);
    };

    drawChart();

    const resizeObserver = new ResizeObserver(drawChart);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [data, agents, hoveredBubble, hoveredLine, mousePos]);

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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    setMousePos({ x: mouseX, y: mouseY });

    // Detect which line is closest to mouse
    if (!hoveredBubble) {
      let closestLine: string | null = null;
      let minDistance = 20; // Max distance to consider a line "hovered"

      agents.forEach((agent) => {
        const points = linePointsRef.current[agent.id];
        if (!points) return;

        // Find closest point on this line to the mouse
        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];

          // Calculate distance from mouse to line segment
          const distance = distanceToLineSegment(mouseX, mouseY, p1.x, p1.y, p2.x, p2.y);

          if (distance < minDistance) {
            minDistance = distance;
            closestLine = agent.id;
          }
        }
      });

      setHoveredLine(closestLine);
    }
  };

  // Calculate distance from point to line segment
  const distanceToLineSegment = (px: number, py: number, x1: number, y1: number, x2: number, y2: number) => {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) param = dot / lenSq;

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleMouseLeave = () => {
    setMousePos(null);
    setHoveredBubble(null);
    setHoveredLine(null);
  };

  return (
    <div
      className="w-full h-full bg-[#0a0a0f] rounded-lg relative"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <canvas ref={canvasRef} className="w-full h-full" />

      {/* Absolutely positioned bubbles */}
      {agents.map((agent) => {
        const pos = lineEndpoints[agent.id];
        if (!pos) return null;

        // Bubble is "active" if either the bubble or line is hovered
        const isActive = hoveredBubble === agent.id || hoveredLine === agent.id;
        const shouldFade = (hoveredBubble || hoveredLine) && !isActive;

        return (
          <div
            key={agent.id}
            className="absolute pointer-events-auto"
            style={{
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              transform: 'translate(10px, -50%)', // Center vertically, slight offset right
              zIndex: isActive ? 100 : 10, // Active bubble on top
              opacity: shouldFade ? 0.15 : 1,
              transition: 'opacity 0.15s ease-out',
            }}
            onMouseEnter={() => {
              setHoveredBubble(agent.id);
              setHoveredLine(null);
            }}
            onMouseLeave={() => setHoveredBubble(null)}
          >
            <div className="flex items-center gap-1.5 cursor-pointer">
              <div
                style={{
                  width: isActive ? '36px' : '28px',
                  height: isActive ? '36px' : '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: agent.color,
                  boxShadow: isActive ? `0 0 20px ${agent.color}60` : 'none',
                  transition: 'all 0.15s ease-out',
                }}
              >
                <ModelIcon model={agent.model} size={isActive ? 16 : 14} />
              </div>
              <div
                style={{
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: agent.color,
                  color: '#000',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: isActive ? `0 0 20px ${agent.color}60` : 'none',
                  transition: 'all 0.15s ease-out',
                }}
              >
                <AnimatedNumber value={getLatestValue(agent.id)} decimals={2} prefix="$" className="font-mono" />
              </div>
            </div>
          </div>
        );
      })}

      {/* Crosshair tooltip - only show for hovered line */}
      {mousePos && (hoveredLine || hoveredBubble) && crosshairValues[hoveredLine || hoveredBubble || ''] && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${mousePos.x + 15}px`,
            top: `${mousePos.y - 10}px`,
            backgroundColor: 'rgba(10, 10, 15, 0.95)',
            border: `2px solid ${agents.find(a => a.id === (hoveredLine || hoveredBubble))?.color || '#333'}`,
            borderRadius: '8px',
            padding: '6px 10px',
            fontSize: '13px',
            zIndex: 1000,
            boxShadow: `0 4px 12px rgba(0, 0, 0, 0.5), 0 0 20px ${agents.find(a => a.id === (hoveredLine || hoveredBubble))?.color || '#333'}40`,
          }}
        >
          {(() => {
            const agentId = hoveredLine || hoveredBubble;
            const agent = agents.find(a => a.id === agentId);
            const value = crosshairValues[agentId || ''];

            if (!agent || !value) return null;

            return (
              <div className="flex items-center gap-2">
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: agent.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ModelIcon model={agent.model} size={12} />
                </div>
                <span className="text-white font-mono font-bold" style={{ fontSize: '14px' }}>
                  ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
