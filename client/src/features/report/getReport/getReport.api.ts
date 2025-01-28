import { axios } from "../../../services/axios/axios";
import { RequestProgress } from "../../../pages/Recommendation";

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
export async function getProgressItems(): Promise<{ data: RequestProgress[]; status: number }> {
  const response = await axios.get<RequestProgress[]>(`/reports/getAllReport`, {});
  // Assuming the response data is already in the format of RequestProgress[]
  return { data: response.data, status: response.status };
}