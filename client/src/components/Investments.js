import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  FormControlLabel,
  Switch
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import InvestmentSummary from './InvestmentSummary';

const Investments = () => {
  const [investments, setInvestments] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: '',
    date: new Date().toISOString().split('T')[0],
    autoUpdate: false,
    updateDay: 1
  });

  const investmentTypes = [
    { value: 'Ações', autoUpdate: false },
    { value: 'Fundos Imobiliários', autoUpdate: true },
    { value: 'Tesouro Direto', autoUpdate: true },
    { value: 'CDB', autoUpdate: true },
    { value: 'LCI/LCA', autoUpdate: true },
    { value: 'Poupança', autoUpdate: true },
    { value: 'Outros', autoUpdate: false }
  ];

  useEffect(() => {
    fetchInvestments();
    // Verificar atualizações mensais
    checkMonthlyUpdates();
  }, []);

  const fetchInvestments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/investments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvestments(response.data);
      setLoading(false);
    } catch (error) {
      setError('Erro ao carregar investimentos');
      setLoading(false);
    }
  };

  const checkMonthlyUpdates = async () => {
    try {
      const token = localStorage.getItem('token');
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      
      // Verificar se já atualizamos este mês
      const lastUpdate = localStorage.getItem('lastInvestmentUpdate');
      if (lastUpdate && new Date(lastUpdate) >= firstDayOfMonth) {
        return;
      }

      // Buscar investimentos que precisam de atualização
      const response = await axios.get('http://localhost:5000/api/investments/check-updates', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.length > 0) {
        // Atualizar investimentos
        await axios.post('http://localhost:5000/api/investments/update', {
          investments: response.data
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Atualizar data da última verificação
        localStorage.setItem('lastInvestmentUpdate', new Date().toISOString());
        
        // Recarregar investimentos
        fetchInvestments();
      }
    } catch (error) {
      console.error('Erro ao verificar atualizações:', error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      description: '',
      amount: '',
      type: '',
      date: new Date().toISOString().split('T')[0],
      autoUpdate: false,
      updateDay: 1
    });
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'autoUpdate' ? checked : value
    });

    // Se o tipo de investimento mudou, atualizar autoUpdate baseado no tipo
    if (name === 'type') {
      const selectedType = investmentTypes.find(type => type.value === value);
      setFormData(prev => ({
        ...prev,
        type: value,
        autoUpdate: selectedType?.autoUpdate || false
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/investments', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchInvestments();
      handleClose();
    } catch (error) {
      setError('Erro ao adicionar investimento');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/investments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchInvestments();
    } catch (error) {
      setError('Erro ao deletar investimento');
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  if (loading) return <Typography>Carregando...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Investimentos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Novo Investimento
        </Button>
      </Box>

      <InvestmentSummary investments={investments} />

      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Lista de Investimentos
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell align="right">Valor</TableCell>
                <TableCell>Atualização</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {investments.map((investment) => (
                <TableRow key={investment._id}>
                  <TableCell>{formatDate(investment.date)}</TableCell>
                  <TableCell>{investment.description}</TableCell>
                  <TableCell>{investment.type}</TableCell>
                  <TableCell align="right">{formatCurrency(investment.amount)}</TableCell>
                  <TableCell>
                    {investment.autoUpdate ? 'Automática' : 'Manual'}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(investment._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Novo Investimento</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrição"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
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
                  required
                  InputProps={{
                    startAdornment: 'R$'
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Tipo"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  {investmentTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.value}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Data"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.autoUpdate}
                      onChange={handleChange}
                      name="autoUpdate"
                      disabled={!investmentTypes.find(t => t.value === formData.type)?.autoUpdate}
                    />
                  }
                  label="Atualização Automática Mensal"
                />
              </Grid>
              {formData.autoUpdate && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Dia da Atualização"
                    name="updateDay"
                    type="number"
                    value={formData.updateDay}
                    onChange={handleChange}
                    required
                    inputProps={{ min: 1, max: 31 }}
                  />
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">
              Salvar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Investments; 