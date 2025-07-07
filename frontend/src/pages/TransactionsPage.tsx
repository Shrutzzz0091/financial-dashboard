import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControlLabel } from '@mui/material';
import TransactionsTable from '../components/TransactionsTable';
import { fetchTransactions } from '../components/api';

const ALL_COLUMNS = [
  { key: 'user', label: 'User' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' },
  { key: 'date', label: 'Date' },
  { key: 'category', label: 'Category' },
];

export default function TransactionsPage() {
  // Table state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('date');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [showAll, setShowAll] = useState(false);

  // Export modal state
  const [exportOpen, setExportOpen] = useState(false);
  const [exportCols, setExportCols] = useState<string[]>(ALL_COLUMNS.map(c => c.key));
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    async function load() {
      const params: any = {
        page,
        limit: showAll ? 300 : pageSize,
        sortBy,
        order,
      };
      if (search) params.search = search;
      if (status) params.status = status;
      if (category) params.category = category;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const data = await fetchTransactions(params);
      setTransactions(data.transactions);
      setTotal(data.total);
      const cats = Array.from(new Set(data.transactions.map((tx: any) => tx.category).filter(Boolean)));
      setCategories(cats as string[]);
    }
    load();
  }, [page, pageSize, showAll, search, status, category, startDate, endDate, sortBy, order]);

  const handleClearFilters = () => {
    setSearch(''); setStatus(''); setCategory(''); setStartDate(null); setEndDate(null); setPage(1);
  };
  const handleSort = (col: string) => {
    if (sortBy === col) setOrder(order === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setOrder('asc'); }
  };
  const handleShowAll = () => { setShowAll(!showAll); setPage(1); };

  // Export logic
  const handleExport = async () => {
    setExporting(true);
    try {
      const params: any = {
        page: 1,
        limit: showAll ? 300 : pageSize,
        sortBy,
        order,
        columns: exportCols.join(','),
      };
      if (search) params.search = search;
      if (status) params.status = status;
      if (category) params.category = category;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const token = localStorage.getItem('token');
      const res = await fetch('/transactions/export?' + new URLSearchParams(params), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transactions.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setExportOpen(false);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>Transactions</Typography>
        <Button variant="contained" color="primary" onClick={() => setExportOpen(true)}>Export</Button>
      </Box>
      <TransactionsTable
        transactions={transactions}
        total={total}
        page={page}
        pageSize={showAll ? 300 : pageSize}
        onPageChange={setPage}
        search={search}
        onSearch={setSearch}
        status={status}
        onStatusChange={setStatus}
        category={category}
        onCategoryChange={setCategory}
        categories={categories}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onClearFilters={handleClearFilters}
        sortBy={sortBy}
        order={order}
        onSort={handleSort}
        showAll={showAll}
        onShowAll={handleShowAll}
      />
      <Dialog open={exportOpen} onClose={() => setExportOpen(false)}>
        <DialogTitle>Select Columns</DialogTitle>
        <DialogContent>
          {ALL_COLUMNS.map(col => (
            <FormControlLabel
              key={col.key}
              control={
                <Checkbox
                  checked={exportCols.includes(col.key)}
                  onChange={e => {
                    if (e.target.checked) setExportCols([...exportCols, col.key]);
                    else setExportCols(exportCols.filter(k => k !== col.key));
                  }}
                />
              }
              label={col.label}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleExport} color="success" variant="contained" disabled={exporting}>
            {exporting ? 'Exporting...' : 'Export'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 