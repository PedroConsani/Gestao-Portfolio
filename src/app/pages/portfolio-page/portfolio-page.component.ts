import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioTableComponent } from '../../components/portfolio-table/portfolio-table.component';
import { PortfolioService } from '../../services/portfolio.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-portfolio-page',
  standalone: true,
  imports: [CommonModule, PortfolioTableComponent],
  templateUrl: './portfolio-page.component.html',
  styleUrls: ['./portfolio-page.component.css']
})
export class PortfolioPageComponent {
  isLoading = false;
  errorMessage = '';

  constructor(
    private portfolioService: PortfolioService,
    private storageService: StorageService
  ) {
    this.initializePortfolio();
  }

  /**
   * Inicializa a carteira ao carregar o componente
   */
  private initializePortfolio(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Tentar carregar do armazenamento local primeiro
    const savedPortfolio = this.storageService.loadPortfolio();
    if (savedPortfolio) {
      this.portfolioService.setPortfolio(savedPortfolio);
      this.isLoading = false;
    } else {
      // Se não houver, carregar do ficheiro JSON
      this.portfolioService.loadPortfolioFromFile('assets/data/portfolio.json').subscribe({
        next: () => {
          this.isLoading = false;
          // Actualizar cotações
          this.updateQuotes();
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Erro ao carregar carteira: ' + err.message;
        }
      });
    }
  }

  /**
   * Actualiza as cotações do dia
   */
  updateQuotes(): void {
    this.isLoading = true;
    this.portfolioService.updateStockQuotes().subscribe({
      next: (portfolio) => {
        this.isLoading = false;
        this.storageService.savePortfolio(portfolio);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Erro ao actualizar cotações: ' + err.message;
      }
    });
  }
}
