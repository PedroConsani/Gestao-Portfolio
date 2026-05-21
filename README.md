# Gestor de Carteira de Ações - Angular

Aplicação web desenvolvida em Angular e TypeScript para monitorização de uma carteira de ações, com integração de APIs REST para obtenção de cotações em tempo real.

## 📋 Requisitos

- **Node.js**: v18.0.0 ou superior
- **Angular CLI**: v17.0.0 ou superior
- **TypeScript**: v5.2.0 ou superior
- **Chave de API** de um dos provedores suportados

## 🚀 Instalação

### 1. Clonar ou descarregar o projeto

```bash
cd Gestao_Portfolio
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar a API

1. Escolha um provedor de API (AlphaVantage, Finnhub ou MarketStack):
   - **AlphaVantage**: https://www.alphavantage.co/
   - **Finnhub**: https://finnhub.io/
   - **MarketStack**: https://marketstack.com/

2. Registre-se e obtenha uma chave de API gratuita

3. Edite `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiProvider: 'alphavantage', // Escolher: 'alphavantage', 'finnhub', 'marketstack'
  apiKey: 'SUA_CHAVE_API_AQUI',
  apiUrl: 'https://www.alphavantage.co/query' // URL da API escolhida
};
```

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── models/                 # Interfaces TypeScript
│   │   ├── portfolio.ts        # Interface Portfolio
│   │   ├── stock.ts            # Interface Stock
│   │   └── api-response.ts     # Interfaces de resposta da API
│   │
│   ├── services/               # Serviços Angular
│   │   ├── stock-api.service.ts    # Chamadas à API de cotações
│   │   ├── portfolio.service.ts    # Gestão da carteira
│   │   └── storage.service.ts      # Persistência em localStorage
│   │
│   ├── components/             # Componentes reutilizáveis
│   │   ├── portfolio-table/        # Tabela principal
│   │   ├── stock-row/              # Linha de um stock
│   │   └── portfolio-summary/      # Resumo/totais
│   │
│   ├── pages/                  # Componentes página (containers)
│   │   └── portfolio-page/         # Página principal
│   │
│   ├── app.component.ts        # Componente raiz
│   └── app.module.ts           # Módulo principal
│
├── assets/
│   └── data/
│       └── portfolio.json      # Ficheiro JSON com dados iniciais
│
├── environments/
│   ├── environment.ts          # Configuração desenvolvimento
│   └── environment.prod.ts     # Configuração produção
│
├── index.html                  # Página HTML principal
├── main.ts                     # Ponto de entrada
├── styles.css                  # Estilos globais
└── ...

```

## 🔧 Desenvolvimento

### Iniciar servidor de desenvolvimento

```bash
npm start
```

O servidor estará disponível em `http://localhost:4200/`

### Build para produção

```bash
npm run build
```

Os ficheiros compilados estarão em `dist/gestao-portfolio/`

## 📊 Funcionalidades

### ✅ Implementadas

- ✓ Carregamento de carteira a partir de ficheiro JSON
- ✓ Cálculo automático de totais e variações
- ✓ Integração com API de cotações em tempo real
- ✓ Cores para representar variações (vermelho negativo, verde positivo, preto neutro)
- ✓ Persistência em localStorage
- ✓ Interface responsiva
- ✓ Componentes reutilizáveis

### 🎯 Características

- **Tabela de Carteira**: Apresenta ticker, empresa, data de compra, quantidade, preço unitário, totais e variações
- **Cálculos Automáticos**: 
  - Total de aquisição = Quantidade × Preço de compra
  - Valor actual = Quantidade × Cotação do dia
  - Variação = ((Valor - Total) / Total) × 100%
- **Cotações em Tempo Real**: Busca cotações actualizadas via API
- **Armazenamento Local**: Guarda dados em localStorage para acesso rápido

## 📝 Configuração do ficheiro portfolio.json

```json
{
  "nome": "Minha Carteira",
  "mercado": "NASDAQ",
  "dataAtualizacao": "2026-05-21",
  "stocks": [
    {
      "ticker": "MSFT",
      "empresa": "Microsoft",
      "dataCompra": "01/03/2026",
      "quantidade": 20,
      "precoCompra": 320.00
    }
  ]
}
```

## 🎨 Estilos

O projecto usa CSS puro com:
- Tabela responsiva
- Cores temáticas (verde para positivo, vermelho para negativo)
- Tipografia consistente
- Compatibilidade com dispositivos móveis

## 🐛 Resolução de Problemas

### Erro "Cannot find module"
```bash
npm install
```

### Erro de API
- Verificar se a chave de API está correctamente configurada em `src/environments/environment.ts`
- Confirmar que o provedor de API está operacional
- Verificar a cota de chamadas da API

### CORS Error
Algumas APIs podem requerir proxy. Adicione em `angular.json` se necessário.

## 📧 Contacto

Para questões sobre o projecto, contacte o professor de Programação WEB II.

## 📄 Licença

Projeto desenvolvido para fins educacionais - TESP em Desenvolvimento WEB e Multimédia.
