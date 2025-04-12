import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function Dashboard() {
  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1">
          Bem-vindo ao seu painel de controle financeiro!
        </Typography>
      </Box>
    </Container>
  );
}

export default Dashboard; 