import pytest
from unittest.mock import MagicMock
from fastapi import HTTPException
from utils.types.report_types import ReportType
from database.stockReportRepo import StockReportRepository
from utils.types.report_status import ReportStatus


@pytest.fixture
def mock_collection():
    return MagicMock()


@pytest.fixture
def stock_report_repo(mock_collection):
    return StockReportRepository(collection=mock_collection)

def test_add_report_invalid_stock_symbol(stock_report_repo):
    with pytest.raises(HTTPException) as exc:
        stock_report_repo.add_report(
            stock_symbol="AAPL123",  # Invalid stock symbol with numbers
            analysis_data={"price": 150, "volume": 100000},
            report_type=ReportType.QK_REPORT
        )
    assert exc.value.status_code == 400
    assert exc.value.detail == "Invalid stock symbol. Must be alphabetic."



def test_add_report_invalid_symbol(stock_report_repo):
    with pytest.raises(HTTPException) as exc_info:
        stock_report_repo.add_report(
            stock_symbol="1234",
            analysis_data={"price": 150, "volume": 100000},
            report_type=ReportType.QK_REPORT
        )
    assert exc_info.value.status_code == 400
    assert exc_info.value.detail == "Invalid stock symbol. Must be alphabetic."


def test_get_all_reports(stock_report_repo, mock_collection):
    mock_collection.find.return_value = [
        {"stock_symbol": "AAPL", "price": 150},
        {"stock_symbol": "GOOGL", "price": 2800}
    ]

    result = stock_report_repo.get_all_reports()

    assert len(result) == 2
    assert result[0]["stock_symbol"] == "AAPL"
    assert result[1]["stock_symbol"] == "GOOGL"
    mock_collection.find.assert_called_once_with({}, {"_id": 0})




def test_get_latest_report_not_found(stock_report_repo, mock_collection):
    mock_collection.find_one.return_value = None

    # Call the method and store the result
    result = stock_report_repo.get_latest_report(
        stock_symbol="AAPL",
        report_type=ReportType.QK_REPORT,
        report_status=ReportStatus.IN_PROGRESS
    )

    # Assert that the result is an empty dictionary
    assert result == {}


def test_get_reports_by_stock_symbol_success(stock_report_repo, mock_collection):
    mock_collection.find.return_value = [
        {"stock_symbol": "AAPL", "price": 150},
        {"stock_symbol": "AAPL", "price": 155}
    ]

    result = stock_report_repo.get_reports_by_stock_symbol("AAPL")

    assert len(result) == 2
    assert all(r["stock_symbol"] == "AAPL" for r in result)
    mock_collection.find.assert_called_once_with(
        {"stock_symbol": "AAPL"},
        {"_id": 0}
    )


def test_get_reports_by_stock_symbol_not_found(stock_report_repo, mock_collection):
    mock_collection.find.return_value = []

    with pytest.raises(HTTPException) as exc_info:
        stock_report_repo.get_reports_by_stock_symbol("AAPL")

    assert exc_info.value.status_code == 404
    assert exc_info.value.detail == "No reports found for stock symbol AAPL."
