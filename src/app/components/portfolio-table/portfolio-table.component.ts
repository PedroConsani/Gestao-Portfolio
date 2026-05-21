import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { Portfolio } from '../../models/portfolio';
import { StockRowComponent } from '../stock-row/stock-row.component';
import { PortfolioSummaryComponent } from '../portfolio-summary/portfolio-summary.component';

@Component({
  selector: 'app-portfolio-table',
  standalone: true,
  imports: [CommonModule, StockRowComponent, PortfolioSummaryComponent],
  templateUrl: './portfolio-table.component.html',
  styleUrls: ['./portfolio-table.component.css']
})
export class PortfolioTableComponent implements OnInit {
  portfolio: Portfolio | null = null;

  constructor(private portfolioService: PortfolioService) { }

  ngOnInit(): void {
    this.portfolioService.portfolio$.subscribe(portfolio => {
      this.portfolio = portfolio;
    });
  }
}
