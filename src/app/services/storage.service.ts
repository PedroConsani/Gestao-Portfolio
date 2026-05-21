import { Injectable } from '@angular/core';
import { Portfolio } from '../models/portfolio';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'portfolio_app_data';

  constructor() { }

  /**
   * Guarda a carteira no localStorage
   */
  savePortfolio(portfolio: Portfolio): void {
    try {
      const data = JSON.stringify(portfolio);
      localStorage.setItem(this.STORAGE_KEY, data);
      console.log('Carteira guardada com sucesso');
    } catch (error) {
      console.error('Erro ao guardar carteira:', error);
    }
  }

  /**
   * Carrega a carteira do localStorage
   */
  loadPortfolio(): Portfolio | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      console.error('Erro ao carregar carteira:', error);
      return null;
    }
  }

  /**
   * Remove a carteira do localStorage
   */
  clearPortfolio(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('Carteira removida com sucesso');
    } catch (error) {
      console.error('Erro ao remover carteira:', error);
    }
  }

  /**
   * Verifica se existe carteira guardada
   */
  hasPortfolio(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  }

  /**
   * Guarda as configurações da API no localStorage
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
