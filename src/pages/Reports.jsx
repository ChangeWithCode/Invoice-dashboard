import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  MenuItem,
  TextField,
} from '@mui/material';
import { Download } from '@mui/icons-material';
import { useApp } from '../context/AppContext';
import { useNotification } from '../components/Notification';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Reports = () => {
  const { state } = useApp();
  const { showNotification } = useNotification();
  const [period, setPeriod] = useState('monthly');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Calculate monthly revenue
  const monthlyRevenue = [
    { month: 'Jan', revenue: 12000, paid: 10000, pending: 2000 },
    { month: 'Feb', revenue: 19000, paid: 15000, pending: 4000 },
    { month: 'Mar', revenue: 15000, paid: 12000, pending: 3000 },
    { month: 'Apr', revenue: 22000, paid: 18000, pending: 4000 },
    { month: 'May', revenue: 18000, paid: 15000, pending: 3000 },
    { month: 'Jun', revenue: 25000, paid: 20000, pending: 5000 },
  ];

  const totalRevenue = state.invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidRevenue = state.invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);
  const pendingRevenue = state.invoices
    .filter((inv) => inv.status === 'pending')
    .reduce((sum, inv) => sum + inv.total, 0);
  const overdueRevenue = state.invoices
    .filter((inv) => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.total, 0);

  const statusData = [
    { name: 'Paid', value: paidRevenue, color: '#4caf50' },
    { name: 'Pending', value: pendingRevenue, color: '#ff9800' },
    { name: 'Overdue', value: overdueRevenue, color: '#f44336' },
  ];

  const handleExportPDF = () => {
    showNotification('PDF export feature coming soon', 'info');
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Invoice ID', 'Client', 'Date', 'Amount', 'Status'],
      ...state.invoices.map((inv) => [
        inv.id,
        inv.clientName,
        inv.issueDate,
        inv.total,
        inv.status,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invoices.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    showNotification('CSV exported successfully', 'success');
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Reports
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Analyze your business performance
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <TextField
            select
            size="small"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </TextField>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportCSV}
          >
            Export CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportPDF}
          >
            Export PDF
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Total Revenue
              </Typography>
              <Typography variant="h4" fontWeight={700}>
                {formatCurrency(totalRevenue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Paid Revenue
              </Typography>
              <Typography variant="h4" fontWeight={700} color="success.main">
                {formatCurrency(paidRevenue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Pending Revenue
              </Typography>
              <Typography variant="h4" fontWeight={700} color="warning.main">
                {formatCurrency(pendingRevenue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Overdue Revenue
              </Typography>
              <Typography variant="h4" fontWeight={700} color="error.main">
                {formatCurrency(overdueRevenue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Revenue Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1976d2"
                  strokeWidth={2}
                  name="Total Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="paid"
                  stroke="#4caf50"
                  strokeWidth={2}
                  name="Paid"
                />
                <Line
                  type="monotone"
                  dataKey="pending"
                  stroke="#ff9800"
                  strokeWidth={2}
                  name="Pending"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Revenue by Status
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Paid vs Pending Ratio
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="paid" fill="#4caf50" name="Paid" />
                <Bar dataKey="pending" fill="#ff9800" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;