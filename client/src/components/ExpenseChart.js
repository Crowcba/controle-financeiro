import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ExpenseChart = ({ expenses }) => {
  // Process expenses data for the chart
  const processData = () => {
    const groupedData = {};
    
    expenses.forEach(expense => {
      const date = new Date(expense.date).toLocaleDateString();
      if (!groupedData[date]) {
        groupedData[date] = 0;
      }
      groupedData[date] += parseFloat(expense.amount);
    });

    return {
      labels: Object.keys(groupedData),
      data: Object.values(groupedData)
    };
  };

  const { labels, data } = processData();

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Despesas Diárias',
        data,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Gráfico de Despesas'
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
          text: 'Data'
        }
      }
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '20px auto' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ExpenseChart; 