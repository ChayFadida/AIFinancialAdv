import { axios } from "../../../services/axios/axios";

export type GetReportResponse = any;

export async function getQRReport(stock_symbol: string, report_type: string): Promise<{data: GetReportResponse, status: number}> {
  const response = await axios.get<GetReportResponse>(`/reports/stocksReports`, {
    params: { stock_symbol, report_type },
  });
  return {
    data: response.data,
    status: response.status
  };
}
