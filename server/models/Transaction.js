const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['expense', 'income', 'investment'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  // Campos específicos para investimentos
  investmentDetails: {
    type: {
      type: String,
      enum: [
        'CDB',
        'LCI',
        'LCA',
        'Tesouro Direto',
        'Fundos',
        'Ações',
        'FIIs',
        'Poupança',
        'Outros'
      ]
    },
    indexer: {
      type: String,
      enum: ['CDI', 'IPCA', 'Prefixado', 'Selic', 'Outro']
    },
    rate: {
      type: Number, // Taxa em percentual (ex: 110 para 110% do CDI)
    },
    maturityDate: Date, // Data de vencimento
    monthlyIncome: Boolean, // Se gera renda mensal
    expectedReturn: Number, // Retorno esperado em percentual ao ano
    risk: {
      type: String,
      enum: ['Baixo', 'Médio', 'Alto']
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Índices para melhorar a performance das consultas
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ userId: 1, 'investmentDetails.type': 1 });

module.exports = mongoose.model('Transaction', transactionSchema); 