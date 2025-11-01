import React from 'react';
import { Chip } from '@mui/material';
import { CheckCircle, Schedule, Error } from '@mui/icons-material';

const StatusChip = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return {
          label: 'Paid',
          color: 'success',
          icon: <CheckCircle fontSize="small" />,
        };
      case 'pending':
        return {
          label: 'Pending',
          color: 'warning',
          icon: <Schedule fontSize="small" />,
        };
      case 'overdue':
        return {
          label: 'Overdue',
          color: 'error',
          icon: <Error fontSize="small" />,
        };
      default:
        return {
          label: 'Unknown',
          color: 'default',
          icon: null,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      color={config.color}
      size="small"
      sx={{ fontWeight: 500 }}
    />
  );
};

export default StatusChip;