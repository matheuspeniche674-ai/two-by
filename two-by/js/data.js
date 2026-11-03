/**
 * TWO BY - Plataforma de Mercado Financeiro & B3
 * Arquivo: js/data.js
 * Descrição: Camada central de dados demonstrativos do mercado financeiro brasileiro.
 * Isolado para permitir integração simplificada com APIs REST/WebSockets reais futuramente.
 */

const TwoByData = (function () {
  'use strict';

  // Aviso de dados demonstrativos
  const DEMO_NOTICE = "Modo demonstração — os valores apresentados são ilustrativos e não representam cotações oficiais em tempo real.";

  // Indicadores Principais de Mercado
  const marketIndices = [
    {
      id: "ibovespa",
      name: "IBOVESPA",
      ticker: "IBOV",
      value: 143522.12,
      displayValue: "143.522,12",
      change: 1.32,
      changeFormatted: "+1,32%",
      isPositive: true,
      category: "brasil",
      sparkline: [141800, 142100, 142050, 142600, 142400, 142900, 143100, 143522]
    },
    {
      id: "dolar",
      name: "DÓLAR (PTAX)",
      ticker: "USDBRL",
      value: 5.32,
      displayValue: "R$ 5,32",
      change: -0.21,
      changeFormatted: "-0,21%",
      isPositive: false,
      category: "moedas",
      sparkline: [5.37, 5.36, 5.38, 5.35, 5.34, 5.35, 5.33, 5.32]
    },
    {
      id: "ifix",
      name: "IFIX",
      ticker: "IFIX",
      value: 3186.45,
      displayValue: "3.186,45",
      change: 0.68,
      changeFormatted: "+0,68%",
      isPositive: true,
      category: "brasil",
      sparkline: [3160, 3165, 3168, 3172, 3170, 3178, 3182, 3186]
    },
    {
      id: "sp500",
      name: "S&P 500",
      ticker: "SPX",
      value: 6203.86,
      displayValue: "6.203,86",
      change: 0.74,
      changeFormatted: "+0,74%",
      isPositive: true,
      category: "global",
      sparkline: [6150, 6165, 6160, 6180, 6175, 6195, 6190, 6203]
    },
    {
      id: "nasdaq",
      name: "NASDAQ 100",
      ticker: "NDX",
      value: 19842.15,
      displayValue: "19.842,15",
      change: 1.15,
      changeFormatted: "+1,15%",
      isPositive: true,
      category: "global",
      sparkline: [19600, 19680, 19650, 19740, 19710, 19810, 19842]
    },
    {
      id: "euro",
      name: "EURO COMERCIAL",
      ticker: "EURBRL",
      value: 5.78,
      displayValue: "R$ 5,78",
      change: -0.15,
      changeFormatted: "-0,15%",
      isPositive: false,
      category: "moedas",
      sparkline: [5.82, 5.81, 5.80, 5.79, 5.81, 5.79, 5.78]
    },
    {
      id: "bitcoin",
      name: "BITCOIN (BRL)",
      ticker: "BTCBRL",
      value: 382450.00,
      displayValue: "R$ 382.450",
      change: 2.85,
      changeFormatted: "+2,85%",
      isPositive: true,
      category: "cripto",
      sparkline: [371000, 374000, 372500, 378000, 376000, 381000, 382450]
    },
    {
      id: "petroleo",
      name: "PETRÓLEO BRENT",
      ticker: "BRENT",
      value: 78.45,
      displayValue: "US$ 78,45",
      change: 1.84,
      changeFormatted: "+1,84%",
      isPositive: true,
      category: "commodities",
      sparkline: [76.5, 76.8, 77.2, 77.0, 77.6, 78.1, 78.45]
    }
  ];

  // Ações da B3 com dados detalhados
  const stocks = [
    {
      ticker: "PETR4",
      name: "Petrobras PN",
      company: "Petróleo Brasileiro S.A.",
      sector: "Petróleo, Gás e Biocombustíveis",
      price: 32.18,
      change: 2.41,
      changeAbs: 0.76,
      high: 32.48,
      low: 31.52,
      volume: "112,4M",
      volumeVal: 112400000,
      trades: "82,3k",
      marketCap: "420,5 B",
      pe: 4.8,
      pvp: 1.15,
      dy: 14.8,
      roe: 24.2,
      isFavorite: true,
      logoColor: "#00A859",
      logoBadge: "BR",
      summary: "Maior empresa integrada de energia da América Latina com operações no pré-sal e refino.",
      history1D: generateCandles(31.50, 32.18, 28, 0.25)
    },
    {
      ticker: "VALE3",
      name: "Vale ON",
      company: "Vale S.A.",
      sector: "Materiais Básicos / Mineração",
      price: 67.34,
      change: 3.76,
      changeAbs: 2.44,
      high: 68.10,
      low: 65.20,
      volume: "98,1M",
      volumeVal: 98100000,
      trades: "64,1k",
      marketCap: "305,2 B",
      pe: 6.2,
      pvp: 1.42,
      dy: 9.2,
      roe: 21.5,
      isFavorite: true,
      logoColor: "#007A78",
      logoBadge: "VA",
      summary: "Uma das maiores produtoras globais de minério de ferro e pelotas, além de níquel e cobre.",
      history1D: generateCandles(65.50, 67.34, 28, 0.45)
    },
    {
      ticker: "ITUB4",
      name: "Itaú Unibanco PN",
      company: "Itaú Unibanco Holding S.A.",
      sector: "Financeiro / Bancos",
      price: 36.87,
      change: 3.45,
      changeAbs: 1.23,
      high: 37.15,
      low: 35.80,
      volume: "74,5M",
      volumeVal: 74500000,
      trades: "51,8k",
      marketCap: "360,8 B",
      pe: 8.9,
      pvp: 1.78,
      dy: 7.4,
      roe: 21.8,
      isFavorite: true,
      logoColor: "#EC7000",
      logoBadge: "IT",
      summary: "Maior conglomerado financeiro privado da América Latina com presença internacional.",
      history1D: generateCandles(35.90, 36.87, 28, 0.30)
    },
    {
      ticker: "WEGE3",
      name: "WEG ON",
      company: "WEG S.A.",
      sector: "Bens Industriais / Motores",
      price: 39.12,
      change: 3.28,
      changeAbs: 1.24,
      high: 39.40,
      low: 37.95,
      volume: "42,8M",
      volumeVal: 42800000,
      trades: "38,4k",
      marketCap: "164,1 B",
      pe: 28.5,
      pvp: 8.40,
      dy: 2.1,
      roe: 30.4,
      isFavorite: true,
      logoColor: "#005596",
      logoBadge: "WE",
      summary: "Líder global em equipamentos eletroeletrônicos industriais e motores de alta eficiência.",
      history1D: generateCandles(38.00, 39.12, 28, 0.35)
    },
    {
      ticker: "BBAS3",
      name: "Banco do Brasil ON",
      company: "Banco do Brasil S.A.",
      sector: "Financeiro / Bancos",
      price: 28.41,
      change: 2.97,
      changeAbs: 0.82,
      high: 28.70,
      low: 27.60,
      volume: "58,2M",
      volumeVal: 58200000,
      trades: "44,9k",
      marketCap: "162,5 B",
      pe: 4.2,
      pvp: 0.88,
      dy: 9.8,
      roe: 21.0,
      isFavorite: false,
      logoColor: "#FED100",
      logoBadge: "BB",
      summary: "Instituição bancária pioneira e líder absoluta no financiamento do agronegócio nacional.",
      history1D: generateCandles(27.65, 28.41, 28, 0.22)
    },
    {
      ticker: "BBDC4",
      name: "Bradesco PN",
      company: "Banco Bradesco S.A.",
      sector: "Financeiro / Bancos",
      price: 16.42,
      change: 2.98,
      changeAbs: 0.47,
      high: 16.60,
      low: 15.98,
      volume: "61,0M",
      volumeVal: 61000000,
      trades: "41,2k",
      marketCap: "172,0 B",
      pe: 8.5,
      pvp: 0.95,
      dy: 6.8,
      roe: 12.3,
      isFavorite: false,
      logoColor: "#CC092F",
      logoBadge: "BD",
      summary: "Um dos maiores bancos privados do Brasil com expressiva divisão de seguros e previdência.",
      history1D: generateCandles(16.00, 16.42, 28, 0.15)
    },
    {
      ticker: "MGLU3",
      name: "Magazine Luiza ON",
      company: "Magazine Luiza S.A.",
      sector: "Consumo Cíclico / E-commerce",
      price: 12.56,
      change: -3.42,
      changeAbs: -0.44,
      high: 13.10,
      low: 12.40,
      volume: "35,4M",
      volumeVal: 35400000,
      trades: "31,0k",
      marketCap: "8,9 B",
      pe: -18.2,
      pvp: 1.62,
      dy: 0.0,
      roe: -3.4,
      isFavorite: false,
      logoColor: "#0086FF",
      logoBadge: "ML",
      summary: "Plataforma de varejo multicanal líder no mercado físico e no comércio digital brasileiro.",
      history1D: generateCandles(13.05, 12.56, 28, 0.20)
    },
    {
      ticker: "CPLS3",
      name: "Copel ON",
      company: "Companhia Paranaense de Energia",
      sector: "Utilidade Pública / Energia",
      price: 8.76,
      change: 1.16,
      changeAbs: 0.10,
      high: 8.85,
      low: 8.65,
      volume: "18,9M",
      volumeVal: 18900000,
      trades: "14,3k",
      marketCap: "24,5 B",
      pe: 7.9,
      pvp: 1.08,
      dy: 8.4,
      roe: 14.1,
      isFavorite: false,
      logoColor: "#006837",
      logoBadge: "CP",
      summary: "Empresa de geração, transmissão, distribuição e comercialização de energia elétrica.",
      history1D: generateCandles(8.66, 8.76, 28, 0.08)
    },
    {
      ticker: "RENT3",
      name: "Localiza ON",
      company: "Localiza Rent a Car S.A.",
      sector: "Consumo Cíclico / Aluguel de Carros",
      price: 43.10,
      change: -1.75,
      changeAbs: -0.77,
      high: 44.20,
      low: 42.80,
      volume: "29,6M",
      volumeVal: 29600000,
      trades: "22,5k",
      marketCap: "45,8 B",
      pe: 14.2,
      pvp: 1.85,
      dy: 3.1,
      roe: 13.8,
      isFavorite: false,
      logoColor: "#00833E",
      logoBadge: "LC",
      summary: "Maior locadora de frotas e automóveis da América Latina, integrada à Seminovos.",
      history1D: generateCandles(43.85, 43.10, 28, 0.35)
    },
    {
      ticker: "ABEV3",
      name: "Ambev ON",
      company: "Ambev S.A.",
      sector: "Consumo Não Cíclico / Bebidas",
      price: 12.85,
      change: 0.39,
      changeAbs: 0.05,
      high: 12.98,
      low: 12.75,
      volume: "38,2M",
      volumeVal: 38200000,
      trades: "25,1k",
      marketCap: "202,3 B",
      pe: 13.5,
      pvp: 2.15,
      dy: 6.2,
      roe: 16.5,
      isFavorite: false,
      logoColor: "#003A70",
      logoBadge: "AB",
      summary: "Líder cervejeira e de refrigerantes nas Américas, subsidiária da multinacional AB InBev.",
      history1D: generateCandles(12.80, 12.85, 28, 0.10)
    },
    {
      ticker: "PRIO3",
      name: "PRIO ON",
      company: "PRIO S.A.",
      sector: "Petróleo e Gás",
      price: 44.20,
      change: -1.90,
      changeAbs: -0.85,
      high: 45.40,
      low: 43.90,
      volume: "52,1M",
      volumeVal: 52100000,
      trades: "33,8k",
      marketCap: "39,1 B",
      pe: 6.8,
      pvp: 2.20,
      dy: 0.0,
      roe: 35.1,
      isFavorite: false,
      logoColor: "#F47920",
      logoBadge: "PR",
      summary: "Maior petroleira independente do Brasil especializada em campos maduros em águas profundas.",
      history1D: generateCandles(45.10, 44.20, 28, 0.40)
    },
    {
      ticker: "SUZB3",
      name: "Suzano ON",
      company: "Suzano S.A.",
      sector: "Materiais Básicos / Papel e Celulose",
      price: 54.80,
      change: 1.48,
      changeAbs: 0.80,
      high: 55.20,
      low: 53.90,
      volume: "31,4M",
      volumeVal: 31400000,
      trades: "19,8k",
      marketCap: "72,4 B",
      pe: 8.1,
      pvp: 1.65,
      dy: 3.5,
      roe: 22.0,
      isFavorite: false,
      logoColor: "#008542",
      logoBadge: "SZ",
      summary: "Maior produtora global de celulose de eucalipto e líder na fabricação de papéis sustentáveis.",
      history1D: generateCandles(54.00, 54.80, 28, 0.35)
    }
  ];

  // ETFs da B3
  const etfs = [
    {
      ticker: "BOVA11",
      name: "iShares Ibovespa Fundo de Índice",
      manager: "BlackRock Brasil",
      benchmark: "Índice Bovespa (IBOV)",
      price: 124.10,
      change: 1.35,
      fee: "0,10% a.a.",
      volume: "245,8M",
      trades: "18,2k",
      shares: "125M",
      description: "Replica fielmente o desempenho ponderado das principais ações negociadas na B3."
    },
    {
      ticker: "IVVB11",
      name: "iShares S&P 500 Fundo de Índice",
      manager: "BlackRock Brasil",
      benchmark: "S&P 500 (Convertido em R$)",
      price: 342.80,
      change: 0.82,
      fee: "0,23% a.a.",
      volume: "112,5M",
      trades: "14,5k",
      shares: "45M",
      description: "Exposição direta em reais às 500 maiores corporações listadas nos EUA."
    },
    {
      ticker: "SMAL11",
      name: "iShares Small Cap Fundo de Índice",
      manager: "BlackRock Brasil",
      benchmark: "Índice Small Cap (SMLL)",
      price: 98.45,
      change: 2.14,
      fee: "0,50% a.a.",
      volume: "34,2M",
      trades: "8,9k",
      shares: "32M",
      description: "Acompanha empresas de média e baixa capitalização com alto potencial de crescimento."
    },
    {
      ticker: "HASH11",
      name: "Hashdex Nasdaq Crypto Index ETF",
      manager: "Hashdex",
      benchmark: "Nasdaq Crypto Index (NCI)",
      price: 68.90,
      change: 3.12,
      fee: "0,30% a.a.",
      volume: "48,1M",
      trades: "12,1k",
      shares: "58M",
      description: "Cesta regulada e institucional dos principais criptoativos do mercado mundial."
    },
    {
      ticker: "GOLD11",
      name: "Trend ETF LBMA Ouro Fundo de Índice",
      manager: "XP Vista Asset",
      benchmark: "LBMA Gold Price",
      price: 14.85,
      change: -0.45,
      fee: "0,30% a.a.",
      volume: "15,6M",
      trades: "5,4k",
      shares: "85M",
      description: "Investimento em ouro físico em dólar com proteção de patrimônio."
    },
    {
      ticker: "DIVO11",
      name: "It Now IDIV Fundo de Índice",
      manager: "Itaú Asset Management",
      benchmark: "Índice Dividendos (IDIV)",
      price: 92.30,
      change: 1.05,
      fee: "0,50% a.a.",
      volume: "21,8M",
      trades: "6,8k",
      shares: "18M",
      description: "Carteira focada nas melhores pagadoras de proventos e dividendos da bolsa."
    }
  ];

  // Fundos Imobiliários (FIIs)
  const fiis = [
    {
      ticker: "MXRF11",
      name: "Maxi Renda FII",
      category: "Papel / CRIs",
      price: 10.45,
      change: 0.38,
      dy12m: 12.8,
      lastDividend: "R$ 0,10",
      pvp: 1.01,
      liquidity: "R$ 11,2M/dia",
      shareholders: "1.080.000",
      description: "Maior fundo imobiliário em número de cotistas do Brasil, focado em crédito imobiliário."
    },
    {
      ticker: "HGLG11",
      name: "CSHG Logística FII",
      category: "Tijolo / Logística",
      price: 164.20,
      change: 0.72,
      dy12m: 8.9,
      lastDividend: "R$ 1,10",
      pvp: 1.03,
      liquidity: "R$ 8,5M/dia",
      shareholders: "395.000",
      description: "Galpões logísticos de alto padrão (Classe A+) em eixos rodoviários estratégicos."
    },
    {
      ticker: "KNIP11",
      name: "Kinea Rendimentos Imobiliários",
      category: "Papel / IPCA",
      price: 94.60,
      change: 0.45,
      dy12m: 11.4,
      lastDividend: "R$ 0,85",
      pvp: 0.98,
      liquidity: "R$ 7,1M/dia",
      shareholders: "142.000",
      description: "Fundo com carteira substancial de Certificados de Recebíveis Imobiliários indexados à inflação."
    },
    {
      ticker: "XPML11",
      name: "XP Malls FII",
      category: "Tijolo / Shoppings",
      price: 106.30,
      change: 0.95,
      dy12m: 9.1,
      lastDividend: "R$ 0,92",
      pvp: 0.96,
      liquidity: "R$ 9,8M/dia",
      shareholders: "450.000",
      description: "Portfólio diversificado de shopping centers consolidados nas principais capitais."
    },
    {
      ticker: "BTLG11",
      name: "BTG Pactual Logística FII",
      category: "Tijolo / Logística",
      price: 101.50,
      change: 0.29,
      dy12m: 9.3,
      lastDividend: "R$ 0,78",
      pvp: 0.99,
      liquidity: "R$ 6,4M/dia",
      shareholders: "310.000",
      description: "Condomínios industriais e centros de distribuição com inquilinos multinacionais."
    },
    {
      ticker: "VISC11",
      name: "Vinci Shopping Centers FII",
      category: "Tijolo / Shoppings",
      price: 117.80,
      change: 0.55,
      dy12m: 8.8,
      lastDividend: "R$ 0,88",
      pvp: 0.95,
      liquidity: "R$ 5,2M/dia",
      shareholders: "285.000",
      description: "Participação em shoppings regionais com alta dominância e fluxo resiliente."
    }
  ];

  // Renda Fixa Demonstrativa
  const fixedIncome = [
    {
      id: "ts-2029",
      title: "Tesouro Selic 2029",
      issuer: "Tesouro Nacional",
      type: "Público Federal",
      rate: "Selic + 0,145% a.a.",
      maturity: "01/03/2029",
      minInvestment: "R$ 152,40",
      liquidity: "D+0 (Resgate Diário)",
      risk: "Muito Baixo",
      riskLevel: 1,
      isTaxExempt: false,
      badge: "Tesouro Direto"
    },
    {
      id: "tipca-2035",
      title: "Tesouro IPCA+ 2035",
      issuer: "Tesouro Nacional",
      type: "Público Federal",
      rate: "IPCA + 6,42% a.a.",
      maturity: "15/05/2035",
      minInvestment: "R$ 41,80",
      liquidity: "D+1 (Vencimento)",
      risk: "Baixo",
      riskLevel: 2,
      isTaxExempt: false,
      badge: "Tesouro Direto"
    },
    {
      id: "tpref-2029",
      title: "Tesouro Prefixado 2029",
      issuer: "Tesouro Nacional",
      type: "Público Federal",
      rate: "12,18% a.a.",
      maturity: "01/01/2029",
      minInvestment: "R$ 38,50",
      liquidity: "D+1 (Vencimento)",
      risk: "Baixo",
      riskLevel: 2,
      isTaxExempt: false,
      badge: "Tesouro Direto"
    },
    {
      id: "cdb-master-122",
      title: "CDB Banco Master",
      issuer: "Banco Master S.A.",
      type: "Bancário / Privado",
      rate: "122% do CDI",
      maturity: "24/10/2027",
      minInvestment: "R$ 1.000,00",
      liquidity: "No Vencimento",
      risk: "Médio (Garantia FGC)",
      riskLevel: 3,
      isTaxExempt: false,
      badge: "CDB"
    },
    {
      id: "cdb-diario-102",
      title: "CDB Liquidez Diária C6 Bank",
      issuer: "Banco C6 S.A.",
      type: "Bancário / Privado",
      rate: "102% do CDI",
      maturity: "20/10/2026",
      minInvestment: "R$ 50,00",
      liquidity: "Diária (Imediata)",
      risk: "Muito Baixo (FGC)",
      riskLevel: 1,
      isTaxExempt: false,
      badge: "CDB"
    },
    {
      id: "lci-caixa-94",
      title: "LCI Imobiliária Caixa",
      issuer: "Caixa Econômica Federal",
      type: "Crédito Imobiliário",
      rate: "94% do CDI",
      maturity: "15/08/2026",
      minInvestment: "R$ 500,00",
      liquidity: "No Vencimento (após 9 meses)",
      risk: "Baixo (Isento IR + FGC)",
      riskLevel: 2,
      isTaxExempt: true,
      badge: "LCI - Isento IR"
    },
    {
      id: "lca-bb-93",
      title: "LCA Agronegócio Banco do Brasil",
      issuer: "Banco do Brasil S.A.",
      type: "Agronegócio",
      rate: "93,5% do CDI",
      maturity: "10/11/2026",
      minInvestment: "R$ 1.000,00",
      liquidity: "No Vencimento (após 9 meses)",
      risk: "Baixo (Isento IR + FGC)",
      riskLevel: 2,
      isTaxExempt: true,
      badge: "LCA - Isento IR"
    }
  ];

  // Carteira do Usuário (Demonstração)
  let userPortfolio = {
    totalValue: 12548.32,
    totalProfitLoss: 337.40,
    totalProfitLossPercent: 2.76,
    availableBalance: 1250.00,
    openPositionsValue: 0.00,
    allocation: {
      stocks: { label: "Ações", percentage: 62.4, color: "#0066FF", value: 7830.15 },
      fiis: { label: "FIIs", percentage: 18.7, color: "#00C2FF", value: 2346.53 },
      etfs: { label: "ETFs", percentage: 8.9, color: "#00E396", value: 1116.80 },
      fixedIncome: { label: "Renda Fixa", percentage: 9.9, color: "#94A3B8", value: 1254.84 }
    },
    positions: [
      {
        ticker: "PETR4",
        name: "Petrobras PN",
        quantity: 50,
        avgPrice: 28.45,
        currentPrice: 32.18,
        change: 4.21,
        totalValue: 1609.00,
        totalCost: 1422.50,
        profitAbs: 186.50,
        profitPercent: 13.11,
        type: "Ações"
      },
      {
        ticker: "VALE3",
        name: "Vale ON",
        quantity: 30,
        avgPrice: 62.30,
        currentPrice: 67.34,
        change: 3.76,
        totalValue: 2020.20,
        totalCost: 1869.00,
        profitAbs: 151.20,
        profitPercent: 8.09,
        type: "Ações"
      },
      {
        ticker: "ITUB4",
        name: "Itaú Unibanco PN",
        quantity: 20,
        avgPrice: 34.12,
        currentPrice: 36.87,
        change: 3.45,
        totalValue: 737.40,
        totalCost: 682.40,
        profitAbs: 55.00,
        profitPercent: 8.06,
        type: "Ações"
      },
      {
        ticker: "WEGE3",
        name: "WEG ON",
        quantity: 15,
        avgPrice: 36.90,
        currentPrice: 39.12,
        change: 3.28,
        totalValue: 586.80,
        totalCost: 553.50,
        profitAbs: 33.30,
        profitPercent: 6.02,
        type: "Ações"
      },
      {
        ticker: "MXRF11",
        name: "Maxi Renda FII",
        quantity: 120,
        avgPrice: 10.15,
        currentPrice: 10.45,
        change: 0.38,
        totalValue: 1254.00,
        totalCost: 1218.00,
        profitAbs: 36.00,
        profitPercent: 2.95,
        type: "FIIs"
      },
      {
        ticker: "BOVA11",
        name: "iShares Ibovespa ETF",
        quantity: 9,
        avgPrice: 118.50,
        currentPrice: 124.10,
        change: 1.35,
        totalValue: 1116.90,
        totalCost: 1066.50,
        profitAbs: 50.40,
        profitPercent: 4.73,
        type: "ETFs"
      },
      {
        ticker: "TS-2029",
        name: "Tesouro Selic 2029",
        quantity: 1,
        avgPrice: 1200.00,
        currentPrice: 1254.84,
        change: 0.12,
        totalValue: 1254.84,
        totalCost: 1200.00,
        profitAbs: 54.84,
        profitPercent: 4.57,
        type: "Renda Fixa"
      }
    ],
    orders: [
      {
        id: "ORD-9421",
        date: "27/10/2026 10:14",
        ticker: "PETR4",
        type: "Compra",
        orderType: "A mercado",
        quantity: 50,
        price: 32.18,
        total: 1609.00,
        status: "Executada"
      },
      {
        id: "ORD-8874",
        date: "25/10/2026 14:32",
        ticker: "VALE3",
        type: "Compra",
        orderType: "Limitada",
        quantity: 30,
        price: 62.30,
        total: 1869.00,
        status: "Executada"
      },
      {
        id: "ORD-7612",
        date: "21/10/2026 11:05",
        ticker: "MXRF11",
        type: "Compra",
        orderType: "A mercado",
        quantity: 120,
        price: 10.15,
        total: 1218.00,
        status: "Executada"
      }
    ],
    historyPerformance: {
      "1M": [
        { date: "01/10", value: 11980, percent: 0.0 },
        { date: "07/10", value: 12120, percent: 1.17 },
        { date: "14/10", value: 12290, percent: 2.58 },
        { date: "21/10", value: 12410, percent: 3.58 },
        { date: "28/10", value: 12548, percent: 4.83 }
      ],
      "3M": [
        { date: "Ago", value: 11350, percent: 0.0 },
        { date: "Set", value: 11840, percent: 4.31 },
        { date: "Out", value: 12548, percent: 10.55 }
      ],
      "6M": [
        { date: "Mai", value: 10700, percent: 0.0 },
        { date: "Jul", value: 11200, percent: 4.67 },
        { date: "Set", value: 11900, percent: 11.21 },
        { date: "Out", value: 12548, percent: 17.27 }
      ],
      "1A": [
        { date: "Out/25", value: 9800, percent: 0.0 },
        { date: "Jan/26", value: 10450, percent: 6.63 },
        { date: "Abr/26", value: 11100, percent: 13.26 },
        { date: "Jul/26", value: 11800, percent: 20.40 },
        { date: "Out/26", value: 12548, percent: 28.04 }
      ]
    }
  };

  // Notícias Financeiras Demonstrativas
  const news = [
    {
      id: 1,
      time: "09:48",
      date: "Hoje",
      title: "Petrobras anuncia novo plano estratégico de investimentos para 2026-2030",
      summary: "Estatal planeja alocar capital prioritariamente na revitalização de campos maduros na Bacia de Campos e projetos de baixo carbono.",
      category: "Empresas",
      source: "Valor Econômico",
      readTime: "3 min"
    },
    {
      id: 2,
      time: "08:55",
      date: "Hoje",
      title: "Ibovespa opera em forte alta com dados de inflação dos EUA abaixo do esperado",
      summary: "Índice de preços ao consumidor norte-americano impulsiona apetite a risco nos mercados emergentes com alívio nas taxas de juros globais.",
      category: "Macroeconomia",
      source: "CNN Brasil",
      readTime: "4 min"
    },
    {
      id: 3,
      time: "08:30",
      date: "Hoje",
      title: "Dólar comercial abre em queda e recua para R$ 5,32 com fluxo cambial positivo",
      summary: "Entrada de recursos estrangeiros para a renda variável e balança comercial recorde sustentam a valorização do real na B3.",
      category: "Câmbio",
      source: "Estadão",
      readTime: "2 min"
    },
    {
      id: 4,
      time: "07:45",
      date: "Hoje",
      title: "B3 divulga prévia dos novos índices setoriais com foco em infraestrutura e FIIs",
      summary: "A bolsa brasileira amplia a oferta de índices de referência temáticos atendendo à demanda crescente de gestoras e investidores individuais.",
      category: "Mercados",
      source: "InfoMoney",
      readTime: "3 min"
    },
    {
      id: 5,
      time: "Ontem",
      date: "26/10",
      title: "Vale consolida liderança na produção de níquel verde voltado à transição energética",
      summary: "Demanda do setor automobilístico europeu impulsiona contratos de longo prazo com prêmio socioambiental para as minas brasileiras.",
      category: "Commodities",
      source: "Exame",
      readTime: "5 min"
    }
  ];

  // Dados do Usuário
  const userProfile = {
    name: "Matheus Penicwh",
    role: "Cliente Premium",
    status: "Verificada",
    cpf: "***.123.456-**",
    email: "matheuspeniche674@gmail.com",
    bank: "Banco Itaú (341)",
    agency: "1234",
    account: "56789-0",
    pixKey: "matheuspeniche674@gmail.com",
    theme: "dark"
  };

  // Helper para gerar candlesticks realistas
  function generateCandles(baseOpen, finalClose, count, volatility) {
    const candles = [];
    let currentOpen = baseOpen;
    const timeLabels = ["10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45", "12:00", "12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "15:45", "16:00", "16:15", "16:30", "17:00"];

    for (let i = 0; i < count; i++) {
      const step = (finalClose - baseOpen) / count;
      const noise = (Math.sin(i * 0.7) + (Math.random() - 0.45) * 1.5) * volatility;
      const open = Number((currentOpen).toFixed(2));
      let close = Number((open + step * 0.8 + noise).toFixed(2));
      if (i === count - 1) close = finalClose;

      const high = Number((Math.max(open, close) + Math.random() * volatility * 1.2).toFixed(2));
      const low = Number((Math.min(open, close) - Math.random() * volatility * 1.2).toFixed(2));
      const volume = Math.floor(250000 + Math.random() * 650000 + (Math.abs(close - open) * 500000));
      const time = timeLabels[i % timeLabels.length];

      candles.push({
        time,
        open,
        high,
        low,
        close,
        volume,
        isBullish: close >= open
      });
      currentOpen = close;
    }
    return candles;
  }

  // Gera dados históricos para períodos diferentes
  function getStockHistory(ticker, period) {
    const stock = stocks.find(s => s.ticker === ticker) || stocks[0];
    const basePrice = stock.price;

    let pointsCount = 28;
    let vol = 0.25;
    let factor = 0.05;

    switch (period) {
      case "1D":
        return stock.history1D;
      case "1S":
        pointsCount = 25;
        vol = 0.45;
        factor = 0.08;
        break;
      case "1M":
        pointsCount = 30;
        vol = 0.80;
        factor = 0.12;
        break;
      case "3M":
        pointsCount = 35;
        vol = 1.20;
        factor = 0.18;
        break;
      case "6M":
        pointsCount = 40;
        vol = 1.60;
        factor = 0.25;
        break;
      case "1A":
        pointsCount = 50;
        vol = 2.20;
        factor = 0.35;
        break;
      case "5A":
        pointsCount = 60;
        vol = 3.50;
        factor = 0.55;
        break;
      default:
        return stock.history1D;
    }

    const startPrice = Number((basePrice * (1 - factor)).toFixed(2));
    return generateCandles(startPrice, basePrice, pointsCount, vol);
  }

  // Simulação de Ordem de Compra / Venda
  function executeOrder({ ticker, type, quantity, orderType }) {
    const target = stocks.find(s => s.ticker === ticker) ||
                   etfs.find(e => e.ticker === ticker) ||
                   fiis.find(f => f.ticker === ticker);
    if (!target) return { success: false, message: "Ativo não encontrado" };

    const price = target.price;
    const total = Number((price * quantity).toFixed(2));

    if (type === "Compra" && userPortfolio.availableBalance < total) {
      return {
        success: false,
        message: `Saldo insuficiente. Saldo disponível: R$ ${userPortfolio.availableBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}. Valor total da ordem: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`
      };
    }

    const now = new Date();
    const dateFormatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: dateFormatted,
      ticker,
      type,
      orderType: orderType || "A mercado",
      quantity,
      price,
      total,
      status: "Executada"
    };

    userPortfolio.orders.unshift(newOrder);

    // Atualiza saldo e posições
    if (type === "Compra") {
      userPortfolio.availableBalance -= total;
      const existingPos = userPortfolio.positions.find(p => p.ticker === ticker);
      if (existingPos) {
        const totalQty = existingPos.quantity + quantity;
        const totalCost = existingPos.totalCost + total;
        existingPos.avgPrice = Number((totalCost / totalQty).toFixed(2));
        existingPos.quantity = totalQty;
        existingPos.totalCost = totalCost;
        existingPos.totalValue = Number((existingPos.quantity * price).toFixed(2));
        existingPos.profitAbs = Number((existingPos.totalValue - totalCost).toFixed(2));
        existingPos.profitPercent = Number(((existingPos.profitAbs / totalCost) * 100).toFixed(2));
      } else {
        userPortfolio.positions.push({
          ticker,
          name: target.name || target.company,
          quantity,
          avgPrice: price,
          currentPrice: price,
          change: target.change,
          totalValue: total,
          totalCost: total,
          profitAbs: 0,
          profitPercent: 0,
          type: target.category ? "FIIs" : (target.fee ? "ETFs" : "Ações")
        });
      }
    } else {
      // Venda
      const existingPos = userPortfolio.positions.find(p => p.ticker === ticker);
      if (!existingPos || existingPos.quantity < quantity) {
        return { success: false, message: "Você não possui quantidade suficiente deste ativo para venda." };
      }
      userPortfolio.availableBalance += total;
      existingPos.quantity -= quantity;
      if (existingPos.quantity <= 0) {
        userPortfolio.positions = userPortfolio.positions.filter(p => p.ticker !== ticker);
      } else {
        existingPos.totalValue = Number((existingPos.quantity * price).toFixed(2));
      }
    }

    // Recalcular valor total da carteira
    const positionsSum = userPortfolio.positions.reduce((acc, curr) => acc + curr.totalValue, 0);
    userPortfolio.totalValue = Number((positionsSum + userPortfolio.availableBalance).toFixed(2));

    return {
      success: true,
      message: `Ordem de ${type} para ${quantity}x ${ticker} a R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} executada com sucesso!`,
      order: newOrder
    };
  }

  // Toggle Favorito
  function toggleFavorite(ticker) {
    const stock = stocks.find(s => s.ticker === ticker);
    if (stock) {
      stock.isFavorite = !stock.isFavorite;
      return stock.isFavorite;
    }
    return false;
  }

  // Integração com Cotações Oficiais da B3
  let isLiveOfficial = false;
  let lastSyncTimestamp = null;

  async function syncLiveB3Quotes() {
    try {
      const res = await fetch('/api/b3/quotes');
      if (!res.ok) throw new Error('Falha HTTP ao consultar /api/b3/quotes');
      const data = await res.json();
      if (!data.success || !Array.isArray(data.quotes)) throw new Error('Dados inválidos');

      const liveQuotes = data.quotes;

      // Atualiza ações
      stocks.forEach(stock => {
        const found = liveQuotes.find(q => q.ticker === stock.ticker);
        if (found) {
          stock.price = found.price;
          stock.change = found.change;
          stock.changeAbs = found.changeAbs;
          stock.high = found.high;
          stock.low = found.low;
          stock.volume = found.volume;
          stock.volumeVal = found.volumeVal;
          stock.isOfficial = true;
          stock.lastUpdated = found.lastUpdated;
        }
      });

      // Atualiza índices de mercado
      marketIndices.forEach(idx => {
        const found = liveQuotes.find(q => q.ticker === idx.ticker);
        if (found) {
          idx.value = found.price;
          idx.displayValue = found.price >= 1000 
            ? found.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : (idx.category === 'moedas' ? 'R$ ' + found.price.toFixed(2) : String(found.price.toFixed(2)));
          idx.change = found.change;
          idx.changeFormatted = (found.change >= 0 ? '+' : '') + found.change.toFixed(2) + '%';
          idx.isPositive = found.change >= 0;
          idx.isOfficial = true;
        }
      });

      // Atualiza ETFs
      etfs.forEach(etf => {
        const found = liveQuotes.find(q => q.ticker === etf.ticker);
        if (found) {
          etf.price = found.price;
          etf.change = found.change;
          etf.volume = found.volume;
          etf.isOfficial = true;
        }
      });

      // Atualiza FIIs
      fiis.forEach(fii => {
        const found = liveQuotes.find(q => q.ticker === fii.ticker);
        if (found) {
          fii.price = found.price;
          fii.change = found.change;
          fii.isOfficial = true;
        }
      });

      // Atualiza posições da carteira com os novos preços reais
      userPortfolio.positions.forEach(pos => {
        const target = stocks.find(s => s.ticker === pos.ticker) ||
                       etfs.find(e => e.ticker === pos.ticker) ||
                       fiis.find(f => f.ticker === pos.ticker);
        if (target) {
          pos.currentPrice = target.price;
          pos.change = target.change;
          pos.totalValue = Number((pos.quantity * target.price).toFixed(2));
          pos.profitAbs = Number((pos.totalValue - pos.totalCost).toFixed(2));
          pos.profitPercent = Number(((pos.profitAbs / pos.totalCost) * 100).toFixed(2));
        }
      });

      // Recalcula totais da carteira
      const positionsSum = userPortfolio.positions.reduce((acc, curr) => acc + curr.totalValue, 0);
      userPortfolio.totalValue = Number((positionsSum + userPortfolio.availableBalance).toFixed(2));

      isLiveOfficial = true;
      lastSyncTimestamp = new Date();

      return {
        success: true,
        count: liveQuotes.length,
        timestamp: lastSyncTimestamp,
        source: 'B3 Oficial'
      };
    } catch (err) {
      console.warn('Conexão ao endpoint B3 offline ou indisponível; usando cotações locais:', err);
      return { success: false, error: err.message };
    }
  }

  async function fetchOfficialHistory(ticker, period) {
    let range = '1mo';
    let interval = '1d';

    switch (period) {
      case '1D': range = '1d'; interval = '15m'; break;
      case '1S': range = '5d'; interval = '30m'; break;
      case '1M': range = '1mo'; interval = '1d'; break;
      case '3M': range = '3mo'; interval = '1d'; break;
      case '6M': range = '6mo'; interval = '1d'; break;
      case '1A': range = '1y'; interval = '1wk'; break;
      case '5A': range = '5y'; interval = '1mo'; break;
    }

    try {
      const res = await fetch(`/api/b3/history/${ticker}?range=${range}&interval=${interval}`);
      if (!res.ok) throw new Error('Histórico indisponível');
      const data = await res.json();
      if (data.success && Array.isArray(data.candles) && data.candles.length > 0) {
        return data.candles;
      }
    } catch (e) {
      // Fallback silencioso
    }

    return getStockHistory(ticker, period);
  }

  // Exportação de API pública
  return {
    DEMO_NOTICE,
    getIndices: () => marketIndices,
    getStocks: () => stocks,
    getEtfs: () => etfs,
    getFiis: () => fiis,
    getFixedIncome: () => fixedIncome,
    getPortfolio: () => userPortfolio,
    getNews: () => news,
    getUserProfile: () => userProfile,
    getStockHistory,
    fetchOfficialHistory,
    syncLiveB3Quotes,
    isLiveOfficial: () => isLiveOfficial,
    getLastSyncTime: () => lastSyncTimestamp,
    executeOrder,
    toggleFavorite
  };
})();

// Suporte para exportação ES Module se necessário em bundlers
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TwoByData;
}
