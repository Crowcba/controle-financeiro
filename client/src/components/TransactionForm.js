import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  InputAdornment,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBR from 'date-fns/locale/pt-BR';
import api from '../services/api';

function TransactionForm() {
  const [formData, setFormData] = useState({
    type: 'expense', // 'expense', 'income', 'investment'
    category: '',
    description: '',
    amount: '',
    date: new Date(),
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = {
    expense: [
      'Alimentação',
      'Transporte',
      'Moradia',
      'Saúde',
      'Educação',
      'Lazer',
      'Outros'
    ],
    income: [
      'Salário',
      'Freelance',
      'Investimentos',
      'Outros'
    ],
    investment: [
      'Ações',
      'Fundos Imobiliários',
      'Tesouro Direto',
      'Criptomoedas',
      'Outros'
    ]
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleDateChange = (newDate) => {
    setFormData(prev => ({
      ...prev,
      date: newDate
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      // Validações
      if (!formData.category || !formData.amount || !formData.description) {
        setError('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
        setError('Por favor, insira um valor válido.');
        return;
      }

      // Formatar os dados
      const transaction = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: formData.date.toISOString()
      };

      // Enviar para o backend
      await api.post('/transactions', transaction);
      
      // Limpar formulário e mostrar mensagem de sucesso
      setFormData({
        type: 'expense',
        category: '',
        description: '',
        amount: '',
        date: new Date(),
      });
      setSuccess('Lançamento registrado com sucesso!');
      
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao registrar lançamento');
      console.error('Erro ao salvar transação:', error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Novo Lançamento
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Lançamento</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label="Tipo de Lançamento"
                >
                  <MenuItem value="expense">Despesa</MenuItem>
                  <MenuItem value="income">Receita</MenuItem>
                  <MenuItem value="investment">Investimento</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Categoria</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Categoria"
                >
                  {categories[formData.type].map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Valor"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Data"
                value={formData.date}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 2 }}
              >
                Registrar Lançamento
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
}

export default TransactionForm; 