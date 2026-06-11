import { useState, useEffect } from 'react';

export interface Investment {
  id: string;
  assetType: 'Stock';
  companyName: string;
  quantity: number;
  buyPrice: number;
  purchaseDate: string;
}

export interface AnalysisHistory {
  id: string;
  date: string;
  summary: string;
  status: 'Excellent' | 'Good' | 'Moderate' | 'Poor' | 'Critical';
}

const DEFAULT_STOCKS: Investment[] = [
  {
    id: '1',
    assetType: 'Stock',
    companyName: 'Apple Inc. (AAPL)',
    quantity: 10,
    buyPrice: 150.0,
    purchaseDate: new Date('2023-01-15').toISOString(),
  },
  {
    id: '2',
    assetType: 'Stock',
    companyName: 'Microsoft Corp. (MSFT)',
    quantity: 5,
    buyPrice: 280.0,
    purchaseDate: new Date('2023-03-22').toISOString(),
  },
  {
    id: '3',
    assetType: 'Stock',
    companyName: 'Tesla Inc. (TSLA)',
    quantity: 15,
    buyPrice: 190.0,
    purchaseDate: new Date('2023-06-10').toISOString(),
  },
];

const DEFAULT_HISTORY: AnalysisHistory[] = [
  {
    id: 'h1',
    date: new Date('2024-02-10').toISOString(),
    summary: 'The stock portfolio shows strong performance with key technology holdings driving growth. Diversification is healthy across large-cap tech.',
    status: 'Good',
  },
];

export function usePortfolioStore() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedInvestments = localStorage.getItem('assetnode_stocks');
    const savedHistory = localStorage.getItem('assetnode_history');

    if (savedInvestments) {
      setInvestments(JSON.parse(savedInvestments));
    } else {
      setInvestments(DEFAULT_STOCKS);
    }

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    } else {
      setHistory(DEFAULT_HISTORY);
    }
    
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('assetnode_stocks', JSON.stringify(investments));
    }
  }, [investments, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('assetnode_history', JSON.stringify(history));
    }
  }, [history, isInitialized]);

  const addInvestment = (investment: Omit<Investment, 'id'>) => {
    const newInv = { ...investment, id: Math.random().toString(36).substring(7) };
    setInvestments((prev) => [...prev, newInv as Investment]);
  };

  const deleteInvestment = (id: string) => {
    setInvestments((prev) => prev.filter((i) => i.id !== id));
  };

  const addHistory = (item: Omit<AnalysisHistory, 'id'>) => {
    const newItem = { ...item, id: Math.random().toString(36).substring(7) };
    setHistory((prev) => [newItem as AnalysisHistory, ...prev]);
  };

  return {
    investments,
    history,
    addInvestment,
    deleteInvestment,
    addHistory,
    isInitialized,
  };
}
