# Estrutura Arquitectónica do Projeto

## 📊 Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────┐
│                    PortfolioPageComponent                   │
│              (Container - Página Principal)                │
└──────────────────────────┬──────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
    ┌─────────────┐  ┌──────────────┐  ┌────────────┐
    │Portfolio    │  │PortfolioTable│  │Loading &   │
    │Service      │  │Component     │  │Error States│
    └─────────────┘  └──────────────┘  └────────────┘
         │                 │
         ├─────────┬───────┘
         │         │
         ▼         ▼
    ┌──────────────────────────┐
    │  StockApiService         │
    │  (Chamadas à API)        │
    └──────────────────────────┘
         │
         ▼
    ┌──────────────────────────┐
    │   API Externa            │
    │ (AlphaVantage/Finnhub/   │
    │  MarketStack)            │
    └──────────────────────────┘
```

## 📁 Estrutura de Ficheiros

```
Gestao_Portfolio/
├── src/
│   ├── app/
│   │   ├── models/
│   │   │   ├── stock.ts                  # Interface Stock
│   │   │   ├── portfolio.ts              # Interface Portfolio
│   │   │   └── api-response.ts           # Interfaces API
│   │   │
│   │   ├── services/
│   │   │   ├── stock-api.service.ts      # 📡 API de Cotações
│   │   │   │   └── Métodos:
│   │   │   │       ├── getStockQuote()
│   │   │   │       ├── getStockQuotes()
│   │   │   │       ├── getAlphaVantageQuote()
│   │   │   │       ├── getFinnhubQuote()
│   │   │   │       └── getMarketstackQuote()
│   │   │   │
│   │   │   ├── portfolio.service.ts      # 🎯 Gestão Carteira
│   │   │   │   └── Métodos:
│   │   │   │       ├── loadPortfolioFromFile()
│   │   │   │       ├── updateStockQuotes()
│   │   │   │       ├── calculatePortfolioValues()
│   │   │   │       ├── addStock()
│   │   │   │       ├── removeStock()
│   │   │   │       └── getPortfolio()
│   │   │   │
│   │   │   └── storage.service.ts        # 💾 Persistência
│   │   │       └── Métodos:
│   │   │           ├── savePortfolio()
│   │   │           ├── loadPortfolio()
│   │   │           ├── clearPortfolio()
│   │   │           └── hasPortfolio()
│   │   │
│   │   ├── components/
│   │   │   ├── portfolio-table/          # 📊 Tabela Principal
│   │   │   │   ├── portfolio-table.component.ts
│   │   │   │   ├── portfolio-table.component.html
│   │   │   │   └── portfolio-table.component.css
│   │   │   │
│   │   │   ├── stock-row/                # 📝 Linha de Stock
│   │   │   │   ├── stock-row.component.ts
│   │   │   │   ├── stock-row.component.html
│   │   │   │   └── stock-row.component.css
│   │   │   │
│   │   │   └── portfolio-summary/        # 📈 Sumário/Totais
│   │   │       ├── portfolio-summary.component.ts
│   │   │       ├── portfolio-summary.component.html
│   │   │       └── portfolio-summary.component.css
│   │   │
│   │   ├── pages/
│   │   │   └── portfolio-page/           # 🏠 Página Principal
│   │   │       ├── portfolio-page.component.ts
│   │   │       ├── portfolio-page.component.html
│   │   │       └── portfolio-page.component.css
│   │   │
│   │   ├── app.component.ts              # Root Component
│   │   ├── app.component.html
│   │   ├── app.component.css
│   │   └── app.module.ts
│   │
│   ├── assets/
│   │   └── data/
│   │       └── portfolio.json            # 📊 Dados Iniciais
│   │
│   ├── environments/
│   │   ├── environment.ts                # ⚙️ Dev Config
│   │   └── environment.prod.ts           # ⚙️ Prod Config
│   │
│   ├── styles.css                        # 🎨 Estilos Globais
│   ├── index.html                        # 📄 HTML Principal
│   ├── main.ts                           # 🚀 Ponto de Entrada
│   └── test.ts                           # 🧪 Config Testes
│
├── Configuration Files
│   ├── package.json                      # NPM Dependencies
│   ├── angular.json                      # Angular Config
│   ├── tsconfig.json                     # TypeScript Config
│   ├── tsconfig.app.json
│   ├── tsconfig.spec.json
│   ├── karma.conf.js                     # Testes Config
│   └── .gitignore
│
├── Documentation
│   ├── README.md                         # 📖 Documentação Principal
│   ├── API_CONFIG.md                     # 🔑 Configuração APIs
│   ├── EXAMPLES.md                       # 📋 Exemplos de Dados
│   ├── DEVELOPMENT.md                    # 🚀 Guia Desenvolvimento
│   └── .github/
│       └── copilot-instructions.md       # 📌 Instruções Projeto
│
└── Build Output
    └── dist/                             # 📦 Ficheiros Compilados
