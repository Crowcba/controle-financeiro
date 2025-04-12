const express = require('express');
const router = express.Router();

// Mock user data
const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  investments: [1, 2] // IDs of investments
};

// Get user profile
router.get('/profile', (req, res) => {
  res.json(mockUser);
});

// Update user profile
router.put('/profile', (req, res) => {
  const updatedUser = { ...mockUser, ...req.body };
  res.json(updatedUser);
});

module.exports = router; 