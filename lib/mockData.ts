export enum AssetType {
  STOCK = 'Stock',
  ETF = 'ETF',
  CRYPTO = 'Crypto',
  INDEX = 'Index',
  COMMODITY = 'Commodity'
}

export interface MarketIndex {
  id: string;
  name: string;
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
  assetType: AssetType.INDEX | AssetType.CRYPTO | AssetType.COMMODITY;
  updatedAt: Date;
}

export interface FundamentalDatapoint {
    period: string; // e.g., "Q1 2024", "2023"
    revenue: number;
    grossProfit?: number;
    operatingIncome?: number;
    netIncome: number;
    eps: number;
    sharesOutstanding?: number;
    freeCashFlow: number;
    operatingMargin: number;
    // Balance Sheet Metrics
    totalAssets?: number;
    totalLiabilities?: number;
    totalEquity?: number;
    totalDebt?: number;
    cashAndShortTermInvestments?: number;
    currentAssets?: number;
    currentLiabilities?: number;
    // Cash Flow Metrics
    operatingCashFlow?: number;
    investingCashFlow?: number;
    financingCashFlow?: number;
    capitalExpenditures?: number;
    // Financial Ratios
    currentRatio?: number;
    quickRatio?: number;
    debtToEquity?: number;
    returnOnEquity?: number;
    returnOnAssets?: number;
    assetTurnover?: number;
}

export interface EstimateDatapoint {
    period: string;
    actual: number;
    estimate: number;
    difference: number;
    percentDiff: number;
    numAnalysts: number;
}

export interface StockData {
    ticker: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    marketCap: string;
    peRatio: number;
    sector: string;
    description: string;
    // Watchlist fields
    assetType: AssetType;
    isInWatchlist: boolean;
    addedAt?: Date;
    category?: string;
    exchange?: string;
    ytdChangePercent: number; // Year-to-date change percentage
    // New detailed metrics
    yields: {
        earningsYield: number;
        cashFlowYield: number;
        freeCashFlowYield: number;
        dividendYield: number | null; // N/A
        payoutRatio: number | null; // N/A
    };
    balances: {
        totalCash: string;
        totalDebt: string;
        netCashPosition: string;
    };
    margins: {
        grossMargin: number;
        operatingMargin: number;
        netIncomeMargin: number;
    };
    history: { time: string; price: number }[];
    fundamentals: {
        quarterly: FundamentalDatapoint[];
        annual: FundamentalDatapoint[];
    };
    estimates: {
        eps: EstimateDatapoint[];
        revenue: EstimateDatapoint[];
    };
}

const generateHistory = (basePrice: number, count: number) => {
    let price = basePrice;
    return Array.from({ length: count }, (_, i) => {
        const change = (Math.random() - 0.5) * 5;
        price += change;
        return {
            time: `${10 + Math.floor(i / 12)}:${((i % 12) * 5).toString().padStart(2, '0')}`.padStart(5, '0'),
            price: parseFloat(price.toFixed(2)),
        };
    });
};

