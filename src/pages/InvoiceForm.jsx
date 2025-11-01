import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useApp } from '../context/AppContext';
import { useNotification } from '../components/Notification';
import { format } from 'date-fns';

const validationSchema = yup.object({
  clientId: yup.string().required('Client is required'),
  issueDate: yup.date().required('Issue date is required'),
  dueDate: yup.date().required('Due date is required'),
});

const InvoiceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { state, dispatch } = useApp();
  const { showNotification } = useNotification();

  const [items, setItems] = useState([
    { name: '', quantity: 1, price: 0 },
  ]);

  const invoice = isEdit ? state.invoices.find((inv) => inv.id === id) : null;

  useEffect(() => {
    if (invoice && isEdit) {
      formik.setValues({
        clientId: invoice.clientId,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
      });
      setItems(invoice.items || [{ name: '', quantity: 1, price: 0 }]);
    }
  }, [invoice, isEdit]);

  const formik = useFormik({
    initialValues: {
      clientId: '',
      issueDate: format(new Date(), 'yyyy-MM-dd'),
      dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const selectedClient = state.clients.find((c) => c.id === values.clientId);
      const subtotal = items.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );
      const tax = subtotal * (state.company.taxRate / 100);
      const discount = 0;
      const total = subtotal + tax - discount;

      const invoiceData = {
        id: isEdit ? invoice.id : `INV-${String(state.invoices.length + 1).padStart(3, '0')}`,
        clientId: values.clientId,
        clientName: selectedClient?.name || '',
        issueDate: values.issueDate,
        dueDate: values.dueDate,
        items: items.filter((item) => item.name && item.price > 0),
        subtotal,
        tax,
        discount,
        total,
        status: isEdit ? invoice.status : 'pending',
      };

      if (isEdit) {
        dispatch({ type: 'UPDATE_INVOICE', payload: invoiceData });
        showNotification('Invoice updated successfully', 'success');
      } else {
        dispatch({ type: 'ADD_INVOICE', payload: invoiceData });
        showNotification('Invoice created successfully', 'success');
      }

      navigate('/invoices');
    },
  });

  const addItem = () => {
    setItems([...items, { name: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = field === 'quantity' || field === 'price' ? parseFloat(value) || 0 : value;
    setItems(updatedItems);
  };

  const calculateTotals = () => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    const tax = subtotal * (state.company.taxRate / 100);
    const discount = 0;
    const total = subtotal + tax - discount;
    return { subtotal, tax, discount, total };
  };

  const totals = calculateTotals();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        {isEdit ? 'Edit Invoice' : 'Create New Invoice'}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        {isEdit ? 'Update invoice details' : 'Fill in the details to create a new invoice'}
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Client Information
              </Typography>
              <TextField
                fullWidth
                select
                label="Client"
                name="clientId"
                value={formik.values.clientId}
                onChange={formik.handleChange}
                error={formik.touched.clientId && Boolean(formik.errors.clientId)}
                helperText={formik.touched.clientId && formik.errors.clientId}
                margin="normal"
              >
                {state.clients.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.name} - {client.company}
                  </MenuItem>
                ))}
              </TextField>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Invoice Details
              </Typography>
              <TextField
                fullWidth
                type="date"
                label="Issue Date"
                name="issueDate"
                value={formik.values.issueDate}
                onChange={formik.handleChange}
                error={formik.touched.issueDate && Boolean(formik.errors.issueDate)}
                helperText={formik.touched.issueDate && formik.errors.issueDate}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                type="date"
                label="Due Date"
                name="dueDate"
                value={formik.values.dueDate}
                onChange={formik.handleChange}
                error={formik.touched.dueDate && Boolean(formik.errors.dueDate)}
                helperText={formik.touched.dueDate && formik.errors.dueDate}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight={600}>
                  Items
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={addItem}
                  variant="outlined"
                  size="small"
                >
                  Add Item
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Item Name</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item, index) => {
                      const itemTotal = item.quantity * item.price;
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <TextField
                              size="small"
                              fullWidth
                              value={item.name}
                              onChange={(e) => updateItem(index, 'name', e.target.value)}
                              placeholder="Item name"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <TextField
                              size="small"
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                              inputProps={{ min: 1 }}
                              sx={{ width: 100 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <TextField
                              size="small"
                              type="number"
                              value={item.price}
                              onChange={(e) => updateItem(index, 'price', e.target.value)}
                              inputProps={{ min: 0, step: 0.01 }}
                              sx={{ width: 120 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(itemTotal)}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => removeItem(index)}
                              disabled={items.length === 1}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Summary
              </Typography>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Subtotal:</Typography>
                <Typography>{formatCurrency(totals.subtotal)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Tax ({state.company.taxRate}%):</Typography>
                <Typography>{formatCurrency(totals.tax)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Discount:</Typography>
                <Typography>{formatCurrency(totals.discount)}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" fontWeight={700}>
                  Total:
                </Typography>
                <Typography variant="h6" fontWeight={700} color="primary">
                  {formatCurrency(totals.total)}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => navigate('/invoices')}>
                Cancel
              </Button>
              <Button variant="outlined" type="submit">
                Save Draft
              </Button>
              <Button variant="contained" type="submit">
                {isEdit ? 'Update Invoice' : 'Send Invoice'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default InvoiceForm;