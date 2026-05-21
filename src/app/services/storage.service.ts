import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map } from 'rxjs';
import { Portfolio } from '../models/portfolio';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly backendUrl = environment.backendUrl;

  constructor(private http: HttpClient) { }

  /**
   * Guarda a carteira no MongoDB (via backend API)
   */
  savePortfolio(portfolio: Portfolio): Observable<Portfolio> {
    return this.http.put<Portfolio>(`${this.backendUrl}/portfolio`, portfolio).pipe(
      catchError(error => {
        console.error('Erro ao guardar carteira no MongoDB:', error);
        // Fallback: guardar no localStorage
        try {
          localStorage.setItem('portfolio_app_data', JSON.stringify(portfolio));
          console.log('Carteira guardada no localStorage (fallback)');
        } catch (e) {
          console.error('Erro ao guardar no localStorage:', e);
        }
        return of(portfolio);
      })
    );
  }

  /**
   * Carrega a carteira do MongoDB (via backend API)
   */
  loadPortfolio(): Observable<Portfolio | null> {
    return this.http.get<Portfolio>(`${this.backendUrl}/portfolio`).pipe(
      catchError(error => {
        console.error('Erro ao carregar carteira do MongoDB:', error);
        // Fallback: carregar do localStorage
        try {
          const data = localStorage.getItem('portfolio_app_data');
          if (data) {
            console.log('Carteira carregada do localStorage (fallback)');
            return of(JSON.parse(data) as Portfolio);
          }
        } catch (e) {
          console.error('Erro ao carregar do localStorage:', e);
        }
        return of(null);
      })
    );
  }

  /**
   * Remove a carteira / Repõe dados padrão (via backend API)
   */
  clearPortfolio(): Observable<Portfolio> {
    return this.http.post<Portfolio>(`${this.backendUrl}/portfolio/reset`, {}).pipe(
      catchError(error => {
        console.error('Erro ao repor carteira no MongoDB:', error);
        try {
          localStorage.removeItem('portfolio_app_data');
        } catch (e) {
          console.error('Erro ao remover do localStorage:', e);
        }
        return of(null as any);
      })
    );
  }

  /**
   * Verifica se existe carteira guardada (agora assíncrono)
   */
  hasPortfolio(): Observable<boolean> {
    return this.http.get<Portfolio>(`${this.backendUrl}/portfolio`).pipe(
      map(portfolio => !!portfolio),
      catchError(() => of(localStorage.getItem('portfolio_app_data') !== null))
    );
  }

  /**
   * Guarda as configurações da API no localStorage
   * (Estas ficam no browser pois são configurações locais do utilizador)
   */
  saveApiSettings(provider: string, apiKey: string, isSimulated: boolean): void {
    try {
      const settings = { provider, apiKey, isSimulated };
      localStorage.setItem('portfolio_api_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Erro ao guardar configurações de API:', error);
    }
  }

  /**
   * Carrega as configurações da API do localStorage
   */
  loadApiSettings(): { provider: string; apiKey: string; isSimulated: boolean } | null {
    try {
      const settings = localStorage.getItem('portfolio_api_settings');
      if (settings) {
        return JSON.parse(settings);
      }
      return null;
    } catch (error) {
      console.error('Erro ao carregar configurações de API:', error);
      return null;
    }
  }
}