const generateFundamentals = (startYear: number = 2015, years: number = 10, baseRevenue: number = 383, growthRate: number = 0.05) => {
    const annual: FundamentalDatapoint[] = [];
    const quarterly: FundamentalDatapoint[] = [];

    for (let i = 0; i < years; i++) {
        const year = startYear + i;
        const revenue = baseRevenue * Math.pow(1 + growthRate, i) * (0.9 + Math.random() * 0.2);
        const grossProfit = revenue * (0.38 + Math.random() * 0.1); // 38-48% gross margin
        const operatingIncome = revenue * (0.25 + Math.random() * 0.05); // 25-30% operating margin
        const netIncome = revenue * (0.2 + Math.random() * 0.05);
        const operatingMargin = 25 + Math.random() * 5;
        const freeCashFlow = netIncome * (0.8 + Math.random() * 0.4);
        const sharesOutstanding = 15.5 + (Math.random() - 0.5) * 1; // 15-16B shares

        // Balance Sheet Generation
        const totalAssets = revenue * 0.8;
        const totalLiabilities = totalAssets * 0.6;
        const totalEquity = totalAssets - totalLiabilities; // Assets = Liabilities + Equity
        const totalDebt = totalLiabilities * 0.4;
        const cashAndShortTermInvestments = totalAssets * 0.15;
        const currentAssets = totalAssets * 0.3;
        const currentLiabilities = totalLiabilities * 0.4;

        // Cash Flow Generation
        const operatingCashFlow = netIncome * (1.1 + Math.random() * 0.2); // 110-130% of net income
        const capitalExpenditures = revenue * (0.08 + Math.random() * 0.04); // 8-12% of revenue
        const investingCashFlow = -capitalExpenditures - (revenue * 0.02); // CapEx + other investments (negative)
        const financingCashFlow = revenue * (-0.05 + Math.random() * 0.1); // Can be positive or negative

        // Financial Ratios
        const currentRatio = currentAssets / currentLiabilities; // Liquidity ratio
        const quickRatio = (currentAssets * 0.7) / currentLiabilities; // Approximate (excluding inventory)
        const debtToEquity = totalDebt / totalEquity; // Leverage ratio
        const returnOnEquity = (netIncome / totalEquity) * 100; // Profitability %
        const returnOnAssets = (netIncome / totalAssets) * 100; // Profitability %
        const assetTurnover = revenue / totalAssets; // Efficiency ratio

        annual.push({
            period: year.toString(),
            revenue: parseFloat(revenue.toFixed(2)),
            grossProfit: parseFloat(grossProfit.toFixed(2)),
            operatingIncome: parseFloat(operatingIncome.toFixed(2)),
            netIncome: parseFloat(netIncome.toFixed(2)),
            eps: parseFloat((netIncome / sharesOutstanding).toFixed(2)),
            sharesOutstanding: parseFloat(sharesOutstanding.toFixed(2)),
            freeCashFlow: parseFloat(freeCashFlow.toFixed(2)),
            operatingMargin: parseFloat(operatingMargin.toFixed(2)),
            totalAssets: parseFloat(totalAssets.toFixed(2)),
            totalLiabilities: parseFloat(totalLiabilities.toFixed(2)),
            totalEquity: parseFloat(totalEquity.toFixed(2)),
            totalDebt: parseFloat(totalDebt.toFixed(2)),
            cashAndShortTermInvestments: parseFloat(cashAndShortTermInvestments.toFixed(2)),
            currentAssets: parseFloat(currentAssets.toFixed(2)),
            currentLiabilities: parseFloat(currentLiabilities.toFixed(2)),
            operatingCashFlow: parseFloat(operatingCashFlow.toFixed(2)),
            investingCashFlow: parseFloat(investingCashFlow.toFixed(2)),
            financingCashFlow: parseFloat(financingCashFlow.toFixed(2)),
            capitalExpenditures: parseFloat(capitalExpenditures.toFixed(2)),
            currentRatio: parseFloat(currentRatio.toFixed(2)),
            quickRatio: parseFloat(quickRatio.toFixed(2)),
            debtToEquity: parseFloat(debtToEquity.toFixed(2)),
            returnOnEquity: parseFloat(returnOnEquity.toFixed(2)),
            returnOnAssets: parseFloat(returnOnAssets.toFixed(2)),
            assetTurnover: parseFloat(assetTurnover.toFixed(2)),
        });
    }

    // Generate last 8 quarters
    for (let i = 0; i < 8; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() - (i * 3));
        const quarter = Math.floor((date.getMonth() + 3) / 3);
        const year = date.getFullYear();
        const period = `${year} Q${quarter}`;

        const revenue = (baseRevenue * Math.pow(1 + growthRate, years) / 4) * (0.9 + Math.random() * 0.2);
        const netIncome = revenue * (0.2 + Math.random() * 0.05);
        const operatingMargin = 25 + Math.random() * 5;
        const freeCashFlow = netIncome * (0.8 + Math.random() * 0.4);

        // Balance Sheet (Quarterly snapshot similar to annual logic)
        const totalAssets = revenue * 4 * 0.8;
        const totalLiabilities = totalAssets * 0.6;
        const totalDebt = totalLiabilities * 0.4;
        const cashAndShortTermInvestments = totalAssets * 0.15;
        const currentAssets = totalAssets * 0.3;
        const currentLiabilities = totalLiabilities * 0.4;

        // Cash Flow (Quarterly)
        const operatingCashFlow = netIncome * (1.1 + Math.random() * 0.2);
        const capitalExpenditures = revenue * (0.08 + Math.random() * 0.04);
        const investingCashFlow = -capitalExpenditures - (revenue * 0.02);
        const financingCashFlow = revenue * (-0.05 + Math.random() * 0.1);

        // Financial Ratios (Quarterly)
        const totalEquity = totalAssets - totalLiabilities;
        const currentRatio = currentAssets / currentLiabilities;
        const quickRatio = (currentAssets * 0.7) / currentLiabilities;
        const debtToEquity = totalDebt / totalEquity;
        const returnOnEquity = (netIncome / totalEquity) * 100;
        const returnOnAssets = (netIncome / totalAssets) * 100;
        const assetTurnover = (revenue * 4) / totalAssets; // Annualized for quarterly

        quarterly.push({
            period,
            revenue: parseFloat(revenue.toFixed(2)),
            netIncome: parseFloat(netIncome.toFixed(2)),
            eps: parseFloat((netIncome / 15.5).toFixed(2)),
            freeCashFlow: parseFloat(freeCashFlow.toFixed(2)),
            operatingMargin: parseFloat(operatingMargin.toFixed(2)),
            totalAssets: parseFloat(totalAssets.toFixed(2)),
            totalLiabilities: parseFloat(totalLiabilities.toFixed(2)),
            totalDebt: parseFloat(totalDebt.toFixed(2)),
            cashAndShortTermInvestments: parseFloat(cashAndShortTermInvestments.toFixed(2)),
            currentAssets: parseFloat(currentAssets.toFixed(2)),
            currentLiabilities: parseFloat(currentLiabilities.toFixed(2)),
            operatingCashFlow: parseFloat(operatingCashFlow.toFixed(2)),
            investingCashFlow: parseFloat(investingCashFlow.toFixed(2)),
            financingCashFlow: parseFloat(financingCashFlow.toFixed(2)),
            capitalExpenditures: parseFloat(capitalExpenditures.toFixed(2)),
            currentRatio: parseFloat(currentRatio.toFixed(2)),
            quickRatio: parseFloat(quickRatio.toFixed(2)),
            debtToEquity: parseFloat(debtToEquity.toFixed(2)),
            returnOnEquity: parseFloat(returnOnEquity.toFixed(2)),
            returnOnAssets: parseFloat(returnOnAssets.toFixed(2)),
            assetTurnover: parseFloat(assetTurnover.toFixed(2)),
        });
    }

    return { annual, quarterly };
};

