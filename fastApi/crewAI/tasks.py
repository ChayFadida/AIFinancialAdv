from crewai import Task
from textwrap import dedent
from crewai_tools import FileReadTool
import pandas as pd
import csv
import chardet
from pathlib import Path
from crewai_tools import FileReadTool
import PyPDF2
import PyPDF2
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph

class MarketingAnalysisTasks:
    def best_stock_analysis(self, agent):
        return Task(
            description=dedent("""\
                Analyze the current stock market trends and identify the best stock to invest in right now.
                
                Your analysis should consider factors such as recent performance, market trends, 
                industry outlook, and potential for growth. Provide a detailed rationale for your 
                recommendation, highlighting key metrics and insights.
                
                Your final answer must clearly justify why the recommended stock stands out as the 
                best investment option at the present time.
                """),
            expected_output="A wide answer",
            agent=agent
        )

    def createYourOwnTask(self, agent, task):
        return Task(
            description=dedent(task),
            expected_output="A wide answer",
            agent=agent,
        )