import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Container,
  Grid,
  Paper,
  Avatar,
  Menu,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import DashboardCharts from './DashboardCharts';
import api from '../services/api';
import TransactionList from './TransactionList';
import TransactionSummary from './TransactionSummary';

const drawerWidth = 240;

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    totalInvestments: 0
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userStr));
    fetchTransactions();
  }, [navigate]);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions');
      setTransactions(response.data);
      calculateSummary(response.data);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      setError('Erro ao carregar transações');
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (transactions) => {
    const currentMonth = format(new Date(), 'yyyy-MM');
    
    const summary = transactions.reduce((acc, transaction) => {
      const transactionMonth = format(new Date(transaction.date), 'yyyy-MM');
      
      if (transaction.type === 'income') {
        acc.totalBalance += transaction.amount;
        if (transactionMonth === currentMonth) {
          acc.monthlyIncome += transaction.amount;
        }
      } else if (transaction.type === 'expense') {
        acc.totalBalance -= transaction.amount;
        if (transactionMonth === currentMonth) {
          acc.monthlyExpenses += transaction.amount;
        }
      } else if (transaction.type === 'investment') {
        acc.totalInvestments += transaction.amount;
      }
      
      return acc;
    }, {
      totalBalance: 0,
      monthlyIncome: 0,
      monthlyExpenses: 0,
      totalInvestments: 0
    });

    setSummary(summary);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        <ListItem button>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Visão Geral" />
        </ListItem>
        <ListItem button onClick={() => navigate('/transactions/new')}>
          <ListItemIcon>
            <ReceiptIcon />
          </ListItemIcon>
          <ListItemText primary="Novo Lançamento" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <AccountBalanceIcon />
          </ListItemIcon>
          <ListItemText primary="Contas" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <TrendingUpIcon />
          </ListItemIcon>
          <ListItemText primary="Investimentos" />
        </ListItem>
      </List>
    </div>
  );

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Controle Financeiro
          </Typography>
          <IconButton
            onClick={handleMenuClick}
            size="large"
            sx={{ ml: 2 }}
            aria-controls="user-menu"
            aria-haspopup="true"
          >
            {user.picture ? (
              <Avatar src={user.picture} alt={user.name} />
            ) : (
              <Avatar>{user.name?.[0]}</Avatar>
            )}
          </IconButton>
          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Perfil
            </MenuItem>
            <MenuItem onClick={handleLogout}>Sair</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          
          <TransactionSummary transactions={transactions} />
          <DashboardCharts transactions={transactions} />
          <TransactionList transactions={transactions} setTransactions={setTransactions} />
        </Container>
      </Box>
    </Box>
  );
}

export default Dashboard; 