const generateEstimates = (quarterlyData: FundamentalDatapoint[]) => {
    const epsEstimates: EstimateDatapoint[] = [];
    const revenueEstimates: EstimateDatapoint[] = [];

    // Generate estimates for last 8 quarters
    quarterlyData.forEach((quarter) => {
        // EPS estimates - sometimes beat, sometimes miss
        const epsEstimate = quarter.eps * (0.95 + Math.random() * 0.1); // Estimate within ±5%
        const epsDiff = quarter.eps - epsEstimate;
        const epsPercentDiff = ((epsDiff / epsEstimate) * 100);

        epsEstimates.push({
            period: quarter.period,
            actual: parseFloat(quarter.eps.toFixed(2)),
            estimate: parseFloat(epsEstimate.toFixed(2)),
            difference: parseFloat(epsDiff.toFixed(2)),
            percentDiff: parseFloat(epsPercentDiff.toFixed(2)),
            numAnalysts: Math.floor(15 + Math.random() * 20), // 15-35 analysts
        });

        // Revenue estimates - sometimes beat, sometimes miss
        const revenueEstimate = quarter.revenue * (0.97 + Math.random() * 0.06); // Estimate within ±3%
        const revDiff = quarter.revenue - revenueEstimate;
        const revPercentDiff = ((revDiff / revenueEstimate) * 100);

        revenueEstimates.push({
            period: quarter.period,
            actual: parseFloat(quarter.revenue.toFixed(2)),
            estimate: parseFloat(revenueEstimate.toFixed(2)),
            difference: parseFloat(revDiff.toFixed(2)),
            percentDiff: parseFloat(revPercentDiff.toFixed(2)),
            numAnalysts: Math.floor(12 + Math.random() * 18), // 12-30 analysts
        });
    });

    return { eps: epsEstimates, revenue: revenueEstimates };
};


