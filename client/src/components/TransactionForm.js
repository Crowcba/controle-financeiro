import React, { useState, useEffect } from 'react';
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
  FormControlLabel,
  Switch,
  Collapse,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addMonths, format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import api from '../services/api';

function TransactionForm() {
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    description: '',
    amount: '',
    date: new Date(),
    investmentDetails: {
      type: '',
      indexer: '',
      rate: '',
      maturityDate: addMonths(new Date(), 12),
      monthlyIncome: false,
      expectedReturn: '',
      risk: 'Baixo'
    }
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [projections, setProjections] = useState(null);

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
      'Renda Fixa',
      'Renda Variável',
      'Fundos',
      'Outros'
    ]
  };

  const investmentTypes = [
    'CDB',
    'LCI',
    'LCA',
    'Tesouro Direto',
    'Fundos',
    'Ações',
    'FIIs',
    'Poupança',
    'Outros'
  ];

  const indexers = ['CDI', 'IPCA', 'Prefixado', 'Selic', 'Outro'];
  const riskLevels = ['Baixo', 'Médio', 'Alto'];

  // Taxa CDI atual (exemplo - você deve buscar isso de uma API)
  const currentCDI = 11.65;

  useEffect(() => {
    if (formData.type === 'investment' && 
        formData.amount && 
        formData.investmentDetails.rate &&
        formData.investmentDetails.indexer) {
      calculateProjections();
    }
  }, [formData.amount, formData.investmentDetails.rate, formData.investmentDetails.indexer]);

  const calculateProjections = () => {
    const amount = parseFloat(formData.amount);
    const rate = parseFloat(formData.investmentDetails.rate);
    const monthlyProjections = [];
    let currentAmount = amount;

    // Calcula projeção para os próximos 12 meses
    for (let i = 1; i <= 12; i++) {
      let monthlyReturn;
      
      if (formData.investmentDetails.indexer === 'CDI') {
        // Para investimentos atrelados ao CDI
        const effectiveRate = (currentCDI * (rate / 100)) / 12;
        monthlyReturn = currentAmount * (effectiveRate / 100);
      } else if (formData.investmentDetails.indexer === 'Prefixado') {
        // Para investimentos prefixados
        monthlyReturn = currentAmount * ((rate / 12) / 100);
      } else {
        // Para outros tipos de investimentos (simplificado)
        monthlyReturn = currentAmount * ((rate / 12) / 100);
      }

      currentAmount += monthlyReturn;
      
      monthlyProjections.push({
        month: format(addMonths(new Date(), i), 'MMM/yyyy', { locale: ptBR }),
        value: currentAmount,
        return: monthlyReturn
      });
    }

    setProjections(monthlyProjections);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name.startsWith('investmentDetails.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        investmentDetails: {
          ...prev.investmentDetails,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    setError('');
    setSuccess('');
  };

  const handleDateChange = (newDate, field = 'date') => {
    if (field === 'maturityDate') {
      setFormData(prev => ({
        ...prev,
        investmentDetails: {
          ...prev.investmentDetails,
          maturityDate: newDate
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: newDate
      }));
    }
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

      // Validações específicas para investimentos
      if (formData.type === 'investment') {
        if (!formData.investmentDetails.type || 
            !formData.investmentDetails.indexer || 
            !formData.investmentDetails.rate) {
          setError('Por favor, preencha todos os detalhes do investimento.');
          return;
        }
      }

      // Formatar os dados
      const transaction = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: formData.date.toISOString(),
        investmentDetails: formData.type === 'investment' ? {
          ...formData.investmentDetails,
          rate: parseFloat(formData.investmentDetails.rate),
          maturityDate: formData.investmentDetails.maturityDate.toISOString()
        } : undefined
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
        investmentDetails: {
          type: '',
          indexer: '',
          rate: '',
          maturityDate: addMonths(new Date(), 12),
          monthlyIncome: false,
          expectedReturn: '',
          risk: 'Baixo'
        }
      });
      setSuccess('Lançamento registrado com sucesso!');
      setProjections(null);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao registrar lançamento');
      console.error('Erro ao salvar transação:', error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4 }}>
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

            {formData.type === 'investment' && (
              <>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo de Investimento</InputLabel>
                    <Select
                      name="investmentDetails.type"
                      value={formData.investmentDetails.type}
                      onChange={handleChange}
                      label="Tipo de Investimento"
                    >
                      {investmentTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Indexador</InputLabel>
                    <Select
                      name="investmentDetails.indexer"
                      value={formData.investmentDetails.indexer}
                      onChange={handleChange}
                      label="Indexador"
                    >
                      {indexers.map((indexer) => (
                        <MenuItem key={indexer} value={indexer}>
                          {indexer}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Taxa (%)"
                    name="investmentDetails.rate"
                    type="number"
                    value={formData.investmentDetails.rate}
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: formData.investmentDetails.indexer === 'CDI' ? (
                        <InputAdornment position="end">% do CDI</InputAdornment>
                      ) : (
                        <InputAdornment position="end">% a.a.</InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Data de Vencimento"
                    value={formData.investmentDetails.maturityDate}
                    onChange={(newDate) => handleDateChange(newDate, 'maturityDate')}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.investmentDetails.monthlyIncome}
                        onChange={(e) => handleChange({
                          target: {
                            name: 'investmentDetails.monthlyIncome',
                            value: e.target.checked
                          }
                        })}
                      />
                    }
                    label="Gera Renda Mensal"
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Nível de Risco</InputLabel>
                    <Select
                      name="investmentDetails.risk"
                      value={formData.investmentDetails.risk}
                      onChange={handleChange}
                      label="Nível de Risco"
                    >
                      {riskLevels.map((risk) => (
                        <MenuItem key={risk} value={risk}>
                          {risk}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}

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
                onChange={(newDate) => handleDateChange(newDate)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </Grid>

            {projections && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Projeção para os próximos 12 meses
                </Typography>
                <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                  {projections.map((projection, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>
                        {projection.month}
                      </Typography>
                      <Typography>
                        R$ {projection.value.toFixed(2)} (+R$ {projection.return.toFixed(2)})
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>
            )}

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