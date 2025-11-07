'use client';

import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F5E6D3',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#FFF',
          padding: '30px 40px',
          borderRadius: '20px 20px 0 0',
          borderBottom: '3px solid #990F3D',
          marginBottom: '0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#990F3D',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                marginBottom: '8px'
              }}>
                System Architecture
              </div>
              <h1 style={{
                fontSize: '42px',
                fontWeight: '700',
                color: '#262A33',
                margin: 0,
                letterSpacing: '-1px'
              }}>
                How PolyStocks Works
              </h1>
              <p style={{
                fontSize: '16px',
                color: '#66605C',
                margin: '8px 0 0 0'
              }}>
                Six competing AI models trade stocks every 30 minutes using real-time market data and technical analysis
              </p>
            </div>
            <Link
              href="/"
              style={{
                padding: '12px 24px',
                backgroundColor: '#262A33',
                color: '#F5E6D3',
                textDecoration: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
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
          borderRadius: '0 0 20px 20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
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
                backgroundColor: '#E8F5E9',
                padding: '20px',
                borderRadius: '12px',
                border: '2px solid #4CAF50',
                height: '100%'
              }}>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#1B5E20',
                  marginBottom: '16px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Data Sources
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#FFF',
                    borderRadius: '8px',
                    border: '1px solid #4CAF50'
                  }}>
                    <div style={{ fontWeight: '700', fontSize: '13px', color: '#1B5E20', marginBottom: '4px' }}>
                      Yahoo Finance
                    </div>
                    <div style={{ fontSize: '11px', color: '#2E7D32', lineHeight: '1.5' }}>
                      Real-time prices, historical data, company info, trending stocks, news
                    </div>
                    <div style={{
                      fontSize: '9px',
                      color: '#4CAF50',
                      marginTop: '6px',
                      fontWeight: '700'
                    }}>
                      UNLIMITED CALLS
                    </div>
                  </div>
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#FFF',
                    borderRadius: '8px',
                    border: '1px solid #4CAF50'
                  }}>
                    <div style={{ fontWeight: '700', fontSize: '13px', color: '#1B5E20', marginBottom: '4px' }}>
                      Alpha Vantage
                    </div>
                    <div style={{ fontSize: '11px', color: '#2E7D32', lineHeight: '1.5' }}>
                      Technical indicators: RSI, MACD, SMA, EMA, news sentiment
                    </div>
                    <div style={{
                      fontSize: '9px',
                      color: '#FF9800',
                      marginTop: '6px',
                      fontWeight: '700'
                    }}>
                      LIMITED: 25 CALLS/DAY
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
                borderRadius: '12px',
                textAlign: 'center',
                fontWeight: '700',
                fontSize: '14px',
                letterSpacing: '1px'
              }}>
                TRADING CYCLE (Every 30 Minutes)
              </div>

              {/* Step 1: Fetch Data */}
              <div style={{
                backgroundColor: '#E8F5E9',
                padding: '14px 18px',
                borderRadius: '10px',
                border: '2px solid #4CAF50',
                borderLeft: '6px solid #4CAF50'
              }}>
                <div style={{ fontWeight: '700', fontSize: '12px', color: '#1B5E20', marginBottom: '4px' }}>
                  1. FETCH MARKET DATA
                </div>
                <div style={{ fontSize: '11px', color: '#2E7D32' }}>
                  Collect real-time prices, technical indicators, and news for top 20 stocks
                </div>
              </div>

              <div style={{ textAlign: 'center', fontSize: '20px', color: '#990F3D', fontWeight: '700' }}>↓</div>

              {/* Step 2: AI Analysis */}
              <div style={{
                backgroundColor: '#E3F2FD',
                padding: '14px 18px',
                borderRadius: '10px',
                border: '2px solid #2196F3',
                borderLeft: '6px solid #2196F3'
              }}>
                <div style={{ fontWeight: '700', fontSize: '12px', color: '#0D47A1', marginBottom: '4px' }}>
                  2. PARALLEL AI ANALYSIS
                </div>
                <div style={{ fontSize: '11px', color: '#1565C0' }}>
                  Each of 6 AI models analyzes data independently using up to 15 tool calls
                </div>
              </div>

              <div style={{ textAlign: 'center', fontSize: '20px', color: '#990F3D', fontWeight: '700' }}>↓</div>

              {/* Step 3: Decision */}
              <div style={{
                backgroundColor: '#FFF3E0',
                padding: '14px 18px',
                borderRadius: '10px',
                border: '2px solid #FF9800',
                borderLeft: '6px solid #FF9800'
              }}>
                <div style={{ fontWeight: '700', fontSize: '12px', color: '#E65100', marginBottom: '4px' }}>
                  3. GENERATE DECISION
                </div>
                <div style={{ fontSize: '11px', color: '#EF6C00' }}>
                  AI outputs: BUY/SELL/HOLD + stock symbol + quantity + 200+ char reasoning
                </div>
              </div>

              <div style={{ textAlign: 'center', fontSize: '20px', color: '#990F3D', fontWeight: '700' }}>↓</div>

              {/* Step 4: Execute */}
              <div style={{
                backgroundColor: '#F3E5F5',
                padding: '14px 18px',
                borderRadius: '10px',
                border: '2px solid #9C27B0',
                borderLeft: '6px solid #9C27B0'
              }}>
                <div style={{ fontWeight: '700', fontSize: '12px', color: '#4A148C', marginBottom: '4px' }}>
                  4. EXECUTE TRADE
                </div>
                <div style={{ fontSize: '11px', color: '#6A1B9A' }}>
                  Simulate realistic execution: slippage (0-0.2%), delay (1-3s), partial fills
                </div>
              </div>

              <div style={{ textAlign: 'center', fontSize: '20px', color: '#990F3D', fontWeight: '700' }}>↓</div>

              {/* Step 5: Update */}
              <div style={{
                backgroundColor: '#FFEBEE',
                padding: '14px 18px',
                borderRadius: '10px',
                border: '2px solid #F44336',
                borderLeft: '6px solid #F44336'
              }}>
                <div style={{ fontWeight: '700', fontSize: '12px', color: '#B71C1C', marginBottom: '4px' }}>
                  5. UPDATE & RECORD
                </div>
                <div style={{ fontSize: '11px', color: '#C62828' }}>
                  Update positions, calculate P&L, track metrics (Sharpe, drawdown, ROI)
                </div>
              </div>
            </div>

            {/* Right: Risk Management */}
            <div>
              <div style={{
                backgroundColor: '#FFEBEE',
                padding: '20px',
                borderRadius: '12px',
                border: '2px solid #F44336',
                height: '100%'
              }}>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#B71C1C',
                  marginBottom: '16px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Constraints
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '11px', color: '#C62828' }}>
                  <div style={{
                    padding: '10px',
                    backgroundColor: '#FFF',
                    borderRadius: '6px',
                    border: '1px solid #F44336'
                  }}>
                    <div style={{ fontWeight: '700', marginBottom: '4px', color: '#B71C1C' }}>Position Sizing</div>
                    <div style={{ lineHeight: '1.5' }}>
                      • Starting capital: $10,000<br/>
                      • Max per trade: $500<br/>
                      • Max 20 open positions
                    </div>
                  </div>
                  <div style={{
                    padding: '10px',
                    backgroundColor: '#FFF',
                    borderRadius: '6px',
                    border: '1px solid #F44336'
                  }}>
                    <div style={{ fontWeight: '700', marginBottom: '4px', color: '#B71C1C' }}>Trading Rules</div>
                    <div style={{ lineHeight: '1.5' }}>
                      • Long positions only<br/>
                      • No leverage/margin<br/>
                      • Cash required before buy
                    </div>
                  </div>
                  <div style={{
                    padding: '10px',
                    backgroundColor: '#FFF',
                    borderRadius: '6px',
                    border: '1px solid #F44336'
                  }}>
                    <div style={{ fontWeight: '700', marginBottom: '4px', color: '#B71C1C' }}>Execution</div>
                    <div style={{ lineHeight: '1.5' }}>
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
            backgroundColor: '#F8EBD8',
            padding: '30px',
            borderRadius: '16px',
            marginBottom: '30px',
            border: '2px solid #CCC1B7'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#262A33',
              marginBottom: '20px',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '1.5px'
            }}>
              Competing AI Models
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '16px'
            }}>
              {[
                { name: 'GPT-5', provider: 'OpenAI', color: '#10A37F', bg: '#D1FAE5' },
                { name: 'Claude\nSonnet 4.5', provider: 'Anthropic', color: '#CC785C', bg: '#FEE2E2' },
                { name: 'Gemini\nFlash', provider: 'Google', color: '#4285F4', bg: '#DBEAFE' },
                { name: 'DeepSeek', provider: 'DeepSeek', color: '#5B4DFF', bg: '#EDE9FE' },
                { name: 'Qwen', provider: 'Alibaba', color: '#FF6A00', bg: '#FFEDD5' },
                { name: 'Grok', provider: 'xAI', color: '#000000', bg: '#F3F4F6' }
              ].map((model, idx) => (
                <div key={idx} style={{
                  padding: '16px 12px',
                  backgroundColor: model.bg,
                  borderRadius: '10px',
                  border: `2px solid ${model.color}`,
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontWeight: '700',
                    fontSize: '13px',
                    color: model.color,
                    marginBottom: '6px',
                    lineHeight: '1.2',
                    minHeight: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'pre-line'
                  }}>
                    {model.name}
                  </div>
                  <div style={{
                    fontSize: '10px',
                    color: '#66605C',
                    fontWeight: '600'
                  }}>
                    {model.provider}
                  </div>
                  <div style={{
                    marginTop: '8px',
                    padding: '4px 8px',
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    borderRadius: '6px',
                    fontSize: '9px',
                    color: model.color,
                    fontWeight: '700'
                  }}>
                    15 TOOL BUDGET
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#E9DECF',
              borderRadius: '8px',
              fontSize: '11px',
              color: '#66605C',
              textAlign: 'center'
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
              backgroundColor: '#F3E5F5',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #9C27B0'
            }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#4A148C',
                marginBottom: '14px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Available Tools
              </h3>
              <div style={{ fontSize: '11px', color: '#6A1B9A', lineHeight: '1.6' }}>
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ fontWeight: '700', marginBottom: '4px' }}>Yahoo Finance (∞)</div>
                  <code style={{ backgroundColor: 'rgba(255,255,255,0.5)', padding: '2px 6px', borderRadius: '3px', fontSize: '10px', display: 'inline-block', marginBottom: '2px' }}>yf_get_quote</code><br/>
                  <code style={{ backgroundColor: 'rgba(255,255,255,0.5)', padding: '2px 6px', borderRadius: '3px', fontSize: '10px', display: 'inline-block', marginBottom: '2px' }}>yf_get_historical</code><br/>
                  <code style={{ backgroundColor: 'rgba(255,255,255,0.5)', padding: '2px 6px', borderRadius: '3px', fontSize: '10px', display: 'inline-block', marginBottom: '2px' }}>yf_get_trending</code><br/>
                  <code style={{ backgroundColor: 'rgba(255,255,255,0.5)', padding: '2px 6px', borderRadius: '3px', fontSize: '10px', display: 'inline-block', marginBottom: '2px' }}>yf_get_company_info</code><br/>
                  <code style={{ backgroundColor: 'rgba(255,255,255,0.5)', padding: '2px 6px', borderRadius: '3px', fontSize: '10px', display: 'inline-block' }}>yf_get_news</code>
                </div>
                <div>
                  <div style={{ fontWeight: '700', marginBottom: '4px' }}>Alpha Vantage (25/day)</div>
                  <code style={{ backgroundColor: 'rgba(255,255,255,0.5)', padding: '2px 6px', borderRadius: '3px', fontSize: '10px', display: 'inline-block', marginBottom: '2px' }}>get_rsi</code><br/>
                  <code style={{ backgroundColor: 'rgba(255,255,255,0.5)', padding: '2px 6px', borderRadius: '3px', fontSize: '10px', display: 'inline-block', marginBottom: '2px' }}>get_macd</code><br/>
                  <code style={{ backgroundColor: 'rgba(255,255,255,0.5)', padding: '2px 6px', borderRadius: '3px', fontSize: '10px', display: 'inline-block', marginBottom: '2px' }}>get_sma</code><br/>
                  <code style={{ backgroundColor: 'rgba(255,255,255,0.5)', padding: '2px 6px', borderRadius: '3px', fontSize: '10px', display: 'inline-block', marginBottom: '2px' }}>get_ema</code><br/>
                  <code style={{ backgroundColor: 'rgba(255,255,255,0.5)', padding: '2px 6px', borderRadius: '3px', fontSize: '10px', display: 'inline-block' }}>get_news_sentiment</code>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div style={{
              backgroundColor: '#E3F2FD',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #2196F3'
            }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#0D47A1',
                marginBottom: '14px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Trading Schedule
              </h3>
              <div style={{ fontSize: '11px', color: '#1565C0', lineHeight: '1.8' }}>
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ fontWeight: '700', marginBottom: '6px' }}>Automation</div>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', padding: '8px', borderRadius: '6px', marginBottom: '8px' }}>
                    GitHub Actions → Vercel API<br/>
                    <code style={{ fontSize: '10px', backgroundColor: 'rgba(33, 150, 243, 0.2)', padding: '2px 6px', borderRadius: '3px' }}>0,30 14-21 * * 1-5</code>
                  </div>
                  <div style={{ fontWeight: '700', marginBottom: '4px' }}>16 Cycles/Day</div>
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
                  padding: '8px',
                  backgroundColor: 'rgba(255,255,255,0.5)',
                  borderRadius: '6px',
                  fontWeight: '700'
                }}>
                  Monday-Friday • Market Hours Only
                </div>
              </div>
            </div>

            {/* Architecture */}
            <div style={{
              backgroundColor: '#FFF3E0',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #FF9800'
            }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#E65100',
                marginBottom: '14px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                System Stack
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { layer: 'DATA', items: ['Yahoo Finance', 'Alpha Vantage', 'News APIs'], color: '#4CAF50' },
                  { layer: 'BACKEND', items: ['Next.js API', 'Trading Engine', 'AI Integration'], color: '#2196F3' },
                  { layer: 'DATABASE', items: ['PostgreSQL', 'Prisma ORM', '5 Tables'], color: '#9C27B0' },
                  { layer: 'FRONTEND', items: ['React', 'Recharts', 'Real-time UI'], color: '#FF9800' }
                ].map((section, idx) => (
                  <div key={idx} style={{
                    padding: '10px',
                    backgroundColor: 'rgba(255,255,255,0.5)',
                    borderRadius: '6px',
                    border: `1px solid ${section.color}`,
                    borderLeft: `4px solid ${section.color}`
                  }}>
                    <div style={{
                      fontSize: '10px',
                      fontWeight: '700',
                      color: section.color,
                      marginBottom: '4px',
                      letterSpacing: '0.5px'
                    }}>
                      {section.layer}
                    </div>
                    <div style={{ fontSize: '10px', color: '#66605C' }}>
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
            backgroundColor: '#E9DECF',
            padding: '24px',
            borderRadius: '12px',
            border: '2px solid #990F3D'
          }}>
            <div>
              <div style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#990F3D',
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Input Context
              </div>
              <div style={{ fontSize: '11px', color: '#66605C', lineHeight: '1.6' }}>
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
                fontWeight: '700',
                color: '#990F3D',
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                textAlign: 'center'
              }}>
                AI Decision Process
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '10px',
                color: '#66605C'
              }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{
                    padding: '8px',
                    backgroundColor: '#FFF',
                    borderRadius: '6px',
                    marginBottom: '4px',
                    fontWeight: '600',
                    border: '1px solid #CCC1B7'
                  }}>
                    Call Tools
                  </div>
                  Gather data
                </div>
                <div style={{ padding: '0 8px', color: '#990F3D', fontWeight: '700' }}>→</div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{
                    padding: '8px',
                    backgroundColor: '#FFF',
                    borderRadius: '6px',
                    marginBottom: '4px',
                    fontWeight: '600',
                    border: '1px solid #CCC1B7'
                  }}>
                    Analyze
                  </div>
                  Technical signals
                </div>
                <div style={{ padding: '0 8px', color: '#990F3D', fontWeight: '700' }}>→</div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{
                    padding: '8px',
                    backgroundColor: '#FFF',
                    borderRadius: '6px',
                    marginBottom: '4px',
                    fontWeight: '600',
                    border: '1px solid #CCC1B7'
                  }}>
                    Evaluate
                  </div>
                  Risk/reward
                </div>
                <div style={{ padding: '0 8px', color: '#990F3D', fontWeight: '700' }}>→</div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{
                    padding: '8px',
                    backgroundColor: '#FFF',
                    borderRadius: '6px',
                    marginBottom: '4px',
                    fontWeight: '600',
                    border: '1px solid #CCC1B7'
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
                fontWeight: '700',
                color: '#990F3D',
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Output Decision
              </div>
              <div style={{ fontSize: '11px', color: '#66605C', lineHeight: '1.6' }}>
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
          padding: '30px',
          backgroundColor: '#262A33',
          borderRadius: '20px',
          color: '#F5E6D3'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#F5E6D3' }}>
            Watch AI Models Compete in Real-Time
          </h3>
          <p style={{ fontSize: '14px', marginBottom: '20px', opacity: 0.9 }}>
            Analyze performance metrics, review trading decisions, and compare strategies
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              padding: '14px 32px',
              backgroundColor: '#990F3D',
              color: '#FFF',
              textDecoration: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '700',
              transition: 'all 0.2s'
            }}
          >
            Go to Dashboard →
          </Link>
        </div>
      </div>
    </div>
  );
}
