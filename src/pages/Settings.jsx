import React from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useApp } from '../context/AppContext';
import { useNotification } from '../components/Notification';

const validationSchema = yup.object({
  name: yup.string().required('Company name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  address: yup.string(),
  taxRate: yup.number().min(0).max(100).required('Tax rate is required'),
  currency: yup.string().required('Currency is required'),
  paymentTerms: yup.number().min(1).required('Payment terms are required'),
});

const Settings = () => {
  const { state, dispatch } = useApp();
  const { showNotification } = useNotification();

  const formik = useFormik({
    initialValues: {
      name: state.company.name,
      email: state.company.email,
      address: state.company.address,
      taxRate: state.company.taxRate,
      currency: state.company.currency,
      paymentTerms: state.company.paymentTerms,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch({ type: 'UPDATE_COMPANY', payload: values });
      showNotification('Settings saved successfully', 'success');
    },
  });

  const handleThemeToggle = () => {
    dispatch({
      type: 'SET_THEME',
      payload: state.theme === 'light' ? 'dark' : 'light',
    });
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Manage your company details and preferences
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Company Information
              </Typography>
              <TextField
                fullWidth
                label="Company Name"
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
                label="Address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                margin="normal"
                multiline
                rows={3}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Invoice Settings
              </Typography>
              <TextField
                fullWidth
                label="Tax Rate (%)"
                name="taxRate"
                type="number"
                value={formik.values.taxRate}
                onChange={formik.handleChange}
                error={formik.touched.taxRate && Boolean(formik.errors.taxRate)}
                helperText={formik.touched.taxRate && formik.errors.taxRate}
                margin="normal"
                inputProps={{ min: 0, max: 100 }}
              />
              <TextField
                fullWidth
                select
                label="Currency"
                name="currency"
                value={formik.values.currency}
                onChange={formik.handleChange}
                error={formik.touched.currency && Boolean(formik.errors.currency)}
                helperText={formik.touched.currency && formik.errors.currency}
                margin="normal"
              >
                <MenuItem value="USD">USD ($)</MenuItem>
                <MenuItem value="EUR">EUR (?)</MenuItem>
                <MenuItem value="GBP">GBP (?)</MenuItem>
                <MenuItem value="JPY">JPY (?)</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Payment Terms (Days)"
                name="paymentTerms"
                type="number"
                value={formik.values.paymentTerms}
                onChange={formik.handleChange}
                error={
                  formik.touched.paymentTerms && Boolean(formik.errors.paymentTerms)
                }
                helperText={
                  formik.touched.paymentTerms && formik.errors.paymentTerms
                }
                margin="normal"
                inputProps={{ min: 1 }}
              />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Preferences
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={state.theme === 'dark'}
                    onChange={handleThemeToggle}
                  />
                }
                label="Dark Mode"
              />
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary">
                  Enable dark mode for a more comfortable viewing experience
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => formik.resetForm()}>
                Reset
              </Button>
              <Button variant="contained" type="submit">
                Save Changes
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default Settings;