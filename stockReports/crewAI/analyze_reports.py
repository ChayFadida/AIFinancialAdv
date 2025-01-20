from crewai.project import CrewBase, agent, crew, task
from crewai import Agent, Crew, Process, Task, LLM
from config.app_contex import AI_MODEL
from crewAI.tools.calcTool import CalculatorTool
from crewai_tools import FileReadTool
from crewAI.utils.reports_api import Reports
from config.logger_config import log
import os

llm = LLM(model=f"ollama/{AI_MODEL}")
file_read_tool_desc = 'A tool to read reports from txt files'
@CrewBase
class StockReportAnalysisCrew:
    agents_config = 'configs/agents.yaml'
    tasks_config = 'configs/tasks.yaml'
    
    def __init__(self, stock: str):
        self.stock = stock.upper()
        self.report_10k = self.check_for_report(stock, 'K')
        self.report_10q = self.check_for_report(stock, 'Q')

    def check_for_report(self, stock, report_type):
        file_path = f"crewAI/reports_cache/{stock}_10{report_type}.txt"
        if not os.path.exists(file_path):
            log.info(f'{report_type} report for {stock} does not exist. retrive report from API')
            report_content = Reports.get_report_content(stock ,report_type)
            with open(file_path, "w", encoding="utf-8") as file:
                file.write(report_content)
                log.info(f'save new {report_type} report for {stock} in {file_path} path')
        return file_path

    @agent
    def financial_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['financial_analyst'],
            verbose=True,
            llm=llm,
            tools=[
                CalculatorTool(),
                FileReadTool(file_path=self.report_10k, description=file_read_tool_desc),
                FileReadTool(file_path=self.report_10q, description=file_read_tool_desc)
            ]
        )

    @task
    def financial_analysis(self) -> Task: 
        return Task(
            config=self.tasks_config['financial_analysis'],
            agent=self.financial_agent(),
        )

    @agent
    def research_analyst_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['research_analyst'],
            verbose=True,
            llm=llm,
            tools=[
                FileReadTool(file_path=self.report_10k, description=file_read_tool_desc),
                FileReadTool(file_path=self.report_10q, description=file_read_tool_desc)
            ]
        )

    @task
    def research(self) -> Task:
        return Task(
            config=self.tasks_config['research'],
            agent=self.research_analyst_agent(),
        )

    @agent
    def financial_analyst_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['financial_analyst'],
            verbose=True,
            llm=llm,
            tools=[
                FileReadTool(file_path=self.report_10k, description=file_read_tool_desc),
                FileReadTool(file_path=self.report_10q, description=file_read_tool_desc),
                CalculatorTool(),
            ]
        )

    @task
    def filings_analysis(self) -> Task:
        return Task(
            config=self.tasks_config['filings_analysis'],
            agent=self.financial_analyst_agent(),
        )

    @agent
    def investment_advisor_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['investment_advisor'],
            verbose=True,
            llm=llm,
            tools=[
                CalculatorTool(),
            ]
        )

    @task
    def recommend(self) -> Task:
        return Task(
            config=self.tasks_config['recommend'],
            agent=self.investment_advisor_agent(),
        )

    @crew
    def crew(self) -> Crew:
        """Creates the Stock Analysis"""
        return Crew(
            agents=self.agents,  
            tasks=self.tasks, 
            process=Process.sequential,
            verbose=True,
        )

    def analyze(self):
        inputs = {
            'query': 'What is the company you want to analyze?',
            'company_stock': self.stock,
        }
        analysis_crew = self.crew()
        log.info(f"kickoff AI for analyze report for {self.stock}")
        crew_output = analysis_crew.kickoff(inputs=inputs)
        # Safe access to tasks_output
        try:
            taks_output = crew_output.model_dump()['tasks_output'][0]
        except (KeyError, IndexError, AttributeError) as e:
            log.error(f"Error accessing 'tasks_output': {e}")
            taks_output = None
        
        return taks_output