import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Portfolio } from '../models/portfolio';
import { Stock } from '../models/stock';
import { StockApiService } from './stock-api.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private portfolioSubject = new BehaviorSubject<Portfolio | null>(null);
  public portfolio$ = this.portfolioSubject.asObservable();

  constructor(
    private stockApiService: StockApiService,
    private storageService: StorageService
  ) { }

  /**
   * Carrega a carteira a partir de um ficheiro JSON
   * @param filePath Caminho do ficheiro JSON
   */
  loadPortfolioFromFile(filePath: string): Observable<Portfolio> {
    return new Observable<Portfolio>((observer) => {
      fetch(filePath)
        .then(response => response.json())
        .then((data: any) => {
          const portfolio = data as Portfolio;
          portfolio.dataAtualizacao = new Date().toISOString().split('T')[0];
          // Calcular valores iniciais (cotação do dia = preço de compra se não houver cotação ainda)
          this.calculatePortfolioValues(portfolio);
          this.portfolioSubject.next(portfolio);
          this.storageService.savePortfolio(portfolio);
          observer.next(portfolio);
          observer.complete();
        })
        .catch((error: any) => {
          console.error('Erro ao carregar portfolio:', error);
          observer.error(error);
        });
    });
  }

  /**
   * Actualiza as cotações do dia para todos os stocks
   */
  updateStockQuotes(): Observable<Portfolio> {
    return new Observable<Portfolio>((observer) => {
      const portfolio = this.portfolioSubject.value;

      if (!portfolio || !portfolio.stocks) {
        observer.error('Portfolio não carregado');
        return;
      }

      if (portfolio.stocks.length === 0) {
        portfolio.dataAtualizacao = new Date().toISOString().split('T')[0];
        this.calculatePortfolioValues(portfolio);
        this.portfolioSubject.next(portfolio);
        this.storageService.savePortfolio(portfolio);
        observer.next(portfolio);
        observer.complete();
        return;
      }

      const tickers = portfolio.stocks.map((s: Stock) => s.ticker);

      this.stockApiService.getStockQuotes(tickers).subscribe({
        next: (quotes: any[]) => {
          portfolio.stocks.forEach((stock: Stock) => {
            const quote = quotes.find((q: any) => q.ticker.toUpperCase() === stock.ticker.toUpperCase());
            if (quote) {
              stock.cotacaoDia = quote.price;
            }
          });

          // Calcular valores e atualizar data
          portfolio.dataAtualizacao = new Date().toISOString().split('T')[0];
          this.calculatePortfolioValues(portfolio);
          this.portfolioSubject.next(portfolio);
          this.storageService.savePortfolio(portfolio);
          observer.next(portfolio);
          observer.complete();
        },
        error: (err: any) => {
          console.error('Erro ao actualizar cotações:', err);
          observer.error(err);
        }
      });
    });
  }

  /**
   * Calcula os valores da carteira (totais e variações)
   */
  private calculatePortfolioValues(portfolio: Portfolio): void {
    // Calcular valores por stock
    portfolio.stocks.forEach(stock => {
      // Total de aquisição
      stock.total = stock.quantidade * stock.precoCompra;

      // Se a cotação do dia não está definida, usar preço de compra
      if (stock.cotacaoDia === undefined) {
        stock.cotacaoDia = stock.precoCompra;
      }

      // Valor actual
      stock.valor = stock.quantidade * stock.cotacaoDia;

      // Variação em percentagem
      const diferencaValor = stock.valor - stock.total;
      stock.variacao = stock.total > 0 ? (diferencaValor / stock.total) * 100 : 0;
    });

    // Calcular totais da carteira
    portfolio.totalAquisicao = portfolio.stocks.reduce((sum, stock) => sum + (stock.total || 0), 0);
    portfolio.totalValor = portfolio.stocks.reduce((sum, stock) => sum + (stock.valor || 0), 0);

    const diferencaTotal = portfolio.totalValor - portfolio.totalAquisicao;
    portfolio.variacaoTotal = portfolio.totalAquisicao > 0 ? (diferencaTotal / portfolio.totalAquisicao) * 100 : 0;
  }

  /**
   * Adiciona um novo stock à carteira
   */
  addStock(stock: Stock): void {
    const portfolio = this.portfolioSubject.value;
    if (portfolio) {
      const existing = portfolio.stocks.find(s => s.ticker.toUpperCase() === stock.ticker.toUpperCase());
      if (existing) {
        const novaQtd = existing.quantidade + stock.quantidade;
        existing.precoCompra = ((existing.quantidade * existing.precoCompra) + (stock.quantidade * stock.precoCompra)) / novaQtd;
        existing.quantidade = novaQtd;
        existing.cotacaoDia = undefined; // Forçar recálculo da cotação
      } else {
        portfolio.stocks.push(stock);
      }
      this.calculatePortfolioValues(portfolio);
      this.portfolioSubject.next(portfolio);
      this.storageService.savePortfolio(portfolio);
    }
  }

  /**
   * Remove um stock da carteira
   */
  removeStock(ticker: string): void {
    const portfolio = this.portfolioSubject.value;
    if (portfolio) {
      portfolio.stocks = portfolio.stocks.filter((s: Stock) => s.ticker.toUpperCase() !== ticker.toUpperCase());
      this.calculatePortfolioValues(portfolio);
      this.portfolioSubject.next(portfolio);
      this.storageService.savePortfolio(portfolio);
    }
  }

  /**
   * Repõe os dados iniciais do ficheiro JSON
   */
  resetPortfolio(): Observable<Portfolio> {
    this.storageService.clearPortfolio();
    return this.loadPortfolioFromFile('assets/data/portfolio.json');
  }

  /**
   * Obtém a carteira actual
   */
  getPortfolio(): Portfolio | null {
    return this.portfolioSubject.value;
  }

  /**
   * Define a carteira
   */
  setPortfolio(portfolio: Portfolio): void {
    this.calculatePortfolioValues(portfolio);
    this.portfolioSubject.next(portfolio);
    this.storageService.savePortfolio(portfolio);
  }
}
