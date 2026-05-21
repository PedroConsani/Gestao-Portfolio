# Exemplos de Ficheiros portfolio.json

## Exemplo 1: Carteira NASDAQ Básica

```json
{
  "nome": "Carteira NASDAQ",
  "mercado": "NASDAQ",
  "dataAtualizacao": "2026-05-21",
  "stocks": [
    {
      "ticker": "MSFT",
      "empresa": "Microsoft",
      "dataCompra": "01/03/2026",
      "quantidade": 20,
      "precoCompra": 320.00
    },
    {
      "ticker": "TSLA",
      "empresa": "Tesla",
      "dataCompra": "20/03/2026",
      "quantidade": 50,
      "precoCompra": 220.00
    }
  ]
}
```

## Exemplo 2: Carteira Diversificada

```json
{
  "nome": "Carteira Diversificada",
  "mercado": "NYSE/NASDAQ",
  "dataAtualizacao": "2026-05-21",
  "stocks": [
    {
      "ticker": "AAPL",
      "empresa": "Apple",
      "dataCompra": "10/01/2026",
      "quantidade": 15,
      "precoCompra": 180.50
    },
    {
      "ticker": "GOOGL",
      "empresa": "Alphabet",
      "dataCompra": "15/02/2026",
      "quantidade": 8,
      "precoCompra": 2900.00
    },
    {
      "ticker": "AMZN",
      "empresa": "Amazon",
      "dataCompra": "05/03/2026",
      "quantidade": 12,
      "precoCompra": 3200.00
    },
    {
      "ticker": "META",
      "empresa": "Meta Platforms",
      "dataCompra": "20/04/2026",
      "quantidade": 25,
      "precoCompra": 320.00
    },
    {
      "ticker": "NVDA",
      "empresa": "NVIDIA",
      "dataCompra": "30/04/2026",
      "quantidade": 10,
      "precoCompra": 875.00
    }
  ]
}
```

## Exemplo 3: Carteira com Valores Variados

```json
{
  "nome": "Carteira Portuguesa",
  "mercado": "PSI-20",
  "dataAtualizacao": "2026-05-21",
  "stocks": [
    {
      "ticker": "BCP",
      "empresa": "Banco Comercial Português",
      "dataCompra": "12/01/2026",
      "quantidade": 100,
      "precoCompra": 0.85
    },
    {
      "ticker": "EDPR",
      "empresa": "EDP Renováveis",
      "dataCompra": "25/02/2026",
      "quantidade": 50,
      "precoCompra": 28.50
    },
    {
      "ticker": "REN",
      "empresa": "REN",
      "dataCompra": "10/03/2026",
      "quantidade": 75,
      "precoCompra": 8.75
    }
  ]
}
```

## Exemplo 4: Carteira com Uma Ação

```json
{
  "nome": "Single Stock Portfolio",
  "mercado": "NASDAQ",
  "dataAtualizacao": "2026-05-21",
  "stocks": [
    {
      "ticker": "BRK.B",
      "empresa": "Berkshire Hathaway Inc. Class B",
      "dataCompra": "01/05/2026",
      "quantidade": 5,
      "precoCompra": 350.00
    }
  ]
}
```

## Notas Importantes

1. **Data de Compra**: Use formato DD/MM/YYYY
2. **Ticker**: Use símbolos exactos do mercado (ex: MSFT, TSLA, BRK.B)
3. **Quantidade**: Número inteiro (sem casas decimais)
4. **Preço**: Decimal com ponto (200.50, não 200,50)
5. **Mercado**: Indique o mercado/bolsa (NASDAQ, NYSE, PSI-20, etc.)

## Tickers Populares NASDAQ

| Ticker | Empresa | Sector |
|--------|---------|--------|
| AAPL | Apple | Tecnologia |
| MSFT | Microsoft | Tecnologia |
| AMZN | Amazon | E-commerce |
| GOOGL | Alphabet | Tecnologia |
| TSLA | Tesla | Automóvel |
| META | Meta Platforms | Social Media |
| NVDA | NVIDIA | Chips |
| AMD | Advanced Micro Devices | Chips |
| INTC | Intel | Chips |
| NFLX | Netflix | Media |

## Tickers Populares NYSE

| Ticker | Empresa | Sector |
|--------|---------|--------|
| JPM | JPMorgan Chase | Banca |
| BAC | Bank of America | Banca |
| IBM | IBM | Tecnologia |
| Ford | Ford Motor | Automóvel |
| GM | General Motors | Automóvel |
| XOM | ExxonMobil | Energia |
| CVX | Chevron | Energia |

Para encontrar mais tickers, consulte:
- Yahoo Finance: https://finance.yahoo.com
- Google Finance: https://www.google.com/finance
- Investing.com: https://www.investing.com
