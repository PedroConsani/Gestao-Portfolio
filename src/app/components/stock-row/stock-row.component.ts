import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Stock } from '../../models/stock';

@Component({
  selector: 'app-stock-row',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stock-row.component.html',
  styleUrls: ['./stock-row.component.css']
})
export class StockRowComponent {
  @Input() stock!: Stock;

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
   * Formata a variação com 2 casas decimais
   */
  formatarVariacao(valor: number | undefined): string {
    if (valor === undefined) return '-';
    return valor.toFixed(2).replace('.', ',');
  }
}
