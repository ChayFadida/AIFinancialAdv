
from crewai_tools import FileReadTool
from utils.types.report_types import ReportType  # Import the enum
from config.logger_config import log
import os
from crewAI.api.reports_api import Reports
import threading
from crewAI.tools.calcTool import CalculatorTool
from crewai_tools import SerperDevTool
from crewai_tools import SeleniumScrapingTool
from datetime import datetime

file_read_tool_desc = 'A tool to read reports from txt files'
download_lock = threading.Lock()
cache_folder = 'crewAI/reports_cache'
class ReportTools:
    report_cache = {}
    @staticmethod
    def get_latest_report(stock, report_type):
        # Construct the path format
        report_folder = cache_folder
        files = []

        # Loop through the files in the report folder
        for filename in os.listdir(report_folder):
            if filename.startswith(f"{stock}_") and filename.endswith(f"10{report_type}.txt"):
                # Extract the date part of the file name
                try:
                    date_str = filename.split('_')[1]  # Assuming the second part is the date
                    report_date = datetime.strptime(date_str, "%Y-%m-%d")  # Adjust the format if necessary
                    files.append((report_date, filename))
                except Exception as e:
                    print(f"Error processing file {filename}: {e}")

        # Find the file with the latest date
        if files:
            latest_file = max(files, key=lambda x: x[0])
            return f"{report_folder}/{latest_file[1]}"  # Return the filename
        else:
            return None  # No file found matching the pattern

    @staticmethod
    def check_for_report(stock, report_type):
        report_info = Reports.get_latest_report_info(stock ,report_type)
        report_date = report_info.get('report_date', '')
        report_url = report_info.get('report_url', '')
        file_path = f"{cache_folder}/{stock}_{report_date}_10{report_type}.txt"
        with download_lock:
            if not os.path.exists(file_path):
                log.info(f'{report_type} {report_date} report for {stock} does not exist. retrive report from API')
                report_content = Reports.get_report_content(report_url)
                if report_content:
                    with open(file_path, "w", encoding="utf-8") as file:
                        file.write(report_content)
                        log.info(f'save new {report_type} report for {stock} in {file_path} path')
        return file_path
    
    @staticmethod
    def get_tools(report_type: ReportType, stock: str):
        """Returns new instances of FileReadTool based on the report type."""
        report_path_10k = report_path_10q = None
        if report_type in [ReportType.QK_REPORT, ReportType.BOTH]:
            # Get the correct report path from the BaseCrew instance
            report_path_10k = ReportTools.get_latest_report(stock, 'K')
            report_path_10q = ReportTools.get_latest_report(stock, 'Q')
            if not report_path_10k or not report_path_10q:
                log.warning(f"Missing report for 10-K or 10-Q for stock {stock}")

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
    
ReportTools.get_tools(ReportType.QK_REPORT, "QCOM")