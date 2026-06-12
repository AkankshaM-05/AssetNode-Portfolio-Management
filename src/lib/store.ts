'use client';

import { useState, useEffect } from 'react';

export interface Investment {
  id: string;
  assetType: "Stock";
  ticker?: string;
  sector?: string;
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
    id: crypto.randomUUID(),
    assetType: 'Stock',
    ticker: 'AAPL',
    sector: 'Technology',
    companyName: 'Apple Inc.',
    quantity: 10,
    buyPrice: 150,
    purchaseDate: new Date('2023-01-15').toISOString(),
  },
  {
    id: crypto.randomUUID(),
    assetType: 'Stock',
    ticker: 'MSFT',
    sector: 'Technology',
    companyName: 'Microsoft Corp.',
    quantity: 5,
    buyPrice: 280,
    purchaseDate: new Date('2023-03-22').toISOString(),
  },
];

const DEFAULT_HISTORY: AnalysisHistory[] = [
  {
    id: crypto.randomUUID(),
    date: new Date('2024-02-10').toISOString(),
    summary:
      'The stock portfolio shows strong performance with key technology holdings driving growth.',
    status: 'Good',
  },
];

function sanitizeInvestments(data: any): Investment[] {
  if (!Array.isArray(data)) return [];

  return data
    .map((inv) => {
      if (!inv || typeof inv.companyName !== 'string') return null;
      if (inv.assetType !== 'Stock') return null;

      const quantity = Number(inv.quantity);
      const buyPrice = Number(inv.buyPrice);

      if (isNaN(quantity) || isNaN(buyPrice)) return null;

      return {
        id: inv.id ?? crypto.randomUUID(),
        assetType: 'Stock',
        ticker: inv.ticker?.trim() || undefined,
        sector: inv.sector?.trim() || 'Unknown',
        companyName: inv.companyName,
        quantity,
        buyPrice,
        purchaseDate: inv.purchaseDate || new Date().toISOString(),
      };
    })
    .filter(Boolean) as Investment[];
}

export function usePortfolioStore() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedInvestments = localStorage.getItem('assetnode_stocks');
    const savedHistory = localStorage.getItem('assetnode_history');

    const cleanedInvestments = sanitizeInvestments(
      savedInvestments ? JSON.parse(savedInvestments) : null
    );

    setInvestments(
      cleanedInvestments.length > 0 ? cleanedInvestments : DEFAULT_STOCKS
    );

    setHistory(
      savedHistory ? JSON.parse(savedHistory) : DEFAULT_HISTORY
    );

    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('assetnode_stocks', JSON.stringify(investments));
  }, [investments, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('assetnode_history', JSON.stringify(history));
  }, [history, isInitialized]);

  const addInvestment = (investment: Omit<Investment, 'id'>) => {
    const quantity = Number(investment.quantity);
    const buyPrice = Number(investment.buyPrice);

    if (isNaN(quantity) || isNaN(buyPrice)) return;

    const newInvestment: Investment = {
      ...investment,
      quantity,
      buyPrice,
      id: crypto.randomUUID(),
    };

    setInvestments((prev) => [...prev, newInvestment]);
  };

  const deleteInvestment = (id: string) => {
    setInvestments((prev) => prev.filter((inv) => inv.id !== id));
  };

  const addHistory = (item: Omit<AnalysisHistory, 'id'>) => {
    const newItem: AnalysisHistory = {
      ...item,
      id: crypto.randomUUID(),
    };

    setHistory((prev) => [newItem, ...prev]);
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