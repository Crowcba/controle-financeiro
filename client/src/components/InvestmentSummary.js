import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
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

const InvestmentSummary = ({ investments }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Calcular o valor total investido
  const totalInvested = investments.reduce((acc, investment) => {
    return acc + parseFloat(investment.amount);
  }, 0);

  // Preparar dados para o gráfico de distribuição por tipo
  const investmentTypes = investments.reduce((acc, investment) => {
    const type = investment.type || 'Outros';
    acc[type] = (acc[type] || 0) + parseFloat(investment.amount);
    return acc;
  }, {});

  const pieChartData = {
    labels: Object.keys(investmentTypes),
    datasets: [
      {
        data: Object.values(investmentTypes),
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

  // Preparar dados para o gráfico de evolução mensal
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const currentYear = new Date().getFullYear();
  
  const monthlyInvestments = months.map((_, index) => {
    return investments.reduce((acc, investment) => {
      const investmentDate = new Date(investment.date);
      if (investmentDate.getFullYear() === currentYear && investmentDate.getMonth() === index) {
        acc += parseFloat(investment.amount);
      }
      return acc;
    }, 0);
  });

  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: 'Investimentos Mensais',
        data: monthlyInvestments,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const chartContainerStyle = {
    height: '300px',
    position: 'relative',
    margin: 'auto'
  };

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Resumo dos Investimentos
          </Typography>
          <Typography variant="h4" color="primary" gutterBottom>
            {formatCurrency(totalInvested)}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Valor Total Investido
          </Typography>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Distribuição por Tipo
          </Typography>
          <Box sx={chartContainerStyle}>
            <Pie 
              data={pieChartData} 
              options={{ 
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  }
                }
              }} 
            />
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Evolução Mensal
          </Typography>
          <Box sx={chartContainerStyle}>
            <Line 
              data={lineChartData} 
              options={{ 
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  }
                },
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
                      text: 'Mês'
                    }
                  }
                }
              }} 
            />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default InvestmentSummary; 