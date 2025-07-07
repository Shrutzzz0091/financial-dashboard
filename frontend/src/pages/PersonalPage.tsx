import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Divider, Switch, FormControlLabel, Select, MenuItem, Paper } from '@mui/material';

export default function PersonalPage() {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [phone, setPhone] = useState('+1234567890');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('English');

  const activityLog = [
    { action: 'Logged in from IP 192.168.1.1', date: '2024-06-01 10:00' },
    { action: 'Changed password', date: '2024-05-28 15:30' },
    { action: 'Updated profile information', date: '2024-05-20 09:45' },
  ];
  const linkedAccounts = [
    { name: 'Chase Bank - ****1234', type: 'Bank Account' },
    { name: 'Visa - ****5678', type: 'Payment Method' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>Personal Settings</Typography>
      <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>Profile Information</Typography>
      <TextField
        label="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        fullWidth
        sx={{ mb: 2, input: { color: 'white' }, label: { color: 'white' } }}
        InputLabelProps={{ style: { color: 'white' } }}
      />
      <TextField
        label="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        fullWidth
        sx={{ mb: 2, input: { color: 'white' }, label: { color: 'white' } }}
        InputLabelProps={{ style: { color: 'white' } }}
      />
      <TextField
        label="Phone"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        fullWidth
        sx={{ mb: 2, input: { color: 'white' }, label: { color: 'white' } }}
        InputLabelProps={{ style: { color: 'white' } }}
      />
      <Button variant="contained" sx={{ bgcolor: '#00b74d', color: 'white', fontWeight: 'bold', mb: 4 }}>SAVE PROFILE</Button>
      <Divider sx={{ bgcolor: '#333', my: 4 }} />
      <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>Security Settings</Typography>
      <TextField
        label="Current Password"
        type="password"
        value={currentPassword}
        onChange={e => setCurrentPassword(e.target.value)}
        fullWidth
        sx={{ mb: 2, input: { color: 'white' }, label: { color: 'white' } }}
        InputLabelProps={{ style: { color: 'white' } }}
      />
      <TextField
        label="New Password"
        type="password"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        fullWidth
        sx={{ mb: 2, input: { color: 'white' }, label: { color: 'white' } }}
        InputLabelProps={{ style: { color: 'white' } }}
      />
      <Divider sx={{ bgcolor: '#333', my: 4 }} />
      {/* Preferences */}
      <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>Preferences</Typography>
      <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
        <FormControlLabel
          control={<Switch checked={darkMode} onChange={e => setDarkMode(e.target.checked)} color="success" />}
          label={<span style={{ color: 'white' }}>Dark Mode</span>}
        />
        <FormControlLabel
          control={<Switch checked={notifications} onChange={e => setNotifications(e.target.checked)} color="success" />}
          label={<span style={{ color: 'white' }}>Notifications</span>}
        />
      </Box>
      <Box sx={{ maxWidth: 300, mb: 4 }}>
        <Typography sx={{ color: '#aaa', mb: 1 }}>Language</Typography>
        <Select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          fullWidth
          sx={{ color: 'white', bgcolor: '#181A20', '.MuiOutlinedInput-notchedOutline': { borderColor: '#333' } }}
        >
          <MenuItem value="English">English</MenuItem>
          <MenuItem value="Spanish">Spanish</MenuItem>
        </Select>
      </Box>
      <Divider sx={{ bgcolor: '#333', my: 4 }} />
      {/* Activity Log */}
      <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>Activity Log</Typography>
      <Paper sx={{ bgcolor: '#20213a', p: 2, mb: 4 }}>
        {activityLog.map((log, idx) => (
          <Box key={idx} sx={{ mb: idx < activityLog.length - 1 ? 2 : 0 }}>
            <Typography sx={{ color: 'white' }}>{log.action}</Typography>
            <Typography sx={{ color: '#aaa', fontSize: 14 }}>{log.date}</Typography>
          </Box>
        ))}
      </Paper>
      {/* Linked Accounts */}
      <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>Linked Accounts</Typography>
      <Paper sx={{ bgcolor: '#20213a', p: 2 }}>
        {linkedAccounts.map((acc, idx) => (
          <Box key={idx} sx={{ mb: idx < linkedAccounts.length - 1 ? 2 : 0 }}>
            <Typography sx={{ color: 'white', fontWeight: 'bold' }}>{acc.name}</Typography>
            <Typography sx={{ color: '#aaa', fontSize: 15 }}>{acc.type}</Typography>
          </Box>
        ))}
      </Paper>
    </Box>
  );
} 