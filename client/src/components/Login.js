import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Grid,
  Divider,
} from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';
import api from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      setError('Email ou senha inválidos');
      console.error('Erro no login:', error);
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Envie o token de acesso para seu backend
        const response = await api.post('/auth/google', {
          access_token: tokenResponse.access_token
        });
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      } catch (error) {
        setError('Erro ao fazer login com Google');
        console.error('Erro no login com Google:', error);
      }
    },
    onError: () => {
      setError('Erro ao fazer login com Google');
    }
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          <Box sx={{ mt: 2, width: '100%' }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => login()}
              sx={{
                backgroundColor: '#fff',
                color: '#757575',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
                textTransform: 'none',
                display: 'flex',
                gap: 1,
              }}
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                style={{ width: 20, height: 20 }}
              />
              Continuar com Google
            </Button>
          </Box>
          <Divider sx={{ my: 3, width: '100%' }}>ou</Divider>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Entrar
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <Button variant="text" color="primary">
                    Não tem uma conta? Cadastre-se
                  </Button>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login; 