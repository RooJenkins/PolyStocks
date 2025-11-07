'use client';

import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <div style={{
      height: '100vh',
      background: 'linear-gradient(135deg, #E9DECF 0%, #D4C7BA 100%)',
      padding: '10px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: '1800px', margin: '0 auto', height: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #990F3D 0%, #b8123f 100%)',
          padding: '12px 20px',
          borderRadius: '10px',
          color: '#FFF'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{
                fontSize: '9px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                marginBottom: '4px',
                opacity: 0.9
              }}>
                System Architecture
              </div>
              <h1 style={{
                fontSize: '26px',
                fontWeight: '700',
                margin: 0,
                letterSpacing: '-0.5px',
                lineHeight: '1'
              }}>
                How PolyStocks Works
              </h1>
              <p style={{
                fontSize: '11px',
                margin: '4px 0 0 0',
                lineHeight: '1.3',
                opacity: 0.95
              }}>
                Real-time AI trading competition with 6 models, 20 stocks, and complete transparency
              </p>
            </div>
            <Link
              href="/"
              style={{
                padding: '8px 16px',
                background: 'rgba(255,255,255,0.2)',
                color: '#FFF',
                textDecoration: 'none',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                border: '1px solid rgba(255,255,255,0.3)',
                transition: 'all 0.2s'
              }}
            >
              ← Dashboard
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          background: '#FFF',
          borderRadius: '10px',
          padding: '12px',
          flex: 1,
          display: 'grid',
          gridTemplateRows: 'auto 1fr auto',
          gap: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(153, 15, 61, 0.08)'
        }}>
          {/* Top Section: Trading Cycle + Data Sources + Risk Rules */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 240px 240px',
            gap: '8px',
            minHeight: 0
          }}>
            {/* Trading Cycle */}
            <div style={{
              background: 'linear-gradient(135deg, #FFF5F0 0%, #FFE9E0 100%)',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #f0d5cc'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #990F3D 0%, #b8123f 100%)',
                color: '#FFF',
                padding: '6px',
                borderRadius: '6px',
                textAlign: 'center',
                fontWeight: '700',
                fontSize: '9px',
                letterSpacing: '1px',
                marginBottom: '8px'
              }}>
                30-MINUTE TRADING CYCLE
              </div>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'stretch' }}>
                {[
                  { num: '1', title: 'FETCH', desc: 'Get real-time prices, RSI, MACD, SMA, EMA, news for 20 stocks' },
                  { num: '2', title: 'ANALYZE', desc: '6 AI models process data with 15 function calls each' },
                  { num: '3', title: 'DECIDE', desc: 'Generate BUY/SELL/HOLD + reasoning + confidence + risk' },
                  { num: '4', title: 'EXECUTE', desc: 'Simulate: slippage (0-0.2%), delay (1-3s), partial fills' },
                  { num: '5', title: 'RECORD', desc: 'Log decision, update positions, calculate P&L, track metrics' }
                ].map((step, idx) => (
                  <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{
                      background: '#FFF',
                      padding: '6px',
                      borderRadius: '6px',
                      border: '2px solid #990F3D',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <div style={{
                        fontWeight: '700',
                        fontSize: '8px',
                        color: '#990F3D',
                        marginBottom: '4px',
                        textAlign: 'center'
                      }}>
                        {step.num}. {step.title}
                      </div>
                      <div style={{
                        fontSize: '7px',
                        color: '#5a5a5a',
                        lineHeight: '1.3',
                        flex: 1
                      }}>
                        {step.desc}
                      </div>
                    </div>
                    {idx < 4 && (
                      <div style={{
                        textAlign: 'center',
                        fontSize: '12px',
                        color: '#990F3D',
                        fontWeight: '700',
                        padding: '2px 0'
                      }}>→</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Data Sources */}
            <div style={{
              background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #c5e3f6'
            }}>
              <h3 style={{
                fontSize: '9px',
                fontWeight: '700',
                color: '#075985',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Market Data APIs
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{
                  background: '#FFF',
                  padding: '8px',
                  borderRadius: '6px',
                  borderLeft: '3px solid #0284c7'
                }}>
                  <div style={{ fontWeight: '700', fontSize: '10px', color: '#075985', marginBottom: '4px' }}>
                    Yahoo Finance
                  </div>
                  <div style={{ fontSize: '8px', color: '#5a5a5a', lineHeight: '1.4', marginBottom: '4px' }}>
                    • Real-time quotes<br/>
                    • Historical OHLCV data<br/>
                    • Company fundamentals<br/>
                    • Trending stocks<br/>
                    • Market news feed
                  </div>
                  <div style={{
                    fontSize: '7px',
                    color: '#0284c7',
                    fontWeight: '700',
                    textTransform: 'uppercase'
                  }}>
                    ∞ Unlimited Calls
                  </div>
                </div>
                <div style={{
                  background: '#FFF',
                  padding: '8px',
                  borderRadius: '6px',
                  borderLeft: '3px solid #ea580c'
                }}>
                  <div style={{ fontWeight: '700', fontSize: '10px', color: '#9a3412', marginBottom: '4px' }}>
                    Alpha Vantage
                  </div>
                  <div style={{ fontSize: '8px', color: '#5a5a5a', lineHeight: '1.4', marginBottom: '4px' }}>
                    • RSI (Relative Strength)<br/>
                    • MACD (Momentum)<br/>
                    • SMA/EMA (Averages)<br/>
                    • Bollinger Bands<br/>
                    • News sentiment
                  </div>
                  <div style={{
                    fontSize: '7px',
                    color: '#ea580c',
                    fontWeight: '700',
                    textTransform: 'uppercase'
                  }}>
                    ⚠ 25 Calls/Day Limit
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Management */}
            <div style={{
              background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #f0d896'
            }}>
              <h3 style={{
                fontSize: '9px',
                fontWeight: '700',
                color: '#78350f',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Risk Rules & Limits
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '8px', color: '#5a5a5a' }}>
                <div style={{
                  background: '#FFF',
                  padding: '7px',
                  borderRadius: '6px',
                  borderLeft: '3px solid #ca8a04'
                }}>
                  <div style={{ fontWeight: '700', marginBottom: '3px', color: '#78350f', fontSize: '9px' }}>Capital</div>
                  <div style={{ lineHeight: '1.4' }}>
                    • Start: $10,000/agent<br/>
                    • Max trade: $500<br/>
                    • Max positions: 20
                  </div>
                </div>
                <div style={{
                  background: '#FFF',
                  padding: '7px',
                  borderRadius: '6px',
                  borderLeft: '3px solid #ca8a04'
                }}>
                  <div style={{ fontWeight: '700', marginBottom: '3px', color: '#78350f', fontSize: '9px' }}>Rules</div>
                  <div style={{ lineHeight: '1.4' }}>
                    • Long only (no shorts)<br/>
                    • No leverage/margin<br/>
                    • Cash required first
                  </div>
                </div>
                <div style={{
                  background: '#FFF',
                  padding: '7px',
                  borderRadius: '6px',
                  borderLeft: '3px solid #ca8a04'
                }}>
                  <div style={{ fontWeight: '700', marginBottom: '3px', color: '#78350f', fontSize: '9px' }}>Execution</div>
                  <div style={{ lineHeight: '1.4' }}>
                    • Slippage: 0-0.2%<br/>
                    • Delay: 1-3 seconds<br/>
                    • Fills: 90-100%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Section: AI Models + Database Architecture */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr',
            gap: '8px',
            minHeight: 0,
            overflow: 'hidden'
          }}>
            {/* AI Models */}
            <div style={{
              background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #e4d9f7',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0
            }}>
              <h2 style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#5b21b6',
                marginBottom: '8px',
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '1px'
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
                  { name: 'GPT-5', provider: 'OpenAI', desc: 'Advanced reasoning, strong technical analysis, conservative risk' },
                  { name: 'Claude Sonnet 4.5', provider: 'Anthropic', desc: 'Balanced approach, detailed reasoning, portfolio optimization' },
                  { name: 'Gemini Flash', provider: 'Google', desc: 'Fast decisions, trend following, high-frequency mindset' },
                  { name: 'DeepSeek', provider: 'DeepSeek', desc: 'Value investing, fundamentals-focused, long-term holds' },
                  { name: 'Qwen', provider: 'Alibaba', desc: 'Momentum trading, pattern recognition, technical signals' },
                  { name: 'Grok', provider: 'xAI', desc: 'Contrarian plays, market sentiment analysis, bold moves' }
                ].map((model, idx) => (
                  <div key={idx} style={{
                    background: '#FFF',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #e4d9f7',
                    borderTop: '3px solid #7c3aed',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <div style={{
                      fontWeight: '700',
                      fontSize: '10px',
                      color: '#5b21b6',
                      marginBottom: '2px',
                      textAlign: 'center',
                      minHeight: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {model.name}
                    </div>
                    <div style={{
                      fontSize: '7px',
                      color: '#7c3aed',
                      fontWeight: '600',
                      textAlign: 'center',
                      marginBottom: '6px'
                    }}>
                      {model.provider}
                    </div>
                    <div style={{
                      fontSize: '7px',
                      color: '#5a5a5a',
                      lineHeight: '1.3',
                      flex: 1,
                      marginBottom: '6px'
                    }}>
                      {model.desc}
                    </div>
                    <div style={{
                      padding: '4px',
                      background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
                      border: '1px solid #e4d9f7',
                      borderRadius: '4px',
                      fontSize: '7px',
                      color: '#5b21b6',
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

            {/* Database Architecture */}
            <div style={{
              background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #c0f2dc',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h3 style={{
                fontSize: '9px',
                fontWeight: '700',
                color: '#065f46',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                textAlign: 'center'
              }}>
                PostgreSQL Database
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                {[
                  { table: 'Agents', fields: 'id, name, model, accountValue, cashBalance, isLive, broker', records: '6 AI models' },
                  { table: 'Positions', fields: 'symbol, quantity, entryPrice, unrealizedPnL', records: '~50 active' },
                  { table: 'Trades', fields: 'action, price, total, realizedPnL, reasoning', records: '~500 history' },
                  { table: 'Decisions', fields: 'action, symbol, confidence, riskAssessment', records: '~2000 logged' },
                  { table: 'Performance', fields: 'timestamp, accountValue, metrics', records: '~10k points' },
                  { table: 'StockPrices', fields: 'symbol, price, change, volume', records: '~5k snapshots' },
                  { table: 'NewsItems', fields: 'title, sentiment, symbols, publishedAt', records: '~1k articles' }
                ].map((db, idx) => (
                  <div key={idx} style={{
                    background: '#FFF',
                    padding: '5px 7px',
                    borderRadius: '6px',
                    border: '1px solid #c0f2dc',
                    borderLeft: '3px solid #10b981'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '2px'
                    }}>
                      <div style={{
                        fontSize: '8px',
                        fontWeight: '700',
                        color: '#065f46'
                      }}>
                        {db.table}
                      </div>
                      <div style={{
                        fontSize: '6px',
                        color: '#10b981',
                        fontWeight: '600',
                        background: '#ECFDF5',
                        padding: '2px 4px',
                        borderRadius: '3px'
                      }}>
                        {db.records}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '6px',
                      color: '#5a5a5a',
                      lineHeight: '1.3'
                    }}>
                      {db.fields}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section: Performance Metrics + Automation + Tech Stack */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '8px',
            minHeight: 0
          }}>
            {/* Performance Metrics */}
            <div style={{
              background: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #f7ccd1'
            }}>
              <h3 style={{
                fontSize: '9px',
                fontWeight: '700',
                color: '#9f1239',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Performance Analytics
              </h3>
              <div style={{ fontSize: '8px', color: '#5a5a5a', lineHeight: '1.5' }}>
                <div style={{ marginBottom: '6px' }}>
                  <div style={{ fontWeight: '700', marginBottom: '3px', color: '#9f1239', fontSize: '9px' }}>Core Metrics</div>
                  <div style={{ background: '#FFF', padding: '6px', borderRadius: '6px', borderLeft: '3px solid #f43f5e', marginBottom: '4px' }}>
                    <strong>Account Value:</strong> Cash + (position qty × current price)<br/>
                    <strong>ROI:</strong> ((current - start) / start) × 100%<br/>
                    <strong>Total P&L:</strong> Realized + unrealized gains/losses
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: '700', marginBottom: '3px', color: '#9f1239', fontSize: '9px' }}>Risk Metrics</div>
                  <div style={{ background: '#FFF', padding: '6px', borderRadius: '6px', borderLeft: '3px solid #f43f5e' }}>
                    <strong>Sharpe Ratio:</strong> Risk-adjusted returns<br/>
                    <strong>Max Drawdown:</strong> Peak-to-trough decline<br/>
                    <strong>Win Rate:</strong> Profitable trades / total trades
                  </div>
                </div>
              </div>
            </div>

            {/* GitHub Actions Automation */}
            <div style={{
              background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #c7dff7'
            }}>
              <h3 style={{
                fontSize: '9px',
                fontWeight: '700',
                color: '#1e40af',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Automated Trading
              </h3>
              <div style={{ fontSize: '8px', color: '#5a5a5a', lineHeight: '1.5' }}>
                <div style={{ marginBottom: '6px' }}>
                  <div style={{ fontWeight: '700', marginBottom: '3px', color: '#1e40af', fontSize: '9px' }}>Scheduler</div>
                  <div style={{ background: '#FFF', padding: '6px', borderRadius: '6px', border: '1px solid #c7dff7', fontSize: '7px', marginBottom: '4px' }}>
                    GitHub Actions → Vercel API<br/>
                    <code style={{ background: '#EFF6FF', padding: '2px 4px', borderRadius: '3px', fontFamily: 'monospace' }}>
                      0,30 14-21 * * 1-5
                    </code>
                  </div>
                </div>
                <div style={{ fontWeight: '700', marginBottom: '3px', color: '#1e40af', fontSize: '9px' }}>16 Cycles/Day</div>
                <div style={{ fontSize: '7px', lineHeight: '1.4', marginBottom: '6px' }}>
                  9:00 • 9:30 • 10:00 • 10:30 • 11:00 • 11:30<br/>
                  12:00 • 12:30 • 1:00 • 1:30 • 2:00 • 2:30<br/>
                  3:00 • 3:30 • 4:00 • 4:30 PM EST
                </div>
                <div style={{
                  padding: '6px',
                  background: '#FFF',
                  border: '1px solid #c7dff7',
                  borderRadius: '6px',
                  fontWeight: '700',
                  color: '#1e40af',
                  fontSize: '7px',
                  textAlign: 'center'
                }}>
                  MON-FRI • MARKET HOURS ONLY
                </div>
              </div>
            </div>

            {/* Technology Stack */}
            <div style={{
              background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #c6f0d2'
            }}>
              <h3 style={{
                fontSize: '9px',
                fontWeight: '700',
                color: '#14532d',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Technology Stack
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {[
                  { layer: 'FRONTEND', tech: 'Next.js 15 • React 19 • TypeScript • Tailwind CSS • Recharts' },
                  { layer: 'BACKEND', tech: 'Next.js API Routes • Prisma ORM • Trading Engine' },
                  { layer: 'DATABASE', tech: 'PostgreSQL • 7 Tables • Real-time queries' },
                  { layer: 'DATA APIS', tech: 'Yahoo Finance • Alpha Vantage • News API' },
                  { layer: 'AI MODELS', tech: 'OpenAI • Anthropic • Google • xAI • DeepSeek • Alibaba' },
                  { layer: 'HOSTING', tech: 'Vercel Edge • GitHub Actions • Automated CRON' }
                ].map((stack, idx) => (
                  <div key={idx} style={{
                    padding: '5px 7px',
                    background: '#FFF',
                    borderRadius: '6px',
                    border: '1px solid #c6f0d2',
                    borderLeft: '3px solid #22c55e'
                  }}>
                    <div style={{
                      fontSize: '7px',
                      fontWeight: '700',
                      color: '#14532d',
                      marginBottom: '2px',
                      letterSpacing: '0.5px'
                    }}>
                      {stack.layer}
                    </div>
                    <div style={{ fontSize: '7px', color: '#5a5a5a', lineHeight: '1.3' }}>
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
