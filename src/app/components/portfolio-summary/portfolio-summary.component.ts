import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Portfolio } from '../../models/portfolio';

@Component({
  selector: 'app-portfolio-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio-summary.component.html',
  styleUrls: ['./portfolio-summary.component.css']
})
export class PortfolioSummaryComponent {
  @Input() portfolio!: Portfolio;

  /**
   * Retorna a classe CSS baseada na variação total
   */
  getVariacaoClass(): string {
    if (!this.portfolio.variacaoTotal) return 'neutro';
    if (this.portfolio.variacaoTotal > 0) return 'positivo';
    if (this.portfolio.variacaoTotal < 0) return 'negativo';
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
   * Formata a variação com 2 casas decimais
   */
  formatarVariacao(valor: number | undefined): string {
    if (valor === undefined) return '-';
    return valor.toFixed(2).replace('.', ',');
  }
}
