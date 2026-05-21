export interface Stock {
  ticker: string;
  empresa: string;
  dataCompra: string;
  quantidade: number;
  precoCompra: number;
  total?: number; // Quantidade × Preço de compra (calculado)
  cotacaoDia?: number;
  valor?: number; // Quantidade × Cotação do dia (calculado)
  variacao?: number; // Percentagem de variação (calculado)
}
