import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBR from 'date-fns/locale/pt-BR';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import './App.css';

// Criar um tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Seu Google Client ID - Substitua pelo seu Client ID real do Google Cloud Console
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
          <CssBaseline />
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/transactions/new" element={<TransactionForm />} />
                {/* Adicione outras rotas aqui conforme necessário */}
              </Routes>
            </div>
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App; 