import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit,
  Delete,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useApp } from '../context/AppContext';
import { useNotification } from '../components/Notification';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  company: yup.string().required('Company is required'),
});

const Clients = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const { showNotification } = useNotification();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      company: '',
      address: '',
      phone: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const clientData = {
        id: `CLI-${String(state.clients.length + 1).padStart(3, '0')}`,
        ...values,
      };
      dispatch({ type: 'ADD_CLIENT', payload: clientData });
      showNotification('Client added successfully', 'success');
      formik.resetForm();
      setDialogOpen(false);
    },
  });

  const handleDelete = (id) => {
    setClientToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    dispatch({ type: 'DELETE_CLIENT', payload: clientToDelete });
    showNotification('Client deleted successfully', 'success');
    setDeleteDialogOpen(false);
    setClientToDelete(null);
  };

  const columns = [
    { field: 'id', headerName: 'Client ID', width: 150 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'company', headerName: 'Company', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    {
      field: 'invoices',
      headerName: 'Total Invoices',
      width: 150,
      valueGetter: (params) => {
        return state.invoices.filter((inv) => inv.clientId === params.row.id).length;
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            color="primary"
            onClick={() => navigate(`/clients/${params.row.id}`)}
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Clients
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your client database
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={state.clients}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
        />
      </Paper>

      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
        onClick={() => setDialogOpen(true)}
      >
        <AddIcon />
      </Fab>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Client</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Company"
              name="company"
              value={formik.values.company}
              onChange={formik.handleChange}
              error={formik.touched.company && Boolean(formik.errors.company)}
              helperText={formik.touched.company && formik.errors.company}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              margin="normal"
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Add Client
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Client</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this client? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export const ClientDetails = () => {
  const { id } = useParams();
  const { state } = useApp();
  const client = state.clients.find((c) => c.id === id);
  const clientInvoices = state.invoices.filter((inv) => inv.clientId === id);

  if (!client) {
    return <Typography>Client not found</Typography>;
  }

  const statusData = [
    {
      name: 'Paid',
      value: clientInvoices.filter((inv) => inv.status === 'paid').length,
      color: '#4caf50',
    },
    {
      name: 'Pending',
      value: clientInvoices.filter((inv) => inv.status === 'pending').length,
      color: '#ff9800',
    },
    {
      name: 'Overdue',
      value: clientInvoices.filter((inv) => inv.status === 'overdue').length,
      color: '#f44336',
    },
  ];

  const totalRevenue = clientInvoices.reduce((sum, inv) => sum + inv.total, 0);

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        {client.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Client Details & Payment History
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Contact Information
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Email:</strong> {client.email}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                <strong>Company:</strong> {client.company}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                <strong>Address:</strong> {client.address || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                <strong>Phone:</strong> {client.phone || 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Statistics
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Total Invoices:</strong> {clientInvoices.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                <strong>Total Revenue:</strong>{' '}
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(totalRevenue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Payment Status Distribution
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Clients;