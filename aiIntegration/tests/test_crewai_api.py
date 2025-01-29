import pytest
from unittest.mock import patch, MagicMock
from crewAI.api.stock_api import YahooFinanceAPI  # Adjust the import as necessary
from crewAI.api.reports_api import Reports
from unittest.mock import patch, MagicMock, ANY

@patch('requests.get')
def test_get_stock_price_success(mock_get):
    # Mock the response object
    mock_response = MagicMock()
    mock_response.raise_for_status = MagicMock()
    mock_response.json.return_value = {
        "meta": {
            "regularMarketPrice": 150.75
        }
    }
    mock_get.return_value = mock_response

    # Call the method (simulate the API call)
    result = YahooFinanceAPI.get_stock_price("AAPL")

    # Assertions - match the URL and params, but ignore the API key using `ANY`
    mock_get.assert_called_once_with(
        'https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/history',
        headers={'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com', 'x-rapidapi-key': ANY},
        params={'symbol': 'AAPL', 'interval': '5m', 'diffandsplits': 'false'}
    )

    # Validate the result
    assert result == 150.75


@patch('requests.get')
def test_get_stock_price_no_price(mock_get):
    # Mock the response object
    mock_response = MagicMock()
    mock_response.raise_for_status = MagicMock()
    mock_response.json.return_value = {
        "meta": {}  # No price data available
    }
    mock_get.return_value = mock_response

    # Call the method (simulate the API call)
    result = YahooFinanceAPI.get_stock_price("AAPL")

    # Assertions - match the URL and params, but ignore the API key using `ANY`
    mock_get.assert_called_once_with(
        'https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/history',
        headers={'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com', 'x-rapidapi-key': ANY},
        params={'symbol': 'AAPL', 'interval': '5m', 'diffandsplits': 'false'}
    )

    # Validate the result - since no price is available, the result should be None or some default value
    assert result is None  # Or whatever value you expect in case of no price

