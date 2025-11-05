'use client';

import { useEffect, useState } from 'react';
import type { AIAgent } from '@/types';

interface HeatmapData {
  agentId: string;
  name: string;
  model: string;
  color: string;
  dailyPerformance: Record<string, {
    gains: number;
    losses: number;
    total: number;
    percentChange: number;
    startValue: number;
    endValue: number;
  }>;
  hourlyActivity: Record<number, number>;
  dayOfWeekActivity: Record<number, number>;
  tradesByHour: Record<number, { count: number; wins: number; losses: number }>;
  tradesByDayOfWeek: Record<number, { count: number; wins: number; losses: number }>;
  streaks: Array<{ type: 'win' | 'loss'; length: number; startDate: Date }>;
  maxWinStreak: number;
  maxLossStreak: number;
}

interface Props {
  agents: AIAgent[];
  selectedAgentId: string | null;
}

export default function AdvancedHeatmaps({ agents, selectedAgentId }: Props) {
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        const response = await fetch('/api/analytics/heatmap');
        const data = await response.json();
        setHeatmapData(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch heatmap data:', error);
        setLoading(false);
      }
    };

    fetchHeatmapData();
    const interval = setInterval(fetchHeatmapData, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#66605C' }}>
        Loading advanced analytics...
      </div>
    );
  }

  const filteredData = selectedAgentId
    ? heatmapData.filter(d => d.agentId === selectedAgentId)
    : heatmapData;

  // Get all unique dates across all agents
  const allDates = new Set<string>();
  filteredData.forEach(agent => {
    Object.keys(agent.dailyPerformance).forEach(date => allDates.add(date));
  });
  const sortedDates = Array.from(allDates).sort();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
      {/* Daily Performance Heatmap */}
      <div style={{
        backgroundColor: '#F8EBD8',
        padding: '20px',
        borderRadius: '16px',
        border: '1px solid #CCC1B7'
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px', color: '#262A33' }}>
          Daily Performance Heatmap
        </h3>

        {sortedDates.length === 0 ? (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: '#66605C',
            fontSize: '12px'
          }}>
            No performance data available yet. Data will appear once agents start trading.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `120px repeat(${sortedDates.length}, 50px)`,
              gap: '2px',
              fontSize: '10px',
              minWidth: 'fit-content'
            }}>
              {/* Header row with dates */}
              <div style={{ position: 'sticky', left: 0, backgroundColor: '#F8EBD8', zIndex: 2 }} />
              {sortedDates.map(date => (
                <div
                  key={date}
                  style={{
                    fontSize: '9px',
                    color: '#66605C',
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                    textAlign: 'left',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    padding: '4px 0'
                  }}
                >
                  {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              ))}

              {/* Rows for each agent */}
              {filteredData.map(agent => (
                <>
                  <div
                    key={`label-${agent.agentId}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      position: 'sticky',
                      left: 0,
                      backgroundColor: '#F8EBD8',
                      paddingRight: '8px',
                      zIndex: 1,
                      fontWeight: '600',
                      fontSize: '11px',
                      color: '#262A33'
                    }}
                  >
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: agent.color
                    }} />
                    {agent.name}
                  </div>
                  {sortedDates.map(date => {
                    const dayData = agent.dailyPerformance[date];
                    const percentChange = dayData?.percentChange || 0;
                    const dollarChange = dayData?.total || 0;

                    // Use percentage for color intensity (max at 5%)
                    const maxPercent = 5;
                    const intensity = Math.min(Math.abs(percentChange) / maxPercent, 1);
                    const color = percentChange > 0
                      ? `rgba(15, 123, 58, ${0.2 + intensity * 0.8})`
                      : percentChange < 0
                      ? `rgba(204, 0, 0, ${0.2 + intensity * 0.8})`
                      : '#E9DECF';

                    return (
                      <div
                        key={`${agent.agentId}-${date}`}
                        title={`${agent.name} on ${date}: ${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(2)}% (${dollarChange >= 0 ? '+' : ''}$${dollarChange.toFixed(2)})`}
                        style={{
                          width: '50px',
                          height: '40px',
                          backgroundColor: color,
                          borderRadius: '4px',
                          border: '1px solid #CCC1B7',
                          cursor: 'pointer',
                          transition: 'transform 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '9px',
                          fontWeight: '700',
                          color: Math.abs(percentChange) > 0.5 ? (intensity > 0.6 ? '#FFF' : '#262A33') : '#66605C'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.15)';
                          e.currentTarget.style.zIndex = '10';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.zIndex = '1';
                        }}
                      >
                        {Math.abs(percentChange) > 0.01 ? `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(1)}%` : '-'}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
          </div>
        )}

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          marginTop: '16px',
          fontSize: '10px',
          color: '#66605C'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: 'rgba(15, 123, 58, 0.8)', borderRadius: '3px' }} />
            <span>Profit</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: 'rgba(204, 0, 0, 0.8)', borderRadius: '3px' }} />
            <span>Loss</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#E9DECF', borderRadius: '3px', border: '1px solid #CCC1B7' }} />
            <span>No Change</span>
          </div>
        </div>
      </div>

      {/* Trading Volume Heatmap - Day of Week */}
      <div style={{
        backgroundColor: '#F8EBD8',
        padding: '20px',
        borderRadius: '16px',
        border: '1px solid #CCC1B7'
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px', color: '#262A33' }}>
          Trading Activity by Day of Week
        </h3>

        {filteredData.some(agent => Object.keys(agent.tradesByDayOfWeek).length > 0) ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '120px repeat(7, 1fr)',
            gap: '4px',
            fontSize: '10px'
          }}>
            {/* Header row */}
            <div style={{ position: 'sticky', left: 0, backgroundColor: '#F8EBD8', zIndex: 2 }} />
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, idx) => (
              <div
                key={day}
                style={{
                  textAlign: 'center',
                  fontWeight: '600',
                  color: '#262A33',
                  fontSize: '11px',
                  padding: '8px 4px'
                }}
              >
                {day}
              </div>
            ))}

            {/* Rows for each agent */}
            {filteredData.map(agent => {
              const maxTrades = Math.max(...Object.values(agent.tradesByDayOfWeek).map(d => d.count), 1);

              return (
                <>
                  <div
                    key={`label-${agent.agentId}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      position: 'sticky',
                      left: 0,
                      backgroundColor: '#F8EBD8',
                      paddingRight: '8px',
                      zIndex: 1,
                      fontWeight: '600',
                      fontSize: '11px',
                      color: '#262A33'
                    }}
                  >
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: agent.color
                    }} />
                    {agent.name}
                  </div>
                  {[0, 1, 2, 3, 4, 5, 6].map(dayIdx => {
                    const dayData = agent.tradesByDayOfWeek[dayIdx];
                    const count = dayData?.count || 0;
                    const winRate = count > 0 ? (dayData.wins / count) : 0;
                    const intensity = count / maxTrades;

                    let bgColor = '#E9DECF';
                    if (count > 0) {
                      if (winRate >= 0.5) {
                        bgColor = `rgba(15, 123, 58, ${0.2 + intensity * 0.8})`;
                      } else {
                        bgColor = `rgba(204, 0, 0, ${0.2 + intensity * 0.8})`;
                      }
                    }

                    return (
                      <div
                        key={`${agent.agentId}-${dayIdx}`}
                        title={`${agent.name}: ${count} trades, ${(winRate * 100).toFixed(0)}% win rate`}
                        style={{
                          height: '50px',
                          backgroundColor: bgColor,
                          borderRadius: '8px',
                          border: '1px solid #CCC1B7',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          fontWeight: '700',
                          color: intensity > 0.5 ? '#FFF' : '#262A33',
                          transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        {count > 0 && (
                          <>
                            <div>{count}</div>
                            <div style={{ fontSize: '8px', opacity: 0.8 }}>
                              {(winRate * 100).toFixed(0)}%
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </>
              );
            })}
          </div>
        ) : (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: '#66605C',
            fontSize: '12px'
          }}>
            No trading data available yet. Data will appear once agents execute trades.
          </div>
        )}

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          marginTop: '16px',
          fontSize: '10px',
          color: '#66605C'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: 'rgba(15, 123, 58, 0.8)', borderRadius: '3px' }} />
            <span>Wins &gt;50%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: 'rgba(204, 0, 0, 0.8)', borderRadius: '3px' }} />
            <span>Wins &lt;50%</span>
          </div>
        </div>
      </div>

      {/* Win/Loss Streak Visualization */}
      <div style={{
        backgroundColor: '#F8EBD8',
        padding: '20px',
        borderRadius: '16px',
        border: '1px solid #CCC1B7'
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px', color: '#262A33' }}>
          Win/Loss Streaks
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {filteredData.map(agent => (
            <div
              key={agent.agentId}
              style={{
                padding: '16px',
                backgroundColor: '#F5E6D3',
                borderRadius: '12px',
                border: '1px solid #CCC1B7'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px'
              }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: agent.color
                }} />
                <span style={{ fontSize: '11px', fontWeight: '600', color: '#262A33' }}>
                  {agent.name}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '10px', color: '#66605C' }}>Max Win Streak</span>
                  <div style={{
                    padding: '4px 12px',
                    backgroundColor: 'rgba(15, 123, 58, 0.15)',
                    border: '1px solid rgba(15, 123, 58, 0.3)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#0F7B3A'
                  }}>
                    {agent.maxWinStreak}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '10px', color: '#66605C' }}>Max Loss Streak</span>
                  <div style={{
                    padding: '4px 12px',
                    backgroundColor: 'rgba(204, 0, 0, 0.15)',
                    border: '1px solid rgba(204, 0, 0, 0.3)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#CC0000'
                  }}>
                    {agent.maxLossStreak}
                  </div>
                </div>

                {/* Recent streaks visualization */}
                <div style={{ marginTop: '8px' }}>
                  <div style={{ fontSize: '10px', color: '#66605C', marginBottom: '6px' }}>
                    Recent Streak Pattern
                  </div>
                  <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap' }}>
                    {agent.streaks.slice(-20).map((streak, idx) => (
                      <div
                        key={idx}
                        title={`${streak.type === 'win' ? 'Win' : 'Loss'} streak: ${streak.length}`}
                        style={{
                          width: `${Math.min(streak.length * 4, 40)}px`,
                          height: '12px',
                          backgroundColor: streak.type === 'win' ? '#0F7B3A' : '#CC0000',
                          borderRadius: '2px',
                          opacity: 0.7 + (idx / agent.streaks.length) * 0.3
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Correlation Matrix */}
      <div style={{
        backgroundColor: '#F8EBD8',
        padding: '20px',
        borderRadius: '16px',
        border: '1px solid #CCC1B7'
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px', color: '#262A33' }}>
          Model Performance Correlation
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `50px repeat(${agents.length}, 1fr)`,
          gap: '2px',
          fontSize: '10px'
        }}>
          {/* Header row */}
          <div />
          {agents.map(agent => (
            <div
              key={agent.id}
              style={{
                textAlign: 'center',
                fontWeight: '600',
                color: '#262A33',
                fontSize: '9px',
                padding: '4px'
              }}
            >
              {agent.name.split(' ')[0]}
            </div>
          ))}

          {/* Correlation cells */}
          {agents.map((rowAgent, rowIdx) => (
            <>
              <div
                key={`label-${rowAgent.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  fontWeight: '600',
                  color: '#262A33',
                  fontSize: '9px',
                  padding: '4px'
                }}
              >
                {rowAgent.name.split(' ')[0]}
              </div>
              {agents.map((colAgent, colIdx) => {
                // Calculate simple correlation based on ROI similarity
                const correlation = rowIdx === colIdx
                  ? 1
                  : 1 - Math.min(Math.abs((rowAgent.roi || 0) - (colAgent.roi || 0)) / 10, 1);

                const intensity = Math.abs(correlation);
                const color = correlation > 0.7
                  ? `rgba(15, 123, 58, ${intensity})`
                  : correlation < 0.3
                  ? `rgba(204, 0, 0, ${intensity})`
                  : `rgba(153, 15, 61, ${intensity * 0.6})`;

                return (
                  <div
                    key={`${rowAgent.id}-${colAgent.id}`}
                    title={`${rowAgent.name} vs ${colAgent.name}: ${(correlation * 100).toFixed(0)}%`}
                    style={{
                      aspectRatio: '1',
                      backgroundColor: color,
                      borderRadius: '4px',
                      border: '1px solid #CCC1B7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '8px',
                      fontWeight: '700',
                      color: intensity > 0.5 ? '#FFF' : '#262A33'
                    }}
                  >
                    {(correlation * 100).toFixed(0)}
                  </div>
                );
              })}
            </>
          ))}
        </div>
        <div style={{
          marginTop: '12px',
          padding: '10px',
          backgroundColor: '#EBE0D0',
          borderRadius: '8px',
          fontSize: '10px',
          color: '#66605C'
        }}>
          <strong style={{ color: '#262A33' }}>Note:</strong> Higher correlation (green) indicates models are performing similarly,
          while lower correlation (red) shows divergent strategies.
        </div>
      </div>
    </div>
  );
}
