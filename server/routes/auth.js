const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/User');

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Find user by email
    const user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      return res.status(400).json({ message: 'Email ou senha inválidos' });
    }

    // If user exists with Google only
    if (!user.password) {
      return res.status(400).json({ 
        message: 'Esta conta foi criada com Google. Por favor, faça login com Google.' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email ou senha inválidos' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user info and token
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Google login route
router.post('/google', async (req, res) => {
  try {
    const { access_token } = req.body;

    // Obter informações do usuário do Google
    const googleUserInfo = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const { email, name, picture, sub: googleId } = googleUserInfo.data;

    // Procurar ou criar usuário
    let user = await User.findOne({ 
      $or: [{ email: email.toLowerCase() }, { googleId }]
    });

    if (!user) {
      // Criar novo usuário
      user = new User({
        email: email.toLowerCase(),
        name,
        picture,
        googleId
      });
      await user.save();
    } else {
      // Atualizar informações do usuário existente
      user.name = name;
      user.picture = picture;
      user.googleId = googleId;
      await user.save();
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    res.json({ 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture
      }
    });
  } catch (error) {
    console.error('Erro na autenticação do Google:', error);
    res.status(500).json({ message: 'Erro na autenticação do Google' });
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já está em uso' });
    }

    // Criar novo usuário
    const user = new User({
      email: email.toLowerCase(),
      password,
      name
    });

    await user.save();

    // Criar e retornar o token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    res.status(201).json({ 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

module.exports = router; 