from crewAI.utils.reports_api import Reports
from config.logger_config import log
import os
from crewai import LLM
from config.app_contex import AI_MODEL


llm = LLM(model=f"ollama/{AI_MODEL}")

class BaseCrew:
    file_read_tool_desc = 'A tool to read reports from txt files'

    def __init__(self, stock: str):
        self.stock = stock.upper()
        self.report_10k = self.check_for_report(stock, 'K')
        self.report_10q = self.check_for_report(stock, 'Q')
        self.llm = llm

    def check_for_report(self, stock, report_type):
        file_path = f"crewAI/reports_cache/{stock}_10{report_type}.txt"
        if not os.path.exists(file_path):
            log.info(f'{report_type} report for {stock} does not exist. retrive report from API')
            report_content = Reports.get_report_content(stock ,report_type)
            with open(file_path, "w", encoding="utf-8") as file:
                file.write(report_content)
                log.info(f'save new {report_type} report for {stock} in {file_path} path')
        return file_path