import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import RevenueExpensesChart from '../components/RevenueExpensesChart';
import CategoryPieChart from '../components/CategoryPieChart';
import { fetchTransactions } from '../components/api';

interface Transaction {
  _id: string;
  from: string;
  to: string;
  amount: number;
  type: 'transfer' | 'receive';
  status: 'Completed' | 'Pending';
  date: string;
  category?: string;
  description?: string;
}

function aggregateByCategory(transactions: Transaction[]) {
  const map: Record<string, number> = {};
  transactions.forEach(tx => {
    const cat = tx.category || 'Uncategorized';
    map[cat] = (map[cat] || 0) + tx.amount;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

function aggregateByMonth(transactions: Transaction[]) {
  const map: Record<string, { income: number; expenses: number }> = {};
  transactions.forEach(tx => {
    const date = new Date(tx.date);
    const label = date.toLocaleString('default', { month: 'short', year: '2-digit' });
    if (!map[label]) map[label] = { income: 0, expenses: 0 };
    if (tx.type === 'receive') map[label].income += tx.amount;
    if (tx.type === 'transfer') map[label].expenses += tx.amount;
  });
  return Object.entries(map)
    .sort((a, b) => new Date('1 ' + a[0]).getTime() - new Date('1 ' + b[0]).getTime())
    .map(([label, { income, expenses }]) => ({ label, income, expenses }));
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchTransactions({ limit: 1000, sortBy: 'date', order: 'desc' });
      setTransactions(data.transactions);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <Box sx={{ color: 'white', p: 4, textAlign: 'center' }}><CircularProgress /></Box>;

  const pieData = aggregateByCategory(transactions);
  const lineData = aggregateByMonth(transactions);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>Analytics Dashboard</Typography>
      <Paper sx={{ p: 3, bgcolor: '#23243a', color: 'white', mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Income vs Expenses Over Time</Typography>
        <RevenueExpensesChart monthlyData={lineData} />
      </Paper>
      <Paper sx={{ p: 3, bgcolor: '#23243a', color: 'white' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Spending by Category</Typography>
        <CategoryPieChart data={pieData} />
      </Paper>
    </Box>
  );
} 