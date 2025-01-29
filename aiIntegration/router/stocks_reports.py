from fastapi import APIRouter, Query, HTTPException, Depends
from crewAI.analyze_reports import ReportGeneration
from multiprocessing import Process
from database.stockReportRepo import StockReportRepository
from dependency.dependencies import get_stock_report_repo
from utils.types.report_types import ReportType
from utils.types.report_status import ReportStatus

router = APIRouter(prefix="/stocksReports", tags=["Stock Reports"])

def analyze_and_push_to_db(stock : str, report_type: ReportType):
    repo = get_stock_report_repo()
    report_id = repo.create_report_placeholder(stock_symbol=stock, report_type=report_type)
    try:
        analysis_result = ReportGeneration.getReport(stock, report_type)
        repo.update_report_status(report_id=report_id, status="done", analysis_data=analysis_result)
    except Exception as e:
        repo.update_report_status(report_id=report_id, status="failed")
        raise e

@router.post('/analyzeReport')
def analyze_report(
    stock: str, report_type: ReportType,
):
    """
    Analyze report for a single stock symbol.

    Args:
        stock (str): A single stock symbol provided as a query parameter.

    Returns:
        dict: A response indicating the result of the analysis.
    """
    if not stock.isalpha():
        raise HTTPException(status_code=400, detail="Invalid stock symbol. Must be alphabetic.")
    process = Process(target=analyze_and_push_to_db, args=(stock, report_type,))
    process.start()
    return {"status": "success", "stock": stock}

@router.get('/getLatestReport')
def get_latest_report(
    stock: str, report_type: ReportType, report_status: ReportStatus,
    repo: StockReportRepository = Depends(get_stock_report_repo)
):
    """
    Retrieve the latest report for a given stock symbol.

    Args:
        stock_symbol (str): The stock symbol to retrieve the latest report for.

    Returns:
        dict: The latest stock report.
    """
    return repo.get_latest_report(stock, report_type, report_status)

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