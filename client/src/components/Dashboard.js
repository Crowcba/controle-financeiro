import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Fab,
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

const drawerWidth = 240;

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userStr));
  }, [navigate]);

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
        <ListItem button component={Link} to="/dashboard">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Visão Geral" />
        </ListItem>
        <ListItem button component={Link} to="/transactions/new">
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
            keepMounted: true, // Better open performance on mobile.
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
          position: 'relative',
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Saldo Total */}
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                }}
              >
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Saldo Total
                </Typography>
                <Typography component="p" variant="h4">
                  R$ 0,00
                </Typography>
              </Paper>
            </Grid>
            {/* Receitas do Mês */}
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                }}
              >
                <Typography component="h2" variant="h6" color="success.main" gutterBottom>
                  Receitas do Mês
                </Typography>
                <Typography component="p" variant="h4">
                  R$ 0,00
                </Typography>
              </Paper>
            </Grid>
            {/* Despesas do Mês */}
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                }}
              >
                <Typography component="h2" variant="h6" color="error.main" gutterBottom>
                  Despesas do Mês
                </Typography>
                <Typography component="p" variant="h4">
                  R$ 0,00
                </Typography>
              </Paper>
            </Grid>
            {/* Últimas Transações */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Últimas Transações
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Nenhuma transação registrada
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
        
        {/* Floating Action Button for quick access to new transaction */}
        <Fab
          color="primary"
          aria-label="add"
          component={Link}
          to="/transactions/new"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
        >
          <AddIcon />
        </Fab>
      </Box>
    </Box>
  );
}

export default Dashboard; 