```

## 🔄 Fluxo de Componentes

```
┌─────────────────────────┐
│   app.component.ts      │  (Root)
│   (Standalone)          │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│   portfolio-page.component.ts               │  (Container)
│   - Carrega portfolio.json                  │
│   - Actualiza cotações                      │
│   - Gerencia erros e loading                │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│   portfolio-table.component.ts              │
│   - Itera sobre stocks                      │
│   - Renderiza linhas e totais               │
└──────────────┬──────────────────────────────┘
               │
        ┌──────┴───────┐
        │              │
        ▼              ▼
    ┌─────────┐  ┌──────────────┐
    │stock-   │  │portfolio-    │
    │row.ts   │  │summary.ts    │
    └─────────┘  └──────────────┘
```

## 🎯 Responsabilidades por Classe

### Models (Tipagem)
- **Stock**: Um activo individual na carteira
- **Portfolio**: Colecção de stocks
- **ApiStockResponse**: Resposta da API externa

### Services (Lógica)
- **StockApiService**: Interface com APIs externas
- **PortfolioService**: Cálculos e gestão de estado
- **StorageService**: Persistência de dados

### Components (Apresentação)
- **PortfolioPageComponent**: Orquestração e lógica de página
- **PortfolioTableComponent**: Renderização da tabela
- **StockRowComponent**: Linha individual
- **PortfolioSummaryComponent**: Totais finais

## 📊 Fluxo de Dados com Services

```
┌─────────────────────────────────────────────────────────────┐
│                  PortfolioPageComponent                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
              loadPortfolioFromFile()
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
        ▼                                     ▼
   Portfolio.json          StorageService.loadPortfolio()
    (assets/data)                 (localStorage)
        │                                     │
        └──────────────────┬──────────────────┘
                           │
                           ▼
                  PortfolioService$
                  (BehaviorSubject)
                           │
                           ▼
              updateStockQuotes()
                           │
                           ▼
                   StockApiService
                           │
                           ▼
                      External API
          (AlphaVantage/Finnhub/MarketStack)
                           │
                           ▼
              calculatePortfolioValues()
                           │
                           ▼
                   StorageService
                  (localStorage save)
                           │
                           ▼
            PortfolioTableComponent (Subscribe)
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
    StockRow          StockRow          Summary
   (MSFT data)       (TSLA data)        (Totals)
```

## 🔐 Segurança e Boas Práticas

```
┌──────────────────────────────────────────────┐
│          Security & Best Practices           │
├──────────────────────────────────────────────┤
│ ✓ Environment Variables para API Keys       │
│ ✓ HttpClient com error handling             │
│ ✓ RxJS operators para data transformation   │
│ ✓ localStorage para cache local             │
│ ✓ Standalone Components (Angular 14+)      │
│ ✓ Type Safety com TypeScript                │
│ ✓ Reactive patterns com observables         │
│ ✓ Separation of Concerns (Models/Services)  │
└──────────────────────────────────────────────┘
```