export const MOCK_INDEXES: MarketIndex[] = [
    {
        id: 'SPX',
        name: 'S&P 500',
        symbol: 'SPX',
        value: 4783.83,
        change: 23.87,
        changePercent: 0.50,
        assetType: AssetType.INDEX,
        updatedAt: new Date()
    },
    {
        id: 'NDX',
        name: 'Nasdaq',
        symbol: 'NDX',
        value: 16825.93,
        change: -45.23,
        changePercent: -0.27,
        assetType: AssetType.INDEX,
        updatedAt: new Date()
    },
    {
        id: 'DJI',
        name: 'Dow Jones',
        symbol: 'DJI',
        value: 37545.33,
        change: 156.82,
        changePercent: 0.42,
        assetType: AssetType.INDEX,
        updatedAt: new Date()
    },
    {
        id: 'RUT',
        name: 'Russell 2000',
        symbol: 'IWM',
        value: 2063.24,
        change: 12.45,
        changePercent: 0.61,
        assetType: AssetType.INDEX,
        updatedAt: new Date()
    },
    {
        id: 'GOLD',
        name: 'Gold',
        symbol: 'GC=F',
        value: 2063.40,
        change: 15.80,
        changePercent: 0.77,
        assetType: AssetType.COMMODITY,
        updatedAt: new Date()
    },
    {
        id: 'SILVER',
        name: 'Silver',
        symbol: 'SI=F',
        value: 24.12,
        change: -0.18,
        changePercent: -0.74,
        assetType: AssetType.COMMODITY,
        updatedAt: new Date()
    },
    {
        id: 'BTCUSD',
        name: 'Bitcoin',
        symbol: 'BTC-USD',
        value: 42750.50,
        change: 1250.30,
        changePercent: 3.01,
        assetType: AssetType.CRYPTO,
        updatedAt: new Date()
    },
    {
        id: 'ETHUSD',
        name: 'Ethereum',
        symbol: 'ETH-USD',
        value: 2234.75,
        change: -67.25,
        changePercent: -2.92,
        assetType: AssetType.CRYPTO,
        updatedAt: new Date()
    }
];

