import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import {
  Receipt,
  CheckCircle,
  Schedule,
  Error,
} from '@mui/icons-material';
import { useApp } from '../context/AppContext';
import StatusChip from '../components/StatusChip';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

const Dashboard = () => {
  const { state } = useApp();

  const totalInvoices = state.invoices.length;
  const paidInvoices = state.invoices.filter((inv) => inv.status === 'paid').length;
  const pendingInvoices = state.invoices.filter((inv) => inv.status === 'pending').length;
  const overdueInvoices = state.invoices.filter((inv) => inv.status === 'overdue').length;

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Prepare data for charts
  const monthlyData = [
    { month: 'Jan', revenue: 12000 },
    { month: 'Feb', revenue: 19000 },
    { month: 'Mar', revenue: 15000 },
    { month: 'Apr', revenue: 22000 },
    { month: 'May', revenue: 18000 },
    { month: 'Jun', revenue: 25000 },
  ];

  const statusData = [
    { name: 'Paid', value: paidInvoices, color: '#4caf50' },
    { name: 'Pending', value: pendingInvoices, color: '#ff9800' },
    { name: 'Overdue', value: overdueInvoices, color: '#f44336' },
  ];

  const recentInvoices = state.invoices.slice(0, 5);

  const StatCard = ({ title, value, icon, color }) => (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: '50%',
              p: 1.5,
              color: color,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Welcome back! Here's an overview of your invoices.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Invoices"
            value={totalInvoices}
            icon={<Receipt />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Paid"
            value={paidInvoices}
            icon={<CheckCircle />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending"
            value={pendingInvoices}
            icon={<Schedule />}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Overdue"
            value={overdueInvoices}
            icon={<Error />}
            color="#f44336"
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Monthly Revenue
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
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
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Status Distribution
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
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Recent Invoices
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '12px' }}>Invoice #</th>
                    <th style={{ textAlign: 'left', padding: '12px' }}>Client</th>
                    <th style={{ textAlign: 'left', padding: '12px' }}>Issue Date</th>
                    <th style={{ textAlign: 'left', padding: '12px' }}>Due Date</th>
                    <th style={{ textAlign: 'right', padding: '12px' }}>Amount</th>
                    <th style={{ textAlign: 'center', padding: '12px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td style={{ padding: '12px' }}>{invoice.id}</td>
                      <td style={{ padding: '12px' }}>{invoice.clientName}</td>
                      <td style={{ padding: '12px' }}>
                        {format(new Date(invoice.issueDate), 'MMM dd, yyyy')}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        {formatCurrency(invoice.total)}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <StatusChip status={invoice.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;