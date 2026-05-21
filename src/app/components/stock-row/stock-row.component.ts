import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Stock } from '../../models/stock';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-stock-row',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stock-row.component.html',
  styleUrls: ['./stock-row.component.css']
})
export class StockRowComponent {
  @Input() stock!: Stock;

  constructor(private portfolioService: PortfolioService) { }

  /**
   * Retorna a classe CSS baseada na variação
   */
  getVariacaoClass(): string {
    if (!this.stock.variacao) return 'neutro';
    if (this.stock.variacao > 0) return 'positivo';
    if (this.stock.variacao < 0) return 'negativo';
    return 'neutro';
  }

  /**
   * Formata um número como moeda
   */
  formatarMoeda(valor: number | undefined): string {
    if (valor === undefined) return '-';
    return valor.toFixed(2).replace('.', ',');
  }

  /**
   * Formata a variação com 2 casas decimais e sinal de + se for positiva
   */
  formatarVariacao(valor: number | undefined): string {
    if (valor === undefined) return '-';
    const formatted = valor.toFixed(2).replace('.', ',');
    return valor > 0 ? `+${formatted}` : formatted;
  }

  /**
   * Solicita a exclusão do stock do portfólio
   */
  remover(): void {
    if (confirm(`Tem a certeza que deseja remover ${this.stock.empresa} (${this.stock.ticker}) do portfólio?`)) {
      this.portfolioService.removeStock(this.stock.ticker);
    }
  }

  /**
   * Desenha uma sparkline SVG dinâmica para a linha da ação
   */
  getSparklinePoints(): string {
    const ticker = this.stock.ticker || 'STOCK';
    
    // Gerar seed baseado no hash do ticker
    let hash = 0;
    for (let i = 0; i < ticker.length; i++) {
      hash = ticker.charCodeAt(i) + ((hash << 5) - hash);
    }
    const seed = Math.abs(hash);
    
    const points: string[] = [];
    const width = 70;
    const height = 24;
    const segments = 6;
    const stepX = width / segments;
    
    const isUp = (this.stock.variacao || 0) >= 0;
    
    // Ponto inicial (Y centralizado)
    let currentY = height / 2;
    points.push(`0,${currentY}`);
    
    for (let i = 1; i <= segments; i++) {
      const x = i * stepX;
      // Oscilação
      const wave = ((seed + i * 3) % 9) - 4; // variação entre -4 e +4
      // Direção geral da tendência
      const trend = isUp ? -1.6 : 1.6;
      currentY = currentY + wave + trend;
      
      // Limitar Y aos limites do SVG com margem
      currentY = Math.max(3, Math.min(height - 3, currentY));
      points.push(`${x.toFixed(1)},${currentY.toFixed(1)}`);
    }
    
    return points.join(' ');
  }
}
