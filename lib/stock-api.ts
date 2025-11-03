import { TOP_20_STOCKS } from './constants';
import type { Stock } from '@/types';
import { generateMockStockPrices } from './mock-stock-data';
import { get_quote as yahooGetQuote } from './yahoo-finance-tools';

// Stock API provider types
type StockProvider = 'yahoo_finance' | 'alpha_vantage' | 'polygon' | 'finnhub';

interface StockAPIConfig {
  provider: StockProvider;
  apiKey?: string; // Optional now since Yahoo Finance doesn't need one
}

function getAPIConfig(): StockAPIConfig {
  // Always use Yahoo Finance first (unlimited, free, no API key needed)
  return { provider: 'yahoo_finance' };

  // Fallback providers (kept for reference, but Yahoo Finance should always work)
  // if (process.env.POLYGON_API_KEY && process.env.POLYGON_API_KEY !== 'demo') {
  //   return { provider: 'polygon', apiKey: process.env.POLYGON_API_KEY };
  // }
  // if (process.env.ALPHA_VANTAGE_API_KEY && process.env.ALPHA_VANTAGE_API_KEY !== 'demo') {
  //   return { provider: 'alpha_vantage', apiKey: process.env.ALPHA_VANTAGE_API_KEY };
  // }
}

/**
 * Fetch real-time stock data for the top 20 S&P 500 companies
 */
export async function fetchStockPrices(): Promise<Stock[]> {
  const config = getAPIConfig();

  try {
    switch (config.provider) {
      case 'yahoo_finance':
        return await fetchYahooFinancePrices();
      case 'polygon':
        return await fetchPolygonPrices(config.apiKey!);
      case 'alpha_vantage':
        return await fetchAlphaVantagePrices(config.apiKey!);
      case 'finnhub':
        return await fetchFinnhubPrices(config.apiKey!);
      default:
        console.log('  ⚠️  Unknown provider, using simulated prices');
        return generateMockStockPrices();
    }
  } catch (error) {
    console.error('  ❌ Error fetching real stock prices, falling back to simulated data:', error);
    return generateMockStockPrices();
  }
}

/**
 * Fetch single stock quote
 */
export async function fetchStockQuote(symbol: string): Promise<Stock> {
  const config = getAPIConfig();

  const stock = TOP_20_STOCKS.find((s) => s.symbol === symbol);
  if (!stock) {
    throw new Error(`Stock ${symbol} not found in top 20 list`);
  }

  if (!config) {
    // Return simulated price for this stock
    const mockPrices = generateMockStockPrices();
    const mockStock = mockPrices.find((s) => s.symbol === symbol);
    if (mockStock) return mockStock;
    throw new Error(`Failed to get price for ${symbol}`);
  }

  switch (config.provider) {
    case 'yahoo_finance':
      return yahooGetQuote(symbol, 'stock-api', 'StockAPI');
    case 'polygon':
      return fetchPolygonQuote(symbol, stock.name, config.apiKey!);
    case 'alpha_vantage':
      return fetchAlphaVantageQuote(symbol, stock.name, config.apiKey!);
    case 'finnhub':
      return fetchFinnhubQuote(symbol, stock.name, config.apiKey!);
    default:
      throw new Error(`Unsupported provider: ${config.provider}`);
  }
}

// Polygon.io implementation
async function fetchPolygonPrices(apiKey: string): Promise<Stock[]> {
  const symbols = TOP_20_STOCKS.map((s) => s.symbol).join(',');

  try {
    const response = await fetch(
      `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers?tickers=${symbols}&apiKey=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Polygon API error: ${response.status}`);
    }

    const data = await response.json();

    return data.tickers.map((ticker: any) => {
      const stock = TOP_20_STOCKS.find((s) => s.symbol === ticker.ticker);
      return {
        symbol: ticker.ticker,
        name: stock?.name || ticker.ticker,
        price: ticker.day?.c || ticker.prevDay?.c || 0,
        change: (ticker.day?.c || 0) - (ticker.prevDay?.c || 0),
        changePercent: ticker.todaysChangePerc || 0,
      };
    });
  } catch (error) {
    console.error('Error fetching Polygon prices:', error);
    throw error;
  }
}

async function fetchPolygonQuote(
  symbol: string,
  name: string,
  apiKey: string
): Promise<Stock> {
  try {
    const response = await fetch(
      `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/${symbol}?apiKey=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Polygon API error: ${response.status}`);
    }

    const data = await response.json();
    const ticker = data.ticker;

    return {
      symbol,
      name,
      price: ticker.day?.c || ticker.prevDay?.c || 0,
      change: (ticker.day?.c || 0) - (ticker.prevDay?.c || 0),
      changePercent: ticker.todaysChangePerc || 0,
    };
  } catch (error) {
    console.error(`Error fetching Polygon quote for ${symbol}:`, error);
    throw error;
  }
}

