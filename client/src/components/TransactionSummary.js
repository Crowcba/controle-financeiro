import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';

const TransactionSummary = ({ transactions }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const summary = transactions.reduce((acc, transaction) => {
    const amount = parseFloat(transaction.amount);
    
    if (transaction.type === 'income') {
      acc.totalBalance += amount;
      if (new Date(transaction.date).getMonth() === new Date().getMonth()) {
        acc.monthlyIncome += amount;
      }
    } else if (transaction.type === 'expense') {
      acc.totalBalance -= amount;
      if (new Date(transaction.date).getMonth() === new Date().getMonth()) {
        acc.monthlyExpenses += amount;
      }
    } else if (transaction.type === 'investment') {
      acc.totalBalance -= amount;
      acc.totalInvestments += amount;
    }
    
    return acc;
  }, {
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    totalInvestments: 0
  });

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Saldo Total
          </Typography>
          <Typography component="p" variant="h4">
            {formatCurrency(summary.totalBalance)}
          </Typography>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
          <Typography component="h2" variant="h6" color="success.main" gutterBottom>
            Receitas do Mês
          </Typography>
          <Typography component="p" variant="h4">
            {formatCurrency(summary.monthlyIncome)}
          </Typography>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
          <Typography component="h2" variant="h6" color="error.main" gutterBottom>
            Despesas do Mês
          </Typography>
          <Typography component="p" variant="h4">
            {formatCurrency(summary.monthlyExpenses)}
          </Typography>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
          <Typography component="h2" variant="h6" color="info.main" gutterBottom>
            Total Investido
          </Typography>
          <Typography component="p" variant="h4">
            {formatCurrency(summary.totalInvestments)}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default TransactionSummary; 