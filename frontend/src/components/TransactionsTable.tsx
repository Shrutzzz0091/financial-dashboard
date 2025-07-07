import React, { useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Pagination, TextField, MenuItem, Select, Button, InputLabel, FormControl
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface Transaction {
  _id: string;
  date: string;
  amount: number;
  category?: string;
  status: string;
  user_id?: string;
  user_profile?: string;
}

interface Props {
  transactions: Transaction[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  search: string;
  onSearch: (s: string) => void;
  status: string;
  onStatusChange: (s: string) => void;
  category: string;
  onCategoryChange: (c: string) => void;
  categories: string[];
  startDate: string | null;
  endDate: string | null;
  onStartDateChange: (d: string | null) => void;
  onEndDateChange: (d: string | null) => void;
  onClearFilters: () => void;
  sortBy: string;
  order: 'asc' | 'desc';
  onSort: (col: string) => void;
  showAll: boolean;
  onShowAll: () => void;
}

export default function TransactionsTable({
  transactions, total, page, pageSize, onPageChange,
  search, onSearch, status, onStatusChange, category, onCategoryChange, categories,
  startDate, endDate, onStartDateChange, onEndDateChange, onClearFilters,
  sortBy, order, onSort, showAll, onShowAll
}: Props) {
  const pageCount = Math.ceil(total / pageSize);
  return (
    <Box sx={{ bgcolor: '#23272F', p: 2, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
        <TextField
          label="Search by ID"
          value={search}
          onChange={e => onSearch(e.target.value)}
          size="small"
          sx={{ input: { color: 'white' }, label: { color: 'white' }, minWidth: 200 }}
          InputLabelProps={{ style: { color: 'white' } }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel sx={{ color: 'white' }}>Status</InputLabel>
          <Select
            value={status}
            onChange={e => onStatusChange(e.target.value)}
            label="Status"
            sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel sx={{ color: 'white' }}>Category</InputLabel>
          <Select
            value={category}
            onChange={e => onCategoryChange(e.target.value)}
            label="Category"
            sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }}
          >
            <MenuItem value="">All</MenuItem>
            {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
          </Select>
        </FormControl>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={(d: any) => onStartDateChange(d ? d.toISOString() : null)}
          slotProps={{ textField: { size: 'small', sx: { input: { color: 'white' }, label: { color: 'white' } } } }}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={(d: any) => onEndDateChange(d ? d.toISOString() : null)}
          slotProps={{ textField: { size: 'small', sx: { input: { color: 'white' }, label: { color: 'white' } } } }}
        />
        <Button variant="outlined" color="warning" onClick={onClearFilters} sx={{ ml: 1 }}>
          CLEAR FILTERS
        </Button>
        <Button variant="contained" color="success" onClick={onShowAll} sx={{ ml: 1 }}>
          {showAll ? 'Show 10' : 'Show All'}
        </Button>
      </Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>#</TableCell>
              <TableCell sx={{ color: 'white', cursor: 'pointer' }} onClick={() => onSort('date')}>
                Date {sortBy === 'date' ? (order === 'asc' ? '↑' : '↓') : ''}
              </TableCell>
              <TableCell sx={{ color: 'white', cursor: 'pointer' }} onClick={() => onSort('amount')}>
                Amount {sortBy === 'amount' ? (order === 'asc' ? '↑' : '↓') : ''}
              </TableCell>
              <TableCell sx={{ color: 'white' }}>Category</TableCell>
              <TableCell sx={{ color: 'white' }}>Status</TableCell>
              <TableCell sx={{ color: 'white' }}>User</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((tx, idx) => (
              <TableRow key={tx._id}>
                <TableCell sx={{ color: 'white' }}>{(page - 1) * pageSize + idx + 1}</TableCell>
                <TableCell sx={{ color: 'white' }}>{new Date(tx.date).toLocaleDateString()}</TableCell>
                <TableCell sx={{ color: tx.amount > 0 ? '#00b74d' : '#f5a623' }}>{tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}</TableCell>
                <TableCell sx={{ color: 'white' }}>{tx.category || 'Uncategorized'}</TableCell>
                <TableCell sx={{ color: 'white' }}>{tx.status}</TableCell>
                <TableCell sx={{ color: 'white' }}>
                  {tx.user_profile && <img src={tx.user_profile} alt="profile" style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 8 }} />}
                  {tx.user_id}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, value) => onPageChange(value)}
            color="primary"
            sx={{ button: { color: 'white' } }}
          />
        </Box>
      )}
    </Box>
  );
} 