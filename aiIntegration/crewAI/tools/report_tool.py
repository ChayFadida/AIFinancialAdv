
from crewai_tools import FileReadTool
from utils.types.report_types import ReportType  # Import the enum
from config.logger_config import log
import os
from crewAI.api.reports_api import Reports
import threading
from crewAI.tools.calcTool import CalculatorTool
from crewai_tools import SerperDevTool
from crewai_tools import SeleniumScrapingTool
from crewai_tools import ScrapeWebsiteTool

file_read_tool_desc = 'A tool to read reports from txt files'
download_lock = threading.Lock()

class ReportTools:
    @staticmethod
    def check_for_report(stock, report_type):
        file_path = f"crewAI/reports_cache/{stock}_10{report_type}.txt"
        with download_lock:
            if not os.path.exists(file_path):
                log.info(f'{report_type} report for {stock} does not exist. retrive report from API')
                report_content = Reports.get_report_content(stock ,report_type)
                if report_content:
                    with open(file_path, "w", encoding="utf-8") as file:
                        file.write(report_content)
                        log.info(f'save new {report_type} report for {stock} in {file_path} path')
        return file_path
    
    @staticmethod
    def get_tools(report_type: ReportType, stock: str):
        """Returns new instances of FileReadTool based on the report type."""
        
        # Get the correct report path from the BaseCrew instance
        report_path_10k = ReportTools.check_for_report(stock, 'K')
        report_path_10q = ReportTools.check_for_report(stock, 'Q')
        
        # Define a mapping from report type to tool generation
        tool_mapping = {
            ReportType.QK_REPORT: lambda: [
                FileReadTool(file_path=report_path_10k, description=f"{file_read_tool_desc} 10-K report tool"),
                FileReadTool(file_path=report_path_10q, description=f"{file_read_tool_desc} 10-Q report tool"),
                CalculatorTool()
            ],
            ReportType.WEB_REPORT: lambda: [
                SerperDevTool(),
                SeleniumScrapingTool(website_url=f"https://edition.cnn.com/markets/stocks/{stock}#news"),
                SeleniumScrapingTool(website_url=f"https://edition.cnn.com/markets/stocks/{stock}#forecasts")
            ],
            ReportType.BOTH: lambda: [
                FileReadTool(file_path=report_path_10k, description=f"{file_read_tool_desc} 10-K report tool"),
                FileReadTool(file_path=report_path_10q, description=f"{file_read_tool_desc} 10-Q report tool"),
                CalculatorTool(),
                SerperDevTool(),
                SeleniumScrapingTool(website_url=f"https://edition.cnn.com/markets/stocks/{stock}#news"),
                SeleniumScrapingTool(website_url=f"https://edition.cnn.com/markets/stocks/{stock}#forecasts")        
            ]
        }

        # Return the appropriate tool generation function and call it to get new instances
        return tool_mapping.get(report_type, lambda: [])()  # Default to empty list if report_type is invalid