export const MOCK_STOCKS: Record<string, StockData> = {
    AAPL: (() => {
        const fundamentals = generateFundamentals(2015, 10, 230, 0.08);
        return {
            ticker: 'AAPL',
            name: 'Apple Inc.',
            price: 192.53,
            change: 2.34,
            changePercent: 1.23,
            marketCap: '2.8T',
            peRatio: 28.5,
            description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories.',
            sector: 'Technology',
            assetType: AssetType.STOCK,
            isInWatchlist: true,
            addedAt: new Date('2026-01-01'),
            category: 'Technology',
            exchange: 'NASDAQ',
            ytdChangePercent: 28.5,
            history: generateHistory(180, 50),
            fundamentals,
            estimates: generateEstimates(fundamentals.quarterly),
            yields: {
                earningsYield: 3.12,
                cashFlowYield: 5.02,
                freeCashFlowYield: 4.55,
                dividendYield: null,
                payoutRatio: null
            },
            balances: {
                totalCash: '28.54B',
                totalDebt: '2.44B',
                netCashPosition: '26.11B'
            },
            margins: {
                grossMargin: 43.04,
                operatingMargin: 26.26,
                netIncomeMargin: 18.67
            }
        };
    })(),
    TSLA: (() => {
        const fundamentals = generateFundamentals(2015, 10, 40, 0.25);
        return {
            ticker: 'TSLA',
            name: 'Tesla, Inc.',
            price: 240.32,
            change: -3.50,
            changePercent: -1.44,
            marketCap: '750B',
            peRatio: 65.2,
            description: 'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems.',
            sector: 'Consumer Cyclical',
            assetType: AssetType.STOCK,
            isInWatchlist: true,
            addedAt: new Date('2025-12-15'),
            category: 'Consumer Cyclical',
            exchange: 'NASDAQ',
            ytdChangePercent: -15.2,
            history: generateHistory(220, 50),
            fundamentals,
            estimates: generateEstimates(fundamentals.quarterly),
            yields: {
                earningsYield: 1.5,
                cashFlowYield: 2.1,
                freeCashFlowYield: 1.8,
                dividendYield: null,
                payoutRatio: null
            },
            balances: {
                totalCash: '15.2B',
                totalDebt: '5.1B',
                netCashPosition: '10.1B'
            },
            margins: {
                grossMargin: 18.5,
                operatingMargin: 9.2,
                netIncomeMargin: 10.5
            }
        };
    })(),
    MSFT: (() => {
        const fundamentals = generateFundamentals(2015, 10, 90, 0.12);
        return {
            ticker: 'MSFT',
            name: 'Microsoft Corp.',
            price: 375.21,
            change: 1.12,
            changePercent: 0.30,
            marketCap: '2.9T',
            peRatio: 35.1,
            description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.',
            sector: 'Technology',
            assetType: AssetType.STOCK,
            isInWatchlist: true,
            addedAt: new Date('2026-01-02'),
            category: 'Technology',
            exchange: 'NASDAQ',
            ytdChangePercent: 42.1,
            history: generateHistory(350, 50),
            fundamentals,
            estimates: generateEstimates(fundamentals.quarterly),
            yields: {
                earningsYield: 2.8,
                cashFlowYield: 3.9,
                freeCashFlowYield: 3.5,
                dividendYield: 0.8,
                payoutRatio: 28.5
            },
            balances: {
                totalCash: '80.5B',
                totalDebt: '40.2B',
                netCashPosition: '40.3B'
            },
            margins: {
                grossMargin: 68.5,
                operatingMargin: 41.2,
                netIncomeMargin: 35.1
            }
        };
    })(),
    SPY: (() => {
        const fundamentals = generateFundamentals(2015, 10, 300, 0.08);
        return {
            ticker: 'SPY',
            name: 'SPDR S&P 500 ETF Trust',
            price: 478.25,
            change: 2.15,
            changePercent: 0.45,
            marketCap: '432.5B',
            peRatio: 21.3,
            description: 'The SPDR S&P 500 ETF Trust seeks to provide investment results that correspond to the price and yield performance of the S&P 500 Index.',
            sector: 'ETF',
            assetType: AssetType.ETF,
            isInWatchlist: true,
            addedAt: new Date('2025-11-20'),
            category: 'Large Cap Blend',
            exchange: 'NYSE Arca',
            ytdChangePercent: 18.7,
            history: generateHistory(470, 50),
            fundamentals,
            estimates: generateEstimates(fundamentals.quarterly),
            yields: {
                earningsYield: 4.7,
                cashFlowYield: 5.2,
                freeCashFlowYield: 4.9,
                dividendYield: 1.5,
                payoutRatio: 32.0
            },
            balances: {
                totalCash: 'N/A',
                totalDebt: 'N/A',
                netCashPosition: 'N/A'
            },
            margins: {
                grossMargin: 0,
                operatingMargin: 0,
                netIncomeMargin: 0
            }
        };
    })(),
    'BTC-USD': (() => {
        const fundamentals = generateFundamentals(2015, 10, 1, 0.50);
        return {
            ticker: 'BTC-USD',
            name: 'Bitcoin USD',
            price: 42750.50,
            change: 1250.30,
            changePercent: 3.01,
            marketCap: '837.2B',
            peRatio: 0,
            description: 'Bitcoin is a decentralized digital currency that can be transferred on the peer-to-peer bitcoin network.',
            sector: 'Cryptocurrency',
            assetType: AssetType.CRYPTO,
            isInWatchlist: true,
            addedAt: new Date('2025-12-01'),
            category: 'Cryptocurrency',
            exchange: 'Crypto',
            ytdChangePercent: 145.3,
            history: generateHistory(41500, 50),
            fundamentals,
            estimates: generateEstimates(fundamentals.quarterly),
            yields: {
                earningsYield: 0,
                cashFlowYield: 0,
                freeCashFlowYield: 0,
                dividendYield: null,
                payoutRatio: null
            },
            balances: {
                totalCash: 'N/A',
                totalDebt: 'N/A',
                netCashPosition: 'N/A'
            },
            margins: {
                grossMargin: 0,
                operatingMargin: 0,
                netIncomeMargin: 0
            }
        };
    })(),
    'ETH-USD': (() => {
        const fundamentals = generateFundamentals(2015, 10, 1, 0.40);
        return {
            ticker: 'ETH-USD',
            name: 'Ethereum USD',
            price: 2234.75,
            change: -67.25,
            changePercent: -2.92,
            marketCap: '268.4B',
            peRatio: 0,
            description: 'Ethereum is a decentralized platform that runs smart contracts: applications that run exactly as programmed without possibility of downtime, censorship, fraud or third-party interference.',
            sector: 'Cryptocurrency',
            assetType: AssetType.CRYPTO,
            isInWatchlist: true,
            addedAt: new Date('2025-12-01'),
            category: 'Cryptocurrency',
            exchange: 'Crypto',
            ytdChangePercent: 87.4,
            history: generateHistory(2300, 50),
            fundamentals,
            estimates: generateEstimates(fundamentals.quarterly),
            yields: {
                earningsYield: 0,
                cashFlowYield: 0,
                freeCashFlowYield: 0,
                dividendYield: null,
                payoutRatio: null
            },
            balances: {
                totalCash: 'N/A',
                totalDebt: 'N/A',
                netCashPosition: 'N/A'
            },
            margins: {
                grossMargin: 0,
                operatingMargin: 0,
                netIncomeMargin: 0
            }
        };
    })(),
};
