import logging
from fastapi.testclient import TestClient
from app import app
from utils.types.report_types import ReportType
from unittest.mock import patch
from utils.types.report_status import ReportStatus

# Set up a logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

client = TestClient(app)


@patch('database.stockReportRepo.StockReportRepository.get_all_reports')
def test_get_all_reports(mock_get_all_reports):
    # Mock the get_all_reports method to return a list of reports
    mock_get_all_reports.return_value = [
        {"stock_symbol": "AAPL", "report_data": "Mocked report 1"},
        {"stock_symbol": "GOOG", "report_data": "Mocked report 2"}
    ]

    # Test getting all reports
    response = client.get("/stocksReports/getAllReports")

    assert response.status_code == 200
    assert len(response.json()) == 2
    assert response.json()[0]['stock_symbol'] == "AAPL"
    assert response.json()[1]['stock_symbol'] == "GOOG"


@patch('database.stockReportRepo.StockReportRepository.get_latest_report')
def test_get_latest_report_valid_request(mock_get_latest_report):
    mock_get_latest_report.return_value = {
        "stock_symbol": "AAPL",
        "report_data": "Mocked latest report"
    }

    response = client.get(
        "/stocksReports/getLatestReport",
        params={"stock": "AAPL", "report_type": ReportType.QK_REPORT.value, "report_status": ReportStatus.IN_PROGRESS, "report_status": ReportStatus.DONE.value}
    )

    assert response.status_code == 200
    assert response.json() == {
        "stock_symbol": "AAPL",
        "report_data": "Mocked latest report"
    }

@patch('database.stockReportRepo.StockReportRepository.get_reports_by_stock_symbol')
def test_get_reports_by_stock_symbol_valid(mock_get_reports_by_stock_symbol):
    mock_get_reports_by_stock_symbol.return_value = [
        {"stock_symbol": "AAPL", "report_data": "Mocked report 1"},
        {"stock_symbol": "AAPL", "report_data": "Mocked report 2"}
    ]

    response = client.get("/stocksReports/getReportsByStockSymbol?stock_symbol=AAPL")

    assert response.status_code == 200
    assert len(response.json()) == 2
    assert response.json()[0]["stock_symbol"] == "AAPL"
    assert response.json()[1]["stock_symbol"] == "AAPL"

def test_get_reports_by_stock_symbol_missing_query():
    response = client.get("/stocksReports/getReportsByStockSymbol")

    assert response.status_code == 422  

def test_analyze_report_with_invalid_report_type():
    with patch('multiprocessing.Process.start') as mock_start:
        mock_start.return_value = None
        response = client.post(
            "/stocksReports/analyzeReport",
            json={"stock": "AAPL", "report_type": "INVALID"}
        )
        assert response.status_code == 422
        assert "Field required" in response.json()["detail"][0]["msg"]
