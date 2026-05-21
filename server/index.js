const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexão ao MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gestao_portfolio';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado ao MongoDB com sucesso!');
    console.log(`   Base de dados: ${MONGODB_URI}`);
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar ao MongoDB:', err.message);
    process.exit(1);
  });

// Rotas
const portfolioRoutes = require('./routes/portfolio');
app.use('/api', portfolioRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({
    message: 'API Gestão Portfolio - Servidor ativo',
    endpoints: {
      portfolio: '/api/portfolio',
      addStock: 'POST /api/portfolio/stocks',
      removeStock: 'DELETE /api/portfolio/stocks/:ticker',
      reset: 'POST /api/portfolio/reset'
    }
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor a correr na porta ${PORT}`);
  console.log(`   URL: http://localhost:${PORT}`);
});
