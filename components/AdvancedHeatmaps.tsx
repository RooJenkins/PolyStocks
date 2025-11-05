'use client';

import { useEffect, useState } from 'react';
import type { AIAgent } from '@/types';

interface HeatmapData {
  agentId: string;
  name: string;
  model: string;
  color: string;
  dailyPerformance: Record<string, { gains: number; losses: number; total: number }>;
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

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

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
          📅 Daily Performance Heatmap
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredData.map(agent => {
            const dates = Object.keys(agent.dailyPerformance).sort();
            const last30Days = dates.slice(-30);

            return (
              <div key={agent.agentId} style={{ marginBottom: '12px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: agent.color
                  }} />
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#262A33' }}>
                    {agent.name}
                  </span>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${Math.min(last30Days.length, 30)}, 1fr)`,
                  gap: '4px',
                  maxWidth: '100%'
                }}>
                  {last30Days.map(date => {
                    const dayData = agent.dailyPerformance[date];
                    const change = dayData.total;
                    const maxChange = 50; // Normalize to $50 max change for color intensity
                    const intensity = Math.min(Math.abs(change) / maxChange, 1);
                    const color = change > 0
                      ? `rgba(15, 123, 58, ${0.3 + intensity * 0.7})`
                      : change < 0
                      ? `rgba(204, 0, 0, ${0.3 + intensity * 0.7})`
                      : '#E9DECF';

                    return (
                      <div
                        key={date}
                        title={`${date}: ${change >= 0 ? '+' : ''}$${change.toFixed(2)}`}
                        style={{
                          aspectRatio: '1',
                          backgroundColor: color,
                          borderRadius: '4px',
                          border: '1px solid #CCC1B7',
                          cursor: 'pointer',
                          transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      />
                    );
                  })}
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '4px',
                  fontSize: '9px',
                  color: '#66605C'
                }}>
                  <span>{last30Days[0]}</span>
                  <span>{last30Days[last30Days.length - 1]}</span>
                </div>
              </div>
            );
          })}
        </div>
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

      {/* Hourly Trading Activity Heatmap */}
      <div style={{
        backgroundColor: '#F8EBD8',
        padding: '20px',
        borderRadius: '16px',
        border: '1px solid #CCC1B7'
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px', color: '#262A33' }}>
          ⏰ Trading Activity by Hour & Day
        </h3>
        {filteredData.map(agent => {
          const maxTrades = Math.max(...Object.values(agent.tradesByHour).map(h => h.count), 1);

          return (
            <div key={agent.agentId} style={{ marginBottom: '24px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: agent.color
                }} />
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#262A33' }}>
                  {agent.name}
                </span>
              </div>

              {/* Day of Week x Hour Heatmap */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {/* Hour labels */}
                <div style={{ display: 'flex', gap: '2px', marginLeft: '40px' }}>
                  {[0, 4, 8, 12, 16, 20].map(hour => (
                    <div
                      key={hour}
                      style={{
                        width: '40px',
                        fontSize: '9px',
                        color: '#66605C',
                        textAlign: 'center'
                      }}
                    >
                      {hour}h
                    </div>
                  ))}
                </div>

                {/* Rows for each day */}
                {dayNames.map((day, dayIndex) => (
                  <div key={day} style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                    <div style={{
                      width: '35px',
                      fontSize: '10px',
                      fontWeight: '600',
                      color: '#66605C',
                      textAlign: 'right',
                      paddingRight: '5px'
                    }}>
                      {day}
                    </div>
                    {hours.map(hour => {
                      const trades = agent.tradesByHour[hour];
                      const count = trades?.count || 0;
                      const winRate = count > 0 ? (trades.wins / count) : 0.5;
                      const intensity = count / maxTrades;

                      // Color based on win rate: green for high, red for low, gray for no trades
                      let bgColor = '#E9DECF';
                      if (count > 0) {
                        if (winRate > 0.6) {
                          bgColor = `rgba(15, 123, 58, ${0.2 + intensity * 0.8})`;
                        } else if (winRate < 0.4) {
                          bgColor = `rgba(204, 0, 0, ${0.2 + intensity * 0.8})`;
                        } else {
                          bgColor = `rgba(153, 15, 61, ${0.2 + intensity * 0.6})`;
                        }
                      }

                      return (
                        <div
                          key={hour}
                          title={`${day} ${hour}:00 - ${count} trades (${(winRate * 100).toFixed(0)}% wins)`}
                          style={{
                            width: '10px',
                            height: '20px',
                            backgroundColor: bgColor,
                            borderRadius: '2px',
                            border: '1px solid #CCC1B7',
                            cursor: 'pointer'
                          }}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          marginTop: '12px',
          fontSize: '10px',
          color: '#66605C'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: 'rgba(15, 123, 58, 0.8)', borderRadius: '3px' }} />
            <span>High Win Rate</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: 'rgba(204, 0, 0, 0.8)', borderRadius: '3px' }} />
            <span>Low Win Rate</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#E9DECF', borderRadius: '3px', border: '1px solid #CCC1B7' }} />
            <span>No Activity</span>
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
          🔥 Win/Loss Streaks
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
                    🔥 {agent.maxWinStreak}
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
                    ❄️ {agent.maxLossStreak}
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
          🔗 Model Performance Correlation
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
