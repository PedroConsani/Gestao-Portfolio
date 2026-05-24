import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
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
    private http: HttpClient,
    private stockApiService: StockApiService,
    private storageService: StorageService
  ) { }

  /**
   * Carrega a carteira a partir do backend MongoDB.
   * Se não existir no backend, tenta carregar do ficheiro JSON local.
   */
  loadPortfolioFromFile(filePath: string): Observable<Portfolio> {
    return new Observable<Portfolio>((observer) => {
      // Primeiro tentar carregar do MongoDB via backend
      this.storageService.loadPortfolio().subscribe({
        next: (portfolio) => {
          if (portfolio && portfolio.stocks && portfolio.stocks.length > 0) {
            portfolio.dataAtualizacao = new Date().toISOString().split('T')[0];
            this.calculatePortfolioValues(portfolio);
            this.portfolioSubject.next(portfolio);
            observer.next(portfolio);
            observer.complete();
          } else {
            // Se não há dados no MongoDB, carregar do ficheiro JSON
            this.loadFromJsonFile(filePath, observer);
          }
        },
        error: () => {
          // Fallback: carregar do ficheiro JSON
          this.loadFromJsonFile(filePath, observer);
        }
      });
    });
  }

  /**
   * Carrega do ficheiro JSON local e guarda no MongoDB
   */
  private loadFromJsonFile(filePath: string, observer: any): void {
    fetch(filePath)
      .then(response => response.json())
      .then((data: any) => {
        const portfolio = data as Portfolio;
        portfolio.dataAtualizacao = new Date().toISOString().split('T')[0];
        this.calculatePortfolioValues(portfolio);
        this.portfolioSubject.next(portfolio);

        // Guardar no MongoDB
        this.storageService.savePortfolio(portfolio).subscribe({
          next: () => console.log('Carteira guardada no MongoDB'),
          error: (err) => console.error('Erro ao guardar no MongoDB:', err)
        });

        observer.next(portfolio);
        observer.complete();
      })
      .catch((error: any) => {
        console.error('Erro ao carregar portfolio:', error);
        observer.error(error);
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
        this.storageService.savePortfolio(portfolio).subscribe();
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

          // Guardar no MongoDB (assíncrono)
          this.storageService.savePortfolio(portfolio).subscribe({
            next: () => {},
            error: (err) => console.error('Erro ao guardar cotações no MongoDB:', err)
          });

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
      if (stock.cotacaoDia === undefined || stock.cotacaoDia === null) {
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

      // Guardar no MongoDB (assíncrono)
      this.storageService.savePortfolio(portfolio).subscribe({
        next: () => console.log('Stock adicionado e guardado no MongoDB'),
        error: (err) => console.error('Erro ao guardar stock no MongoDB:', err)
      });
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

      // Guardar no MongoDB (assíncrono)
      this.storageService.savePortfolio(portfolio).subscribe({
        next: () => console.log('Stock removido e guardado no MongoDB'),
        error: (err) => console.error('Erro ao guardar após remover stock:', err)
      });
    }
  }

  /**
   * Repõe os dados iniciais — pede ao backend para fazer reset
   */
  resetPortfolio(): Observable<Portfolio> {
    return new Observable<Portfolio>((observer) => {
      this.storageService.clearPortfolio().subscribe({
        next: (portfolio) => {
          if (portfolio) {
            this.calculatePortfolioValues(portfolio);
            this.portfolioSubject.next(portfolio);
            observer.next(portfolio);
            observer.complete();
          } else {
            // Fallback: criar carteira vazia localmente
            const emptyPortfolio: Portfolio = {
              nome: 'A minha carteira',
              mercado: 'NASDAQ / NYSE',
              dataAtualizacao: new Date().toISOString().split('T')[0],
              stocks: [],
              totalAquisicao: 0,
              totalValor: 0,
              variacaoTotal: 0
            };
            this.portfolioSubject.next(emptyPortfolio);
            try {
              localStorage.setItem('portfolio_app_data', JSON.stringify(emptyPortfolio));
            } catch (e) {
              console.error('Erro ao guardar no localStorage:', e);
            }
            observer.next(emptyPortfolio);
            observer.complete();
          }
        },
        error: (err) => {
          console.error('Erro ao repor carteira:', err);
          observer.error(err);
        }
      });
    });
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

    // Guardar no MongoDB (assíncrono)
    this.storageService.savePortfolio(portfolio).subscribe({
      next: () => {},
      error: (err) => console.error('Erro ao guardar carteira no MongoDB:', err)
    });
  }
}
