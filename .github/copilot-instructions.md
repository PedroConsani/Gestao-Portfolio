<!-- Projeto Angular - Gestão de Carteira de Ações -->

# Instruções de Configuração - Gestão de Carteira de Ações

Projeto Angular para monitorização de carteira de ações com integração de APIs REST.

## Estrutura do Projeto

```
src/
├── app/
│   ├── models/              # Interfaces e tipos TypeScript
│   │   ├── portfolio.ts
│   │   ├── stock.ts
│   │   └── api-response.ts
│   ├── services/            # Serviços Angular (API, dados)
│   │   ├── stock-api.service.ts
│   │   ├── portfolio.service.ts
│   │   └── storage.service.ts
│   ├── components/          # Componentes reutilizáveis
│   │   ├── portfolio-table/
│   │   ├── stock-row/
│   │   └── portfolio-summary/
│   ├── pages/              # Páginas (containers)
│   │   └── portfolio-page/
│   ├── app.component.ts
│   └── app.module.ts
├── assets/
│   └── data/               # Ficheiros JSON de dados
│       └── portfolio.json
├── environments/           # Configuração de ambientes
│   ├── environment.ts
│   └── environment.prod.ts
└── index.html
```

## Componentes Principais

- **PortfolioComponent**: Componente principal que exibe a tabela
- **PortfolioService**: Gestão de dados da carteira
- **StockApiService**: Chamadas a APIs externas
- **StorageService**: Persistência em base de dados/localStorage
