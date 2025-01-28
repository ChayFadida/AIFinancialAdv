import { axios } from "../../../services/axios/axios";

export type GetReportResponse = any;

export async function getQRReport(stock_symbol: string, report_type: string): Promise<GetReportResponse> {
  const response = await axios.get<GetReportResponse>(`/reports/stocksReports`, {
    params: { stock_symbol, report_type },
  });
  return response.data;
}
