import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, AppBar, Typography, TextField, Button, Paper, Alert } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BarChartIcon from '@mui/icons-material/BarChart';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import SettingsIcon from '@mui/icons-material/Settings';
import ReceiptIcon from '@mui/icons-material/Receipt';
import axios from 'axios';
import type { ReactNode, JSXElementConstructor } from 'react';
import Login from './pages/Login';
import TransactionsPage from './pages/TransactionsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import PersonalPage from './pages/PersonalPage';
import MessagePage from './pages/MessagePage';

const drawerWidth = 220;

const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Transactions', icon: <ReceiptIcon />, path: '/transactions' },
  { text: 'Wallet', icon: <AccountBalanceWalletIcon />, path: '/wallet' },
  { text: 'Analytics', icon: <BarChartIcon />, path: '/analytics' },
  { text: 'Personal', icon: <PersonIcon />, path: '/personal' },
  { text: 'Message', icon: <MessageIcon />, path: '/message' },
  { text: 'Setting', icon: <SettingsIcon />, path: '/setting' },
];

// Auth Context
interface AuthContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType>({ token: null, login: async () => false, logout: () => {} });
export function useAuth() { return useContext(AuthContext); }

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post('/auth/login', { email }); // password ignored by backend
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      return true;
    } catch {
      return false;
    }
  };
  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };
  return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>;
}

function RequireAuth({ children }: { children: React.ReactElement }) {
  const { token } = useAuth();
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function Sidebar() {
  const location = useLocation();
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: '#181A20',
          color: 'white',
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#00b74d', fontSize: 24 }}>
          <span style={{ color: 'white' }}>Penta</span>
        </Typography>
      </Toolbar>
      <List disablePadding>
        {navItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            to={item.path}
            sx={{ '&:hover': { background: '#22242C' }, color: 'white' }}
          >
            <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

function Placeholder({ title }: { title: string }) {
  return <Box sx={{ color: 'white', p: 3 }}><Typography variant="h4">{title}</Typography></Box>;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Box sx={{ display: 'flex', minHeight: '100vh', background: '#181A20' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <RequireAuth>
                  <Box sx={{ display: 'flex', width: '100%' }}>
                    <Sidebar />
                    <Box component="main" sx={{ flexGrow: 1, p: 0, ml: `${drawerWidth}px` }}>
                      <AppBar position="static" sx={{ background: '#181A20', boxShadow: 'none', borderBottom: '1px solid #22242C' }}>
                        <Toolbar>
                          <Typography variant="h6" sx={{ color: 'white', flexGrow: 1 }}>
                            {/* Topbar content here */}
                          </Typography>
                        </Toolbar>
                      </AppBar>
                      <Routes>
                        <Route path="/dashboard" element={<Placeholder title="Dashboard" />} />
                        <Route path="/transactions" element={<TransactionsPage />} />
                        <Route path="/wallet" element={<Placeholder title="Wallet" />} />
                        <Route path="/analytics" element={<AnalyticsPage />} />
                        <Route path="/personal" element={<PersonalPage />} />
                        <Route path="/message" element={<MessagePage />} />
                        <Route path="/setting" element={<Placeholder title="Setting" />} />
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                      </Routes>
                    </Box>
                  </Box>
                </RequireAuth>
              }
            />
          </Routes>
        </Box>
      </Router>
    </AuthProvider>
  );
}

export default App;
