import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const ok = await login(email, password);
    if (ok) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#181A20' }}>
      <Paper sx={{ p: 4, width: 350, bgcolor: '#23272F' }}>
        <Typography variant="h5" sx={{ mb: 2, color: 'white', fontWeight: 'bold' }}>Sign in to your account</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            sx={{ mb: 2, input: { color: 'white' }, label: { color: 'white' } }}
            InputLabelProps={{ style: { color: 'white' } }}
            autoComplete="email"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            sx={{ mb: 2, input: { color: 'white' }, label: { color: 'white' } }}
            InputLabelProps={{ style: { color: 'white' } }}
            autoComplete="current-password"
          />
          <Button type="submit" variant="contained" fullWidth sx={{ bgcolor: '#00b74d', color: 'white', fontWeight: 'bold', mt: 1 }}>
            LOGIN
          </Button>
        </form>
      </Paper>
    </Box>
  );
} 