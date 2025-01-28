from crewAI.crew.base import BaseCrew
from crewai.project import CrewBase, agent, task, crew
from crewai import Agent, Task, Crew, Process
from utils.types.report_types import ReportType

@CrewBase
class RiskCrew(BaseCrew):
    agents_config = "/Users/tomer_lazarovitch/Documents/AIFinancialAdv/stockReports/crewAI/configs/risk/agents.yaml"
    tasks_config = "/Users/tomer_lazarovitch/Documents/AIFinancialAdv/stockReports/crewAI/configs/risk/tasks.yaml"
    def __init__(self, stock: str, report_type: ReportType):
        super().__init__(stock, report_type)
        
    
    @agent
    def market_volatility_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['financial_risk_analyst'],
            verbose=True,
            llm=self.llm,
            tools=self.get_tools()
        )

    @agent
    def sector_risk_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['sector_risk_analyst'],
            verbose=True,
            llm=self.llm,
            tools=self.get_tools()
        )

    @agent
    def macroeconomic_risk_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['macroeconomic_risk_analyst'],
            verbose=True,
            llm=self.llm,
            tools=self.get_tools()
        )

    @agent
    def risk_summary_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['risk_summary_analyst'],
            verbose=True,
            llm=self.llm,
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
    def getCrew(self) -> Crew:
        """Creates Growth Analysis Crew"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
        )
    