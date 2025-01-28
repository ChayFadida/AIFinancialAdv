import pytest
from unittest.mock import patch, MagicMock
from crewai_tools import FileReadTool
from utils.types.report_types import ReportType
from crewAI.tools.calcTool import CalculatorTool
from crewai_tools import SerperDevTool, SeleniumScrapingTool
from crewAI.tools.report_tool import ReportTools

# Test for check_for_report method
@patch('os.path.exists')
@patch('crewAI.api.reports_api.Reports.get_report_content')
@patch('builtins.open', new_callable=MagicMock)
def test_check_for_report(mock_open, mock_get_report_content, mock_os_path_exists):
    stock = "AAPL"
    report_type = "K"
    file_path = f"crewAI/reports_cache/{stock}_10{report_type}.txt"
    
    # Mock the scenario where the file does not exist
    mock_os_path_exists.return_value = False
    mock_get_report_content.return_value = "Mocked Report Content"
    
    # Call the method
    result = ReportTools.check_for_report(stock, report_type)
    
    # # Assertions
    mock_os_path_exists.assert_called_once_with(file_path)
    mock_get_report_content.assert_called_once_with(stock, report_type)
    mock_open.assert_called_once_with(file_path, "w", encoding="utf-8")
    assert result == file_path  # Ensure the returned file path is correct
    
    # # Now test for the case where the file already exists
    mock_os_path_exists.return_value = True
    

# Test for get_tools method
@patch('crewAI.tools.report_tool.ReportTools.check_for_report')
def test_get_tools(mock_check_for_report):
    stock = "AAPL"
    
    # Mock the check_for_report method to return mock file paths
    mock_check_for_report.return_value = "mock_file_path"
    
    # Test for ReportType.QK_REPORT
    tools = ReportTools.get_tools(ReportType.QK_REPORT, stock)
    

    assert isinstance(tools[0], FileReadTool)
    assert isinstance(tools[1], FileReadTool)
    assert isinstance(tools[2], CalculatorTool)
    
    # Test for ReportType.WEB_REPORT
    tools = ReportTools.get_tools(ReportType.WEB_REPORT, stock)
    
    # Assertions
    assert len(tools) == 3  # Should return 3 tools: 1 SerperDevTool and 2 SeleniumScrapingTool
    assert isinstance(tools[0], SerperDevTool)
    assert isinstance(tools[1], SeleniumScrapingTool)
    assert isinstance(tools[2], SeleniumScrapingTool)
    
#     # Test for ReportType.BOTH
    tools = ReportTools.get_tools(ReportType.BOTH, stock)
    
    # Assertions
    assert len(tools) == 6  # Should return 6 tools: 2 FileReadTools, 1 CalculatorTool, 1 SerperDevTool, 2 SeleniumScrapingTool
    assert isinstance(tools[0], FileReadTool)
    assert isinstance(tools[1], FileReadTool)
    assert isinstance(tools[2], CalculatorTool)
    assert isinstance(tools[3], SerperDevTool)
    assert isinstance(tools[4], SeleniumScrapingTool)
    assert isinstance(tools[5], SeleniumScrapingTool)
