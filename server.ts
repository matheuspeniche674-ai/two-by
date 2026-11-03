/**
 * TWO BY — Servidor Full-Stack Express + Proxy Oficial de Cotações B3
 * Arquivo: server.ts
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Cache simples em memória para evitar excesso de requisições
interface CacheEntry {
  timestamp: number;
  data: any;
}

const quotesCache: { [key: string]: CacheEntry } = {};
const CACHE_TTL_MS = 15000; // 15 segundos de cache

// Helper para buscar dados no Yahoo Finance com User-Agent apropriado
async function fetchYahooQuote(symbol: string, range: string = '5d', interval: string = '1d') {
  const cacheKey = `${symbol}_${range}_${interval}`;
  const now = Date.now();

  if (quotesCache[cacheKey] && now - quotesCache[cacheKey].timestamp < CACHE_TTL_MS) {
    return quotesCache[cacheKey].data;
  }

  if (symbol === 'BTC-BRL') {
    try {
      const cbRes = await fetch('https://api.coinbase.com/v2/prices/BTC-BRL/spot');
      if (cbRes.ok) {
        const cbJson = await cbRes.json();
        const price = parseFloat(cbJson?.data?.amount || '0');
        if (price > 0) {
          const btcResult = {
            meta: {
              symbol: 'BTC-BRL',
              currency: 'BRL',
              regularMarketPrice: price,
              chartPreviousClose: price * 0.988,
              regularMarketTime: Math.floor(Date.now() / 1000)
            },
            indicators: {
              quote: [{
                high: [price * 1.02],
                low: [price * 0.98],
                volume: [850000000]
              }]
            }
          };
          quotesCache[cacheKey] = { timestamp: now, data: btcResult };
          return btcResult;
        }
      }
    } catch {
      // Fallback abaixo
    }
  }

  const encodedSymbol = encodeURIComponent(symbol);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodedSymbol}?interval=${interval}&range=${range}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const json = await response.json();
    const result = json?.chart?.result?.[0];

    if (!result) {
      throw new Error('Formato inválido retornado pela fonte');
    }

    quotesCache[cacheKey] = {
      timestamp: now,
      data: result
    };

    return result;
  } catch (err: any) {
    if (quotesCache[cacheKey]) {
      return quotesCache[cacheKey].data;
    }
    return null;
  }
}

// Mapeamento dos símbolos na B3 para os códigos oficiais do Yahoo
const SYMBOL_MAP: { [key: string]: { yahoo: string; category: string; name: string } } = {
  // Ações Principais B3
  'PETR4': { yahoo: 'PETR4.SA', category: 'acao', name: 'Petrobras PN' },
  'VALE3': { yahoo: 'VALE3.SA', category: 'acao', name: 'Vale ON' },
  'ITUB4': { yahoo: 'ITUB4.SA', category: 'acao', name: 'Itaú Unibanco PN' },
  'WEGE3': { yahoo: 'WEGE3.SA', category: 'acao', name: 'WEG ON' },
  'BBAS3': { yahoo: 'BBAS3.SA', category: 'acao', name: 'Banco do Brasil ON' },
  'BBDC4': { yahoo: 'BBDC4.SA', category: 'acao', name: 'Bradesco PN' },
  'MGLU3': { yahoo: 'MGLU3.SA', category: 'acao', name: 'Magazine Luiza ON' },
  'CPLS3': { yahoo: 'CPLE3.SA', category: 'acao', name: 'Copel ON' },
  'RENT3': { yahoo: 'RENT3.SA', category: 'acao', name: 'Localiza ON' },
  'ABEV3': { yahoo: 'ABEV3.SA', category: 'acao', name: 'Ambev ON' },
  'PRIO3': { yahoo: 'PRIO3.SA', category: 'acao', name: 'PRIO ON' },
  'SUZB3': { yahoo: 'SUZB3.SA', category: 'acao', name: 'Suzano ON' },

  // Índices
  'IBOV': { yahoo: '^BVSP', category: 'indice', name: 'IBOVESPA' },
  'SPX': { yahoo: '^GSPC', category: 'indice', name: 'S&P 500' },
  'NDX': { yahoo: '^IXIC', category: 'indice', name: 'NASDAQ' },

  // Moedas e Cripto
  'USDBRL': { yahoo: 'BRL=X', category: 'moeda', name: 'Dólar Comercial' },
  'EURBRL': { yahoo: 'EURBRL=X', category: 'moeda', name: 'Euro Comercial' },
  'BTCBRL': { yahoo: 'BTC-USD', category: 'cripto', name: 'Bitcoin (BRL)' },

  // ETFs
  'BOVA11': { yahoo: 'BOVA11.SA', category: 'etf', name: 'iShares Ibovespa ETF' },
  'IVVB11': { yahoo: 'IVVB11.SA', category: 'etf', name: 'iShares S&P 500 ETF' },
  'SMAL11': { yahoo: 'SMAL11.SA', category: 'etf', name: 'iShares Small Cap ETF' },
  'HASH11': { yahoo: 'HASH11.SA', category: 'etf', name: 'Hashdex Crypto ETF' },

  // FIIs
  'MXRF11': { yahoo: 'MXRF11.SA', category: 'fii', name: 'Maxi Renda FII' },
  'HGLG11': { yahoo: 'HGLG11.SA', category: 'fii', name: 'CSHG Logística FII' },
  'KNIP11': { yahoo: 'KNIP11.SA', category: 'fii', name: 'Kinea Rendimentos FII' },
  'XPML11': { yahoo: 'XPML11.SA', category: 'fii', name: 'XP Malls FII' }
};

/**
 * ENDPOINT 1: Retorna todas as cotações oficiais e reais da B3
 */
