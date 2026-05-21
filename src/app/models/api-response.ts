export interface ApiStockResponse {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp?: string;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
}
