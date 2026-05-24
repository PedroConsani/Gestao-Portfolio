const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');

/**
 * Dados padrão da carteira (seed) — usados quando não há dados no MongoDB
 */
const DEFAULT_PORTFOLIO = {
  nome: 'A minha carteira',
  mercado: 'NASDAQ / NYSE',
  dataAtualizacao: new Date().toISOString().split('T')[0],
  stocks: [
    {
      ticker: 'MSFT',
      empresa: 'Microsoft Corporation',
      dataCompra: '10/1/2024',
      quantidade: 10,
      precoCompra: 320
    },
    {
      ticker: 'TSLA',
      empresa: 'Tesla Inc.',
      dataCompra: '15/2/2024',
      quantidade: 5,
      precoCompra: 220
    }
  ]
};

/**
 * GET /api/portfolio
 * Obtém a carteira. Se não existir, cria uma com os dados padrão.
 */
router.get('/portfolio', async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne();

    if (!portfolio) {
      // Criar carteira padrão
      portfolio = new Portfolio(DEFAULT_PORTFOLIO);
      await portfolio.save();
      console.log('📋 Carteira padrão criada no MongoDB');
    }

    res.json(portfolio);
  } catch (error) {
    console.error('Erro ao obter carteira:', error);
    res.status(500).json({ error: 'Erro ao obter carteira', message: error.message });
  }
});

/**
 * PUT /api/portfolio
 * Atualiza a carteira inteira (usado após atualizar cotações, etc.)
 */
router.put('/portfolio', async (req, res) => {
  try {
    const data = req.body;

    let portfolio = await Portfolio.findOne();

    if (portfolio) {
      // Atualizar campos
      portfolio.nome = data.nome || portfolio.nome;
      portfolio.mercado = data.mercado || portfolio.mercado;
      portfolio.dataAtualizacao = data.dataAtualizacao || new Date().toISOString().split('T')[0];
      portfolio.stocks = data.stocks || portfolio.stocks;
      portfolio.totalAquisicao = data.totalAquisicao || 0;
      portfolio.totalValor = data.totalValor || 0;
      portfolio.variacaoTotal = data.variacaoTotal || 0;

      await portfolio.save();
    } else {
      portfolio = new Portfolio(data);
      await portfolio.save();
    }

    res.json(portfolio);
  } catch (error) {
    console.error('Erro ao atualizar carteira:', error);
    res.status(500).json({ error: 'Erro ao atualizar carteira', message: error.message });
  }
});

/**
 * POST /api/portfolio/stocks
 * Adiciona um stock à carteira.
 * Se o ticker já existir, faz merge (média ponderada do preço).
 */
router.post('/portfolio/stocks', async (req, res) => {
  try {
    const stock = req.body;

    if (!stock.ticker || !stock.empresa || !stock.quantidade || !stock.precoCompra) {
      return res.status(400).json({
        error: 'Dados inválidos',
        message: 'ticker, empresa, quantidade e precoCompra são obrigatórios'
      });
    }

    let portfolio = await Portfolio.findOne();

    if (!portfolio) {
      portfolio = new Portfolio(DEFAULT_PORTFOLIO);
    }

    // Verificar se o ticker já existe
    const existingIndex = portfolio.stocks.findIndex(
      s => s.ticker.toUpperCase() === stock.ticker.toUpperCase()
    );

    if (existingIndex >= 0) {
      // Merge: média ponderada
      const existing = portfolio.stocks[existingIndex];
      const novaQtd = existing.quantidade + stock.quantidade;
      existing.precoCompra = ((existing.quantidade * existing.precoCompra) + (stock.quantidade * stock.precoCompra)) / novaQtd;
      existing.quantidade = novaQtd;
      existing.cotacaoDia = null; // Forçar recálculo
    } else {
      portfolio.stocks.push({
        ticker: stock.ticker.toUpperCase().trim(),
        empresa: stock.empresa.trim(),
        dataCompra: stock.dataCompra || new Date().toLocaleDateString('pt-PT'),
        quantidade: stock.quantidade,
        precoCompra: stock.precoCompra
      });
    }

    await portfolio.save();
    res.status(201).json(portfolio);
  } catch (error) {
    console.error('Erro ao adicionar stock:', error);
    res.status(500).json({ error: 'Erro ao adicionar stock', message: error.message });
  }
});

/**
 * DELETE /api/portfolio/stocks/:ticker
 * Remove um stock da carteira pelo ticker.
 */
router.delete('/portfolio/stocks/:ticker', async (req, res) => {
  try {
    const ticker = req.params.ticker.toUpperCase();

    const portfolio = await Portfolio.findOne();

    if (!portfolio) {
      return res.status(404).json({ error: 'Carteira não encontrada' });
    }

    const originalLength = portfolio.stocks.length;
    portfolio.stocks = portfolio.stocks.filter(
      s => s.ticker.toUpperCase() !== ticker
    );

    if (portfolio.stocks.length === originalLength) {
      return res.status(404).json({ error: `Stock ${ticker} não encontrado na carteira` });
    }

    await portfolio.save();
    res.json(portfolio);
  } catch (error) {
    console.error('Erro ao remover stock:', error);
    res.status(500).json({ error: 'Erro ao remover stock', message: error.message });
  }
});

/**
 * POST /api/portfolio/reset
 * Repõe a carteira para um estado vazio (zerar carteira).
 */
router.post('/portfolio/reset', async (req, res) => {
  try {
    // Apagar todas as carteiras existentes
    await Portfolio.deleteMany({});

    // Criar nova carteira vazia (zerada)
    const portfolio = new Portfolio({
      nome: 'A minha carteira',
      mercado: 'NASDAQ / NYSE',
      dataAtualizacao: new Date().toISOString().split('T')[0],
      stocks: [],
      totalAquisicao: 0,
      totalValor: 0,
      variacaoTotal: 0
    });
    await portfolio.save();

    console.log('🔄 Carteira zerada com sucesso');
    res.json(portfolio);
  } catch (error) {
    console.error('Erro ao zerar carteira:', error);
    res.status(500).json({ error: 'Erro ao zerar carteira', message: error.message });
  }
});

module.exports = router;
