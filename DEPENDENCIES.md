# 📦 Diagrama de Dependências e Fluxo

## 🔗 Dependências do Projeto

```
package.json
├── @angular/core
├── @angular/common
├── @angular/platform-browser
├── @angular/platform-browser-dynamic
├── @angular/forms
├── @angular/router
├── @angular/animations
├── rxjs
├── tslib
└── zone.js
```

## 🏗️ Hierarquia de Componentes e Services

```
┌─────────────────────────────────────────────────────────┐
│                  AppComponent                            │
│              (Standalone, Root)                          │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ imports
                       ▼
┌─────────────────────────────────────────────────────────┐
│            PortfolioPageComponent                       │
│  (Standalone, Container, Manages State)                │
└──────────────────────┬──────────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
          │ imports                 │ uses
          ▼                         ▼
┌──────────────────────┐  ┌───────────────────────┐
│PortfolioTableComp.   │  │PortfolioService      │
│(Standalone)          │  │(Injectable)           │
└──────────────────────┘  └───────────┬───────────┘
          │                           │
    ┌─────┴──────┐              ┌─────┴─────┐
    │            │              │           │
    ▼            ▼              ▼           ▼
┌────────────┐ ┌──────────────┐ ┌─────────────────┐
│StockRowC.  │ │PortfolioSum- │ │StockApiService  │
│(Standalone)│ │mary.ts       │ │(Injectable)     │
└────────────┘ │(Standalone)  │ └────────┬────────┘
               └──────────────┘          │
                                         ▼
                                 ┌──────────────────┐
                                 │HttpClient        │
                                 │(Angular Module)  │
                                 └────────┬─────────┘
                                          │
                                          ▼
                                 ┌──────────────────┐
                                 │External API      │
                                 │(AlphaVantage/    │
                                 │ Finnhub/Market)  │
                                 └──────────────────┘

StorageService (Standalone, alongside others)
  ├── localStorage API
  └── Persistence Layer
```

## 📊 Fluxo de Injecção de Dependências

```
┌──────────────────────────────────────────────────────────┐
│           Configuração de Providers                      │
│          (main.ts - bootstrapApplication)               │
└──────────┬───────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────┐
│  provideHttpClient()  ← Necessário para HttpClientModule│
└──────────┬───────────────────────────────────────────────┘
           │
           ├─────────────────┬──────────────┐
           │                 │              │
           ▼                 ▼              ▼
    ┌──────────┐     ┌──────────────┐  ┌──────────────┐
    │Portfolio │     │StockApiService
    │Service   │     │               │  │StorageService
    │          │     │ (HttpClient)  │  │(localStorage)
    └──────────┘     └──────────────┘  └──────────────┘
```

## 🔄 Ciclo de Vida da Aplicação

```
1. BOOTSTRAP
   │
   └─→ main.ts
       └─→ bootstrapApplication(AppComponent)
           └─→ provideHttpClient()

2. APP INIT
   │
   └─→ AppComponent.ngOnInit()
       └─→ PortfolioPageComponent.ngOnInit()
           └─→ initializePortfolio()

3. LOAD DATA
   │
   ├─→ Check localStorage
   │   └─→ StorageService.loadPortfolio()
   │
   ├─→ If not found, load from JSON
   │   └─→ fetch('assets/data/portfolio.json')
   │
   └─→ Set to PortfolioService
       └─→ portfolioSubject.next(portfolio)

4. UPDATE QUOTES
   │
   ├─→ User clicks "Actualizar Cotações"
   │
   ├─→ PortfolioService.updateStockQuotes()
   │
   ├─→ StockApiService.getStockQuotes()
   │
   ├─→ API Calls (AlphaVantage/Finnhub/MarketStack)
   │
   ├─→ Calculate values
   │   └─→ calculatePortfolioValues()
   │
   └─→ Save to localStorage
       └─→ StorageService.savePortfolio()

5. RENDER
   │
   └─→ PortfolioTableComponent (subscribe to portfolio$)
       ├─→ StockRowComponent (for each stock)
       └─→ PortfolioSummaryComponent (totals)
```

