import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Pagination, Box } from '@mui/material';

interface Transaction {
  _id: string;
  date: string;
  amount: number;
  category?: string;
  status: string;
}

interface Props {
  transactions: Transaction[];
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function RecentTransactions({ transactions, page, pageSize, total, onPageChange }: Props) {
  const pageCount = Math.ceil(total / pageSize);
  return (
    <Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>ID</TableCell>
              <TableCell sx={{ color: 'white' }}>Date</TableCell>
              <TableCell sx={{ color: 'white' }}>Amount</TableCell>
              <TableCell sx={{ color: 'white' }}>Category</TableCell>
              <TableCell sx={{ color: 'white' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map(tx => (
              <TableRow key={tx._id}>
                <TableCell sx={{ color: 'white' }}>{tx._id.slice(0, 8)}...</TableCell>
                <TableCell sx={{ color: 'white' }}>{new Date(tx.date).toLocaleDateString()}</TableCell>
                <TableCell sx={{ color: tx.amount > 0 ? '#00b74d' : '#f5a623' }}>{tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}</TableCell>
                <TableCell sx={{ color: 'white' }}>{tx.category || 'Uncategorized'}</TableCell>
                <TableCell sx={{ color: 'white' }}>{tx.status}</TableCell>
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