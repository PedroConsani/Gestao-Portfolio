export const environment = {
  production: false,
  apiProvider: 'alphavantage', // Opções: 'alphavantage', 'finnhub', 'marketstack'
  apiKey: 'YOUR_API_KEY_HERE', // Substituir com a sua chave de API
  apiUrl: 'https://www.alphavantage.co/query' // URL base da API
};

// Instruções de configuração:
// 1. Escolha um provedor de API:
//    - AlphaVantage: https://www.alphavantage.co/
//    - Finnhub: https://finnhub.io/
//    - MarketStack: https://marketstack.com/

// 2. Registre-se e obtenha uma chave de API gratuita

// 3. Substitua 'YOUR_API_KEY_HERE' pela sua chave de API

// 4. Altere 'apiUrl' se necessário:
//    - AlphaVantage: https://www.alphavantage.co/query
//    - Finnhub: https://finnhub.io/api/v1/quote
//    - MarketStack: http://api.marketstack.com/v1/eod
