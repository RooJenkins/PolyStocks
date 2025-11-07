'use client';

import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <div style={{
      height: '100vh',
      backgroundColor: '#FFF1E5',
      padding: '8px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: '1800px', margin: '0 auto', height: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#FFF',
          padding: '12px 20px',
          borderBottom: '1px solid #990F3D'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{
                fontSize: '8px',
                fontWeight: '600',
                color: '#990F3D',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '2px'
              }}>
                System Architecture
              </div>
              <h1 style={{
                fontSize: '22px',
                fontWeight: '400',
                color: '#33302E',
                margin: 0,
                letterSpacing: '-0.3px',
                fontFamily: 'Georgia, serif',
                lineHeight: '1'
              }}>
                How PolyStocks Works
              </h1>
              <p style={{
                fontSize: '10px',
                color: '#66605C',
                margin: '3px 0 0 0',
                lineHeight: '1.2',
                fontFamily: 'Georgia, serif'
              }}>
                Six competing AI models trade stocks every 30 minutes using real-time market data
              </p>
            </div>
            <Link
              href="/"
              style={{
                padding: '6px 14px',
                backgroundColor: '#990F3D',
                color: '#FFF',
                textDecoration: 'none',
                fontSize: '10px',
                fontWeight: '600',
                whiteSpace: 'nowrap'
              }}
            >
              ← Dashboard
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          backgroundColor: '#FFF',
          padding: '12px',
          flex: 1,
          display: 'grid',
          gridTemplateRows: 'auto 1fr auto',
          gap: '10px',
          overflow: 'hidden'
        }}>
          {/* Top Row: Data Sources + Trading Cycle + Constraints */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '180px 1fr 180px',
            gap: '10px'
          }}>
            {/* Data Sources */}
            <div style={{
              backgroundColor: '#FFF9F5',
              padding: '8px',
              border: '1px solid #E5DDD3'
            }}>
              <h3 style={{
                fontSize: '8px',
                fontWeight: '600',
                color: '#990F3D',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Data Sources
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{
                  padding: '6px',
                  backgroundColor: '#FFF',
                  borderLeft: '2px solid #990F3D'
                }}>
                  <div style={{ fontWeight: '600', fontSize: '9px', color: '#33302E', marginBottom: '2px', fontFamily: 'Georgia, serif' }}>
                    Yahoo Finance
                  </div>
                  <div style={{ fontSize: '8px', color: '#66605C', lineHeight: '1.2', marginBottom: '3px' }}>
                    Real-time prices, historical data
                  </div>
                  <div style={{
                    fontSize: '7px',
                    color: '#990F3D',
                    fontWeight: '600'
                  }}>
                    UNLIMITED
                  </div>
                </div>
                <div style={{
                  padding: '6px',
                  backgroundColor: '#FFF',
                  borderLeft: '2px solid #990F3D'
                }}>
                  <div style={{ fontWeight: '600', fontSize: '9px', color: '#33302E', marginBottom: '2px', fontFamily: 'Georgia, serif' }}>
                    Alpha Vantage
                  </div>
                  <div style={{ fontSize: '8px', color: '#66605C', lineHeight: '1.2', marginBottom: '3px' }}>
                    RSI, MACD, SMA, EMA
                  </div>
                  <div style={{
                    fontSize: '7px',
                    color: '#CC6B00',
                    fontWeight: '600'
                  }}>
                    25 CALLS/DAY
                  </div>
                </div>
              </div>
            </div>

            {/* Trading Cycle */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div style={{
                backgroundColor: '#990F3D',
                color: '#FFF',
                padding: '5px',
                textAlign: 'center',
                fontWeight: '600',
                fontSize: '8px',
                letterSpacing: '0.5px'
              }}>
                TRADING CYCLE (Every 30 Minutes)
              </div>
              <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                {[
                  { num: '1', title: 'FETCH', desc: 'Market data' },
                  { num: '2', title: 'ANALYZE', desc: 'AI models' },
                  { num: '3', title: 'DECIDE', desc: 'Buy/Sell/Hold' },
                  { num: '4', title: 'EXECUTE', desc: 'Trade' },
                  { num: '5', title: 'UPDATE', desc: 'Record P&L' }
                ].map((step, idx) => (
                  <>
                    <div key={idx} style={{
                      backgroundColor: '#FFF9F5',
                      padding: '5px 8px',
                      border: '1px solid #E5DDD3',
                      borderLeft: '2px solid #990F3D',
                      flex: 1
                    }}>
                      <div style={{ fontWeight: '600', fontSize: '8px', color: '#990F3D', marginBottom: '2px' }}>
                        {step.num}. {step.title}
                      </div>
                      <div style={{ fontSize: '7px', color: '#66605C', lineHeight: '1.2' }}>
                        {step.desc}
                      </div>
                    </div>
                    {idx < 4 && <div style={{ fontSize: '10px', color: '#990F3D' }}>→</div>}
                  </>
                ))}
              </div>
            </div>

            {/* Constraints */}
            <div style={{
              backgroundColor: '#FFF9F5',
              padding: '8px',
              border: '1px solid #E5DDD3'
            }}>
              <h3 style={{
                fontSize: '8px',
                fontWeight: '600',
                color: '#990F3D',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Constraints
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '8px', color: '#66605C' }}>
                <div style={{
                  padding: '6px',
                  backgroundColor: '#FFF',
                  borderLeft: '2px solid #990F3D'
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '3px', color: '#33302E', fontFamily: 'Georgia, serif', fontSize: '9px' }}>Position Sizing</div>
                  <div style={{ lineHeight: '1.3', fontSize: '8px' }}>
                    • Capital: $10,000<br/>
                    • Max trade: $500<br/>
                    • Max positions: 20
                  </div>
                </div>
                <div style={{
                  padding: '6px',
                  backgroundColor: '#FFF',
                  borderLeft: '2px solid #990F3D'
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '3px', color: '#33302E', fontFamily: 'Georgia, serif', fontSize: '9px' }}>Trading Rules</div>
                  <div style={{ lineHeight: '1.3', fontSize: '8px' }}>
                    • Long only<br/>
                    • No leverage<br/>
                    • Cash required
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle: AI Models */}
          <div style={{
            backgroundColor: '#FFF9F5',
            padding: '10px',
            border: '1px solid #E5DDD3',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h2 style={{
              fontSize: '11px',
              fontWeight: '400',
              color: '#33302E',
              marginBottom: '8px',
              textAlign: 'center',
              fontFamily: 'Georgia, serif'
            }}>
              Competing AI Models
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '8px'
            }}>
              {[
                { name: 'GPT-5', provider: 'OpenAI' },
                { name: 'Claude Sonnet 4.5', provider: 'Anthropic' },
                { name: 'Gemini Flash', provider: 'Google' },
                { name: 'DeepSeek', provider: 'DeepSeek' },
                { name: 'Qwen', provider: 'Alibaba' },
                { name: 'Grok', provider: 'xAI' }
              ].map((model, idx) => (
                <div key={idx} style={{
                  padding: '8px 6px',
                  backgroundColor: '#FFF',
                  border: '1px solid #E5DDD3',
                  borderTop: '2px solid #990F3D',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontWeight: '600',
                    fontSize: '9px',
                    color: '#33302E',
                    marginBottom: '3px',
                    lineHeight: '1.2',
                    minHeight: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Georgia, serif'
                  }}>
                    {model.name}
                  </div>
                  <div style={{
                    fontSize: '7px',
                    color: '#66605C',
                    fontWeight: '500',
                    marginBottom: '4px'
                  }}>
                    {model.provider}
                  </div>
                  <div style={{
                    padding: '3px 5px',
                    backgroundColor: '#FFF9F5',
                    border: '1px solid #E5DDD3',
                    fontSize: '7px',
                    color: '#990F3D',
                    fontWeight: '600'
                  }}>
                    15 TOOLS
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom: Tools + Schedule + Stack */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '10px'
          }}>
            {/* Tools */}
            <div style={{
              backgroundColor: '#FFF9F5',
              padding: '8px',
              border: '1px solid #E5DDD3'
            }}>
              <h3 style={{
                fontSize: '8px',
                fontWeight: '600',
                color: '#990F3D',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Available Tools
              </h3>
              <div style={{ fontSize: '8px', color: '#66605C', lineHeight: '1.3' }}>
                <div style={{ marginBottom: '6px' }}>
                  <div style={{ fontWeight: '600', marginBottom: '3px', color: '#33302E' }}>Yahoo (∞)</div>
                  <code style={{ backgroundColor: '#FFF', padding: '2px 4px', border: '1px solid #E5DDD3', fontSize: '7px', display: 'inline-block', marginRight: '2px', fontFamily: 'monospace' }}>quote</code>
                  <code style={{ backgroundColor: '#FFF', padding: '2px 4px', border: '1px solid #E5DDD3', fontSize: '7px', display: 'inline-block', marginRight: '2px', fontFamily: 'monospace' }}>historical</code>
                  <code style={{ backgroundColor: '#FFF', padding: '2px 4px', border: '1px solid #E5DDD3', fontSize: '7px', display: 'inline-block', fontFamily: 'monospace' }}>news</code>
                </div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '3px', color: '#33302E' }}>Alpha (25/day)</div>
                  <code style={{ backgroundColor: '#FFF', padding: '2px 4px', border: '1px solid #E5DDD3', fontSize: '7px', display: 'inline-block', marginRight: '2px', fontFamily: 'monospace' }}>rsi</code>
                  <code style={{ backgroundColor: '#FFF', padding: '2px 4px', border: '1px solid #E5DDD3', fontSize: '7px', display: 'inline-block', marginRight: '2px', fontFamily: 'monospace' }}>macd</code>
                  <code style={{ backgroundColor: '#FFF', padding: '2px 4px', border: '1px solid #E5DDD3', fontSize: '7px', display: 'inline-block', fontFamily: 'monospace' }}>ema</code>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div style={{
              backgroundColor: '#FFF9F5',
              padding: '8px',
              border: '1px solid #E5DDD3'
            }}>
              <h3 style={{
                fontSize: '8px',
                fontWeight: '600',
                color: '#990F3D',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Trading Schedule
              </h3>
              <div style={{ fontSize: '8px', color: '#66605C', lineHeight: '1.4' }}>
                <div style={{ marginBottom: '4px' }}>
                  <div style={{ fontWeight: '600', marginBottom: '2px', color: '#33302E' }}>Automation</div>
                  <div style={{ backgroundColor: '#FFF', padding: '4px', border: '1px solid #E5DDD3', fontSize: '7px' }}>
                    GitHub Actions → Vercel
                  </div>
                </div>
                <div style={{ fontWeight: '600', marginBottom: '2px', color: '#33302E' }}>16 Cycles/Day</div>
                <div style={{ fontSize: '7px', lineHeight: '1.3' }}>
                  9:00-9:30-10:00-10:30-11:00-11:30<br/>
                  12:00-12:30-1:00-1:30-2:00-2:30<br/>
                  3:00-3:30-4:00-4:30
                </div>
                <div style={{
                  padding: '4px',
                  backgroundColor: '#FFF',
                  border: '1px solid #E5DDD3',
                  fontWeight: '600',
                  color: '#33302E',
                  marginTop: '4px',
                  fontSize: '7px'
                }}>
                  Mon-Fri • Market Hours Only
                </div>
              </div>
            </div>

            {/* System Stack */}
            <div style={{
              backgroundColor: '#FFF9F5',
              padding: '8px',
              border: '1px solid #E5DDD3'
            }}>
              <h3 style={{
                fontSize: '8px',
                fontWeight: '600',
                color: '#990F3D',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                System Stack
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {[
                  { layer: 'DATA', items: 'Yahoo • Alpha Vantage' },
                  { layer: 'BACKEND', items: 'Next.js • Trading Engine' },
                  { layer: 'DATABASE', items: 'PostgreSQL • Prisma' },
                  { layer: 'FRONTEND', items: 'React • Recharts' }
                ].map((section, idx) => (
                  <div key={idx} style={{
                    padding: '5px',
                    backgroundColor: '#FFF',
                    border: '1px solid #E5DDD3',
                    borderLeft: '2px solid #990F3D'
                  }}>
                    <div style={{
                      fontSize: '7px',
                      fontWeight: '600',
                      color: '#990F3D',
                      marginBottom: '2px',
                      letterSpacing: '0.5px'
                    }}>
                      {section.layer}
                    </div>
                    <div style={{ fontSize: '7px', color: '#66605C' }}>
                      {section.items}
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