// Yahoo Finance implementation (FREE, unlimited)
async function fetchYahooFinancePrices(): Promise<Stock[]> {
  console.log('  📊 Using Yahoo Finance (unlimited, free)');
  const stocks: Stock[]  = [];

  // Fetch all stocks in parallel
  const promises = TOP_20_STOCKS.map(async (stock) => {
    try {
      const quote = await yahooGetQuote(stock.symbol, 'stock-api', 'StockAPI');
      return {
        symbol: stock.symbol,
        name: stock.name,
        price: quote.price,
        change: quote.change,
        changePercent: quote.changePercent,
      };
    } catch (error) {
      console.error(`Error fetching ${stock.symbol} from Yahoo Finance:`, error);
      return null;
    }
  });

  const results = await Promise.all(promises);
  const validResults = results.filter((r): r is Stock => r !== null);

  console.log(`  ✓ Fetched ${validResults.length}/${TOP_20_STOCKS.length} stocks from Yahoo Finance`);
  return validResults;
}

// Alpha Vantage implementation
async function fetchAlphaVantagePrices(apiKey: string): Promise<Stock[]> {
  const stocks: Stock[] = [];

  // Alpha Vantage requires individual API calls for each stock
  // We'll batch them with Promise.all
  const promises = TOP_20_STOCKS.map(async (stock) => {
    try {
      return await fetchAlphaVantageQuote(stock.symbol, stock.name, apiKey);
    } catch (error) {
      console.error(`Error fetching ${stock.symbol}:`, error);
      return null;
    }
  });

  const results = await Promise.all(promises);
  return results.filter((r): r is Stock => r !== null);
}

async function fetchAlphaVantageQuote(
  symbol: string,
  name: string,
  apiKey: string
): Promise<Stock> {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Alpha Vantage API error: ${response.status}`);
    }

    const data = await response.json();
    const quote = data['Global Quote'];

    if (!quote || Object.keys(quote).length === 0) {
      throw new Error(`No data returned for ${symbol}`);
    }

    const price = parseFloat(quote['05. price'] || '0');
    const change = parseFloat(quote['09. change'] || '0');
    const changePercent = parseFloat(
      (quote['10. change percent'] || '0').replace('%', '')
    );

    return {
      symbol,
      name,
      price,
      change,
      changePercent,
    };
  } catch (error) {
    console.error(`Error fetching Alpha Vantage quote for ${symbol}:`, error);
    throw error;
  }
}

// Finnhub implementation
async function fetchFinnhubPrices(apiKey: string): Promise<Stock[]> {
  const stocks: Stock[] = [];

  const promises = TOP_20_STOCKS.map(async (stock) => {
    try {
      return await fetchFinnhubQuote(stock.symbol, stock.name, apiKey);
    } catch (error) {
      console.error(`Error fetching ${stock.symbol}:`, error);
      return null;
    }
  });

  const results = await Promise.all(promises);
  return results.filter((r): r is Stock => r !== null);
}

async function fetchFinnhubQuote(
  symbol: string,
  name: string,
  apiKey: string
): Promise<Stock> {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Finnhub API error: ${response.status}`);
    }

    const data = await response.json();

    const price = data.c || 0; // Current price
    const previousClose = data.pc || 0;
    const change = price - previousClose;
    const changePercent = data.dp || 0; // Percent change

    return {
      symbol,
      name,
      price,
      change,
      changePercent,
    };
  } catch (error) {
    console.error(`Error fetching Finnhub quote for ${symbol}:`, error);
    throw error;
  }
}

/**
 * Fetch stock news
 */
export async function fetchStockNews(symbols: string[] = []): Promise<any[]> {
  const config = getAPIConfig();

  if (!config) {
    return []; // No news without API
  }

  switch (config.provider) {
    case 'polygon':
      return fetchPolygonNews(symbols, config.apiKey!);
    case 'finnhub':
      return fetchFinnhubNews(symbols, config.apiKey!);
    default:
      return [];
  }
}

async function fetchPolygonNews(
  symbols: string[],
  apiKey: string
): Promise<any[]> {
  try {
    const ticker = symbols.length > 0 ? symbols[0] : '';
    const url = ticker
      ? `https://api.polygon.io/v2/reference/news?ticker=${ticker}&limit=10&apiKey=${apiKey}`
      : `https://api.polygon.io/v2/reference/news?limit=10&apiKey=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Polygon News API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching Polygon news:', error);
    return [];
  }
}

async function fetchFinnhubNews(
  symbols: string[],
  apiKey: string
): Promise<any[]> {
  try {
    const symbol = symbols.length > 0 ? symbols[0] : 'AAPL';
    const response = await fetch(
      `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }&to=${new Date().toISOString().split('T')[0]}&token=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Finnhub News API error: ${response.status}`);
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching Finnhub news:', error);
    return [];
  }
}
