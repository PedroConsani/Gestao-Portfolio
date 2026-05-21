import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioService } from '../../services/portfolio.service';
import { Portfolio } from '../../models/portfolio';
import { Stock } from '../../models/stock';
import { StockRowComponent } from '../stock-row/stock-row.component';
import { PortfolioSummaryComponent } from '../portfolio-summary/portfolio-summary.component';

@Component({
  selector: 'app-portfolio-table',
  standalone: true,
  imports: [CommonModule, FormsModule, StockRowComponent, PortfolioSummaryComponent],
  templateUrl: './portfolio-table.component.html',
  styleUrls: ['./portfolio-table.component.css']
})
export class PortfolioTableComponent implements OnInit {
  portfolio: Portfolio | null = null;
  
  // Pesquisa e Ordenação
  searchTerm = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private portfolioService: PortfolioService) { }

  ngOnInit(): void {
    this.portfolioService.portfolio$.subscribe(portfolio => {
      this.portfolio = portfolio;
    });
  }

  /**
   * Retorna a lista de ações filtrada e ordenada
   */
  get filteredStocks(): Stock[] {
    if (!this.portfolio || !this.portfolio.stocks) return [];
    
    const query = this.searchTerm.toLowerCase().trim();
    let list = [...this.portfolio.stocks];

    // 1. Filtrar por pesquisa (Ticker ou Empresa)
    if (query) {
      list = list.filter(stock => 
        stock.ticker.toLowerCase().includes(query) || 
        stock.empresa.toLowerCase().includes(query)
      );
    }

    // 2. Ordenar por coluna selecionada
    if (this.sortColumn) {
      list.sort((a: any, b: any) => {
        let valA = a[this.sortColumn];
        let valB = b[this.sortColumn];

        // Tratar valores indefinidos
        if (valA === undefined) valA = 0;
        if (valB === undefined) valB = 0;

        // Comparação de strings de forma case-insensitive
        if (typeof valA === 'string' && typeof valB === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return list;
  }

  /**
   * Ordena a tabela por uma coluna
   */
  sortBy(column: string): void {
    if (this.sortColumn === column) {
      if (this.sortDirection === 'asc') {
        this.sortDirection = 'desc';
      } else {
        // Limpar ordenação ao clicar pela 3ª vez
        this.sortColumn = '';
        this.sortDirection = 'asc';
      }
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  /**
   * Calcula os totais das ações visíveis/filtradas
   */
  get filteredSummary() {
    const stocks = this.filteredStocks;
    const totalAquisicao = stocks.reduce((sum, s) => sum + (s.total || 0), 0);
    const totalValor = stocks.reduce((sum, s) => sum + (s.valor || 0), 0);
    const diferenca = totalValor - totalAquisicao;
    const variacaoTotal = totalAquisicao > 0 ? (diferenca / totalAquisicao) * 100 : 0;

    return {
      totalAquisicao,
      totalValor,
      variacaoTotal
    };
  }
}
