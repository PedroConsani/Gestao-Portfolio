# ✅ Checklist de Configuração Inicial

Complete os passos abaixo para colocar o projeto em funcionamento.

## 1️⃣ Instalação de Dependências

- [ ] Abra o terminal na pasta do projeto
- [ ] Execute: `npm install`
- [ ] Aguarde a conclusão da instalação

## 2️⃣ Configuração da API

### Escolha um Provedor

- [ ] **AlphaVantage** (Recomendado)
  - [ ] Registe-se em https://www.alphavantage.co/
  - [ ] Obtenha a chave de API por email
  - [ ] Copie a chave de API

- [ ] **Finnhub**
  - [ ] Registe-se em https://finnhub.io/
  - [ ] Obtenha a chave de API
  - [ ] Copie a chave de API

- [ ] **MarketStack**
  - [ ] Registe-se em https://marketstack.com/
  - [ ] Obtenha a chave de API
  - [ ] Copie a chave de API

### Configure a API

- [ ] Abra `src/environments/environment.ts`
- [ ] Substitua `YOUR_API_KEY_HERE` pela sua chave
- [ ] Escolha o provedor em `apiProvider`
- [ ] Confirme `apiUrl` está correcto
- [ ] Guarde o ficheiro (Ctrl+S)

### Exemplo de Configuração Completa:
```typescript
export const environment = {
  production: false,
  apiProvider: 'alphavantage', // ← Escolha aqui
  apiKey: 'sua_chave_aqui', // ← Copie aqui
  apiUrl: 'https://www.alphavantage.co/query'
};
```

## 3️⃣ Configuração de Dados (Opcional)

Se desejar usar dados diferentes:

- [ ] Abra `src/assets/data/portfolio.json`
- [ ] Modifique os stocks conforme necessário
- [ ] Guarde o ficheiro

### Exemplo de Estrutura:
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

**Dica**: Consulte `EXAMPLES.md` para mais exemplos

## 4️⃣ Iniciar a Aplicação

- [ ] No terminal, execute: `npm start`
- [ ] Aguarde a compilação (pode demorar alguns segundos)
- [ ] O servidor iniciará em `http://localhost:4200`
- [ ] O navegador abrir automaticamente

## 5️⃣ Testar a Aplicação

### ✓ Verificações Iniciais

- [ ] Tabela é carregada com dados de `portfolio.json`
- [ ] Clique em "Actualizar Cotações"
- [ ] Sistema busca cotações da API
- [ ] Colunas de valores são preenchidas
- [ ] Variações mostram cores correctas (verde/vermelho)
- [ ] Totais aparecem na linha "TOTAL"

### Valores Esperados do Exemplo:
- MSFT: 20 × 320 = 6.400,00 (Total de Aquisição)
- TSLA: 50 × 220 = 11.000,00 (Total de Aquisição)
- **TOTAL**: 17.400,00 (Soma)

## 6️⃣ Resolução de Problemas

### ❌ Erro: "Cannot find module"
```bash
npm install
```

### ❌ Erro: API não responde
- [ ] Verifique a chave de API em `environment.ts`
- [ ] Confirme que a chave está correcta
- [ ] Verifique se o provedor está operacional
- [ ] Tente outro provedor

### ❌ Erro: "Ticker não encontrado"
- [ ] Verifique a ortografia (MSFT, não msft)
- [ ] Use tickers reais (NASDAQ ou NYSE)
- [ ] Consulte Yahoo Finance para tickers válidos

### ❌ Erro: CORS
- Se ver "No 'Access-Control-Allow-Origin'" na consola:
- Algumas APIs requerem proxy
- Tente com Finnhub (melhor suporte a CORS)

### ❌ Dados não aparecem
- [ ] Abra DevTools (F12)
- [ ] Verifique a aba "Network"
- [ ] Procure pela chamada da API
- [ ] Verifique se há erros na aba "Console"

## 7️⃣ Uso Diário

### Executar Projeto
```bash
npm start
```

### Compilar para Produção
```bash
npm run build
```

### Executar Testes
```bash
npm test
```

## 8️⃣ Documentação de Referência

Consulte estes ficheiros conforme necessário:

- 📖 **README.md** - Documentação geral
- 🏗️ **ARCHITECTURE.md** - Diagramas e arquitetura
- 🔑 **API_CONFIG.md** - Detalhes de configuração de APIs
- 📋 **EXAMPLES.md** - Exemplos de dados
- 🚀 **DEVELOPMENT.md** - Guia de desenvolvimento
- 📊 **PROJECT_SUMMARY.md** - Resumo do projeto

## 9️⃣ Próximas Etapas (Opcional)

Após configuração inicial:

- [ ] Explore o código em `src/app`
- [ ] Modifique `portfolio.json` com seus dados
- [ ] Teste com diferentes tickers
- [ ] Customize os estilos em CSS
- [ ] Adicione novos componentes
- [ ] Implemente um backend

## 🔟 Validação Final

Antes de submeter o trabalho:

- [ ] Aplicação inicia sem erros
- [ ] Tabela carrega e mostra dados
- [ ] Cotações são actualizadas
- [ ] Cálculos estão correctos
- [ ] Cores de variação funcionam
- [ ] Dados são guardados em localStorage
- [ ] Documentação está completa

---

## 📧 Dúvidas?

1. Verifique a documentação nos ficheiros `.md`
2. Consulte a secção de resolução de problemas
3. Verifique os exemplos em `EXAMPLES.md`
4. Contacte o professor se necessário

---

**Status**: 🟢 Pronto para começar!

Boa sorte com o seu projeto! 🚀
