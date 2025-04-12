import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardCharts = ({ transactions }) => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const currentYear = new Date().getFullYear();
  
  // Prepare data for monthly income/expense chart
  const monthlyData = months.map((_, index) => {
    return transactions.reduce((acc, transaction) => {
      const transactionDate = new Date(transaction.date);
      if (transactionDate.getFullYear() === currentYear && transactionDate.getMonth() === index) {
        const amount = parseFloat(transaction.amount);
        if (transaction.type === 'income') {
          acc.income += amount;
        } else if (transaction.type === 'expense') {
          acc.expense += amount;
        }
      }
      return acc;
    }, { income: 0, expense: 0 });
  });

  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: 'Receitas',
        data: monthlyData.map(data => data.income),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Despesas',
        data: monthlyData.map(data => data.expense),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };

  // Prepare data for expense distribution pie chart
  const expenseCategories = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const category = transaction.category || 'Outros';
      acc[category] = (acc[category] || 0) + parseFloat(transaction.amount);
      return acc;
    }, {});

  const pieChartData = {
    labels: Object.keys(expenseCategories),
    datasets: [
      {
        data: Object.values(expenseCategories),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ]
      }
    ]
  };

  // Prepare data for daily expenses chart
  const today = new Date();
  const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
  
  const dailyExpenses = transactions
    .filter(t => t.type === 'expense' && new Date(t.date) >= thirtyDaysAgo)
    .reduce((acc, transaction) => {
      const date = new Date(transaction.date).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + parseFloat(transaction.amount);
      return acc;
    }, {});

  const sortedDates = Object.keys(dailyExpenses).sort();
  
  const dailyExpenseData = {
    labels: sortedDates.map(date => {
      const [year, month, day] = date.split('-');
      return `${day}/${month}`;
    }),
    datasets: [
      {
        label: 'Despesas Diárias',
        data: sortedDates.map(date => dailyExpenses[date]),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Receitas e Despesas Mensais
          </Typography>
          <Line data={lineChartData} options={{ maintainAspectRatio: false, height: 300 }} />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Distribuição de Despesas
          </Typography>
          <Pie data={pieChartData} options={{ maintainAspectRatio: false, height: 300 }} />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Despesas Diárias (Últimos 30 dias)
          </Typography>
          <Line 
            data={dailyExpenseData} 
            options={{ 
              maintainAspectRatio: false,
              height: 300,
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Valor (R$)'
                  }
                },
                x: {
                  title: {
                    display: true,
                    text: 'Data'
                  }
                }
              }
            }} 
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DashboardCharts; 