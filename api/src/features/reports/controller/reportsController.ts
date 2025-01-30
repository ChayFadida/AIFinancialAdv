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

  // Check if a report is in progress
  const response_in_progress = await aiAxios.get(`/stocksReports/getLatestReport`, {
    params: { stock: stock_symbol, report_type: report_type, report_status: "in_progress" },
  });

  const inProgressExists = response_in_progress.data && Object.keys(response_in_progress.data).length > 0;

  // Check if a report is done
  const response_done = await aiAxios.get(`/stocksReports/getLatestReport`, {
    params: { stock: stock_symbol, report_type: report_type, report_status: "done" },
  });

  const doneExists = response_done.data && Object.keys(response_done.data).length > 0;

  // If there is no "done" report but an "in progress" report exists, return 200
  if (!doneExists && inProgressExists) {
    console.log("Report is still in progress")
    return res.status(201).json({ message: "Report is still in progress" });
  }

  // If there is a "done" report (regardless of an "in progress" report), return the done report
  if (doneExists) {
    return res.status(200).json(response_done.data);
  }

  // If there is no report in progress and no report done, trigger analysis and return 201
  const fallbackResponse = await aiAxios.post(`/stocksReports/analyzeReport`, null, {
    params: { stock: stock_symbol, report_type: report_type }
  });

  return res.status(201).json(fallbackResponse.data);
});


export const getAllReport = catchAsync(async (req: GetLatestReportRequest, res: Response) => {

  const response = await aiAxios.get(`/stocksReports/getAllReports`, {});
  if (!response.data || !Array.isArray(response.data)) {
    return res.status(404).json({ message: 'Report not found' });
  }

  // Filter reports based on `status` key
  const filteredReports = response.data.filter(
    (report) =>
      report?.status === 'in_progress' || report?.status === 'done'
  );

  if (filteredReports.length === 0) {
    return res.status(404).json({ message: 'No reports with status "in_progress" or "done" found' });
  }

  const reportTypeMapping: Record<string, string> = {
    "qk_report": "Quarterly & Yearly Report",
    "both": "Both Method Report",
    "web_report": "Latest News Report",
  };
  const progressReports = filteredReports.map((report) => {
    return {
      reportType: reportTypeMapping[report.report_type] || "Unknown Report", // Use mapping or default to 'Unknown Report'
      stock_symbol: report.stock_symbol,
      status: report.status,
      date: report.created_at
    };
  });
  return res.status(200).json(progressReports);
});


export const forceGenerateReport = catchAsync(async (req: GetLatestReportRequest, res: Response) => {
  const { stock_symbol, report_type } = req.query;
  if (!stock_symbol) {
    throw 'Stock symbol is required';
  }
  const response_in_progress = await aiAxios.get(`/stocksReports/getLatestReport`, {
    params: { stock: stock_symbol, report_type: report_type, report_status: "in_progress" },
  });

  const inProgressExists = response_in_progress.data && Object.keys(response_in_progress.data).length > 0;
  if (inProgressExists) {
    return res.status(200).json(response_in_progress.data);
  }
  const response = await aiAxios.post(`/stocksReports/analyzeReport`, null, {
    params: { stock: stock_symbol, report_type: report_type }
  });
  return res.status(201).json(response.data);
});