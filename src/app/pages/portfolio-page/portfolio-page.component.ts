import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioTableComponent } from '../../components/portfolio-table/portfolio-table.component';
import { PortfolioService } from '../../services/portfolio.service';
import { StorageService } from '../../services/storage.service';
import { StockApiService } from '../../services/stock-api.service';
import { Portfolio } from '../../models/portfolio';
import { Stock } from '../../models/stock';

@Component({
  selector: 'app-portfolio-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PortfolioTableComponent],
  templateUrl: './portfolio-page.component.html',
  styleUrls: ['./portfolio-page.component.css']
})
export class PortfolioPageComponent implements OnInit {
  portfolio: Portfolio | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Controlos de UI
  showSettings = false;
  showAddForm = false;

  // Formulário - Adicionar Ação
  newTicker = '';
  newEmpresa = '';
  newQuantidade: number | null = null;
  newPrecoCompra: number | null = null;
  newDataCompra = '';

  // Formulário - Configurações API
  apiProvider = 'alphavantage';
  apiKey = '';
  isSimulated = true;

  constructor(
    private portfolioService: PortfolioService,
    private storageService: StorageService,
    private stockApiService: StockApiService
  ) { }

  ngOnInit(): void {
    // Carregar configurações de API
    this.apiProvider = this.stockApiService.getProvider();
    this.apiKey = this.stockApiService.getApiKey();
    this.isSimulated = this.stockApiService.getIsSimulated();

    // Subscrever às atualizações da carteira
    this.portfolioService.portfolio$.subscribe(portfolio => {
      this.portfolio = portfolio;
    });

    // Inicializar a carteira (agora carrega do MongoDB)
    this.initializePortfolio();
  }

  /**
   * Inicializa a carteira ao carregar — agora carrega do MongoDB via backend
   */
  private initializePortfolio(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Carregar do MongoDB (o serviço já faz fallback para JSON se necessário)
    this.portfolioService.loadPortfolioFromFile('assets/data/portfolio.json').subscribe({
      next: () => {
        this.isLoading = false;
        // Atualizar cotações em background
        this.updateQuotes(true);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Erro ao carregar carteira: ' + (err.message || err);
      }
    });
  }

  /**
   * Atualiza as cotações
   */
  updateQuotes(silent = false): void {
    if (!silent) this.isLoading = true;
    this.errorMessage = '';
    
    this.portfolioService.updateStockQuotes().subscribe({
      next: (updatedPortfolio) => {
        this.isLoading = false;
        if (!silent) {
          this.showSuccess('Cotações atualizadas com sucesso!');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Erro ao atualizar cotações: ' + err.message;
      }
    });
  }

  /**
   * Adiciona um novo stock à carteira
   */
  addStock(): void {
    if (!this.newTicker || !this.newEmpresa || !this.newQuantidade || !this.newPrecoCompra || !this.newDataCompra) {
      this.errorMessage = 'Por favor, preencha todos os campos do formulário.';
      return;
    }

    if (this.newQuantidade <= 0 || this.newPrecoCompra <= 0) {
      this.errorMessage = 'Quantidade e Preço Unitário devem ser maiores que zero.';
      return;
    }

    // Formatar data de YYYY-MM-DD para DD/MM/YYYY
    const dateParts = this.newDataCompra.split('-');
    const formattedDate = dateParts.length === 3 
      ? `${parseInt(dateParts[2])}/${parseInt(dateParts[1])}/${dateParts[0]}` 
      : new Date().toLocaleDateString('pt-PT');

    const stock: Stock = {
      ticker: this.newTicker.toUpperCase().trim(),
      empresa: this.newEmpresa.trim(),
      dataCompra: formattedDate,
      quantidade: this.newQuantidade,
      precoCompra: this.newPrecoCompra
    };

    this.portfolioService.addStock(stock);
    
    // Atualizar as cotações após adicionar a ação
    this.updateQuotes(true);

    // Reset formulário
    this.newTicker = '';
    this.newEmpresa = '';
    this.newQuantidade = null;
    this.newPrecoCompra = null;
    this.newDataCompra = '';
    this.showAddForm = false;
    this.errorMessage = '';
    
    this.showSuccess('Ação adicionada com sucesso!');
  }

  /**
   * Grava as configurações da API
   */
  saveSettings(): void {
    this.stockApiService.updateSettings(this.apiProvider, this.apiKey.trim(), this.isSimulated);
    this.showSettings = false;
    this.errorMessage = '';
    
    // Forçar atualização das cotações com as novas definições
    this.updateQuotes();
    this.showSuccess('Configurações da API gravadas!');
  }

  /**
   * Reinicia a carteira para o estado padrão
   */
  resetPortfolio(): void {
    if (confirm('Tem a certeza que deseja repor a carteira padrão? Isto apagará todas as edições.')) {
      this.isLoading = true;
      this.portfolioService.resetPortfolio().subscribe({
        next: () => {
          this.isLoading = false;
          this.updateQuotes();
          this.showSuccess('Carteira restaurada para o padrão!');
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Erro ao restaurar carteira: ' + (err.message || err);
        }
      });
    }
  }

  /**
   * Métodos utilitários
   */
  getIsSimulatedMode(): boolean {
    return this.stockApiService.getIsSimulated();
  }

  getApiProviderLabel(): string {
    const provider = this.stockApiService.getProvider();
    switch (provider) {
      case 'alphavantage': return 'AlphaVantage';
      case 'finnhub': return 'Finnhub';
      case 'marketstack': return 'MarketStack';
      default: return provider;
    }
  }

  private showSuccess(msg: string): void {
    this.successMessage = msg;
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  toggleSettings(): void {
    this.showSettings = !this.showSettings;
    if (this.showSettings) this.showAddForm = false;
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (this.showAddForm) {
      this.showSettings = false;
      // Definir data padrão como hoje
      this.newDataCompra = new Date().toISOString().split('T')[0];
    }
  }
}
