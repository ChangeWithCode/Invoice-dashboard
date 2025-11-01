import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AppProvider, useApp } from './context/AppContext';
import { NotificationProvider } from './components/Notification';
import Layout from './components/layout/Layout';
import getTheme from './theme';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import InvoiceForm from './pages/InvoiceForm';
import Clients, { ClientDetails } from './pages/Clients';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

const AppContent = () => {
  const { state } = useApp();
  const theme = getTheme(state.theme);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/invoices/new" element={<InvoiceForm />} />
          <Route path="/invoices/:id" element={<InvoiceForm />} />
          <Route path="/invoices/:id/edit" element={<InvoiceForm />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/:id" element={<ClientDetails />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
};

function App() {
  return (
    <AppProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AppProvider>
  );
}

export default App;