import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiStockResponse, ApiErrorResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class StockApiService {
  private apiKey = environment.apiKey;
  private apiUrl = environment.apiUrl;
  private apiProvider = environment.apiProvider; // 'alphavantage', 'finnhub', 'marketstack'

  constructor(private http: HttpClient) { }

  /**
   * Obtém a cotação atual de uma ação usando a API externa
   * @param ticker Símbolo da ação (ex: MSFT, TSLA)
   * @returns Observable com dados da cotação
   */
  getStockQuote(ticker: string): Observable<ApiStockResponse> {
    switch (this.apiProvider) {
      case 'alphavantage':
        return this.getAlphaVantageQuote(ticker);
      case 'finnhub':
        return this.getFinnhubQuote(ticker);
      case 'marketstack':
        return this.getMarketstackQuote(ticker);
      default:
        return throwError(() => new Error('API provider not configured'));
    }
  }

  /**
   * Obtém cotações para múltiplas ações
   * @param tickers Array de símbolos
   * @returns Observable com array de cotações
   */
  getStockQuotes(tickers: string[]): Observable<ApiStockResponse[]> {
    return new Observable(observer => {
      const responses: ApiStockResponse[] = [];
      let completed = 0;

      tickers.forEach(ticker => {
        this.getStockQuote(ticker).subscribe({
          next: (data) => {
            responses.push(data);
            completed++;
            if (completed === tickers.length) {
              observer.next(responses);
              observer.complete();
            }
          },
          error: (err) => {
            console.error(`Erro ao buscar cotação de ${ticker}:`, err);
            completed++;
            if (completed === tickers.length) {
              observer.next(responses);
              observer.complete();
            }
          }
        });
      });
    });
  }

  /**
   * API AlphaVantage: https://www.alphavantage.co/
   */
  private getAlphaVantageQuote(ticker: string): Observable<ApiStockResponse> {
    const url = `${this.apiUrl}?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${this.apiKey}`;

    return this.http.get<any>(url).pipe(
      map((response: any) => {
        if (response['Global Quote'] && response['Global Quote']['05. price']) {
          const quote = response['Global Quote'];
          return {
            ticker: ticker,
            price: parseFloat(quote['05. price']),
            change: parseFloat(quote['09. change']) || 0,
            changePercent: parseFloat(quote['10. change percent']?.replace('%', '')) || 0
          };
        }
        throw new Error('Invalid response from AlphaVantage');
      }),
      catchError(this.handleError)
    );
  }

  /**
   * API Finnhub: https://finnhub.io/
   */
  private getFinnhubQuote(ticker: string): Observable<ApiStockResponse> {
    const url = `${this.apiUrl}?symbol=${ticker}&token=${this.apiKey}`;

    return this.http.get<any>(url).pipe(
      map((response: any) => {
        if (response && response.c !== undefined) {
          return {
            ticker: ticker,
            price: response.c,
            change: response.d || 0,
            changePercent: response.dp || 0
          };
        }
        throw new Error('Invalid response from Finnhub');
      }),
      catchError(this.handleError)
    );
  }

  /**
   * API MarketStack: https://marketstack.com/
   */
  private getMarketstackQuote(ticker: string): Observable<ApiStockResponse> {
    const url = `${this.apiUrl}?symbols=${ticker}&access_key=${this.apiKey}`;

    return this.http.get<any>(url).pipe(
      map((response: any) => {
        if (response.data && response.data.length > 0) {
          const quote = response.data[0];
          const change = quote.close - quote.open;
          const changePercent = (change / quote.open) * 100;

          return {
            ticker: ticker,
            price: quote.close,
            change: change,
            changePercent: changePercent
          };
        }
        throw new Error('Invalid response from MarketStack');
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Tratamento de erros HTTP
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Erro ao obter cotação';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      errorMessage = `Código de erro: ${error.status}, mensagem: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
