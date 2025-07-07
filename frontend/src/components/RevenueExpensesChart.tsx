import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Box, MenuItem, Select, Typography } from '@mui/material';

interface ChartData {
  label: string;
  income: number;
  expenses: number;
}

export default function RevenueExpensesChart({ monthlyData, weeklyData }: { monthlyData: ChartData[]; weeklyData?: ChartData[] }) {
  const [period, setPeriod] = useState('Monthly');
  const data = period === 'Monthly' ? monthlyData : (weeklyData || monthlyData);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="subtitle1" color="white">Overview</Typography>
        {weeklyData && (
          <Select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            size="small"
            sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }}
          >
            <MenuItem value="Monthly">Monthly</MenuItem>
            <MenuItem value="Weekly">Weekly</MenuItem>
          </Select>
        )}
      </Box>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#444" strokeDasharray="3 3" />
          <XAxis dataKey="label" stroke="white" />
          <YAxis stroke="white" />
          <Tooltip
            contentStyle={{ background: '#23272F', color: 'white', border: 'none' }}
            labelStyle={{ color: 'white' }}
            itemStyle={{ color: 'white' }}
          />
          <Line type="monotone" dataKey="income" stroke="#00b74d" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="expenses" stroke="#f5a623" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
} 