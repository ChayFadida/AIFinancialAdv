from crewAI.tools.report_tool import ReportTools
from crewai import LLM
from config.app_contex import AI_MODEL
from utils.types.report_types import ReportType  # Import the enum

llm = LLM(model=f"ollama/{AI_MODEL}")

class BaseCrew:
    file_read_tool_desc = 'A tool to read reports from txt files'

    def __init__(self, stock: str, report_type: ReportType):
        self.stock = stock.upper()
        self.llm = llm
        self.report_type = report_type

    def get_tools(self):
            """Returns tools based on the report type and external file paths."""
            return ReportTools.get_tools(self.report_type, self.stock)  # Pass external file paths