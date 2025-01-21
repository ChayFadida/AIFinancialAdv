from crewai.project import CrewBase, agent, crew, task
from crewai import Agent, Crew, Process, Task, LLM
from config.app_contex import AI_MODEL
from crewAI.tools.calcTool import CalculatorTool
from crewai_tools import FileReadTool
from crewAI.utils.reports_api import Reports
from config.logger_config import log
from utils.analysis_types import AnalysisType
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


    @agent
    def market_volatility_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['financial_risk_analyst'],
            verbose=True,
            llm=llm,
            tools=[
                FileReadTool(file_path=self.report_10k, description=file_read_tool_desc),
                FileReadTool(file_path=self.report_10q, description=file_read_tool_desc),
                CalculatorTool(),
            ]
        )

    @agent
    def sector_risk_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['sector_risk_analyst'],
            verbose=True,
            llm=llm,
            tools=[
                FileReadTool(file_path=self.report_10k, description=file_read_tool_desc),
                FileReadTool(file_path=self.report_10q, description=file_read_tool_desc),
                CalculatorTool(),
            ]
        )

    @agent
    def macroeconomic_risk_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['macroeconomic_risk_analyst'],
            verbose=True,
            llm=llm,
            tools=[
                FileReadTool(file_path=self.report_10k, description=file_read_tool_desc),
                FileReadTool(file_path=self.report_10q, description=file_read_tool_desc),
                CalculatorTool(),
            ]
        )

    @agent
    def risk_summary_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['risk_summary_analyst'],
            verbose=True,
            llm=llm,
            tools=[],
        )

    @task
    def market_volatility_analysis(self) -> Task:
        return Task(
            config=self.tasks_config['financial_risk_analysis'],
            agent=self.market_volatility_agent(),
        )

    @task
    def sector_risk_analysis(self) -> Task:
        return Task(
            config=self.tasks_config['sector_risk_analysis'],
            agent=self.sector_risk_agent(),
        )

    @task
    def macroeconomic_risk_analysis(self) -> Task:
        return Task(
            config=self.tasks_config['macroeconomic_risk_analysis'],
            agent=self.macroeconomic_risk_agent(),
        )

    @task
    def risk_summary(self) -> Task:
        return Task(
            config=self.tasks_config['risk_summary'],
            agent=self.risk_summary_agent(),
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

    def riskCrew(self) -> Crew:
        """Creates risk Analysis"""
        return Crew(
            agents=[
                self.market_volatility_agent(),
                self.sector_risk_agent(),
                self.macroeconomic_risk_agent(),
                self.risk_summary_agent(),
            ],
            tasks=[
                self.market_volatility_analysis(),
                self.sector_risk_analysis(),
                self.macroeconomic_risk_analysis(),
                self.risk_summary()
            ],
            process=Process.sequential,
            verbose=True,
        )

    def analyze(self, analysis_type: AnalysisType):
        inputs = {
            'query': 'What is the company you want to analyze?',
            'company_stock': self.stock,
        }
        # Mapping enum values to crew methods
        crew_methods = {
            AnalysisType.FINANCIAL: self.crew,
            AnalysisType.RISK: self.riskCrew,
            # Add more mappings here as you add new crew methods
        }
        crew_method = crew_methods.get(analysis_type)
        if not crew_method:
            log.error(f"Unsupported analysis type: {analysis_type}")
            return None
        log.info(f"Kickoff AI for {analysis_type.value} analysis for {self.stock}")
        crew_instance = crew_method()
        crew_output = crew_instance.kickoff(inputs=inputs)
        # Safe access to tasks_output
        try:
            taks_output = crew_output.model_dump()['tasks_output'][0]
        except (KeyError, IndexError, AttributeError) as e:
            log.error(f"Error accessing 'tasks_output': {e}")
            taks_output = None
        
        return taks_output
    
    