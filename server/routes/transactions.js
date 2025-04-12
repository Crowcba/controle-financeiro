const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

// Create a new transaction
router.post('/', auth, async (req, res) => {
  try {
    const { type, category, description, amount, date } = req.body;
    
    const transaction = new Transaction({
      userId: req.user.userId,
      type,
      category,
      description,
      amount,
      date
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    res.status(500).json({ message: 'Erro ao criar transação' });
  }
});

// Get all transactions for a user
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.userId })
      .sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    res.status(500).json({ message: 'Erro ao buscar transações' });
  }
});

// Get transaction by id
router.get('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transação não encontrada' });
    }
    
    res.json(transaction);
  } catch (error) {
    console.error('Erro ao buscar transação:', error);
    res.status(500).json({ message: 'Erro ao buscar transação' });
  }
});

// Update transaction
router.put('/:id', auth, async (req, res) => {
  try {
    const { type, category, description, amount, date } = req.body;
    
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { type, category, description, amount, date },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: 'Transação não encontrada' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    res.status(500).json({ message: 'Erro ao atualizar transação' });
  }
});

// Delete transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transação não encontrada' });
    }

    res.json({ message: 'Transação excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir transação:', error);
    res.status(500).json({ message: 'Erro ao excluir transação' });
  }
});

module.exports = router; 