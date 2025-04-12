const express = require('express');
const router = express.Router();

// Mock investments data
const mockInvestments = [
  {
    id: 1,
    name: 'Tesouro Direto',
    value: 1000,
    date: '2024-01-01',
    type: 'fixed-income'
  },
  {
    id: 2,
    name: 'Ações',
    value: 2000,
    date: '2024-02-01',
    type: 'variable-income'
  }
];

// Get all investments
router.get('/', (req, res) => {
  res.json(mockInvestments);
});

// Get investment by id
router.get('/:id', (req, res) => {
  const investment = mockInvestments.find(i => i.id === parseInt(req.params.id));
  if (!investment) {
    return res.status(404).json({ message: 'Investment not found' });
  }
  res.json(investment);
});

// Create new investment
router.post('/', (req, res) => {
  const newInvestment = {
    id: mockInvestments.length + 1,
    ...req.body
  };
  mockInvestments.push(newInvestment);
  res.status(201).json(newInvestment);
});

// Update investment
router.put('/:id', (req, res) => {
  const index = mockInvestments.findIndex(i => i.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Investment not found' });
  }
  mockInvestments[index] = { ...mockInvestments[index], ...req.body };
  res.json(mockInvestments[index]);
});

// Delete investment
router.delete('/:id', (req, res) => {
  const index = mockInvestments.findIndex(i => i.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Investment not found' });
  }
  mockInvestments.splice(index, 1);
  res.status(204).send();
});

module.exports = router; 