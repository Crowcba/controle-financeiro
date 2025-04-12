import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import axios from 'axios';

const Dashboard = () => {
  const [investments, setInvestments] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    amount: '',
    rate: '',
    startDate: '',
    endDate: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchInvestments = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/investments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInvestments(res.data);
      } catch (error) {
        console.error('Error fetching investments:', error);
      }
    };

    fetchInvestments();
  }, [navigate]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/investments', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      handleClose();
      // Refresh investments list
      const res = await axios.get('http://localhost:5000/api/investments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvestments(res.data);
    } catch (error) {
      console.error('Error creating investment:', error);
    }
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
          Novo Investimento
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tipo</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Taxa</TableCell>
                <TableCell>Data Início</TableCell>
                <TableCell>Data Fim</TableCell>
                <TableCell>Valor Atual</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {investments.map((investment) => (
                <TableRow key={investment._id}>
                  <TableCell>{investment.type}</TableCell>
                  <TableCell>R$ {investment.amount.toFixed(2)}</TableCell>
                  <TableCell>{investment.rate}%</TableCell>
                  <TableCell>{new Date(investment.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(investment.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>R$ {investment.currentValue.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Novo Investimento</DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ mt: 1 }}>
              <TextField
                select
                fullWidth
                label="Tipo"
                name="type"
                value={formData.type}
                onChange={handleChange}
                margin="normal"
              >
                <MenuItem value="CDB">CDB</MenuItem>
                <MenuItem value="Tesouro Direto">Tesouro Direto</MenuItem>
                <MenuItem value="LCI">LCI</MenuItem>
                <MenuItem value="LCA">LCA</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Valor"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Taxa (%)"
                name="rate"
                type="number"
                value={formData.rate}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Data Início"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Data Fim"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSubmit}>Salvar</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Dashboard; 