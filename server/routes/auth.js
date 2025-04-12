const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock user for testing
const mockUser = {
  email: 'test@example.com',
  password: '$2a$10$YourHashedPasswordHere' // This should be a real hashed password in production
};

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists (mock validation)
    if (email !== mockUser.email) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Validate password (mock validation)
    const isMatch = await bcrypt.compare(password, mockUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and return JWT token
    const token = jwt.sign(
      { email: mockUser.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists (mock validation)
    if (email === mockUser.email) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // In a real application, you would save the user to the database here
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 