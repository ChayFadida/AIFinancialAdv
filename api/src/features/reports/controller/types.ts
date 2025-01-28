import { Request } from 'express';

export interface ReportResponse {
  stock_symbol: string;
  analysis_data: {
    risk: string;
    grow: string;
    market_position: string;
    valuation: string;
    summary: string;
    score: string;
  };
  status: string;
  created_at: string;

}

export interface GetLatestReportRequest extends Request {
  query: {
    stock_symbol: string;
    report_type: string;
  };
}
