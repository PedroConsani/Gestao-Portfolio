# Configuração de APIs de Cotações

Este projeto suporta três provedores de API para obtenção de cotações em tempo real. Escolha um e configure a sua chave de API.

## 1. AlphaVantage

### Registar-se
1. Aceda a https://www.alphavantage.co/
2. Clique em "GET FREE API KEY"
3. Preencha o formulário e receba a chave por email

### Configuração
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiProvider: 'alphavantage',
  apiKey: 'YOUR_ALPHAVANTAGE_API_KEY',
  apiUrl: 'https://www.alphavantage.co/query'
};
```

### Características
- ✅ Gratuito com limite de 5 chamadas por minuto
- ✅ Suporta múltiplas classes de activos
- ✅ Dados históricos disponíveis
- ℹ️ Resposta JSON simples

### Documentação
https://www.alphavantage.co/documentation/

---

## 2. Finnhub

### Registar-se
1. Aceda a https://finnhub.io/
2. Clique em "Sign Up"
3. Complete o registo e obtenha a chave API

### Configuração
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiProvider: 'finnhub',
  apiKey: 'YOUR_FINNHUB_API_KEY',
  apiUrl: 'https://finnhub.io/api/v1/quote'
};
```

### Características
- ✅ Gratuito com limite de 60 chamadas por minuto
- ✅ Cotações em tempo real
- ✅ Interface moderna
- ℹ️ Documentação clara

### Documentação
https://finnhub.io/docs/api

---

## 3. MarketStack

### Registar-se
1. Aceda a https://marketstack.com/
2. Clique em "Sign Up Free"
3. Verifique o email e obtenha a chave API

### Configuração
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiProvider: 'marketstack',
  apiKey: 'YOUR_MARKETSTACK_API_KEY',
  apiUrl: 'http://api.marketstack.com/v1/eod'
};
```

### Características
- ✅ Gratuito com limite de 100 chamadas por dia
- ✅ Dados históricos (eod = end of day)
- ✅ Múltiplas moedas
- ℹ️ Actualização diária

### Documentação
https://marketstack.com/documentation

---

## Exemplo: Adicionar um novo Stock

Edite `src/assets/data/portfolio.json`:

```json
{
  "nome": "Minha Carteira",
  "mercado": "NASDAQ",
  "dataAtualizacao": "2026-05-21",
  "stocks": [
    {
      "ticker": "AAPL",
      "empresa": "Apple",
      "dataCompra": "15/01/2026",
      "quantidade": 10,
      "precoCompra": 150.00
    },
    {
      "ticker": "GOOGL",
      "empresa": "Alphabet",
      "dataCompra": "20/02/2026",
      "quantidade": 5,
      "precoCompra": 2800.00
    }
  ]
}
```

## Resolução de Problemas

### API retorna erro
1. Verifique se a chave está correcta
2. Verifique se o ticker é válido (ex: MSFT, TSLA)
3. Verifique o limite de chamadas
4. Veja a documentação da API

### CORS Error
Se receber erro de CORS, você pode:
1. Usar um proxy CORS (não recomendado em produção)
2. Implementar um backend proxy
3. Usar a API que suporta CORS

### Ticker não encontrado
- Verifique a ortografia do ticker (deve ser em maiúsculas)
- Use tickers da bolsa NASDAQ ou NYSE
- Evite símbolos inválidos

## Boas Práticas

1. **Segurança**: Nunca exponha a sua chave de API em produção
2. **Rate Limiting**: Implemente cache para evitar múltiplas chamadas
3. **Error Handling**: Sempre trate erros de rede
4. **Alternativas**: Tenha um plano B se uma API falhar
