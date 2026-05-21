const mongoose = require('mongoose');

/**
 * Schema para cada ação (Stock) dentro da carteira
 */
const StockSchema = new mongoose.Schema({
  ticker: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  empresa: {
    type: String,
    required: true,
    trim: true
  },
  dataCompra: {
    type: String,
    required: true
  },
  quantidade: {
    type: Number,
    required: true,
    min: 0
  },
  precoCompra: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    default: 0
  },
  cotacaoDia: {
    type: Number,
    default: null
  },
  valor: {
    type: Number,
    default: 0
  },
  variacao: {
    type: Number,
    default: 0
  }
}, { _id: true });

/**
 * Schema principal da Carteira (Portfolio)
 */
const PortfolioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  mercado: {
    type: String,
    required: true,
    trim: true
  },
  dataAtualizacao: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  stocks: {
    type: [StockSchema],
    default: []
  },
  totalAquisicao: {
    type: Number,
    default: 0
  },
  totalValor: {
    type: Number,
    default: 0
  },
  variacaoTotal: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
      return ret;
    }
  }
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
