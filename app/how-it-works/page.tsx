'use client';

import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <div style={{
      height: '100vh',
      backgroundColor: '#E9DECF',
      padding: '8px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: '1900px', margin: '0 auto', height: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #F5E6D3 0%, #F8EBD8 100%)',
          padding: '6px 16px',
          borderRadius: '20px',
          border: '2px solid #990F3D',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              fontSize: '7px',
              fontWeight: '700',
              color: '#990F3D',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              padding: '3px 8px',
              backgroundColor: 'rgba(153, 15, 61, 0.15)',
              borderRadius: '10px',
              border: '1px solid rgba(153, 15, 61, 0.3)'
            }}>
              System Architecture
            </div>
            <h1 style={{
              fontSize: '15px',
              fontWeight: '600',
              margin: 0,
              letterSpacing: '-0.3px',
              color: '#262A33'
            }}>
              How PolyStocks Works
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              fontSize: '9px',
              color: '#66605C',
              fontFamily: 'Georgia, serif'
            }}>
              6 AI models • 20 stocks • Real-time competition
            </div>
            <Link
              href="/"
              style={{
                padding: '5px 12px',
                background: 'linear-gradient(135deg, #990F3D 0%, #b8123f 100%)',
                color: '#FFF',
                textDecoration: 'none',
                borderRadius: '14px',
                fontSize: '10px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 2px 4px rgba(153, 15, 61, 0.3)'
              }}
            >
              ← Dashboard
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          background: 'linear-gradient(135deg, #F5E6D3 0%, #F8EBD8 100%)',
          borderRadius: '20px',
          padding: '10px',
          flex: 1,
          display: 'grid',
          gridTemplateRows: 'auto 1fr auto',
          gap: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          border: '1px solid #CCC1B7'
        }}>
          {/* Top Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 240px 240px',
            gap: '8px'
          }}>
            {/* Trading Cycle */}
            <div style={{
              backgroundColor: '#FFF',
              padding: '10px',
              borderRadius: '16px',
              border: '1px solid #CCC1B7',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #990F3D 0%, #b8123f 100%)',
                color: '#FFF',
                padding: '5px 10px',
                borderRadius: '10px',
                textAlign: 'center',
                fontWeight: '700',
                fontSize: '8px',
                letterSpacing: '0.8px',
                marginBottom: '8px',
                boxShadow: '0 2px 4px rgba(153, 15, 61, 0.3)'
              }}>
                30-MINUTE TRADING CYCLE
              </div>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                {[
                  { num: '1', title: 'FETCH', desc: 'Real-time prices, RSI, MACD, SMA, EMA, news' },
                  { num: '2', title: 'ANALYZE', desc: '6 AI models × 15 function calls each' },
                  { num: '3', title: 'DECIDE', desc: 'BUY/SELL/HOLD + reasoning + risk' },
                  { num: '4', title: 'EXECUTE', desc: 'Slippage, delays, partial fills' },
                  { num: '5', title: 'RECORD', desc: 'Update P&L, positions, metrics' }
                ].map((step, idx) => (
                  <>
                    <div key={idx} style={{ flex: 1 }}>
                      <div style={{
                        backgroundColor: '#F8EBD8',
                        padding: '6px 4px',
                        borderRadius: '10px',
                        border: '2px solid #990F3D',
                        boxShadow: '0 2px 4px rgba(153, 15, 61, 0.1)'
                      }}>
                        <div style={{
                          fontWeight: '700',
                          fontSize: '7px',
                          color: '#990F3D',
                          marginBottom: '3px',
                          textAlign: 'center'
                        }}>
                          {step.num}. {step.title}
                        </div>
                        <div style={{
                          fontSize: '6px',
                          color: '#5a5a5a',
                          lineHeight: '1.3',
                          textAlign: 'center'
                        }}>
                          {step.desc}
                        </div>
                      </div>
                    </div>
                    {idx < 4 && (
                      <div style={{
                        fontSize: '12px',
                        color: '#990F3D',
                        fontWeight: '700'
                      }}>→</div>
                    )}
                  </>
                ))}
              </div>
            </div>

            {/* Data Sources */}
            <div style={{
              backgroundColor: '#FFF',
              padding: '10px',
              borderRadius: '16px',
              border: '1px solid #CCC1B7',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
            }}>
              <h3 style={{
                fontSize: '8px',
                fontWeight: '700',
                color: '#990F3D',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                textAlign: 'center'
              }}>
                Market Data APIs
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{
                  backgroundColor: '#F8EBD8',
                  padding: '8px',
                  borderRadius: '10px',
                  border: '1px solid #CCC1B7'
                }}>
                  <div style={{ fontWeight: '700', fontSize: '9px', color: '#262A33', marginBottom: '4px' }}>
                    Yahoo Finance
                  </div>
                  <div style={{ fontSize: '7px', color: '#66605C', lineHeight: '1.4', marginBottom: '4px' }}>
                    • Real-time quotes<br/>
                    • Historical OHLCV<br/>
                    • Company info<br/>
                    • Trending stocks<br/>
                    • News feed
                  </div>
                  <div style={{
                    fontSize: '6px',
                    color: '#10b981',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    backgroundColor: '#ecfdf5',
                    padding: '2px 5px',
                    borderRadius: '5px',
                    textAlign: 'center'
                  }}>
                    ∞ Unlimited
                  </div>
                </div>
                <div style={{
                  backgroundColor: '#F8EBD8',
                  padding: '8px',
                  borderRadius: '10px',
                  border: '1px solid #CCC1B7'
                }}>
                  <div style={{ fontWeight: '700', fontSize: '9px', color: '#262A33', marginBottom: '4px' }}>
                    Alpha Vantage
                  </div>
                  <div style={{ fontSize: '7px', color: '#66605C', lineHeight: '1.4', marginBottom: '4px' }}>
                    • RSI, MACD indicators<br/>
                    • SMA/EMA averages<br/>
                    • Bollinger Bands<br/>
                    • News sentiment
                  </div>
                  <div style={{
                    fontSize: '6px',
                    color: '#ea580c',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    backgroundColor: '#ffedd5',
                    padding: '2px 5px',
                    borderRadius: '5px',
                    textAlign: 'center'
                  }}>
                    ⚠ 25/Day Limit
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Management */}
            <div style={{
              backgroundColor: '#FFF',
              padding: '10px',
              borderRadius: '16px',
              border: '1px solid #CCC1B7',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
            }}>
              <h3 style={{
                fontSize: '8px',
                fontWeight: '700',
                color: '#990F3D',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                textAlign: 'center'
              }}>
                Risk Rules & Limits
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { title: 'Capital', items: ['Start: $10,000/agent', 'Max trade: $500', 'Max positions: 20'] },
                  { title: 'Rules', items: ['Long only (no shorts)', 'No leverage/margin', 'Cash required first'] },
                  { title: 'Execution', items: ['Slippage: 0-0.2%', 'Delay: 1-3 seconds', 'Fills: 90-100%'] }
                ].map((section, idx) => (
                  <div key={idx} style={{
                    backgroundColor: '#F8EBD8',
                    padding: '6px 8px',
                    borderRadius: '10px',
                    border: '1px solid #CCC1B7'
                  }}>
                    <div style={{ fontWeight: '700', marginBottom: '3px', color: '#262A33', fontSize: '8px' }}>
                      {section.title}
                    </div>
                    <div style={{ fontSize: '6px', color: '#66605C', lineHeight: '1.3' }}>
                      {section.items.map((item, i) => (
                        <div key={i}>• {item}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr',
            gap: '8px',
            overflow: 'hidden'
          }}>
            {/* AI Models */}
            <div style={{
              backgroundColor: '#FFF',
              padding: '10px',
              borderRadius: '16px',
              border: '1px solid #CCC1B7',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h2 style={{
                fontSize: '10px',
                fontWeight: '700',
                color: '#262A33',
                marginBottom: '8px',
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '0.8px'
              }}>
                Competing AI Models
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '6px',
                flex: 1
              }}>
                {[
                  { name: 'GPT-5', provider: 'OpenAI', desc: 'Advanced reasoning, technical analysis, conservative risk', color: '#10A37F' },
                  { name: 'Claude Sonnet 4.5', provider: 'Anthropic', desc: 'Balanced approach, detailed reasoning, portfolio optimization', color: '#CC785C' },
                  { name: 'Gemini Flash', provider: 'Google', desc: 'Fast decisions, trend following, high-frequency mindset', color: '#4285F4' },
                  { name: 'DeepSeek', provider: 'DeepSeek', desc: 'Value investing, fundamentals-focused, long-term holds', color: '#5B4DFF' },
                  { name: 'Qwen', provider: 'Alibaba', desc: 'Momentum trading, pattern recognition, technical signals', color: '#FF6A00' },
                  { name: 'Grok', provider: 'xAI', desc: 'Contrarian plays, market sentiment, bold moves', color: '#000000' }
                ].map((model, idx) => (
                  <div key={idx} style={{
                    backgroundColor: '#F8EBD8',
                    padding: '7px',
                    borderRadius: '10px',
                    border: `2px solid ${model.color}`,
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)'
                  }}>
                    <div style={{
                      fontWeight: '700',
                      fontSize: '9px',
                      color: model.color,
                      marginBottom: '2px',
                      textAlign: 'center',
                      minHeight: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {model.name}
                    </div>
                    <div style={{
                      fontSize: '6px',
                      color: '#66605C',
                      fontWeight: '600',
                      textAlign: 'center',
                      marginBottom: '4px'
                    }}>
                      {model.provider}
                    </div>
                    <div style={{
                      fontSize: '6px',
                      color: '#5a5a5a',
                      lineHeight: '1.3',
                      flex: 1,
                      marginBottom: '5px'
                    }}>
                      {model.desc}
                    </div>
                    <div style={{
                      padding: '3px 5px',
                      backgroundColor: '#FFF',
                      border: `1px solid ${model.color}`,
                      borderRadius: '6px',
                      fontSize: '6px',
                      color: model.color,
                      fontWeight: '700',
                      textAlign: 'center',
                      textTransform: 'uppercase'
                    }}>
                      15 Tool Budget
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Database Schema */}
            <div style={{
              backgroundColor: '#FFF',
              padding: '10px',
              borderRadius: '16px',
              border: '1px solid #CCC1B7',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h3 style={{
                fontSize: '8px',
                fontWeight: '700',
                color: '#262A33',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                textAlign: 'center'
              }}>
                PostgreSQL Database
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                {[
                  { table: 'Agents', fields: 'id, name, model, accountValue, cashBalance', records: '6 models', color: '#10b981' },
                  { table: 'Positions', fields: 'symbol, quantity, entryPrice, unrealizedPnL', records: '~50 active', color: '#3b82f6' },
                  { table: 'Trades', fields: 'action, price, total, realizedPnL, reasoning', records: '~500 history', color: '#8b5cf6' },
                  { table: 'Decisions', fields: 'action, symbol, confidence, riskAssessment', records: '~2k logged', color: '#f59e0b' },
                  { table: 'Performance', fields: 'timestamp, accountValue, metrics', records: '~10k points', color: '#ef4444' },
                  { table: 'StockPrices', fields: 'symbol, price, change, volume', records: '~5k snapshots', color: '#06b6d4' },
                  { table: 'NewsItems', fields: 'title, sentiment, symbols', records: '~1k articles', color: '#84cc16' }
                ].map((db, idx) => (
                  <div key={idx} style={{
                    backgroundColor: '#F8EBD8',
                    padding: '5px 7px',
                    borderRadius: '8px',
                    border: `1px solid ${db.color}`,
                    borderLeft: `3px solid ${db.color}`
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '2px'
                    }}>
                      <div style={{
                        fontSize: '7px',
                        fontWeight: '700',
                        color: '#262A33'
                      }}>
                        {db.table}
                      </div>
                      <div style={{
                        fontSize: '5px',
                        color: db.color,
                        fontWeight: '700',
                        backgroundColor: '#FFF',
                        padding: '2px 4px',
                        borderRadius: '4px',
                        border: `1px solid ${db.color}`
                      }}>
                        {db.records}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '5px',
                      color: '#66605C',
                      lineHeight: '1.3'
                    }}>
                      {db.fields}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '8px'
          }}>
            {/* Performance Metrics */}
            <div style={{
              backgroundColor: '#FFF',
              padding: '10px',
              borderRadius: '16px',
              border: '1px solid #CCC1B7',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
            }}>
              <h3 style={{
                fontSize: '8px',
                fontWeight: '700',
                color: '#990F3D',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.8px'
              }}>
                Performance Analytics
              </h3>
              <div style={{ fontSize: '6px', color: '#5a5a5a', lineHeight: '1.4' }}>
                <div style={{ marginBottom: '5px' }}>
                  <div style={{ fontWeight: '700', marginBottom: '2px', color: '#262A33', fontSize: '7px' }}>Core Metrics</div>
                  <div style={{ backgroundColor: '#F8EBD8', padding: '5px', borderRadius: '6px', marginBottom: '3px' }}>
                    <strong>Account Value:</strong> Cash + positions<br/>
                    <strong>ROI:</strong> (current - start) / start × 100%<br/>
                    <strong>P&L:</strong> Realized + unrealized
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: '700', marginBottom: '2px', color: '#262A33', fontSize: '7px' }}>Risk Metrics</div>
                  <div style={{ backgroundColor: '#F8EBD8', padding: '5px', borderRadius: '6px' }}>
                    <strong>Sharpe:</strong> Risk-adjusted returns<br/>
                    <strong>Drawdown:</strong> Peak-to-trough<br/>
                    <strong>Win Rate:</strong> Profitable / total
                  </div>
                </div>
              </div>
            </div>

            {/* Automation */}
            <div style={{
              backgroundColor: '#FFF',
              padding: '10px',
              borderRadius: '16px',
              border: '1px solid #CCC1B7',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
            }}>
              <h3 style={{
                fontSize: '8px',
                fontWeight: '700',
                color: '#990F3D',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.8px'
              }}>
                Automated Trading
              </h3>
              <div style={{ fontSize: '6px', color: '#5a5a5a', lineHeight: '1.4' }}>
                <div style={{ marginBottom: '5px' }}>
                  <div style={{ fontWeight: '700', marginBottom: '2px', color: '#262A33', fontSize: '7px' }}>Scheduler</div>
                  <div style={{ backgroundColor: '#F8EBD8', padding: '5px', borderRadius: '6px', marginBottom: '3px' }}>
                    GitHub Actions → Vercel API<br/>
                    <code style={{ fontSize: '5px', fontFamily: 'monospace' }}>0,30 14-21 * * 1-5</code>
                  </div>
                </div>
                <div style={{ fontWeight: '700', marginBottom: '2px', color: '#262A33', fontSize: '7px' }}>16 Cycles/Day</div>
                <div style={{ fontSize: '6px', lineHeight: '1.3', marginBottom: '5px' }}>
                  9:00•9:30•10:00•10:30•11:00•11:30<br/>
                  12:00•12:30•1:00•1:30•2:00•2:30<br/>
                  3:00•3:30•4:00•4:30 PM EST
                </div>
                <div style={{
                  padding: '4px',
                  backgroundColor: '#F8EBD8',
                  borderRadius: '6px',
                  fontWeight: '700',
                  color: '#262A33',
                  fontSize: '6px',
                  textAlign: 'center'
                }}>
                  MON-FRI • MARKET HOURS
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            <div style={{
              backgroundColor: '#FFF',
              padding: '10px',
              borderRadius: '16px',
              border: '1px solid #CCC1B7',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
            }}>
              <h3 style={{
                fontSize: '8px',
                fontWeight: '700',
                color: '#990F3D',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.8px'
              }}>
                Technology Stack
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {[
                  { layer: 'FRONTEND', tech: 'Next.js 15 • React 19 • TypeScript • Tailwind' },
                  { layer: 'BACKEND', tech: 'API Routes • Prisma • Trading Engine' },
                  { layer: 'DATABASE', tech: 'PostgreSQL • 7 Tables • Real-time' },
                  { layer: 'DATA', tech: 'Yahoo Finance • Alpha Vantage • News' },
                  { layer: 'AI', tech: 'OpenAI • Anthropic • Google • xAI • DeepSeek' },
                  { layer: 'HOSTING', tech: 'Vercel Edge • GitHub Actions • CRON' }
                ].map((stack, idx) => (
                  <div key={idx} style={{
                    padding: '4px 6px',
                    backgroundColor: '#F8EBD8',
                    borderRadius: '6px',
                    border: '1px solid #CCC1B7'
                  }}>
                    <div style={{
                      fontSize: '6px',
                      fontWeight: '700',
                      color: '#990F3D',
                      marginBottom: '1px',
                      letterSpacing: '0.4px'
                    }}>
                      {stack.layer}
                    </div>
                    <div style={{ fontSize: '6px', color: '#66605C', lineHeight: '1.3' }}>
                      {stack.tech}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
