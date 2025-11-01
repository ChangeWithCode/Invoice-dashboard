import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { format } from 'date-fns';
import StatusChip from './StatusChip';

const InvoiceCard = ({ invoice, onClick }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {invoice.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {invoice.clientName}
            </Typography>
          </Box>
          <StatusChip status={invoice.status} />
        </Box>
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Issue Date
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {format(new Date(invoice.issueDate), 'MMM dd, yyyy')}
            </Typography>
          </Box>
          <Box textAlign="right">
            <Typography variant="caption" color="text.secondary">
              Due Date
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
            </Typography>
          </Box>
        </Box>
        <Box mt={2}>
          <Typography variant="h6" fontWeight={700} color="primary">
            {formatCurrency(invoice.total)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default InvoiceCard;