'use client';

import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <div style={{
      height: '100vh',
      backgroundColor: '#E9DECF',
      padding: '12px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: '1800px', margin: '0 auto', height: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #F5E6D3 0%, #F8EBD8 100%)',
          padding: '8px 20px',
          borderRadius: '20px',
          border: '2px solid #990F3D',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              fontSize: '8px',
              fontWeight: '700',
              color: '#990F3D',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              padding: '4px 10px',
              backgroundColor: 'rgba(153, 15, 61, 0.15)',
              borderRadius: '12px',
              border: '1px solid rgba(153, 15, 61, 0.3)'
            }}>
              System Architecture
            </div>
            <h1 style={{
              fontSize: '18px',
              fontWeight: '600',
              margin: 0,
              letterSpacing: '-0.3px',
              color: '#262A33'
            }}>
              How PolyStocks Works
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              fontSize: '10px',
              color: '#66605C',
              fontFamily: 'Georgia, serif'
            }}>
              6 AI models • 20 stocks • Real-time competition
            </div>
            <Link
              href="/"
              style={{
                padding: '6px 14px',
                background: 'linear-gradient(135deg, #990F3D 0%, #b8123f 100%)',
                color: '#FFF',
                textDecoration: 'none',
                borderRadius: '16px',
                fontSize: '11px',
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
          padding: '14px',
          flex: 1,
          display: 'grid',
          gridTemplateRows: 'auto 1fr auto',
          gap: '10px',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          border: '1px solid #CCC1B7'
        }}>
          {/* Top Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.3fr 260px 260px',
            gap: '10px'
          }}>
            {/* Trading Cycle */}
            <div style={{
              backgroundColor: '#FFF',
              padding: '12px',
              borderRadius: '16px',
              border: '1px solid #CCC1B7',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #990F3D 0%, #b8123f 100%)',
                color: '#FFF',
                padding: '6px 12px',
                borderRadius: '12px',
                textAlign: 'center',
                fontWeight: '700',
                fontSize: '9px',
                letterSpacing: '1px',
                marginBottom: '10px',
                boxShadow: '0 2px 4px rgba(153, 15, 61, 0.3)'
              }}>
                30-MINUTE TRADING CYCLE
              </div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'stretch' }}>
                {[
                  { num: '1', title: 'FETCH', desc: 'Real-time prices, RSI, MACD, SMA, EMA, news' },
                  { num: '2', title: 'ANALYZE', desc: '6 AI models × 15 function calls each' },
                  { num: '3', title: 'DECIDE', desc: 'BUY/SELL/HOLD + reasoning + risk' },
                  { num: '4', title: 'EXECUTE', desc: 'Slippage, delays, partial fills' },
                  { num: '5', title: 'RECORD', desc: 'Update P&L, positions, metrics' }
                ].map((step, idx) => (
                  <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      backgroundColor: '#F8EBD8',
                      padding: '8px 6px',
                      borderRadius: '12px',
                      border: '2px solid #990F3D',
                      flex: 1,
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 2px 4px rgba(153, 15, 61, 0.1)'
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
                        textAlign: 'center',
                        flex: 1
                      }}>
                        {step.desc}
                      </div>
                    </div>
                    {idx < 4 && (
                      <div style={{
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
              backgroundColor: '#FFF',
              padding: '12px',
              borderRadius: '16px',
              border: '1px solid #CCC1B7',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
            }}>
              <h3 style={{
                fontSize: '9px',
                fontWeight: '700',
                color: '#990F3D',
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                textAlign: 'center'
              }}>
                Market Data APIs
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{
                  backgroundColor: '#F8EBD8',
                  padding: '10px',
                  borderRadius: '12px',
                  border: '1px solid #CCC1B7'
                }}>
                  <div style={{ fontWeight: '700', fontSize: '10px', color: '#262A33', marginBottom: '6px' }}>
                    Yahoo Finance
                  </div>
                  <div style={{ fontSize: '8px', color: '#66605C', lineHeight: '1.5', marginBottom: '6px' }}>
                    • Real-time quotes<br/>
                    • Historical OHLCV<br/>
                    • Company info<br/>
                    • Trending stocks<br/>
                    • News feed
                  </div>
                  <div style={{
                    fontSize: '7px',
                    color: '#10b981',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    backgroundColor: '#ecfdf5',
                    padding: '3px 6px',
                    borderRadius: '6px',
                    textAlign: 'center'
                  }}>
                    ∞ Unlimited
                  </div>
                </div>
                <div style={{
                  backgroundColor: '#F8EBD8',
                  padding: '10px',
                  borderRadius: '12px',
                  border: '1px solid #CCC1B7'
                }}>
                  <div style={{ fontWeight: '700', fontSize: '10px', color: '#262A33', marginBottom: '6px' }}>
                    Alpha Vantage
                  </div>
                  <div style={{ fontSize: '8px', color: '#66605C', lineHeight: '1.5', marginBottom: '6px' }}>
                    • RSI, MACD indicators<br/>
                    • SMA/EMA averages<br/>
                    • Bollinger Bands<br/>
                    • News sentiment
                  </div>
                  <div style={{
                    fontSize: '7px',
                    color: '#ea580c',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    backgroundColor: '#ffedd5',
                    padding: '3px 6px',
                    borderRadius: '6px',
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
              padding: '12px',
              borderRadius: '16px',
              border: '1px solid #CCC1B7',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
            }}>
              <h3 style={{
                fontSize: '9px',
                fontWeight: '700',
                color: '#990F3D',
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                textAlign: 'center'
              }}>
                Risk Rules & Limits
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { title: 'Capital', items: ['Start: $10,000/agent', 'Max trade: $500', 'Max positions: 20'] },
                  { title: 'Rules', items: ['Long only (no shorts)', 'No leverage/margin', 'Cash required first'] },
                  { title: 'Execution', items: ['Slippage: 0-0.2%', 'Delay: 1-3 seconds', 'Fills: 90-100%'] }
                ].map((section, idx) => (
                  <div key={idx} style={{
                    backgroundColor: '#F8EBD8',
                    padding: '8px 10px',
                    borderRadius: '12px',
                    border: '1px solid #CCC1B7'
                  }}>
                    <div style={{ fontWeight: '700', marginBottom: '4px', color: '#262A33', fontSize: '9px' }}>
                      {section.title}
                    </div>
                    <div style={{ fontSize: '7px', color: '#66605C', lineHeight: '1.4' }}>
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
            gridTemplateColumns: '1.6fr 1fr',
            gap: '10px',
            overflow: 'hidden'
          }}>
            {/* AI Models */}
            <div style={{
              backgroundColor: '#FFF',
              padding: '12px',
              borderRadius: '16px',
              border: '1px solid #CCC1B7',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h2 style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#262A33',
                marginBottom: '10px',
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Competing AI Models
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                flex: 1
              }}>
                {[
                  { name: 'GPT-5', provider: 'OpenAI', desc: 'Advanced reasoning, strong technical analysis, conservative risk management', color: '#10A37F' },
                  { name: 'Claude Sonnet 4.5', provider: 'Anthropic', desc: 'Balanced approach, detailed reasoning, portfolio optimization focus', color: '#CC785C' },
                  { name: 'Gemini Flash', provider: 'Google', desc: 'Fast decisions, trend following, high-frequency trading mindset', color: '#4285F4' },
                  { name: 'DeepSeek', provider: 'DeepSeek', desc: 'Value investing, fundamentals-focused, long-term hold strategy', color: '#5B4DFF' },
                  { name: 'Qwen', provider: 'Alibaba', desc: 'Momentum trading, pattern recognition, technical signal focused', color: '#FF6A00' },
                  { name: 'Grok', provider: 'xAI', desc: 'Contrarian plays, market sentiment analysis, bold moves', color: '#000000' }
                ].map((model, idx) => (
                  <div key={idx} style={{
                    backgroundColor: '#F8EBD8',
                    padding: '10px',
                    borderRadius: '12px',
                    border: `2px solid ${model.color}`,
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)'
                  }}>
                    <div style={{
                      fontWeight: '700',
                      fontSize: '10px',
                      color: model.color,
                      marginBottom: '3px',
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
                      color: '#66605C',
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
                      marginBottom: '8px'
                    }}>
                      {model.desc}
                    </div>
                    <div style={{
                      padding: '4px 6px',
                      backgroundColor: '#FFF',
                      border: `1px solid ${model.color}`,
                      borderRadius: '8px',
                      fontSize: '7px',
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
              padding: '12px',
              borderRadius: '16px',
              border: '1px solid #CCC1B7',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h3 style={{
                fontSize: '9px',
                fontWeight: '700',
                color: '#262A33',
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                textAlign: 'center'
              }}>
                PostgreSQL Database
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
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
                    padding: '6px 8px',
                    borderRadius: '10px',
                    border: `1px solid ${db.color}`,
                    borderLeft: `3px solid ${db.color}`
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '3px'
                    }}>
                      <div style={{
                        fontSize: '8px',
                        fontWeight: '700',
                        color: '#262A33'
                      }}>
                        {db.table}
                      </div>
                      <div style={{
                        fontSize: '6px',
                        color: db.color,
                        fontWeight: '700',
                        backgroundColor: '#FFF',
                        padding: '2px 5px',
                        borderRadius: '6px',
                        border: `1px solid ${db.color}`
                      }}>
                        {db.records}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '6px',
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
            gap: '10px'
          }}>
            {/* Performance Metrics */}
            <div style={{
              backgroundColor: '#FFF',
              padding: '12px',
              borderRadius: '16px',
              border: '1px solid #CCC1B7',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
            }}>
              <h3 style={{
                fontSize: '9px',
                fontWeight: '700',
                color: '#990F3D',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Performance Analytics
              </h3>
              <div style={{ fontSize: '7px', color: '#5a5a5a', lineHeight: '1.5' }}>
                <div style={{ marginBottom: '6px' }}>
                  <div style={{ fontWeight: '700', marginBottom: '3px', color: '#262A33', fontSize: '8px' }}>Core Metrics</div>
                  <div style={{ backgroundColor: '#F8EBD8', padding: '6px', borderRadius: '8px', marginBottom: '4px' }}>
                    <strong>Account Value:</strong> Cash + positions<br/>
                    <strong>ROI:</strong> (current - start) / start × 100%<br/>
                    <strong>P&L:</strong> Realized + unrealized
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: '700', marginBottom: '3px', color: '#262A33', fontSize: '8px' }}>Risk Metrics</div>
                  <div style={{ backgroundColor: '#F8EBD8', padding: '6px', borderRadius: '8px' }}>
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
              padding: '12px',
              borderRadius: '16px',
              border: '1px solid #CCC1B7',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
            }}>
              <h3 style={{
                fontSize: '9px',
                fontWeight: '700',
                color: '#990F3D',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Automated Trading
              </h3>
              <div style={{ fontSize: '7px', color: '#5a5a5a', lineHeight: '1.5' }}>
                <div style={{ marginBottom: '6px' }}>
                  <div style={{ fontWeight: '700', marginBottom: '3px', color: '#262A33', fontSize: '8px' }}>Scheduler</div>
                  <div style={{ backgroundColor: '#F8EBD8', padding: '6px', borderRadius: '8px', marginBottom: '4px' }}>
                    GitHub Actions → Vercel API<br/>
                    <code style={{ fontSize: '6px', fontFamily: 'monospace' }}>0,30 14-21 * * 1-5</code>
                  </div>
                </div>
                <div style={{ fontWeight: '700', marginBottom: '3px', color: '#262A33', fontSize: '8px' }}>16 Cycles/Day</div>
                <div style={{ fontSize: '7px', lineHeight: '1.4', marginBottom: '6px' }}>
                  9:00•9:30•10:00•10:30•11:00•11:30<br/>
                  12:00•12:30•1:00•1:30•2:00•2:30<br/>
                  3:00•3:30•4:00•4:30 PM EST
                </div>
                <div style={{
                  padding: '5px',
                  backgroundColor: '#F8EBD8',
                  borderRadius: '8px',
                  fontWeight: '700',
                  color: '#262A33',
                  fontSize: '7px',
                  textAlign: 'center'
                }}>
                  MON-FRI • MARKET HOURS
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            <div style={{
              backgroundColor: '#FFF',
              padding: '12px',
              borderRadius: '16px',
              border: '1px solid #CCC1B7',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
            }}>
              <h3 style={{
                fontSize: '9px',
                fontWeight: '700',
                color: '#990F3D',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Technology Stack
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {[
                  { layer: 'FRONTEND', tech: 'Next.js 15 • React 19 • TypeScript • Tailwind' },
                  { layer: 'BACKEND', tech: 'API Routes • Prisma • Trading Engine' },
                  { layer: 'DATABASE', tech: 'PostgreSQL • 7 Tables • Real-time' },
                  { layer: 'DATA', tech: 'Yahoo Finance • Alpha Vantage • News' },
                  { layer: 'AI', tech: 'OpenAI • Anthropic • Google • xAI • DeepSeek' },
                  { layer: 'HOSTING', tech: 'Vercel Edge • GitHub Actions • CRON' }
                ].map((stack, idx) => (
                  <div key={idx} style={{
                    padding: '5px 7px',
                    backgroundColor: '#F8EBD8',
                    borderRadius: '8px',
                    border: '1px solid #CCC1B7'
                  }}>
                    <div style={{
                      fontSize: '7px',
                      fontWeight: '700',
                      color: '#990F3D',
                      marginBottom: '2px',
                      letterSpacing: '0.5px'
                    }}>
                      {stack.layer}
                    </div>
                    <div style={{ fontSize: '7px', color: '#66605C', lineHeight: '1.3' }}>
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
