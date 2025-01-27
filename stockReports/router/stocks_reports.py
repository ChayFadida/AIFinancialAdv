from fastapi import APIRouter, Query, HTTPException, Depends
from crewAI.analyze_reports import ReportGeneration
from multiprocessing import Process
from database.stockReportRepo import StockReportRepository
from dependency.dependencies import get_stock_report_repo
from utils.types.report_types import ReportType
from pydantic import BaseModel

router = APIRouter(prefix="/stocksQ&KReports", tags=["Stock Q&K Reports"])

class ReportRequest(BaseModel):
    stock: str
    report_type: ReportType 

def analyze_and_push_to_db(stock : str, report_type: ReportType):
    if not stock.isalpha():
        raise HTTPException(status_code=400, detail="Invalid stock symbol. Must be alphabetic.")
    analysis_result = ReportGeneration.getReport(stock, report_type)
    repo = get_stock_report_repo()
    repo.add_report(stock_symbol=stock, analysis_data=analysis_result, report_type=report_type)

@router.post('/analyzeReport')
def analyze_report(
    request: ReportRequest
):
    """
    Analyze report for a single stock symbol.

    Args:
        stock (str): A single stock symbol provided as a query parameter.

    Returns:
        dict: A response indicating the result of the analysis.
    """
    stock = request.stock
    report_type = request.report_type
    process = Process(target=analyze_and_push_to_db, args=(stock, report_type,))
    process.start()
    return {"status": "success", "stock": stock}

@router.get('/getLatestReport')
def get_latest_report(
    request: ReportRequest,
    repo: StockReportRepository = Depends(get_stock_report_repo)
):
    """
    Retrieve the latest report for a given stock symbol.

    Args:
        stock_symbol (str): The stock symbol to retrieve the latest report for.

    Returns:
        dict: The latest stock report.
    """
    return repo.get_latest_report(request.stock)

@router.get('/getAllReports')
def get_all_reports(
    repo: StockReportRepository = Depends(get_stock_report_repo)
):
    """
    Retrieve all stock reports from the database.

    Returns:
        list: A list of all stock reports.
    """
    return repo.get_all_reports()

@router.get('/getReportsByStockSymbol')
def get_reports_by_stock_symbol(
    stock_symbol: str = Query(..., description="Stock symbol to filter reports, e.g., 'intc'"),
    repo: StockReportRepository = Depends(get_stock_report_repo)
):
    """
    Retrieve all reports for a specific stock symbol.

    Args:
        stock_symbol (str): The stock symbol to filter reports by.

    Returns:
        list: A list of reports for the specific stock symbol.
    """
    return repo.get_reports_by_stock_symbol(stock_symbol)