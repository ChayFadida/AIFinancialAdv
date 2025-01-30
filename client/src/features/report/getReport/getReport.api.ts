import { axios } from "../../../services/axios/axios";
import { RequestProgress } from "../../../pages/Recommendation";
import company_symbol from "../../../utils/company_symbol.json"
export type GetReportResponse = any;

export async function getQRReport(stock_symbol: string, report_type: string, wantUpdateReport: boolean): Promise<{data: GetReportResponse, status: number}> {
  if(!wantUpdateReport){
    const response = await axios.get<GetReportResponse>(`/reports/stocksReports`, {
        params: { stock_symbol, report_type },
      });
      console.log(`this is ${response.status}`)
      return {
        data: response.data,
        status: response.status
      };
    } else {
      const response = await axios.get<GetReportResponse>(`/reports/forceGenerateReport`, {
        params: { stock_symbol, report_type },
      });
      return {
        data: response.data,
        status: response.status
      };     
    }
}

export async function getProgressItems(): Promise<{ data: any[]; status: number }> {
  try{
    const response = await axios.get<any[]>(`/reports/getAllReport`, {});
  
    // Create a map from the stock_symbol to company name for quick lookup
    const companyMap = new Map(
      company_symbol.map(item => [item.stock_symbol, item.company])
    );
  
    // Map the response data and replace stock_symbol with the company name
    const updatedData = response.data.map(report => {
        const companyName = `${companyMap.get(report.stock_symbol)} ${report.reportType}`; // Fallback to stock_symbol if not found
  
      return {
        reportName: companyName,
        status: report.status,
        date: report.date
      };
    });
    return { data: updatedData, status: response.status };
  } catch (error) {
    return { data: [], status: 500 }
  }
}