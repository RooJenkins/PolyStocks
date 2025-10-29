export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface AIAgent {
  id: string;
  name: string;
  model: string;
  accountValue: number;
  startingValue: number;
  roi: number;
  totalPnL: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  tradeCount: number;
  biggestWin: number;
  biggestLoss: number;
  color: string;
}

export interface Position {
  id: string;
  agentId: string;
  stock: Stock;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  openedAt: Date;
}

export interface Trade {
  id: string;
  agentId: string;
  stock: Stock;
  action: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  total: number;
  realizedPnL?: number;
  timestamp: Date;
  reasoning: string;
  confidence: number;
}

export interface AgentDecision {
  id: string;
  agentId: string;
  timestamp: Date;
  marketData: {
    stockPrices: Stock[];
    portfolioValue: number;
    cashBalance: number;
  };
  reasoning: string;
  decision: {
    action: 'BUY' | 'SELL' | 'HOLD';
    stock?: Stock;
    quantity?: number;
    confidence: number;
    riskAssessment: string;
    targetPrice?: number;
    stopLoss?: number;
  };
}

export interface PerformanceDataPoint {
  timestamp: Date;
  accountValue: number;
  agentId: string;
}
