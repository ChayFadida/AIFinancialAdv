import { Response } from 'express';
import { catchAsync } from '../../../utils';
import { aiAxios } from '../../../services/aiAxios';
import { GetLatestReportRequest } from './types';

// Fetch the latest stock report
export const getLatestReport = catchAsync(async (req: GetLatestReportRequest, res: Response) => {
  const { stock_symbol } = req.query;
  if (!stock_symbol) {
    throw 'Stock symbol is required';
  }

  const response = await aiAxios.get(`/stocksQ%26KReports/getLatestReport`, {
    params: { stock_symbol: stock_symbol },
  });
  console.log(response.data)

  if (!response.data) {
    return res.status(404).json({ message: 'Report not found' });
  }

  return res.status(200).json(response.data);
});
