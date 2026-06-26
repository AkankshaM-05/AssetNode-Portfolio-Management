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
  status: 'Excellent' | 'Good' | 'Moderate' | 'Poor' | 'Critical' | 'Unknown';
}

export function usePortfolioStore() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // LOAD INVESTMENTS
  const fetchInvestments = async () => {
    try {
      const res = await fetch('/api/investments');
      const json = await res.json();

      if (json.success) {
        setInvestments(json.data || []);
      }
    } catch (err) {
      console.error('fetchInvestments failed', err);
    }
  };

  // LOAD HISTORY
  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/analysis-history');
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        const formatted: AnalysisHistory[] = json.data.map((item: any) => ({
          id: item.id,
          date: item.created_at,
          summary: item.summary ?? "",
          status: (item.status as AnalysisHistory['status']) ?? "Unknown",
        }));

        setHistory(formatted);
      }
    } catch (err) {
      console.error('fetchHistory failed', err);
    }
  };

  useEffect(() => {
    Promise.all([fetchInvestments(), fetchHistory()])
      .finally(() => setIsInitialized(true));
  }, []);

  // ADD INVESTMENT
  const addInvestment = async (investment: Omit<Investment, 'id'>) => {
    try {
      const res = await fetch('/api/investments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(investment),
      });

      const json = await res.json();

      if (json.success) {
        await fetchInvestments();
      }
    } catch (err) {
      console.error('addInvestment failed', err);
    }
  };

  // DELETE INVESTMENT
  const deleteInvestment = async (id: string) => {
    try {
      const res = await fetch('/api/investments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const json = await res.json();

      if (json.success) {
        setInvestments(prev => prev.filter(i => i.id !== id));
      }
    } catch (err) {
      console.error('deleteInvestment failed', err);
    }
  };

  // ADD HISTORY (UI ONLY)
  const addHistory = async (item: Omit<AnalysisHistory, 'id'>) => {
    const newItem: AnalysisHistory = {
      id: crypto.randomUUID(),
      ...item,
    };

    setHistory(prev => [newItem, ...prev]);
  };

  return {
    investments,
    history,
    isInitialized,
    addInvestment,
    deleteInvestment,
    addHistory,
    fetchHistory,
  };
}