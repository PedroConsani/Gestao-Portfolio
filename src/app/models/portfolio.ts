import { Stock } from './stock';

export interface Portfolio {
  id?: string;
  nome: string;
  mercado: string;
  dataAtualizacao: string;
  stocks: Stock[];
  totalAquisicao?: number; // Soma de todos os 'total' (calculado)
  totalValor?: number; // Soma de todos os 'valor' (calculado)
  variacaoTotal?: number; // Percentagem de variação total (calculado)
}
