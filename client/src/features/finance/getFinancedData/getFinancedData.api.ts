import { yahooChartAxios } from "../../../services";

export type YahooResponse = any;
interface FinancialMetrics {
  totalRevenue: number;
  profitMargins: number;
  freeCashFlow: number;
  peRatio: number;
  revenueGrowth: number;
  currentRatio: number
  
}
export async function getFinanceData(stockName: string): Promise<FinancialMetrics> {
  const response = await yahooChartAxios.get<YahooResponse>(`/markets/stock/modules`, {
    params: {
      ticker: stockName,
      module: "financial-data",
    },
  });
  const financeData = response.data.body;

  return {
    totalRevenue: financeData.totalRevenue?.fmt || financeData.totalRevenue,
    profitMargins: financeData.profitMargins?.fmt || financeData.profitMargins,
    freeCashFlow: financeData.freeCashFlow?.fmt || financeData.freeCashFlow,
    peRatio: financeData.peRatio?.fmt || financeData.peRatio,
    revenueGrowth: financeData.revenueGrowth?.raw * 100 || financeData.revenueGrowth,
    currentRatio: financeData.currentRatio?.fmt || financeData.currentRatio
  };
}
