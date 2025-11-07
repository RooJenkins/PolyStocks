'use client';

import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FFF1E5',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#FFF',
          padding: '30px 40px',
          borderRadius: '0',
          borderBottom: '1px solid #990F3D',
          marginBottom: '0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#990F3D',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                marginBottom: '12px',
                fontFamily: 'system-ui, sans-serif'
              }}>
                System Architecture
              </div>
              <h1 style={{
                fontSize: '48px',
                fontWeight: '400',
                color: '#33302E',
                margin: 0,
                letterSpacing: '-0.5px',
                fontFamily: 'Georgia, "Times New Roman", serif',
                lineHeight: '1.1'
              }}>
                How PolyStocks Works
              </h1>
              <p style={{
                fontSize: '18px',
                color: '#66605C',
                margin: '16px 0 0 0',
                lineHeight: '1.5',
                fontFamily: 'Georgia, serif',
                fontWeight: '300'
              }}>
                Six competing AI models trade stocks every 30 minutes using real-time market data and technical analysis
              </p>
            </div>
            <Link
              href="/"
              style={{
                padding: '10px 20px',
                backgroundColor: '#990F3D',
                color: '#FFF',
                textDecoration: 'none',
                borderRadius: '0',
                fontSize: '13px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                fontFamily: 'system-ui, sans-serif'
              }}
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Main Infographic Container */}
        <div style={{
          backgroundColor: '#FFF',
          padding: '40px',
          borderRadius: '0',
          boxShadow: 'none',
          borderBottom: '1px solid #E5DDD3'
        }}>
          {/* System Overview Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr 1fr',
            gap: '30px',
            marginBottom: '40px'
          }}>
            {/* Left: Data Sources */}
            <div>
              <div style={{
                backgroundColor: '#FFF9F5',
                padding: '20px',
                borderRadius: '0',
                border: '1px solid #E5DDD3',
                height: '100%'
              }}>
                <h3 style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#990F3D',
                  marginBottom: '16px',
                  textTransform: 'uppercase',
                  letterSpacing: '1.2px',
                  fontFamily: 'system-ui, sans-serif'
                }}>
                  Data Sources
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{
                    padding: '14px',
                    backgroundColor: '#FFF',
                    borderRadius: '0',
                    borderLeft: '3px solid #990F3D'
                  }}>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#33302E', marginBottom: '6px', fontFamily: 'Georgia, serif' }}>
                      Yahoo Finance
                    </div>
                    <div style={{ fontSize: '12px', color: '#66605C', lineHeight: '1.6', marginBottom: '8px' }}>
                      Real-time prices, historical data, company info, trending stocks, news
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: '#990F3D',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Unlimited calls
                    </div>
                  </div>
                  <div style={{
                    padding: '14px',
                    backgroundColor: '#FFF',
                    borderRadius: '0',
                    borderLeft: '3px solid #990F3D'
                  }}>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#33302E', marginBottom: '6px', fontFamily: 'Georgia, serif' }}>
                      Alpha Vantage
                    </div>
                    <div style={{ fontSize: '12px', color: '#66605C', lineHeight: '1.6', marginBottom: '8px' }}>
                      Technical indicators: RSI, MACD, SMA, EMA, news sentiment
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: '#CC6B00',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Limited: 25 calls/day
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Center: Trading Cycle Flow */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                backgroundColor: '#990F3D',
                color: '#FFF',
                padding: '16px',
                borderRadius: '0',
                textAlign: 'center',
                fontWeight: '600',
                fontSize: '13px',
                letterSpacing: '1.2px',
                fontFamily: 'system-ui, sans-serif'
              }}>
                TRADING CYCLE (Every 30 Minutes)
              </div>

              {/* Step 1: Fetch Data */}
              <div style={{
                backgroundColor: '#FFF9F5',
                padding: '16px 20px',
                borderRadius: '0',
                border: '1px solid #E5DDD3',
                borderLeft: '4px solid #990F3D'
              }}>
                <div style={{ fontWeight: '600', fontSize: '13px', color: '#990F3D', marginBottom: '6px', fontFamily: 'system-ui, sans-serif', letterSpacing: '0.5px' }}>
                  1. FETCH MARKET DATA
                </div>
                <div style={{ fontSize: '13px', color: '#66605C', lineHeight: '1.6', fontFamily: 'Georgia, serif' }}>
                  Collect real-time prices, technical indicators, and news for top 20 stocks
                </div>
              </div>

              <div style={{ textAlign: 'center', fontSize: '18px', color: '#990F3D', fontWeight: '400' }}>↓</div>

              {/* Step 2: AI Analysis */}
              <div style={{
                backgroundColor: '#FFF9F5',
                padding: '16px 20px',
                borderRadius: '0',
                border: '1px solid #E5DDD3',
                borderLeft: '4px solid #990F3D'
              }}>
                <div style={{ fontWeight: '600', fontSize: '13px', color: '#990F3D', marginBottom: '6px', fontFamily: 'system-ui, sans-serif', letterSpacing: '0.5px' }}>
                  2. PARALLEL AI ANALYSIS
                </div>
                <div style={{ fontSize: '13px', color: '#66605C', lineHeight: '1.6', fontFamily: 'Georgia, serif' }}>
                  Each of 6 AI models analyzes data independently using up to 15 tool calls
                </div>
              </div>

              <div style={{ textAlign: 'center', fontSize: '18px', color: '#990F3D', fontWeight: '400' }}>↓</div>

              {/* Step 3: Decision */}
              <div style={{
                backgroundColor: '#FFF9F5',
                padding: '16px 20px',
                borderRadius: '0',
                border: '1px solid #E5DDD3',
                borderLeft: '4px solid #990F3D'
              }}>
                <div style={{ fontWeight: '600', fontSize: '13px', color: '#990F3D', marginBottom: '6px', fontFamily: 'system-ui, sans-serif', letterSpacing: '0.5px' }}>
                  3. GENERATE DECISION
                </div>
                <div style={{ fontSize: '13px', color: '#66605C', lineHeight: '1.6', fontFamily: 'Georgia, serif' }}>
                  AI outputs: BUY/SELL/HOLD + stock symbol + quantity + 200+ char reasoning
                </div>
              </div>

              <div style={{ textAlign: 'center', fontSize: '18px', color: '#990F3D', fontWeight: '400' }}>↓</div>

              {/* Step 4: Execute */}
              <div style={{
                backgroundColor: '#FFF9F5',
                padding: '16px 20px',
                borderRadius: '0',
                border: '1px solid #E5DDD3',
                borderLeft: '4px solid #990F3D'
              }}>
                <div style={{ fontWeight: '600', fontSize: '13px', color: '#990F3D', marginBottom: '6px', fontFamily: 'system-ui, sans-serif', letterSpacing: '0.5px' }}>
                  4. EXECUTE TRADE
                </div>
                <div style={{ fontSize: '13px', color: '#66605C', lineHeight: '1.6', fontFamily: 'Georgia, serif' }}>
                  Simulate realistic execution: slippage (0-0.2%), delay (1-3s), partial fills
                </div>
              </div>

              <div style={{ textAlign: 'center', fontSize: '18px', color: '#990F3D', fontWeight: '400' }}>↓</div>

              {/* Step 5: Update */}
              <div style={{
                backgroundColor: '#FFF9F5',
                padding: '16px 20px',
                borderRadius: '0',
                border: '1px solid #E5DDD3',
                borderLeft: '4px solid #990F3D'
              }}>
                <div style={{ fontWeight: '600', fontSize: '13px', color: '#990F3D', marginBottom: '6px', fontFamily: 'system-ui, sans-serif', letterSpacing: '0.5px' }}>
                  5. UPDATE & RECORD
                </div>
                <div style={{ fontSize: '13px', color: '#66605C', lineHeight: '1.6', fontFamily: 'Georgia, serif' }}>
                  Update positions, calculate P&L, track metrics (Sharpe, drawdown, ROI)
                </div>
              </div>
            </div>

            {/* Right: Risk Management */}
            <div>
              <div style={{
                backgroundColor: '#FFF9F5',
                padding: '20px',
                borderRadius: '0',
                border: '1px solid #E5DDD3',
                height: '100%'
              }}>
                <h3 style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#990F3D',
                  marginBottom: '16px',
                  textTransform: 'uppercase',
                  letterSpacing: '1.2px',
                  fontFamily: 'system-ui, sans-serif'
                }}>
                  Constraints
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px', color: '#66605C' }}>
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#FFF',
                    borderRadius: '0',
                    borderLeft: '3px solid #990F3D'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '8px', color: '#33302E', fontFamily: 'Georgia, serif', fontSize: '13px' }}>Position Sizing</div>
                    <div style={{ lineHeight: '1.7', fontFamily: 'Georgia, serif' }}>
                      • Starting capital: $10,000<br/>
                      • Max per trade: $500<br/>
                      • Max 20 open positions
                    </div>
                  </div>
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#FFF',
                    borderRadius: '0',
                    borderLeft: '3px solid #990F3D'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '8px', color: '#33302E', fontFamily: 'Georgia, serif', fontSize: '13px' }}>Trading Rules</div>
                    <div style={{ lineHeight: '1.7', fontFamily: 'Georgia, serif' }}>
                      • Long positions only<br/>
                      • No leverage/margin<br/>
                      • Cash required before buy
                    </div>
                  </div>
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#FFF',
                    borderRadius: '0',
                    borderLeft: '3px solid #990F3D'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '8px', color: '#33302E', fontFamily: 'Georgia, serif', fontSize: '13px' }}>Execution</div>
                    <div style={{ lineHeight: '1.7', fontFamily: 'Georgia, serif' }}>
                      • Realistic slippage<br/>
                      • 1-3 second delays<br/>
                      • Partial fills (90-100%)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Models Section */}
          <div style={{
            backgroundColor: '#FFF9F5',
            padding: '30px',
            borderRadius: '0',
            marginBottom: '30px',
            border: '1px solid #E5DDD3'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '400',
              color: '#33302E',
              marginBottom: '24px',
              textAlign: 'center',
              fontFamily: 'Georgia, serif',
              letterSpacing: '-0.3px'
            }}>
              Competing AI Models
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '16px'
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
                  padding: '18px 14px',
                  backgroundColor: '#FFF',
                  borderRadius: '0',
                  border: '1px solid #E5DDD3',
                  borderTop: '3px solid #990F3D',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontWeight: '600',
                    fontSize: '14px',
                    color: '#33302E',
                    marginBottom: '8px',
                    lineHeight: '1.3',
                    minHeight: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Georgia, serif'
                  }}>
                    {model.name}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#66605C',
                    fontWeight: '500',
                    marginBottom: '10px',
                    fontFamily: 'system-ui, sans-serif'
                  }}>
                    {model.provider}
                  </div>
                  <div style={{
                    marginTop: '10px',
                    padding: '5px 10px',
                    backgroundColor: '#FFF9F5',
                    borderRadius: '0',
                    border: '1px solid #E5DDD3',
                    fontSize: '10px',
                    color: '#990F3D',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontFamily: 'system-ui, sans-serif'
                  }}>
                    15 Tool Budget
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: '20px',
              padding: '16px',
              backgroundColor: '#FFF',
              borderRadius: '0',
              border: '1px solid #E5DDD3',
              fontSize: '13px',
              color: '#66605C',
              textAlign: 'center',
              lineHeight: '1.6',
              fontFamily: 'Georgia, serif'
            }}>
              Each AI uses function calling to access market data tools • Generates 200+ character reasoning for transparency
            </div>
          </div>

          {/* Bottom Grid: Tools + Schedule + Architecture */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '20px'
          }}>
            {/* Tool Access */}
            <div style={{
              backgroundColor: '#FFF9F5',
              padding: '20px',
              borderRadius: '0',
              border: '1px solid #E5DDD3'
            }}>
              <h3 style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#990F3D',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '1.2px',
                fontFamily: 'system-ui, sans-serif'
              }}>
                Available Tools
              </h3>
              <div style={{ fontSize: '12px', color: '#66605C', lineHeight: '1.7', fontFamily: 'Georgia, serif' }}>
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontWeight: '600', marginBottom: '6px', color: '#33302E' }}>Yahoo Finance (∞)</div>
                  <code style={{ backgroundColor: '#FFF', padding: '3px 7px', border: '1px solid #E5DDD3', fontSize: '10px', display: 'inline-block', marginBottom: '3px', marginRight: '4px', fontFamily: 'monospace' }}>yf_get_quote</code>
                  <code style={{ backgroundColor: '#FFF', padding: '3px 7px', border: '1px solid #E5DDD3', fontSize: '10px', display: 'inline-block', marginBottom: '3px', marginRight: '4px', fontFamily: 'monospace' }}>yf_get_historical</code>
                  <code style={{ backgroundColor: '#FFF', padding: '3px 7px', border: '1px solid #E5DDD3', fontSize: '10px', display: 'inline-block', marginBottom: '3px', marginRight: '4px', fontFamily: 'monospace' }}>yf_get_trending</code>
                  <code style={{ backgroundColor: '#FFF', padding: '3px 7px', border: '1px solid #E5DDD3', fontSize: '10px', display: 'inline-block', marginBottom: '3px', marginRight: '4px', fontFamily: 'monospace' }}>yf_get_company_info</code>
                  <code style={{ backgroundColor: '#FFF', padding: '3px 7px', border: '1px solid #E5DDD3', fontSize: '10px', display: 'inline-block', marginBottom: '3px', fontFamily: 'monospace' }}>yf_get_news</code>
                </div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '6px', color: '#33302E' }}>Alpha Vantage (25/day)</div>
                  <code style={{ backgroundColor: '#FFF', padding: '3px 7px', border: '1px solid #E5DDD3', fontSize: '10px', display: 'inline-block', marginBottom: '3px', marginRight: '4px', fontFamily: 'monospace' }}>get_rsi</code>
                  <code style={{ backgroundColor: '#FFF', padding: '3px 7px', border: '1px solid #E5DDD3', fontSize: '10px', display: 'inline-block', marginBottom: '3px', marginRight: '4px', fontFamily: 'monospace' }}>get_macd</code>
                  <code style={{ backgroundColor: '#FFF', padding: '3px 7px', border: '1px solid #E5DDD3', fontSize: '10px', display: 'inline-block', marginBottom: '3px', marginRight: '4px', fontFamily: 'monospace' }}>get_sma</code>
                  <code style={{ backgroundColor: '#FFF', padding: '3px 7px', border: '1px solid #E5DDD3', fontSize: '10px', display: 'inline-block', marginBottom: '3px', marginRight: '4px', fontFamily: 'monospace' }}>get_ema</code>
                  <code style={{ backgroundColor: '#FFF', padding: '3px 7px', border: '1px solid #E5DDD3', fontSize: '10px', display: 'inline-block', marginBottom: '3px', fontFamily: 'monospace' }}>get_news_sentiment</code>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div style={{
              backgroundColor: '#FFF9F5',
              padding: '20px',
              borderRadius: '0',
              border: '1px solid #E5DDD3'
            }}>
              <h3 style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#990F3D',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '1.2px',
                fontFamily: 'system-ui, sans-serif'
              }}>
                Trading Schedule
              </h3>
              <div style={{ fontSize: '12px', color: '#66605C', lineHeight: '1.8', fontFamily: 'Georgia, serif' }}>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontWeight: '600', marginBottom: '8px', color: '#33302E' }}>Automation</div>
                  <div style={{ backgroundColor: '#FFF', padding: '10px', border: '1px solid #E5DDD3', marginBottom: '10px' }}>
                    GitHub Actions → Vercel API<br/>
                    <code style={{ fontSize: '10px', backgroundColor: '#FFF9F5', padding: '3px 7px', border: '1px solid #E5DDD3', marginTop: '4px', display: 'inline-block', fontFamily: 'monospace' }}>0,30 14-21 * * 1-5</code>
                  </div>
                  <div style={{ fontWeight: '600', marginBottom: '6px', color: '#33302E' }}>16 Cycles/Day</div>
                  9:00 AM • 9:30 AM<br/>
                  10:00 AM • 10:30 AM<br/>
                  11:00 AM • 11:30 AM<br/>
                  12:00 PM • 12:30 PM<br/>
                  1:00 PM • 1:30 PM<br/>
                  2:00 PM • 2:30 PM<br/>
                  3:00 PM • 3:30 PM<br/>
                  4:00 PM • 4:30 PM
                </div>
                <div style={{
                  padding: '10px',
                  backgroundColor: '#FFF',
                  border: '1px solid #E5DDD3',
                  fontWeight: '600',
                  color: '#33302E'
                }}>
                  Monday-Friday • Market Hours Only
                </div>
              </div>
            </div>

            {/* Architecture */}
            <div style={{
              backgroundColor: '#FFF9F5',
              padding: '20px',
              borderRadius: '0',
              border: '1px solid #E5DDD3'
            }}>
              <h3 style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#990F3D',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '1.2px',
                fontFamily: 'system-ui, sans-serif'
              }}>
                System Stack
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { layer: 'DATA', items: ['Yahoo Finance', 'Alpha Vantage', 'News APIs'] },
                  { layer: 'BACKEND', items: ['Next.js API', 'Trading Engine', 'AI Integration'] },
                  { layer: 'DATABASE', items: ['PostgreSQL', 'Prisma ORM', '5 Tables'] },
                  { layer: 'FRONTEND', items: ['React', 'Recharts', 'Real-time UI'] }
                ].map((section, idx) => (
                  <div key={idx} style={{
                    padding: '12px',
                    backgroundColor: '#FFF',
                    borderRadius: '0',
                    border: '1px solid #E5DDD3',
                    borderLeft: '3px solid #990F3D'
                  }}>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#990F3D',
                      marginBottom: '6px',
                      letterSpacing: '0.8px',
                      fontFamily: 'system-ui, sans-serif'
                    }}>
                      {section.layer}
                    </div>
                    <div style={{ fontSize: '11px', color: '#66605C', fontFamily: 'Georgia, serif' }}>
                      {section.items.join(' • ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Decision Process Footer */}
          <div style={{
            marginTop: '30px',
            display: 'grid',
            gridTemplateColumns: '1fr 2fr 1fr',
            gap: '20px',
            backgroundColor: '#FFF9F5',
            padding: '24px',
            borderRadius: '0',
            border: '1px solid #E5DDD3',
            borderTop: '3px solid #990F3D'
          }}>
            <div>
              <div style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#990F3D',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontFamily: 'system-ui, sans-serif'
              }}>
                Input Context
              </div>
              <div style={{ fontSize: '12px', color: '#66605C', lineHeight: '1.8', fontFamily: 'Georgia, serif' }}>
                • Current portfolio<br/>
                • Cash balance<br/>
                • Open positions<br/>
                • Stock prices<br/>
                • Technical indicators<br/>
                • News sentiment<br/>
                • Historical performance
              </div>
            </div>
            <div>
              <div style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#990F3D',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                textAlign: 'center',
                fontFamily: 'system-ui, sans-serif'
              }}>
                AI Decision Process
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '11px',
                color: '#66605C',
                fontFamily: 'Georgia, serif'
              }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{
                    padding: '10px',
                    backgroundColor: '#FFF',
                    borderRadius: '0',
                    marginBottom: '6px',
                    fontWeight: '600',
                    border: '1px solid #E5DDD3',
                    color: '#33302E'
                  }}>
                    Call Tools
                  </div>
                  Gather data
                </div>
                <div style={{ padding: '0 8px', color: '#990F3D', fontWeight: '400', fontSize: '16px' }}>→</div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{
                    padding: '10px',
                    backgroundColor: '#FFF',
                    borderRadius: '0',
                    marginBottom: '6px',
                    fontWeight: '600',
                    border: '1px solid #E5DDD3',
                    color: '#33302E'
                  }}>
                    Analyze
                  </div>
                  Technical signals
                </div>
                <div style={{ padding: '0 8px', color: '#990F3D', fontWeight: '400', fontSize: '16px' }}>→</div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{
                    padding: '10px',
                    backgroundColor: '#FFF',
                    borderRadius: '0',
                    marginBottom: '6px',
                    fontWeight: '600',
                    border: '1px solid #E5DDD3',
                    color: '#33302E'
                  }}>
                    Evaluate
                  </div>
                  Risk/reward
                </div>
                <div style={{ padding: '0 8px', color: '#990F3D', fontWeight: '400', fontSize: '16px' }}>→</div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{
                    padding: '10px',
                    backgroundColor: '#FFF',
                    borderRadius: '0',
                    marginBottom: '6px',
                    fontWeight: '600',
                    border: '1px solid #E5DDD3',
                    color: '#33302E'
                  }}>
                    Decide
                  </div>
                  BUY/SELL/HOLD
                </div>
              </div>
            </div>
            <div>
              <div style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#990F3D',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontFamily: 'system-ui, sans-serif'
              }}>
                Output Decision
              </div>
              <div style={{ fontSize: '12px', color: '#66605C', lineHeight: '1.8', fontFamily: 'Georgia, serif' }}>
                • Action (BUY/SELL/HOLD)<br/>
                • Stock symbol<br/>
                • Quantity<br/>
                • Confidence score<br/>
                • Detailed reasoning (200+ chars)<br/>
                • Risk assessment
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div style={{
          textAlign: 'center',
          marginTop: '30px',
          padding: '40px',
          backgroundColor: '#33302E',
          borderRadius: '0',
          color: '#FFF1E5'
        }}>
          <h3 style={{ fontSize: '28px', fontWeight: '400', marginBottom: '16px', color: '#FFF1E5', fontFamily: 'Georgia, serif', letterSpacing: '-0.3px' }}>
            Watch AI Models Compete in Real-Time
          </h3>
          <p style={{ fontSize: '16px', marginBottom: '24px', opacity: 0.9, fontFamily: 'Georgia, serif', color: '#E5DDD3' }}>
            Analyze performance metrics, review trading decisions, and compare strategies
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              padding: '12px 28px',
              backgroundColor: '#990F3D',
              color: '#FFF',
              textDecoration: 'none',
              borderRadius: '0',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s',
              fontFamily: 'system-ui, sans-serif',
              letterSpacing: '0.5px'
            }}
          >
            Go to Dashboard →
          </Link>
        </div>
      </div>
    </div>
  );
}
