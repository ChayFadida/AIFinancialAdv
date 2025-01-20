from crewai.project import CrewBase, agent, crew, task
from crewai import Agent, Crew, Process, Task, LLM
from config.app_contex import AI_MODEL
from crewAI.tools.calcTool import CalculatorTool
from crewai_tools import FileReadTool
from config.logger_config import log
from crewai_tools import WebsiteSearchTool, ScrapeWebsiteTool
from crewAI.tools.search_inthernet import SearchTools
llm = LLM(model=f"ollama/{AI_MODEL}")
config=dict(
    llm=dict(
        provider="ollama",
        config=dict(
            model=AI_MODEL,
        ),
    ),
    embedder=dict(
        provider="ollama",
        config=dict(
            model=AI_MODEL,
        )
    ),
)
@CrewBase
class StockNewsAnalysisCrew:
    agents_config = 'configs/agents.yaml'
    tasks_config = 'configs/tasks.yaml'
    
    def __init__(self, stock: str):
        self.stock = stock

    @agent
    def financial_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['financial_analyst'],
            verbose=True,
            llm=llm,
            tools=[
                SearchTools.search_internet,
                ScrapeWebsiteTool(),
                CalculatorTool(),
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
                SearchTools.search_internet,
                ScrapeWebsiteTool()
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
                SearchTools.search_internet,
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
                SearchTools.search_internet,
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
        return analysis_crew.kickoff(inputs=inputs)