## 🎯 Dependências Entre Componentes

```
StockRowComponent
    ├── Input: Stock
    └── Métodos:
        ├── getVariacaoClass()
        ├── formatarMoeda()
        └── formatarVariacao()

PortfolioSummaryComponent
    ├── Input: Portfolio
    └── Métodos:
        ├── getVariacaoClass()
        ├── formatarMoeda()
        └── formatarVariacao()

PortfolioTableComponent
    ├── Input: (none, subscribe to service)
    ├── Imports: StockRowComponent
    ├── Imports: PortfolioSummaryComponent
    └── Uses: PortfolioService

PortfolioPageComponent
    ├── Imports: PortfolioTableComponent
    ├── Uses: PortfolioService
    ├── Uses: StorageService
    └── Handles: Loading, Errors
```

## 📝 Padrão de Injecção de Dependências

```typescript
// Exemplo: PortfolioPageComponent
constructor(
    private portfolioService: PortfolioService,
    private storageService: StorageService
) { }

// Exemplo: PortfolioService
constructor(private stockApiService: StockApiService) { }

// Exemplo: StockApiService
constructor(private http: HttpClient) { }
```

## 🔄 Reactividade com RxJS

```
PortfolioService
    │
    ├─→ portfolioSubject: BehaviorSubject<Portfolio>
    │
    └─→ portfolio$: Observable<Portfolio>
        │
        ├─→ PortfolioTableComponent (subscribe)
        │   └─→ Actualiza quando portfolio$ emite
        │
        └─→ PortfolioPageComponent (subscribe)
            └─→ Actualiza estado da UI
```

## 💾 Ciclo de Persistência

```
┌─────────────────────────────────────┐
│  Portfolio Data in Memory           │
│  (PortfolioService.subject)         │
└──────────────┬──────────────────────┘
               │
               ├─→ Display in UI
               │   └─→ PortfolioTableComponent
               │
               └─→ Save to Storage
                   └─→ localStorage
                       └─→ StorageService.savePortfolio()

┌─────────────────────────────────────┐
│  localStorage (Browser)             │
│  Key: 'portfolio_app_data'          │
│  Value: JSON string                 │
└─────────────────────────────────────┘
                │
                └─→ Recover on next app load
                    └─→ StorageService.loadPortfolio()
                        └─→ Set PortfolioService.portfolio$
```

## 🌐 Fluxo de API

```
StockApiService.getStockQuotes(tickers)
    │
    ├─→ For each ticker:
    │   └─→ this.getStockQuote(ticker)
    │
    ├─→ Switch based on apiProvider
    │   │
    │   ├─→ ALPHAVANTAGE
    │   │   └─→ this.getAlphaVantageQuote(ticker)
    │   │       └─→ http.get(`${url}?function=...&symbol=${ticker}...`)
    │   │
    │   ├─→ FINNHUB
    │   │   └─→ this.getFinnhubQuote(ticker)
    │   │       └─→ http.get(`${url}?symbol=${ticker}...`)
    │   │
    │   └─→ MARKETSTACK
    │       └─→ this.getMarketstackQuote(ticker)
    │           └─→ http.get(`${url}?symbols=${ticker}...`)
    │
    └─→ Map response to ApiStockResponse
        └─→ Return Observable<ApiStockResponse[]>
```

## 🎨 Dependências de Template

```
PortfolioTableComponent (app-portfolio-table)
    │
    ├─→ *ngFor="stock of portfolio.stocks"
    │   │
    │   └─→ <app-stock-row [stock]="stock">
    │       │
    │       └─→ [getVariacaoClass()]
    │           [formatarMoeda()]
    │           [formatarVariacao()]
    │
    └─→ <app-portfolio-summary [portfolio]="portfolio">
        │
        └─→ [getVariacaoClass()]
            [formatarMoeda()]
            [formatarVariacao()]
```

---

Esta estrutura garante:
- ✅ Separação clara de responsabilidades
- ✅ Componentes reutilizáveis
- ✅ Serviços independentes
- ✅ Fácil manutenção e expansão
- ✅ Testabilidade melhorada
