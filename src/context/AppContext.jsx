import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  invoices: [],
  clients: [],
  theme: localStorage.getItem('theme') || 'light',
  user: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: null,
  },
  company: {
    name: 'InvoicePro',
    email: 'contact@invoicepro.com',
    address: '123 Business St, City, Country',
    taxRate: 10,
    currency: 'USD',
    paymentTerms: 30,
  },
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_INVOICES':
      return { ...state, invoices: action.payload };
    case 'ADD_INVOICE':
      return { ...state, invoices: [...state.invoices, action.payload] };
    case 'UPDATE_INVOICE':
      return {
        ...state,
        invoices: state.invoices.map(inv =>
          inv.id === action.payload.id ? action.payload : inv
        ),
      };
    case 'DELETE_INVOICE':
      return {
        ...state,
        invoices: state.invoices.filter(inv => inv.id !== action.payload),
      };
    case 'SET_CLIENTS':
      return { ...state, clients: action.payload };
    case 'ADD_CLIENT':
      return { ...state, clients: [...state.clients, action.payload] };
    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map(client =>
          client.id === action.payload.id ? action.payload : client
        ),
      };
    case 'DELETE_CLIENT':
      return {
        ...state,
        clients: state.clients.filter(client => client.id !== action.payload),
      };
    case 'UPDATE_COMPANY':
      return { ...state, company: { ...state.company, ...action.payload } };
    case 'LOAD_DATA':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('invoiceAppData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        dispatch({ type: 'LOAD_DATA', payload: parsed });
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    } else {
      // Initialize with sample data
      const sampleInvoices = [
        {
          id: 'INV-001',
          clientId: 'CLI-001',
          clientName: 'Acme Corp',
          issueDate: '2024-01-15',
          dueDate: '2024-02-14',
          items: [
            { name: 'Web Development', quantity: 40, price: 100 },
            { name: 'UI/UX Design', quantity: 20, price: 150 },
          ],
          subtotal: 7000,
          tax: 700,
          discount: 0,
          total: 7700,
          status: 'paid',
        },
        {
          id: 'INV-002',
          clientId: 'CLI-002',
          clientName: 'Tech Solutions Ltd',
          issueDate: '2024-01-20',
          dueDate: '2024-02-19',
          items: [
            { name: 'Consulting', quantity: 30, price: 200 },
          ],
          subtotal: 6000,
          tax: 600,
          discount: 300,
          total: 6300,
          status: 'pending',
        },
        {
          id: 'INV-003',
          clientId: 'CLI-001',
          clientName: 'Acme Corp',
          issueDate: '2024-01-10',
          dueDate: '2024-02-09',
          items: [
            { name: 'Maintenance', quantity: 10, price: 150 },
          ],
          subtotal: 1500,
          tax: 150,
          discount: 0,
          total: 1650,
          status: 'overdue',
        },
      ];

      const sampleClients = [
        {
          id: 'CLI-001',
          name: 'Acme Corp',
          email: 'contact@acmecorp.com',
          company: 'Acme Corporation',
          address: '456 Corporate Ave, Business City',
          phone: '+1 234-567-8900',
        },
        {
          id: 'CLI-002',
          name: 'Tech Solutions Ltd',
          email: 'info@techsolutions.com',
          company: 'Tech Solutions Ltd',
          address: '789 Innovation Rd, Tech Valley',
          phone: '+1 234-567-8901',
        },
      ];

      dispatch({ type: 'SET_INVOICES', payload: sampleInvoices });
      dispatch({ type: 'SET_CLIENTS', payload: sampleClients });
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const dataToSave = {
      invoices: state.invoices,
      clients: state.clients,
      company: state.company,
    };
    localStorage.setItem('invoiceAppData', JSON.stringify(dataToSave));
  }, [state.invoices, state.clients, state.company]);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('theme', state.theme);
  }, [state.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};