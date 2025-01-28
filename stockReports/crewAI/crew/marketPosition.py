from crewAI.crew.base import BaseCrew
from crewai.project import CrewBase, agent, task, crew
from crewai import Agent, Task, Crew, Process
from utils.types.report_types import ReportType

@CrewBase
class MarketPositionCrew(BaseCrew):
    agents_config = "/Users/tomer_lazarovitch/Documents/AIFinancialAdv/stockReports/crewAI/configs/marketPosition/agents.yaml"
    tasks_config = "/Users/tomer_lazarovitch/Documents/AIFinancialAdv/stockReports/crewAI/configs/marketPosition/tasks.yaml"
    
    def __init__(self, stock: str, report_type: ReportType):
        super().__init__(stock, report_type)
        
    @agent
    def emerging_trends_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['emerging_trends_analyst'],
            verbose=True,
            llm=self.llm,
            tools=self.get_tools()
        )

    @agent
    def competitive_landscape_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['competitive_landscape_analyst'],
            verbose=True,
            llm=self.llm,
            tools=self.get_tools()
        )

    @agent
    def customer_perception_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['customer_perception_analyst'],
            verbose=True,
            llm=self.llm,
            tools=self.get_tools()
        )

    @agent
    def market_summary_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['market_summary_analyst'],
            verbose=True,
            llm=self.llm,
            tools=[],
        )

    @task
    def emerging_trends_analysis(self) -> Task:
        return Task(
            config=self.tasks_config['emerging_trends_analysis'],
            agent=self.emerging_trends_agent(),
        )

    @task
    def competitive_landscape_analysis(self) -> Task:
        return Task(
            config=self.tasks_config['competitive_landscape_analysis'],
            agent=self.competitive_landscape_agent(),
        )

    @task
    def customer_perception_analysis(self) -> Task:
        return Task(
            config=self.tasks_config['customer_perception_analysis'],
            agent=self.customer_perception_agent(),
        )

    @task
    def market_summary(self) -> Task:
        return Task(
            config=self.tasks_config['market_summary'],
            agent=self.market_summary_agent(),
        )

    @crew
    def getCrew(self) -> Crew:
        """Creates Market Position Analysis Crew"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
        )
