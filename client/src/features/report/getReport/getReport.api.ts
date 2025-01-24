import { axios } from "../../../services/axios/axios";

export type GetReportResponse = any;

export async function getQRReport(stock_symbol: string): Promise<GetReportResponse> {
  const response = await axios.get<GetReportResponse>(`/reports/Q&K`, {
    params: { stock_symbol },
  });

  return response.data;
}
