from fastapi import APIRouter, Query, HTTPException, Depends
from crewAI.analyze_reports import StockReportAnalysisCrew
from multiprocessing import Process
from database.stockReportRepo import StockReportRepository
from dependency.dependencies import get_stock_report_repo

router = APIRouter(prefix="/stocksQ&KReports", tags=["Stock Q&K Reports"])


def analyze_and_push_to_db(stock : str):
    if not stock.isalpha():
        raise HTTPException(status_code=400, detail="Invalid stock symbol. Must be alphabetic.")
    analysis_result = StockReportAnalysisCrew(stock).analyze()
    repo = get_stock_report_repo()
    repo.add_report(stock_symbol=stock, analysis_data=analysis_result)

@router.post('/analyzeReport')
def analyze_report(
    stock: str = Query(..., description="Stock symbol to analyze, e.g., 'intc'"),
):
    """
    Analyze report for a single stock symbol.

    Args:
        stock (str): A single stock symbol provided as a query parameter.

    Returns:
        dict: A response indicating the result of the analysis.
    """

    # # Perform some operation on the stock symbol
    process = Process(target=analyze_and_push_to_db, args=(stock,))
    process.start()
    return {"status": "success", "stock": stock}

@router.post('/addReport')
def add_report(
    stock_symbol: str,
    analysis_data: dict,
    repo: StockReportRepository = Depends(get_stock_report_repo)
):
    """
    Endpoint to add a stock report to the database.
    """
    
    return repo.add_report(stock_symbol, analysis_data)

@router.get('/getLatestReport')
def get_latest_report(
    stock_symbol: str = Query(..., description="Stock symbol to fetch the latest report, e.g., 'intc'"),
    repo: StockReportRepository = Depends(get_stock_report_repo)
):
    """
    Retrieve the latest report for a given stock symbol.

    Args:
        stock_symbol (str): The stock symbol to retrieve the latest report for.

    Returns:
        dict: The latest stock report.
    """
    return repo.get_latest_report(stock_symbol)

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