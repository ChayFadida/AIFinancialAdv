import pytest
from unittest.mock import patch, MagicMock
from crewai_tools import FileReadTool
from utils.types.report_types import ReportType
from crewAI.tools.calcTool import CalculatorTool
from crewai_tools import SerperDevTool, SeleniumScrapingTool
from crewAI.tools.report_tool import ReportTools

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
