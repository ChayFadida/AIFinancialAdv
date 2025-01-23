import { axios } from "../../../services/axios/axios";

export type GetReportResponse = any;

export async function getQRReport(stock_symbol: string): Promise<GetReportResponse> {
  console.log('JELLO');  // You will get the generated fake report
  const response = await axios.get<GetReportResponse>(`/reports/Q&K`, {
    params: { stock_symbol },
  });

  return response.data;
}