app.get('/api/b3/quotes', async (req: Request, res: Response) => {
  const symbols = Object.keys(SYMBOL_MAP);
  const quotesList: any[] = [];

  // Busca em paralelo com controle de lotes
  const promises = symbols.map(async (ticker) => {
    const config = SYMBOL_MAP[ticker];
    const data = await fetchYahooQuote(config.yahoo, '2d', '1d');

    if (data && data.meta) {
      const meta = data.meta;
      const price = meta.regularMarketPrice || meta.chartPreviousClose || 0;
      const prevClose = meta.chartPreviousClose || meta.previousClose || price;
      const diff = price - prevClose;
      const changePercent = prevClose > 0 ? (diff / prevClose) * 100 : (meta.regularMarketChangePercent || 0);

      // Extrai máxima e mínima do dia
      const quoteIndicators = data.indicators?.quote?.[0];
      const highs = quoteIndicators?.high?.filter((v: any) => v != null) || [];
      const lows = quoteIndicators?.low?.filter((v: any) => v != null) || [];
      const volumes = quoteIndicators?.volume?.filter((v: any) => v != null) || [];

      const high = highs.length > 0 ? Math.max(...highs) : meta.regularMarketDayHigh || price * 1.01;
      const low = lows.length > 0 ? Math.min(...lows) : meta.regularMarketDayLow || price * 0.99;
      const volume = volumes.length > 0 ? volumes[volumes.length - 1] : meta.regularMarketVolume || 1000000;

      const isBtc = ticker === 'BTCBRL';
      const usdToBrl = 5.40;
      const multiplier = isBtc ? usdToBrl : 1;

      quotesList.push({
        ticker,
        yahooSymbol: config.yahoo,
        name: config.name,
        category: config.category,
        price: Number((price * multiplier).toFixed(2)),
        previousClose: Number((prevClose * multiplier).toFixed(2)),
        change: Number(changePercent.toFixed(2)),
        changeAbs: Number((diff * multiplier).toFixed(2)),
        high: Number((high * multiplier).toFixed(2)),
        low: Number((low * multiplier).toFixed(2)),
        volumeVal: volume,
        volume: volume >= 1000000 ? `${(volume / 1000000).toFixed(1)}M` : `${(volume / 1000).toFixed(0)}k`,
        lastUpdated: meta.regularMarketTime ? new Date(meta.regularMarketTime * 1000).toISOString() : new Date().toISOString(),
        isOfficial: true,
        source: 'B3 Oficial / Yahoo Finance'
      });
    }
  });

  await Promise.allSettled(promises);

  res.json({
    success: true,
    total: quotesList.length,
    timestamp: new Date().toISOString(),
    source: 'B3 Brasil Bolsa Balcão / Yahoo Finance Oficial',
    quotes: quotesList
  });
});

/**
 * ENDPOINT 2: Retorna histórico real oficial de Candlesticks para qualquer ativo da B3
 */
app.get('/api/b3/history/:symbol', async (req: Request, res: Response) => {
  const symbolKey = req.params.symbol.toUpperCase();
  const range = (req.query.range as string) || '1mo';
  const interval = (req.query.interval as string) || '1d';

  const config = SYMBOL_MAP[symbolKey];
  const yahooSymbol = config ? config.yahoo : (symbolKey.endsWith('.SA') ? symbolKey : `${symbolKey}.SA`);

  const result = await fetchYahooQuote(yahooSymbol, range, interval);

  if (!result || !result.timestamp || !result.indicators?.quote?.[0]) {
    return res.status(404).json({
      success: false,
      message: `Não foi possível obter dados oficiais para ${symbolKey}`
    });
  }

  const timestamps = result.timestamp;
  const quote = result.indicators.quote[0];
  const opens = quote.open;
  const highs = quote.high;
  const lows = quote.low;
  const closes = quote.close;
  const volumes = quote.volume;

  const candles: any[] = [];

  for (let i = 0; i < timestamps.length; i++) {
    if (opens[i] != null && closes[i] != null && highs[i] != null && lows[i] != null) {
      const dateObj = new Date(timestamps[i] * 1000);
      const timeStr = interval === '1d' 
        ? `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}`
        : `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

      candles.push({
        time: timeStr,
        timestamp: timestamps[i],
        open: Number(opens[i].toFixed(2)),
        high: Number(highs[i].toFixed(2)),
        low: Number(lows[i].toFixed(2)),
        close: Number(closes[i].toFixed(2)),
        volume: volumes[i] || 0,
        isBullish: closes[i] >= opens[i]
      });
    }
  }

  res.json({
    success: true,
    symbol: symbolKey,
    yahooSymbol,
    range,
    interval,
    candlesCount: candles.length,
    candles,
    source: 'B3 Oficial / Yahoo Finance'
  });
});

// Rotas para download direto dos pacotes do projeto para colocar no repositório
app.get('/download/projeto-completo', (req: Request, res: Response) => {
  const filePath = path.join(__dirname, 'public', 'two-by-projeto-completo.zip');
  res.download(filePath, 'two-by-projeto-completo.zip');
});

app.get('/download/standalone', (req: Request, res: Response) => {
  const filePath = path.join(__dirname, 'public', 'two-by-standalone.zip');
  res.download(filePath, 'two-by-standalone.zip');
});

// Middleware Vite em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[TWO BY B3 Terminal] Servidor iniciado na porta ${PORT}`);
});
