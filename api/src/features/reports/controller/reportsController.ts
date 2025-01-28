import { Response } from 'express';
import { catchAsync } from '../../../utils';
import { aiAxios } from '../../../services/aiAxios';
import { GetLatestReportRequest } from './types';

// Fetch the latest stock report
export const getLatestReport = catchAsync(async (req: GetLatestReportRequest, res: Response) => {
  const { stock_symbol, report_type } = req.query;
  if (!stock_symbol) {
    throw 'Stock symbol is required';
  }

  const response = await aiAxios.get(`/stocksReports/getLatestReport`, {
    params: { stock: stock_symbol, report_type: report_type },
  });
  console.log(stock_symbol)
  console.log(report_type)
  // Check if the response data is empty and trigger another API call if true
  if (!response.data || Object.keys(response.data).length === 0) {
    const fallbackResponse = await aiAxios.post(`/stocksReports/analyzeReport`, null, {
      params: { stock: stock_symbol, report_type: report_type }
    });

    // If the fallback response is also empty, return a 404 response
    if (!fallbackResponse.data || Object.keys(fallbackResponse.data).length === 0) {
      return res.status(404).json({ message: 'Report not found in both attempts' });
    }

    // If fallback response is successful, return the data
    return res.status(200).json(fallbackResponse.data);
  }

  // If the original response is not empty, return the data
  return res.status(200).json(response.data);
});
