import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portfolio-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio-summary.component.html',
  styleUrls: ['./portfolio-summary.component.css']
})
export class PortfolioSummaryComponent {
  @Input() totalAquisicao = 0;
  @Input() totalValor = 0;
  @Input() variacaoTotal = 0;

  /**
   * Retorna a classe CSS baseada na variação total
   */
  getVariacaoClass(): string {
    if (!this.variacaoTotal) return 'neutro';
    if (this.variacaoTotal > 0) return 'positivo';
    if (this.variacaoTotal < 0) return 'negativo';
    return 'neutro';
  }

  /**
   * Formata um número como moeda
   */
  formatarMoeda(valor: number): string {
    return valor.toFixed(2).replace('.', ',');
  }

  /**
   * Formata a variação com 2 casas decimais e sinal de + se for positiva
   */
  formatarVariacao(valor: number): string {
    const formatted = valor.toFixed(2).replace('.', ',');
    return valor > 0 ? `+${formatted}` : formatted;
  }
}
