import { Request } from 'express';

export interface ReportResponse {
  stock_symbol: string;
  analysis_data: {
    risks: string;
    grow: string;
  };
  created_at: string;
}

export interface GetLatestReportRequest extends Request {
  query: {
    stock_symbol: string;
  };
}
