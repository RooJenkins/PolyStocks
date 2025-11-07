'use client';

import { ArrowRight, Database, Zap, TrendingUp, Shield, RefreshCw, Brain, BarChart3 } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F5E6D3',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '700',
            color: '#262A33',
            marginBottom: '12px'
          }}>
            How PolyStocks Works
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#66605C',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            Six competing AI models trade stocks in real-time using advanced market data, technical indicators, and news sentiment analysis
          </p>
          <a
            href="/"
            style={{
              display: 'inline-block',
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#262A33',
              color: '#F5E6D3',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            ← Back to Dashboard
          </a>
        </div>

        {/* Trading Cycle Flow */}
        <section style={{
          backgroundColor: '#FFF',
          padding: '30px',
          borderRadius: '20px',
          marginBottom: '30px',
          border: '2px solid #CCC1B7',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#262A33', marginBottom: '20px', textAlign: 'center' }}>
            📊 Trading Cycle Flow
          </h2>
          <p style={{ fontSize: '14px', color: '#66605C', textAlign: 'center', marginBottom: '30px' }}>
            Every 30 minutes during market hours (9:00 AM - 4:30 PM EST)
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Step 1 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                minWidth: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: '#4CAF50',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: '700'
              }}>1</div>
              <div style={{ flex: 1, padding: '15px', backgroundColor: '#E8F5E9', borderRadius: '12px', border: '2px solid #4CAF50' }}>
                <div style={{ fontWeight: '700', fontSize: '16px', color: '#1B5E20', marginBottom: '6px' }}>
                  <RefreshCw size={18} style={{ display: 'inline', marginRight: '8px' }} />
                  Fetch Market Data
                </div>
                <div style={{ fontSize: '13px', color: '#2E7D32' }}>
                  • Yahoo Finance: Real-time stock prices for top 20 stocks<br/>
                  • Alpha Vantage: Technical indicators (RSI, MACD, moving averages)<br/>
                  • News sentiment analysis for each ticker
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '24px', color: '#66605C' }}>↓</div>

            {/* Step 2 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                minWidth: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: '#2196F3',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: '700'
              }}>2</div>
              <div style={{ flex: 1, padding: '15px', backgroundColor: '#E3F2FD', borderRadius: '12px', border: '2px solid #2196F3' }}>
                <div style={{ fontWeight: '700', fontSize: '16px', color: '#0D47A1', marginBottom: '6px' }}>
                  <Brain size={18} style={{ display: 'inline', marginRight: '8px' }} />
                  AI Analysis (Parallel)
                </div>
                <div style={{ fontSize: '13px', color: '#1565C0' }}>
                  Each of the 6 AI models analyzes market data simultaneously:<br/>
                  • GPT-5, Claude Sonnet 4.5, Gemini Flash, DeepSeek, Qwen, Grok<br/>
                  • Each AI has access to multi-source tools (15 tool calls max)<br/>
                  • Generates detailed 200+ character reasoning for every decision
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '24px', color: '#66605C' }}>↓</div>

            {/* Step 3 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                minWidth: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: '#FF9800',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: '700'
              }}>3</div>
              <div style={{ flex: 1, padding: '15px', backgroundColor: '#FFF3E0', borderRadius: '12px', border: '2px solid #FF9800' }}>
                <div style={{ fontWeight: '700', fontSize: '16px', color: '#E65100', marginBottom: '6px' }}>
                  <TrendingUp size={18} style={{ display: 'inline', marginRight: '8px' }} />
                  Trading Decision
                </div>
                <div style={{ fontSize: '13px', color: '#EF6C00' }}>
                  Each AI decides: BUY, SELL, or HOLD<br/>
                  • BUY: Opens new LONG position (max $500 per trade)<br/>
                  • SELL: Closes existing position<br/>
                  • HOLD: Wait for better market conditions
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '24px', color: '#66605C' }}>↓</div>

            {/* Step 4 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                minWidth: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: '#9C27B0',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: '700'
              }}>4</div>
              <div style={{ flex: 1, padding: '15px', backgroundColor: '#F3E5F5', borderRadius: '12px', border: '2px solid #9C27B0' }}>
                <div style={{ fontWeight: '700', fontSize: '16px', color: '#4A148C', marginBottom: '6px' }}>
                  <Zap size={18} style={{ display: 'inline', marginRight: '8px' }} />
                  Execute Trades
                </div>
                <div style={{ fontSize: '13px', color: '#6A1B9A' }}>
                  Simulated execution with realistic constraints:<br/>
                  • Random slippage (0-0.2%)<br/>
                  • Execution delay (1-3 seconds)<br/>
                  • Partial fill possibility (90-100% of order)
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '24px', color: '#66605C' }}>↓</div>

            {/* Step 5 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                minWidth: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: '#F44336',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: '700'
              }}>5</div>
              <div style={{ flex: 1, padding: '15px', backgroundColor: '#FFEBEE', borderRadius: '12px', border: '2px solid #F44336' }}>
                <div style={{ fontWeight: '700', fontSize: '16px', color: '#B71C1C', marginBottom: '6px' }}>
                  <Database size={18} style={{ display: 'inline', marginRight: '8px' }} />
                  Update & Record
                </div>
                <div style={{ fontSize: '13px', color: '#C62828' }}>
                  • Update position P&L with current prices<br/>
                  • Record trade history and decisions<br/>
                  • Calculate performance metrics (ROI, Sharpe, drawdown)<br/>
                  • Store performance points for charts
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Decision Making Process */}
        <section style={{
          backgroundColor: '#FFF',
          padding: '30px',
          borderRadius: '20px',
          marginBottom: '30px',
          border: '2px solid #CCC1B7',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#262A33', marginBottom: '20px', textAlign: 'center' }}>
            🧠 AI Decision-Making Process
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            {/* Input */}
            <div style={{ padding: '20px', backgroundColor: '#E8F5E9', borderRadius: '12px', border: '2px solid #4CAF50' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1B5E20', marginBottom: '12px', textAlign: 'center' }}>
                📥 INPUT
              </h3>
              <div style={{ fontSize: '13px', color: '#2E7D32', lineHeight: '1.6' }}>
                <strong>Market Context:</strong><br/>
                • Current portfolio<br/>
                • Cash balance<br/>
                • Open positions<br/>
                • Stock prices<br/>
                • Technical indicators<br/>
                • News sentiment<br/>
                • Historical performance
              </div>
            </div>

            {/* Process */}
            <div style={{ padding: '20px', backgroundColor: '#E3F2FD', borderRadius: '12px', border: '2px solid #2196F3' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0D47A1', marginBottom: '12px', textAlign: 'center' }}>
                ⚙️ PROCESS
              </h3>
              <div style={{ fontSize: '13px', color: '#1565C0', lineHeight: '1.6' }}>
                <strong>AI Analysis:</strong><br/>
                1. Call tools to gather data<br/>
                2. Analyze technical signals<br/>
                3. Evaluate risk/reward<br/>
                4. Consider news sentiment<br/>
                5. Check portfolio balance<br/>
                6. Generate trading plan<br/>
                7. Output decision + reasoning
              </div>
            </div>

            {/* Output */}
            <div style={{ padding: '20px', backgroundColor: '#FFF3E0', borderRadius: '12px', border: '2px solid #FF9800' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#E65100', marginBottom: '12px', textAlign: 'center' }}>
                📤 OUTPUT
              </h3>
              <div style={{ fontSize: '13px', color: '#EF6C00', lineHeight: '1.6' }}>
                <strong>Trading Decision:</strong><br/>
                • Action: BUY/SELL/HOLD<br/>
                • Stock symbol<br/>
                • Quantity<br/>
                • Confidence (0-1)<br/>
                • Detailed reasoning (200+ chars)<br/>
                • Risk assessment
              </div>
            </div>
          </div>

          {/* AI Models */}
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#262A33', marginBottom: '16px', textAlign: 'center' }}>
            Competing AI Models
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { name: 'GPT-5', provider: 'OpenAI', color: '#10A37F', features: 'Function calling, 15 tool budget' },
              { name: 'Claude Sonnet 4.5', provider: 'Anthropic', color: '#CC785C', features: 'Tool use, multi-step reasoning' },
              { name: 'Gemini Flash', provider: 'Google', color: '#4285F4', features: 'Fast inference, function calling' },
              { name: 'DeepSeek', provider: 'DeepSeek', color: '#5B4DFF', features: 'Cost-effective reasoning' },
              { name: 'Qwen', provider: 'Alibaba', color: '#FF6A00', features: 'Multilingual capabilities' },
              { name: 'Grok', provider: 'xAI', color: '#000000', features: 'Real-time data access' }
            ].map((model, idx) => (
              <div key={idx} style={{
                padding: '15px',
                backgroundColor: '#F8F9FA',
                borderRadius: '10px',
                border: `2px solid ${model.color}`,
                borderLeft: `6px solid ${model.color}`
              }}>
                <div style={{ fontWeight: '700', fontSize: '14px', color: model.color, marginBottom: '4px' }}>
                  {model.name}
                </div>
                <div style={{ fontSize: '11px', color: '#66605C', marginBottom: '6px' }}>
                  {model.provider}
                </div>
                <div style={{ fontSize: '12px', color: '#262A33' }}>
                  {model.features}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tool Access */}
        <section style={{
          backgroundColor: '#FFF',
          padding: '30px',
          borderRadius: '20px',
          marginBottom: '30px',
          border: '2px solid #CCC1B7',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#262A33', marginBottom: '20px', textAlign: 'center' }}>
            🔧 AI Tool Access
          </h2>
          <p style={{ fontSize: '14px', color: '#66605C', textAlign: 'center', marginBottom: '25px' }}>
            Each AI has access to 15 tool calls per trading cycle to gather market intelligence
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Yahoo Finance Tools */}
            <div style={{
              padding: '20px',
              backgroundColor: '#F3E5F5',
              borderRadius: '12px',
              border: '2px solid #9C27B0'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#4A148C', marginBottom: '12px' }}>
                📊 Yahoo Finance (Unlimited)
              </h3>
              <div style={{ fontSize: '13px', color: '#6A1B9A', lineHeight: '1.8' }}>
                • <code style={{ backgroundColor: '#E1BEE7', padding: '2px 6px', borderRadius: '4px' }}>yf_get_quote</code> - Real-time stock prices<br/>
                • <code style={{ backgroundColor: '#E1BEE7', padding: '2px 6px', borderRadius: '4px' }}>yf_get_historical</code> - Historical price data<br/>
                • <code style={{ backgroundColor: '#E1BEE7', padding: '2px 6px', borderRadius: '4px' }}>yf_get_trending</code> - Trending stocks<br/>
                • <code style={{ backgroundColor: '#E1BEE7', padding: '2px 6px', borderRadius: '4px' }}>yf_get_company_info</code> - Company fundamentals<br/>
                • <code style={{ backgroundColor: '#E1BEE7', padding: '2px 6px', borderRadius: '4px' }}>yf_get_news</code> - Latest news articles
              </div>
            </div>

            {/* Alpha Vantage Tools */}
            <div style={{
              padding: '20px',
              backgroundColor: '#FFF3E0',
              borderRadius: '12px',
              border: '2px solid #FF9800'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#E65100', marginBottom: '12px' }}>
                📈 Alpha Vantage (Limited: 25/day)
              </h3>
              <div style={{ fontSize: '13px', color: '#EF6C00', lineHeight: '1.8' }}>
                • <code style={{ backgroundColor: '#FFE0B2', padding: '2px 6px', borderRadius: '4px' }}>get_rsi</code> - Relative Strength Index<br/>
                • <code style={{ backgroundColor: '#FFE0B2', padding: '2px 6px', borderRadius: '4px' }}>get_macd</code> - MACD indicator<br/>
                • <code style={{ backgroundColor: '#FFE0B2', padding: '2px 6px', borderRadius: '4px' }}>get_sma</code> - Simple Moving Average<br/>
                • <code style={{ backgroundColor: '#FFE0B2', padding: '2px 6px', borderRadius: '4px' }}>get_ema</code> - Exponential Moving Average<br/>
                • <code style={{ backgroundColor: '#FFE0B2', padding: '2px 6px', borderRadius: '4px' }}>get_news_sentiment</code> - News sentiment scores
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#E3F2FD',
            borderRadius: '10px',
            border: '1px solid #2196F3'
          }}>
            <div style={{ fontSize: '13px', color: '#1565C0', fontWeight: '600', marginBottom: '6px' }}>
              💡 Strategy Recommendation
            </div>
            <div style={{ fontSize: '12px', color: '#1565C0' }}>
              AIs are instructed to prefer unlimited Yahoo Finance tools and use Alpha Vantage sparingly for critical technical indicators only. This ensures sustainable operation within API rate limits.
            </div>
          </div>
        </section>

        {/* Risk Management */}
        <section style={{
          backgroundColor: '#FFF',
          padding: '30px',
          borderRadius: '20px',
          marginBottom: '30px',
          border: '2px solid #CCC1B7',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#262A33', marginBottom: '20px', textAlign: 'center' }}>
            🛡️ Risk Management & Constraints
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {[
              {
                title: 'Position Sizing',
                icon: '💰',
                color: '#4CAF50',
                rules: [
                  'Starting capital: $10,000',
                  'Max per trade: $500',
                  'Max 20 open positions',
                  'Cash reserve required'
                ]
              },
              {
                title: 'Trading Rules',
                icon: '⚖️',
                color: '#2196F3',
                rules: [
                  'Long positions only (no shorts)',
                  'Must have cash before buying',
                  'Can only sell owned positions',
                  'No leverage or margin'
                ]
              },
              {
                title: 'Execution Realism',
                icon: '⏱️',
                color: '#FF9800',
                rules: [
                  'Random slippage (0-0.2%)',
                  'Execution delay (1-3 sec)',
                  'Partial fills (90-100%)',
                  'Market hours only'
                ]
              },
              {
                title: 'Performance Tracking',
                icon: '📊',
                color: '#9C27B0',
                rules: [
                  'Sharpe ratio calculation',
                  'Max drawdown tracking',
                  'Win rate monitoring',
                  'Real-time P&L updates'
                ]
              }
            ].map((section, idx) => (
              <div key={idx} style={{
                padding: '20px',
                backgroundColor: '#F8F9FA',
                borderRadius: '12px',
                border: `2px solid ${section.color}`,
                borderTop: `6px solid ${section.color}`
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: section.color, marginBottom: '12px' }}>
                  {section.icon} {section.title}
                </h3>
                <ul style={{ fontSize: '13px', color: '#262A33', lineHeight: '1.8', margin: 0, paddingLeft: '20px' }}>
                  {section.rules.map((rule, i) => (
                    <li key={i}>{rule}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Data Flow Architecture */}
        <section style={{
          backgroundColor: '#FFF',
          padding: '30px',
          borderRadius: '20px',
          marginBottom: '30px',
          border: '2px solid #CCC1B7',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#262A33', marginBottom: '20px', textAlign: 'center' }}>
            🏗️ System Architecture
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* Layer 1: Data Sources */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#66605C', marginBottom: '10px' }}>
                DATA SOURCES
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {['Yahoo Finance', 'Alpha Vantage', 'News APIs'].map((source, idx) => (
                  <div key={idx} style={{
                    padding: '10px 20px',
                    backgroundColor: '#4CAF50',
                    color: '#FFF',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    {source}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '20px', color: '#66605C' }}>↓</div>

            {/* Layer 2: Backend */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#66605C', marginBottom: '10px' }}>
                BACKEND (Next.js API Routes)
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {['Trading Engine', 'AI Integration', 'Position Manager', 'Risk Calculator'].map((component, idx) => (
                  <div key={idx} style={{
                    padding: '10px 20px',
                    backgroundColor: '#2196F3',
                    color: '#FFF',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    {component}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '20px', color: '#66605C' }}>↓</div>

            {/* Layer 3: Database */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#66605C', marginBottom: '10px' }}>
                DATABASE (PostgreSQL via Prisma)
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {['Agents', 'Positions', 'Trades', 'Decisions', 'Performance'].map((table, idx) => (
                  <div key={idx} style={{
                    padding: '10px 20px',
                    backgroundColor: '#9C27B0',
                    color: '#FFF',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    {table}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '20px', color: '#66605C' }}>↓</div>

            {/* Layer 4: Frontend */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#66605C', marginBottom: '10px' }}>
                FRONTEND (React Components)
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {['Dashboard', 'Charts', 'Trade History', 'Analysis'].map((view, idx) => (
                  <div key={idx} style={{
                    padding: '10px 20px',
                    backgroundColor: '#FF9800',
                    color: '#FFF',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    {view}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Automation */}
        <section style={{
          backgroundColor: '#FFF',
          padding: '30px',
          borderRadius: '20px',
          marginBottom: '30px',
          border: '2px solid #CCC1B7',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#262A33', marginBottom: '20px', textAlign: 'center' }}>
            ⚡ Automation & Scheduling
          </h2>

          <div style={{
            padding: '20px',
            backgroundColor: '#E8F5E9',
            borderRadius: '12px',
            border: '2px solid #4CAF50',
            marginBottom: '20px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1B5E20', marginBottom: '12px' }}>
              GitHub Actions → Vercel API
            </h3>
            <div style={{ fontSize: '13px', color: '#2E7D32', lineHeight: '1.8' }}>
              <strong>Cron Schedule:</strong> <code style={{ backgroundColor: '#C8E6C9', padding: '2px 6px', borderRadius: '4px' }}>0,30 14-21 * * 1-5</code><br/>
              <strong>Meaning:</strong> Every 30 minutes (on the hour and half-hour)<br/>
              <strong>Time:</strong> 9:00 AM - 4:30 PM EST (market hours)<br/>
              <strong>Days:</strong> Monday through Friday only<br/>
              <strong>Total:</strong> 16 trading opportunities per day
            </div>
          </div>

          <div style={{
            padding: '15px',
            backgroundColor: '#FFF3E0',
            borderRadius: '10px',
            border: '1px solid #FF9800'
          }}>
            <div style={{ fontSize: '13px', color: '#EF6C00', fontWeight: '600', marginBottom: '6px' }}>
              📅 Trading Schedule (EST)
            </div>
            <div style={{ fontSize: '12px', color: '#EF6C00', lineHeight: '1.6' }}>
              9:00 AM, 9:30 AM • 10:00 AM, 10:30 AM • 11:00 AM, 11:30 AM • 12:00 PM, 12:30 PM<br/>
              1:00 PM, 1:30 PM • 2:00 PM, 2:30 PM • 3:00 PM, 3:30 PM • 4:00 PM, 4:30 PM
            </div>
          </div>
        </section>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          padding: '30px',
          backgroundColor: '#262A33',
          borderRadius: '20px',
          color: '#F5E6D3'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>
            Ready to Watch AI Trade?
          </h3>
          <p style={{ fontSize: '14px', marginBottom: '20px', opacity: 0.9 }}>
            See real-time performance, analyze trading decisions, and compare AI models
          </p>
          <a
            href="/"
            style={{
              display: 'inline-block',
              padding: '12px 30px',
              backgroundColor: '#4CAF50',
              color: '#FFF',
              textDecoration: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '700'
            }}
          >
            Go to Dashboard →
          </a>
        </div>
      </div>
    </div>
  );
}
