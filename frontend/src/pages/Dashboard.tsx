import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import CategoryPieChart from '../components/CategoryPieChart';
import RevenueExpensesChart from '../components/RevenueExpensesChart';
import RecentTransactions from '../components/RecentTransactions';
import TransactionsTable from '../components/TransactionsTable';
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
  // Sort by month (chronologically)
  return Object.entries(map)
    .sort((a, b) => new Date('1 ' + a[0]).getTime() - new Date('1 ' + b[0]).getTime())
    .map(([label, { income, expenses }]) => ({ label, income, expenses }));
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Summary stats
  const [balance, setBalance] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [savings, setSavings] = useState(0);

  const [txTablePage, setTxTablePage] = useState(1);
  const [txTablePageSize, setTxTablePageSize] = useState(10);
  const [txTableTotal, setTxTableTotal] = useState(0);
  const [txTableTransactions, setTxTableTransactions] = useState<Transaction[]>([]);
  const [txTableSearch, setTxTableSearch] = useState('');
  const [txTableStatus, setTxTableStatus] = useState('');
  const [txTableCategory, setTxTableCategory] = useState('');
  const [txTableStartDate, setTxTableStartDate] = useState<string | null>(null);
  const [txTableEndDate, setTxTableEndDate] = useState<string | null>(null);
  const [txTableSortBy, setTxTableSortBy] = useState('date');
  const [txTableOrder, setTxTableOrder] = useState<'asc' | 'desc'>('desc');
  const [txTableShowAll, setTxTableShowAll] = useState(false);
  const [txTableCategories, setTxTableCategories] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchTransactions({ page, limit: pageSize, sortBy: 'date', order: 'desc' });
        setTransactions(data.transactions);
        setTotal(data.total);
        // Calculate summary
        let rev = 0, exp = 0;
        data.transactions.forEach((tx: Transaction) => {
          if (tx.type === 'receive') rev += tx.amount;
          if (tx.type === 'transfer') exp += tx.amount;
        });
        setRevenue(rev);
        setExpenses(exp);
        setBalance(rev - exp);
        setSavings(rev - exp); // You can adjust this logic if needed
      } catch (e) {
        // handle error
      }
      setLoading(false);
    }
    load();
  }, [page]);

  // Fetch transactions for the table
  useEffect(() => {
    async function loadTable() {
      const params: any = {
        page: txTablePage,
        limit: txTableShowAll ? 300 : txTablePageSize,
        sortBy: txTableSortBy,
        order: txTableOrder,
      };
      if (txTableSearch) params.search = txTableSearch;
      if (txTableStatus) params.status = txTableStatus;
      if (txTableCategory) params.category = txTableCategory;
      if (txTableStartDate) params.startDate = txTableStartDate;
      if (txTableEndDate) params.endDate = txTableEndDate;
      const data = await fetchTransactions(params);
      setTxTableTransactions(data.transactions);
      setTxTableTotal(data.total);
      // Extract unique categories for dropdown
      const cats = Array.from(new Set(data.transactions.map((tx: Transaction) => tx.category).filter(Boolean)));
      setTxTableCategories(cats as string[]);
    }
    loadTable();
  }, [txTablePage, txTablePageSize, txTableShowAll, txTableSearch, txTableStatus, txTableCategory, txTableStartDate, txTableEndDate, txTableSortBy, txTableOrder]);

  // Handlers
  const handleClearFilters = () => {
    setTxTableSearch('');
    setTxTableStatus('');
    setTxTableCategory('');
    setTxTableStartDate(null);
    setTxTableEndDate(null);
    setTxTablePage(1);
  };
  const handleSort = (col: string) => {
    if (txTableSortBy === col) {
      setTxTableOrder(txTableOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setTxTableSortBy(col);
      setTxTableOrder('asc');
    }
  };
  const handleShowAll = () => {
    setTxTableShowAll(!txTableShowAll);
    setTxTablePage(1);
  };

  if (loading) return <Box sx={{ color: 'white', p: 4, textAlign: 'center' }}><CircularProgress /></Box>;

  const pieData = aggregateByCategory(transactions);
  const lineData = aggregateByMonth(transactions);

  return (
    <Box sx={{ p: 3 }}>
      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <Paper sx={{ p: 2, bgcolor: '#23272F', color: 'white' }}>
            <Typography variant="subtitle2">Balance</Typography>
            <Typography variant="h5">${balance.toLocaleString()}</Typography>
          </Paper>
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <Paper sx={{ p: 2, bgcolor: '#23272F', color: 'white' }}>
            <Typography variant="subtitle2">Revenue</Typography>
            <Typography variant="h5">${revenue.toLocaleString()}</Typography>
          </Paper>
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <Paper sx={{ p: 2, bgcolor: '#23272F', color: 'white' }}>
            <Typography variant="subtitle2">Expenses</Typography>
            <Typography variant="h5">${expenses.toLocaleString()}</Typography>
          </Paper>
        </Box>
        <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <Paper sx={{ p: 2, bgcolor: '#23272F', color: 'white' }}>
            <Typography variant="subtitle2">Savings</Typography>
            <Typography variant="h5">${savings.toLocaleString()}</Typography>
          </Paper>
        </Box>
      </Box>
      {/* Charts */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 100%', minWidth: 300 }}>
          <Paper sx={{ p: 2, bgcolor: '#23272F', color: 'white', height: 350 }}>
            <RevenueExpensesChart monthlyData={lineData} />
          </Paper>
        </Box>
        <Box sx={{ flex: '1 1 100%', minWidth: 300 }}>
          <Paper sx={{ p: 2, bgcolor: '#23272F', color: 'white', height: 350 }}>
            <CategoryPieChart data={pieData} />
          </Paper>
        </Box>
      </Box>
      {/* Recent Transactions */}
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 2, bgcolor: '#23272F', color: 'white' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Recent Transactions</Typography>
          <RecentTransactions
            transactions={transactions}
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
          />
        </Paper>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>All Transactions</Typography>
        <TransactionsTable
          transactions={txTableTransactions}
          total={txTableTotal}
          page={txTablePage}
          pageSize={txTableShowAll ? 300 : txTablePageSize}
          onPageChange={setTxTablePage}
          search={txTableSearch}
          onSearch={setTxTableSearch}
          status={txTableStatus}
          onStatusChange={setTxTableStatus}
          category={txTableCategory}
          onCategoryChange={setTxTableCategory}
          categories={txTableCategories}
          startDate={txTableStartDate}
          endDate={txTableEndDate}
          onStartDateChange={setTxTableStartDate}
          onEndDateChange={setTxTableEndDate}
          onClearFilters={handleClearFilters}
          sortBy={txTableSortBy}
          order={txTableOrder}
          onSort={handleSort}
          showAll={txTableShowAll}
          onShowAll={handleShowAll}
        />
      </Box>
    </Box>
  );
} 